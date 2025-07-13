import React from "react";
import { Link } from "react-router-dom";

import logoLight from "../assect/images/logo-light.png"


import {FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone} from "../assect/icons/vander"

export default function Footer(){
    return(
        <>
        
        <footer className="bg-footer">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="footer-py-60 footer-border">
                            <div className="row">
                                <div className="col-lg-5 col-12 mb-0 mb-md-4 pb-0 pb-md-2">
                                    <Link to="#" className="logo-footer">
                                        <img src={logoLight} alt=""/>
                                    </Link>
                                    <p className="mt-4">One-Stop Digital Solution for Renting, Buying, and Selling properties in Bangladesh.</p>
                                    <ul className="list-unstyled social-icon foot-social-icon mb-0 mt-4">
                                       
                                        <li className="list-inline-item"><Link to="https://www.facebook.com/#" target="_blank" className="rounded-3"><FiFacebook className="fea icon-sm align-middle"/></Link></li>
                                        <li className="list-inline-item"><Link to="https://www.instagram.com/#/" target="_blank" className="rounded-3"><FiInstagram className="fea icon-sm align-middle"/></Link></li>
                                        <li className="list-inline-item"><Link to="https://twitter.com/#" target="_blank" className="rounded-3"><FiTwitter className="fea icon-sm align-middle"/></Link></li>
                                        <li className="list-inline-item"><Link to="mailto:support@google.com" className="rounded-3"><FiMail className="fea icon-sm align-middle"/></Link></li>
                                    </ul>
                                </div>
                                
                                <div className="col-lg-2 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                                    <h5 className="footer-head">Company</h5>
                                    <ul className="list-unstyled footer-list mt-4">
                                        <li><Link to="#" className="text-foot"><i className="mdi mdi-chevron-right align-middle me-1"></i> About us</Link></li>
                                        <li><Link to="#" className="text-foot"><i className="mdi mdi-chevron-right align-middle me-1"></i> Contact us</Link></li>
                                        <li><Link to="#" className="text-foot"><i className="mdi mdi-chevron-right align-middle me-1"></i> Careers</Link></li>
                                    </ul>
                                </div>
                                
                                <div className="col-lg-2 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                                    <h5 className="footer-head">Terms</h5>
                                    <ul className="list-unstyled footer-list mt-4">
                                        <li><Link to="#" className="text-foot"><i className="mdi mdi-chevron-right align-middle me-1"></i> Terms of Services</Link></li>
                                        <li><Link to="#" className="text-foot"><i className="mdi mdi-chevron-right align-middle me-1"></i> Privacy Policy</Link></li>
                                    </ul>
                                </div>
            
                                <div className="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                                    <h5 className="footer-head">Contact Details</h5>
        
                                    <div className="d-flex mt-4">
                                        <FiMail className="fea icon-sm text-primary mt-1 me-3"/>
                                        <Link to="mailto:contact@example.com" className="text-foot">contact@thikana.com</Link>
                                    </div>
                                    
                                    <div className="d-flex mt-4">
                                        <FiPhone className="fea icon-sm text-primary mt-1 me-3"/>
                                        <Link to="tel:+152534-468-854" className="text-foot">+8801732828224</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-py-30 footer-bar">
                <div className="container text-center">
                    <div className="row">
                        <div className="col">
                            <div className="text-center">
                            <p className="mb-0 text-muted">
    © {new Date().getFullYear()} Thikana. All rights reserved.
</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
}