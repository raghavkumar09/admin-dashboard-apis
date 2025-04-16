const User = require('../models/User');

exports.getStats = async (req, res) => {
    try {
        const totalRegistrations = await User.countDocuments();

        // Today's registrations
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todayRegistrations = await User.countDocuments({
            registrationDate: { $gte: today, $lt: tomorrow }
        });

        const incompleteProfiles = await User.countDocuments({
            profilePicturePath: { $in: [null, ''] }
        });

        const completedProfiles = await User.countDocuments({
            profilePicturePath: { $exists: true, $in:[null, ''] }
        });

        res.status(200).json({
            success: true,
            data: {
                totalRegistrations,
                todayRegistrations,
                incompleteProfiles,
                completedProfiles
            }
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
