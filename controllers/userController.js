const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    const { name, email, password, dateOfBirth } = req.body;
    let profilePicturePath = null; // Store the relative path

    // Use the path provided by multer's diskStorage
    if (req.file) {
        profilePicturePath = req.file.path.replace(/\\/g, '/'); 
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            // If user exists and a file was uploaded, delete the orphaned uploaded file
            if (profilePicturePath && fs.existsSync(path.resolve(profilePicturePath))) {
                fs.unlinkSync(path.resolve(profilePicturePath));
            }
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        user = await User.create({
            name,
            email,
            password, // Hashed by pre-save hook
            dateOfBirth: dateOfBirth || null,
            profilePicturePath, // Save the file path
        });

        user.password = undefined;
        res.status(201).json({ success: true, data: user });

    } catch (error) {
        console.error("Error creating user:", error);
        // If error occurs after file upload, delete the uploaded file
        if (profilePicturePath && fs.existsSync(path.resolve(profilePicturePath))) {
            try {
                fs.unlinkSync(path.resolve(profilePicturePath));
            } catch(unlinkErr) {
                console.error("Error deleting orphaned file on user create fail:", unlinkErr);
            }
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user details
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.id).select('+password');
        if (!user) {
             if (req.file) fs.unlinkSync(req.file.path); // Delete newly uploaded file if user not found
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { name, email, dateOfBirth, password } = req.body;
        let updateData = { name, email, dateOfBirth };
        let oldPicturePath = user.profilePicturePath;
        let newPicturePath = null;

        if (req.file) {
            newPicturePath = req.file.path.replace(/\\/g, '/'); // Get path from multer, normalize slashes
            updateData.profilePicturePath = newPicturePath;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true, runValidators: true,
        });

        // If update was successful AND a new picture was uploaded AND an old picture existed, delete the old one
        if (updatedUser && newPicturePath && oldPicturePath && oldPicturePath !== newPicturePath) {
            if(fs.existsSync(path.resolve(oldPicturePath))) {
                try {
                    fs.unlinkSync(path.resolve(oldPicturePath));
                    console.log("Deleted old profile picture:", oldPicturePath);
                } catch (unlinkErr) {
                    console.error("Error deleting old profile picture:", unlinkErr);
                }
            }
        } else if (!updatedUser && newPicturePath) {
            // If update failed but a new picture was uploaded, delete the new one
            if(fs.existsSync(path.resolve(newPicturePath))) fs.unlinkSync(path.resolve(newPicturePath));
        }


        if(!updatedUser){
             return res.status(404).json({ success: false, message: 'User update failed (post-operation check)' });
        }

        updatedUser.password = undefined;
        res.status(200).json({ success: true, data: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
         // Clean up newly uploaded file if error occurred
         if (req.file && fs.existsSync(path.resolve(req.file.path))) {
            try { fs.unlinkSync(path.resolve(req.file.path)); } catch(e){}
         }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


// @desc    Delete user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const picturePath = user.profilePicturePath;

        await user.deleteOne(); // Or user.remove() depending on mongoose version

        // If user had a profile picture, delete it from the server's file system
        if (picturePath && fs.existsSync(path.resolve(picturePath))) {
             try {
                fs.unlinkSync(path.resolve(picturePath));
                console.log("Deleted profile picture:", picturePath);
            } catch(unlinkErr) {
                console.error("Error deleting profile picture during user delete:", unlinkErr);
            }
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
         console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
