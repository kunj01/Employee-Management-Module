import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

function Header() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(45deg, #6a1b9a 30%, #9c4dcc 90%)',
        boxShadow: '0 3px 5px 2px rgba(106, 27, 154, .3)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          <PeopleAltIcon sx={{ mr: 2, color: '#ffffff' }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Employee Management System
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 