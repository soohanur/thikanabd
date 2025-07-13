import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/navbar"; 
import bg3 from "../../assect/images/bg/02.jpg"
import logo from "../../assect/images/logo-dark.png"
import axios from 'axios';

export default function AuthLogin(){
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError("");
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            // Save JWT token and user info
            localStorage.setItem('thikana_token', response.data.token);
            localStorage.setItem('thikana_user', JSON.stringify(response.data.user));
            navigate('/profiles');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setLoginError(error.response.data.message);
            } else {
                setLoginError('Login failed');
            }
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
                            {loginError && (
                                <div className="alert alert-danger text-center" role="alert">
                                    {loginError}
                                </div>
                            )}
                            <form onSubmit={handleLogin}>
                                <Link to="/"><img src={logo} className="mb-4 d-block mx-auto" alt=""/></Link>
                                <h5 className="mb-3">Please sign in</h5>
                            
                                <div className="form-floating mb-2">
                                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
                                    <label htmlFor="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>
                            
                                <div className="d-flex justify-content-between">
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                            <label className="form-check-label text-muted" htmlFor="flexCheckDefault">Remember me</label>
                                        </div>
                                    </div>
                                    <span className="forgot-pass text-muted mb-0"><Link to="/auth-reset-password" className="text-muted">Forgot password ?</Link></span>
                                </div>
                
                                <button className="btn btn-primary w-100" type="submit">Sign in</button>

                                <div className="col-12 text-center mt-3">
                                    <span><span className="text-muted me-2">Don't have an account ?</span> <Link to="/auth-signup" className="text-dark fw-medium">Sign Up</Link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}
