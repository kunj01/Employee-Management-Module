const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/EmpDB_23IT028', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB Connected Successfully');
    
    // Create default admin user if it doesn't exist
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            const adminUser = new User({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            
            await adminUser.save();
            console.log('Default admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error creating default admin:', err);
    }
})
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit if cannot connect to database
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 