const Match = require('../models/Match');
const Team = require('../models/Team');

// @desc    Get team standings for all categories
// @route   GET /api/standings
// @access  Public
const getStandings = async (req, res) => {
    try {
        const teams = await Team.find({});
        const completedMatches = await Match.find({ status: 'Completed' });

        const standings = {};
        // Initialize standings object for each team
        teams.forEach(team => {
            const category = `${team.gender} ${team.category}`;
            if (!standings[category]) {
                standings[category] = {};
            }
            standings[category][team._id] = {
                teamName: team.name,
                teamLogo: team.logoUrl,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
            };
        });

        // Calculate standings from completed matches
        completedMatches.forEach(match => {
            const category = `${match.gender} ${match.category}`;
            const teamAId = match.teamA.toString();
            const teamBId = match.teamB.toString();

            const teamAStats = standings[category]?.[teamAId];
            const teamBStats = standings[category]?.[teamBId];

            if (!teamAStats || !teamBStats) return; // Skip if team not found in category

            teamAStats.played += 1;
            teamBStats.played += 1;
            teamAStats.goalsFor += match.scoreA;
            teamBStats.goalsFor += match.scoreB;
            teamAStats.goalsAgainst += match.scoreB;
            teamBStats.goalsAgainst += match.scoreA;

            if (match.scoreA > match.scoreB) {
                teamAStats.won += 1;
                teamBStats.lost += 1;
                teamAStats.points += 3;
            } else if (match.scoreB > match.scoreA) {
                teamBStats.won += 1;
                teamAStats.lost += 1;
                teamBStats.points += 3;
            } else {
                teamAStats.drawn += 1;
                teamBStats.drawn += 1;
                teamAStats.points += 1;
                teamBStats.points += 1;
            }
        });

        // Format the output
        const formattedStandings = Object.keys(standings).map(category => {
            const categoryTeams = Object.values(standings[category]);
            
            // Calculate goal difference
            categoryTeams.forEach(team => {
                team.goalDifference = team.goalsFor - team.goalsAgainst;
            });

            // Sort teams within the category
            categoryTeams.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
                return b.goalsFor - a.goalsFor;
            });

            return { category, teams: categoryTeams };
        });

        res.status(200).json(formattedStandings);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getStandings,
};
