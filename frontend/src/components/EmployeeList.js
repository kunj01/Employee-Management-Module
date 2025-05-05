import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

function EmployeeList({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/search/${searchQuery}`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error searching employees:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      onLogout();
      console.log('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <Typography variant="h4">Employee List</Typography>
        <div>
          <Button variant="contained" color="primary" onClick={() => navigate('/add-employee')} style={{ marginRight: '10px' }}>
            Add Employee
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <TextField
          fullWidth
          label="Search Employees"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(employee)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => navigate(`/edit-employee/${employee._id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(employee._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {selectedEmployee && (
          <>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogContent>
              <Typography><strong>Name:</strong> {selectedEmployee.name}</Typography>
              <Typography><strong>Email:</strong> {selectedEmployee.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedEmployee.phone}</Typography>
              <Typography><strong>Position:</strong> {selectedEmployee.position}</Typography>
              <Typography><strong>Department:</strong> {selectedEmployee.department}</Typography>
              <Typography><strong>Employee Type:</strong> {selectedEmployee.employeeType}</Typography>
              {selectedEmployee.profilePic && (
                <img
                  src={`http://localhost:5000/${selectedEmployee.profilePic}`}
                  alt="Profile"
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}

export default EmployeeList; 