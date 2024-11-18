import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

    
        if (!formData.username || !formData.password) {
            return setError("Please enter both username and password");
        }

        
        axios.post("http://localhost:5050/api/login", formData)
            .then((response) => {
                console.log("res",response)
                if (response.status === 200) {
                    
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userId', response.data.userId);  
                    console.log("Login successful", response.data);
                    alert("Login successful");

                
                    navigate("/"); 
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    setError("Invalid username or password");
                } else {
                    console.error("Error during login request", error);
                    setError("An error occurred. Please try again.");
                }
            });
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Login Form</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input 
                            type="text" 
                            placeholder="Type your username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div>
                        <label>Password:</label>
                        <input 
                            type="password" 
                            placeholder="Type your Password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <p>Create new account <Link to="/signup">Create</Link></p>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
