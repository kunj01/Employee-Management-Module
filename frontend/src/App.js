import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a1b9a', // Deep Purple
      light: '#9c4dcc',
      dark: '#38006b',
    },
    secondary: {
      main: '#00897b', // Teal
      light: '#4db6ac',
      dark: '#005b4f',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#6a1b9a',
    },
    h5: {
      fontWeight: 500,
      color: '#6a1b9a',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/employees" replace />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                !isAuthenticated ? (
                  <Register />
                ) : (
                  <Navigate to="/employees" replace />
                )
              } 
            />
            <Route 
              path="/employees" 
              element={
                isAuthenticated ? (
                  <EmployeeList onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/add-employee" 
              element={
                isAuthenticated ? (
                  <AddEmployee />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/edit-employee/:id" 
              element={
                isAuthenticated ? (
                  <EditEmployee />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
