import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar"; 
import bg3 from "../../assect/images/bg/02.jpg"
import logo from "../../assect/images/logo-dark.png"
import axios from 'axios';
import { apiUrl } from "../../utils/api";

const Signup = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();
        setEmailError(""); // Reset error on submit

        const name = document.getElementById('floatingInput').value;
        const email = document.getElementById('floatingEmail').value;
        const password = document.getElementById('floatingPassword').value;

        try {
            const response = await axios.post(apiUrl('/register'), {
                name,
                email,
                password,
            });
            setSuccessMessage('Registration complete');
            setTimeout(() => {
                navigate('/auth-login');
            }, 1500);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message === 'User already exists') {
                setEmailError('This email already taken');
            } else if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to register user');
            }
            console.error('Error registering user:', error);
        }
    };

    return(
        <>
        <Navbar navClass="defaultscroll sticky" menuClass="navigation-menu nav-left" />
        <section className="bg-home zoom-image d-flex align-items-center">
            <div className="bg-overlay image-wrap" style={{backgroundImage:`url(${bg3})`, backgroundPosition:'center'}}></div>
            <div className="bg-overlay bg-gradient-overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="p-4 bg-white rounded-3 shadow-md mx-auto w-100" style={{maxWidth:'400px'}}>
                            {successMessage ? (
                                <div className="alert alert-success text-center" role="alert">
                                    {successMessage}
                                </div>
                            ) : (
                                <form onSubmit={handleRegister}>
                                    <Link to="/"><img src={logo} className="mb-4 d-block mx-auto" alt=""/></Link>
                                    <h5 className="mb-3">Register your account</h5>
                                
                                    <div className="form-floating mb-2">
                                        <input type="text" className="form-control" id="floatingInput" placeholder="sumon" required />
                                        <label htmlFor="floatingInput">First Name</label>
                                    </div>

                                    <div className="form-floating mb-2">
                                        <input type="email" className={`form-control${emailError ? ' is-invalid' : ''}`} id="floatingEmail" placeholder="name@example.com" required />
                                        <label htmlFor="floatingEmail">Email Address</label>
                                        {emailError && <div className="invalid-feedback" style={{display:'block'}}>{emailError}</div>}
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                
                                    <div className="form-check mb-3">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" required />
                                        <label className="form-check-label text-muted" htmlFor="flexCheckDefault">I Accept <Link to="#" className="text-primary">Terms And Condition</Link></label>
                                    </div>
                    
                                    <button className="btn btn-primary w-100" type="submit">Register</button>

                                    <div className="col-12 text-center mt-3">
                                        <span><span className="text-muted me-2">Already have an account ? </span> <Link to="/auth-login" className="text-dark fw-medium">Sign in</Link></span>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}

export default Signup;