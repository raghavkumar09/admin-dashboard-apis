const express = require('express');
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import multer middleware

const router = express.Router();

// Apply protect middleware to all user routes
router.use(protect);

router.route('/')
    .post(upload, createUser)
    .get(getAllUsers);

router.route('/:id')
    .get(getUserById)
    .put(upload, updateUser)
    .delete(deleteUser);

module.exports = router;