import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/navbar";
import bg4 from "../assect/images/bg/04.jpg"

import { FiPhone, FiHexagon, FiMapPin, FiMail } from "../assect/icons/vander"
import Footer from "../components/footer";
export default function ContactUs() {
    return (
        <>
            <Navbar navClass="defaultscroll sticky" menuClass="navigation-menu nav-left" />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: `url(${bg4})` }}>
                <div className="bg-overlay bg-gradient-overlay-2"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <p className="text-white-50 para-desc mx-auto mb-0">Get in touch !</p>
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Contact us</h5>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
            <section className="section pb-0">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="p-4 rounded-3 shadow">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Your Name <span className="text-danger">*</span></label>
                                                <input name="name" id="name" type="text" className="form-control" placeholder="Name :" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Your Email <span className="text-danger">*</span></label>
                                                <input name="email" id="email" type="email" className="form-control" placeholder="Email :" />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">Subject</label>
                                                <input name="subject" id="subject" className="form-control" placeholder="Subject :" />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">Comments <span className="text-danger">*</span></label>
                                                <textarea name="comments" id="comments" rows="4" className="form-control" placeholder="Message :"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-grid">
                                                <button type="submit" id="submit" name="send" className="btn btn-primary">Send Message</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mt-100 mt-60">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="position-relative features text-center mx-lg-4 px-md-1">
                                <div className="feature-icon position-relative overflow-hidden d-flex justify-content-center">
                                    <FiHexagon className="hexagon" />
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                        <FiPhone className="fea icon-m-md text-primary" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="mb-3">Phone</h5>
                                    <p className="text-muted">Feel free to reach out to us for any inquiries or support.</p>
                                    <Link to="tel:+8801723456789" className="text-primary">+880 172-345-6789</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="position-relative features text-center mx-lg-4 px-md-1">
                                <div className="feature-icon position-relative overflow-hidden d-flex justify-content-center">
                                    <FiHexagon className="hexagon" />
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                        <FiMail className="fea icon-m-md text-primary" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="mb-3">Email</h5>
                                    <p className="text-muted">We are here to assist you. Drop us an email anytime.</p>
                                    <Link to="mailto:support@thikana.com" className="text-primary">support@thikana.com</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="position-relative features text-center mx-lg-4 px-md-1">
                                <div className="feature-icon position-relative overflow-hidden d-flex justify-content-center">
                                    <FiHexagon className="hexagon" />
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                        <FiMapPin className="fea icon-m-md text-primary" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="mb-3">Location</h5>
                                    <p className="text-muted">456 University Road, <br /> Rajshahi, Bangladesh</p>
                                    <Link to="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d88.61251831543127!3d24.37433298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbef2b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sRajshahi!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd" className="lightbox text-primary" data-type="iframe" data-group="iframe" data-width="1024px" data-height="576px">View on Google map</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid mt-100 mt-60">
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="card map border-0">
                                <div className="card-body p-0">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d88.61251831543127!3d24.37433298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbef2b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sRajshahi!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd" style={{ border: "0" }} title="Townter" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}