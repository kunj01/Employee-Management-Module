const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username);

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', username);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful for user:', username);

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 