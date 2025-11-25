const { createClient } = require('@supabase/supabase-js');
const Referee = require('../models/Referee');

// This admin client uses the service key and should only be used on the server.
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// @desc    Create a referee
// @route   POST /api/referees
// @access  Private/Admin
const createReferee = async (req, res) => {
    try {
        const { name, categoryExpertise, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Please provide name and email for the referee.' });
        }

        // Check if a referee with this email already exists in our DB
        const existingReferee = await Referee.findOne({ 'supabaseUserId': `temp_${email}` }); // A bit of a hack until we have real IDs
        if (existingReferee) {
             return res.status(400).json({ message: 'A referee with this email already exists.' });
        }

        // Auto-generate a password
        const password = Math.random().toString(36).slice(-8);

        // Create the user in Supabase Auth
        const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email for simplicity
            user_metadata: {
                name: name,
                role: 'referee'
            }
        });

        if (authError) {
            // Check if user already exists in Supabase
            if (authError.message.includes('already registered')) {
                return res.status(400).json({ message: 'A user with this email is already registered in Supabase.' });
            }
            throw new Error(`Supabase Auth Error: ${authError.message}`);
        }

        // Create the referee in our MongoDB
        const newReferee = new Referee({
            name,
            categoryExpertise,
            supabaseUserId: user.id, // Use the real ID from Supabase
        });

        const createdReferee = await newReferee.save();
        
        // Return the created referee and the temporary password
        res.status(201).json({ 
            ...createdReferee.toObject(),
            password: password // Send password to admin
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all referees
// @route   GET /api/referees
// @access  Private/Admin
const getReferees = async (req, res) => {
    try {
        const referees = await Referee.find({});
        res.status(200).json(referees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single referee by ID
// @route   GET /api/referees/:id
// @access  Private/Admin
const getRefereeById = async (req, res) => {
    try {
        const referee = await Referee.findById(req.params.id);
        if (!referee) {
            return res.status(404).json({ message: 'Referee not found' });
        }
        res.status(200).json(referee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a referee
// @route   PUT /api/referees/:id
// @access  Private/Admin
const updateReferee = async (req, res) => {
    try {
        const { name, categoryExpertise } = req.body;
        const referee = await Referee.findById(req.params.id);

        if (!referee) {
            return res.status(404).json({ message: 'Referee not found' });
        }

        referee.name = name || referee.name;
        referee.categoryExpertise = categoryExpertise || referee.categoryExpertise;

        const updatedReferee = await referee.save();
        res.status(200).json(updatedReferee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a referee
// @route   DELETE /api/referees/:id
// @access  Private/Admin
const deleteReferee = async (req, res) => {
    try {
        const referee = await Referee.findById(req.params.id);

        if (!referee) {
            return res.status(404).json({ message: 'Referee not found' });
        }

        // Delete the user from Supabase Auth
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(referee.supabaseUserId);
        if (authError) {
            // Log the error but proceed with DB deletion anyway
            console.error(`Supabase user deletion failed: ${authError.message}`);
        }

        await referee.deleteOne();

        res.status(200).json({ message: 'Referee deleted successfully from DB and Supabase.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createReferee,
    getReferees,
    getRefereeById,
    updateReferee,
    deleteReferee,
};