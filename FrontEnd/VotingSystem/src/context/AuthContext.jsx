import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for default export

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);

      // Decode the token to get user details
      const decoded = jwtDecode(res.data.token);
      setUser(decoded);

      // Redirect based on user role
      if (decoded.isAdmin) {
        navigate('/admin'); // Redirect to Admin Dashboard
      } else {
        navigate('/user'); // Redirect to User Dashboard
      }
    } catch (error) {
      throw error; // Propagate the error to the Login component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);