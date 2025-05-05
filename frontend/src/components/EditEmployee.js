import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    employeeType: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [currentProfilePic, setCurrentProfilePic] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
        const employee = response.data;
        setFormData({
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          employeeType: employee.employeeType
        });
        setCurrentProfilePic(employee.profilePic);
      } catch (error) {
        console.error('Error fetching employee:', error);
        navigate('/employees');
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (profilePic) {
        formDataToSend.append('profilePic', profilePic);
      }

      await axios.put(`http://localhost:5000/api/employees/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/employees');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Employee
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Employee Type</InputLabel>
            <Select
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChange}
              label="Employee Type"
            >
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
            </Select>
          </FormControl>
          {currentProfilePic && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="subtitle1">Current Profile Picture:</Typography>
              <img
                src={`http://localhost:5000/${currentProfilePic}`}
                alt="Current Profile"
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginRight: '10px' }}
            >
              Update Employee
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default EditEmployee; 