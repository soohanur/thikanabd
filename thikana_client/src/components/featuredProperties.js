import React from "react";
import { Link } from "react-router-dom";
import { propertyData } from "../data/data";
import { FiHome, FiHeart, FiCamera } from '../assect/icons/vander';

export default function FeaturedProperties() {
    // Sort properties so verified listings appear first
    const sortedPropertyData = propertyData.sort((a, b) => b.verified - a.verified);

    return (
        <>
            <div className="row justify-content-center">
                <div className="col">
                    <div className="section-title text-center mb-2 pb-2">
                        <h4 className="title mb-3">Featured Properties</h4>
                        <p className="text-muted para-desc mb-0 mx-auto">
                        Explore a wide range of premium properties tailored to meet your needs effortlessly.
                        </p>
                    </div>
                </div>
            </div>

            <div className="row g-4 mt-0">
                {sortedPropertyData.slice(0, 6).map((item, index) => {
                    return (
                        <div className="col-lg-4 col-md-6 col-12" key={index}>
                            <div className="card property border-0 shadow position-relative overflow-hidden rounded-3">
                                <div className="property-image position-relative overflow-hidden shadow">
                                    {/* Verified Tag */}
                                    {item.verified && (
                                        <span className="badge bg-success position-absolute top-0 start-0 m-2">
                                            Verified
                                        </span>
                                    )}
                                    <img src={item.image} className="img-fluid" alt="" />
                                    <ul className="list-unstyled property-icon">
                                        <li className="">
                                            <Link to="#" className="btn btn-sm btn-icon btn-pills btn-primary">
                                                <FiHome className="icons" />
                                            </Link>
                                        </li>
                                        <li className="mt-1">
                                            <Link to="#" className="btn btn-sm btn-icon btn-pills btn-primary">
                                                <FiHeart className="icons" />
                                            </Link>
                                        </li>
                                        <li className="mt-1">
                                            <Link to="#" className="btn btn-sm btn-icon btn-pills btn-primary">
                                                <FiCamera className="icons" />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body content p-4">
                                    <Link to={`/property-detail/${item.id}`} className="title fs-5 text-dark fw-medium">
                                        {item.title}
                                    </Link>

                                    <ul className="list-unstyled mt-3 py-3 border-top border-bottom d-flex align-items-center justify-content-between">
                                        <li className="d-flex align-items-center me-3">
                                            <i className="mdi mdi-arrow-expand-all fs-5 me-2 text-primary"></i>
                                            <span className="text-muted">
                                                            {item.size} sq.ft
                                                        </span>
                                        </li>

                                        <li className="d-flex align-items-center me-3">
                                            <i className="mdi mdi-bed fs-5 me-2 text-primary"></i>
                                            <span className="text-muted">{item.beds} Beds</span>
                                        </li>

                                        <li className="d-flex align-items-center">
                                            <i className="mdi mdi-shower fs-5 me-2 text-primary"></i>
                                            <span className="text-muted">{item.baths} Baths</span>
                                        </li>
                                    </ul>
                                    <ul className="list-unstyled d-flex justify-content-between mt-2 mb-0">
                                        <li className="list-inline-item mb-0">
                                            <span className="text-muted">Price</span>
                                            <p className="fw-medium mb-0">
                                                            ৳{item.price}/month
                                                        </p>
                                        </li>
                                        <li className="list-inline-item mb-0 text-muted">
                                            <span className="text-muted">Rating</span>
                                            <ul className="fw-medium text-warning list-unstyled mb-0">
                                                {[...Array(Math.floor(item.rating))].map((_, i) => (
                                                    <li key={i} className="list-inline-item mb-0">
                                                        <i className="mdi mdi-star"></i>
                                                    </li>
                                                ))}
                                                <li className="list-inline-item mb-0 text-dark">
                                                    {item.rating} ({item.reviews})
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="col-12 mt-4 pt-2">
                    <div className="text-center">
                        <Link to="/grid-sidebar" className="mt-3 fs-6 text-primary">
                            View More Properties <i className="mdi mdi-arrow-right align-middle"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}