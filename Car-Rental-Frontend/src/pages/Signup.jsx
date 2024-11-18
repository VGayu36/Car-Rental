import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);  

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");  

        
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill all the fields");
            return;
        }


        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        
        const { password, confirmPassword, ...formDataWithoutPasswords } = formData;
        console.log("Form Data: ", formDataWithoutPasswords);

        
        setIsLoading(true);


        axios.post("http://localhost:5050/api/register", {
            username: formData.name,
            email: formData.email,
            password: formData.password
        }, {
            headers: {
                'Content-Type': 'application/json'  
            }
        })
            .then((response) => {
                if (response.status === 201) {  
                    alert("Signup successful");
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.error("Error during signup request", error);
                if (error.response && error.response.data) {
                    console.log(error.response.data); 
                    if (error.response.data.message === "User or email already exists") {
                        setError("The email is already registered. Please use a different email.");
                    } else {
                        setError(error.response.data.message || "An error occurred during signup. Please try again.");
                    }
                } else {
                    setError("An error occurred during signup. Please try again.");
                }
            })
            .finally(() => {
                setIsLoading(false);  
            });
    };

    return (
        <div className="signups">
            <div className="signup-container">
                <form onSubmit={handleSubmit} className="signup-form">
                    <h1>Signup Form</h1>

                    <label htmlFor="name">Username :</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                    <br /><br />

                    <label htmlFor="email">E-mail Id :</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                    <br /><br />

                    <label htmlFor="password">Password :</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                    <br /><br />

                    <label htmlFor="confirmPassword">Confirm Password :</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                    <br /><br />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? "Signing up..." : "Signup"}
                    </button>
                </form>

                <p className="login-link">Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    );
};

export default Signup;
