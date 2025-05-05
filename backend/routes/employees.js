const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create employee
router.post('/', upload.single('profilePic'), async (req, res) => {
    try {
        const newEmployee = new Employee({
            ...req.body,
            profilePic: req.file ? req.file.path : ''
        });
        const savedEmployee = await newEmployee.save();
        res.json(savedEmployee);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update employee
router.put('/:id', upload.single('profilePic'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profilePic = req.file.path;
        }
        
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete employee
router.delete('/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Search employees
router.get('/search/:query', async (req, res) => {
    try {
        const searchQuery = req.params.query;
        const employees = await Employee.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
                { position: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 