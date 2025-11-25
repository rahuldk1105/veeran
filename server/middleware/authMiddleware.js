const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }

            req.user = user; // Attach user to the request
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    // req.user should be attached from the 'protect' middleware
    if (req.user && req.user.app_metadata.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const referee = (req, res, next) => {
    // req.user should be attached from the 'protect' middleware
    if (req.user && (req.user.app_metadata.role === 'referee' || req.user.app_metadata.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a referee' });
    }
};


module.exports = { protect, admin, referee };
