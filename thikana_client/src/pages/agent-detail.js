import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { brokerData } from "../data/data";
import { apiUrl } from "../utils/api";

export default function AgentDetail() {
    const { id } = useParams();
    const broker = brokerData.find((b) => b.id === parseInt(id));
    const [activeSection, setActiveSection] = useState("agentDetails");

    if (!broker) {
        return <div>Agent not found</div>;
    }

    const renderContent = () => {
        switch (activeSection) {
            case "agentDetails":
                return (
                    <div>
                        <h5 className="card-title">Agent Details</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Name:</strong> {broker.name}</li>
                            <li className="list-group-item"><strong>Email:</strong> {broker.email}</li>
                            <li className="list-group-item"><strong>Phone:</strong> {broker.phone}</li>
                            <li className="list-group-item"><strong>Location:</strong> {broker.location}</li>
                        </ul>
                    </div>
                );
            case "listedProperties":
                return (
                    <div>
                        <h5 className="card-title">Listed Properties</h5>
                        {broker.listedProperties && broker.listedProperties.length > 0 ? (
                            <ul className="list-group">
                                {broker.listedProperties.map((property) => (
                                    <li key={property.id} className="list-group-item">
                                        <Link to={`/property-detail/${property.id}`} className="text-decoration-none">
                                            <strong>{property.title}</strong>
                                        </Link> - {property.location} - ৳{property.price}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No properties listed by this agent.</p>
                        )}
                    </div>
                );
            case "reviews":
                return (
                    <div>
                        <h5 className="card-title">Reviews</h5>
                        {broker.reviews && broker.reviews.length > 0 ? (
                            <ul className="list-group">
                                {broker.reviews.map((review, index) => (
                                    <li key={index} className="list-group-item">
                                        <strong>{review.reviewer}:</strong> {review.comment} ({review.rating}★)
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No reviews available for this agent.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Navbar navClass="defaultscroll sticky" menuClass="navigation-menu nav-left" />
            <section className="profile-box">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <img
                                src={broker.image.startsWith('http') ? broker.image : apiUrl(broker.image)}
                                className="img-fluid rounded-circle mb-3"
                                alt={broker.name}
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                            <h2 className="heading fw-bold mb-0">{broker.name}</h2>
                            <p className="text-muted">{broker.description}</p>
                            <div className="mt-4">
                                <button className="btn btn-primary me-2">Book Now</button>
                                <button className="btn btn-outline-primary">Message Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-lg-3">
                            <div className="card shadow rounded">
                                <div className="card-body">
                                    <ul className="list-group">
                                        <li
                                            className={`list-group-item ${activeSection === "agentDetails" ? "active" : ""}`}
                                            onClick={() => setActiveSection("agentDetails")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Agent Details
                                        </li>
                                        <li
                                            className={`list-group-item ${activeSection === "listedProperties" ? "active" : ""}`}
                                            onClick={() => setActiveSection("listedProperties")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Listed Properties
                                        </li>
                                        <li
                                            className={`list-group-item ${activeSection === "reviews" ? "active" : ""}`}
                                            onClick={() => setActiveSection("reviews")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Reviews
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-9">
                            <div className="card shadow rounded">
                                <div className="card-body">
                                    {renderContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}