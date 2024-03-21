import "./App.css";
import { Routes, Route, useLocation } from 'react-router-dom'; 
import { Link } from "react-router-dom";
import LoginPage from "./components/Login.jsx";
import RegisterPage from "./components/Register.jsx";
import HomePage from "./components/Home.jsx";
function App() {
  const location = useLocation(); // Get the current location

  return (
    <div className="main-div">
      <Routes> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* Add more routes as needed */}
      </Routes>

      {/* Conditional rendering of navigation links */}
      {location.pathname === '/'  && ( 
        <div>
          <Link to="/login">Login</Link>
          <br></br>
          <Link to="/register">Register</Link> 
        </div>
      )}
    </div>
  );
}

export default App;
