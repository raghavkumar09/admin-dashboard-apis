const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const statsRoutes = require('./routes/stats');

const app = express();

// Enable CORS
app.use(cors());

// Body Parser Middleware
app.use(express.json()); // To accept JSON data
app.use(express.urlencoded({ extended: false })); // To accept form data

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    // Handle Multer errors specifically
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `File Upload Error: ${err.message}` });
    } else if (err) {
        // Handle other errors (like file type validation from checkFileType)
        return res.status(400).json({ success: false, message: err.message || err });
    }
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));