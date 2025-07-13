import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import bg3 from "../../assect/images/property/3.jpg";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import { propertyData } from "../../data/data";

export default function GridSidebar() {
    // State for filters
    const [filters, setFilters] = useState({
        price: 100000,
        beds: "",
        baths: "",
        verified: false,
        category: "",
        location: "",
        area: "",
    });

    const [filteredProperties, setFilteredProperties] = useState(propertyData);

    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const { location: loc, area, category, type } = location.state;
            const filtered = propertyData.filter((property) => {
                return (
                    (loc === "" || property.location === loc) &&
                    (area === "" || property.area === area) &&
                    (category === "" || property.category === category) &&
                    (type === "" || property.type === type)
                );
            });
            setFilteredProperties(filtered);
        }
    }, [location.state]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Apply filters when the button is clicked
    const applyFilters = () => {
        const filtered = propertyData.filter((property) => {
            return (
                property.price <= filters.price &&
                (filters.beds === "" || property.beds === parseInt(filters.beds)) &&
                (filters.baths === "" || property.baths === parseInt(filters.baths)) &&
                (!filters.verified || property.verified) &&
                (filters.category === "" || property.category === filters.category) &&
                (filters.location === "" || property.location === filters.location) &&
                (filters.area === "" || property.area === filters.area)
            );
        });
        setFilteredProperties(filtered); // Update the filtered properties
    };

    return (
        <>
            <Navbar navClass="defaultscroll sticky" menuClass="navigation-menu nav-left" />
            <section className="bg-half-170 d-table w-100" style={{ backgroundImage: `url(${bg3})`, objectFit: "cover" } }>
                <div className="bg-overlay bg-gradient-overlay-2"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <p className="text-white-50 para-desc mx-auto mb-0">Find your dream property</p>
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">All Properties</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
            </div>
            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        {/* Sidebar */}
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="card bg-white p-4 rounded-3 shadow sticky-bar">
                                {/* Price Range */}
                                <div className="mt-4">
                                    <h6 className="mb-0">Price Range</h6>
                                    <input
                                        type="range"
                                        className="form-range mt-2"
                                        min="1000"
                                        max="100000"
                                        step="1000"
                                        name="price"
                                        value={filters.price}
                                        onChange={handleFilterChange}
                                    />
                                    <p className="text-muted small">Up to ৳{filters.price}</p>
                                </div>

                                {/* Beds */}
                                <div className="mt-4">
                                    <h6 className="mb-0">Bedroom </h6>
                                    <select
                                        className="form-select form-control border mt-2"
                                        name="beds"
                                        value={filters.beds}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Any</option>
                                        <option value="1">1 Bed</option>
                                        <option value="2">2 Beds</option>
                                        <option value="3">3 Beds</option>
                                        <option value="4">4 Beds</option>
                                        <option value="5">5+ Beds</option>
                                    </select>
                                </div>

                                {/* Baths */}
                                <div className="mt-4">
                                    <h6 className="mb-0">Bathroom</h6>
                                    <select
                                        className="form-select form-control border mt-2"
                                        name="baths"
                                        value={filters.baths}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Any</option>
                                        <option value="1">1 Bath</option>
                                        <option value="2">2 Baths</option>
                                        <option value="3">3 Baths</option>
                                        <option value="4">4 Baths</option>
                                        <option value="5">5+ Baths</option>
                                    </select>
                                </div>

                                {/* Verified */}
                                <div className="mt-4">
                                    <h6 className="mb-0">Verified</h6>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="verified"
                                            name="verified"
                                            checked={filters.verified}
                                            onChange={handleFilterChange}
                                        />
                                        <label className="form-check-label" htmlFor="verified">
                                            Verified Listings
                                        </label>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="mt-4">
                                    <h6 className="mb-0">Categories</h6>
                                    <select
                                        className="form-select form-control border mt-2"
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Any</option>
                                        <option value="Houses">Houses</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Offices">Offices</option>
                                        <option value="Sub-let">Sub-let</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="mt-4">
                                    <h6 className="mb-0">Location</h6>
                                    <select
                                        className="form-select form-control border mt-2"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Any</option>
                                        <option value="Dhaka">Dhaka</option>
                                        <option value="Rajshahi">Rajshahi</option>
                                        <option value="Chattogram">Chattogram</option>
                                        <option value="Sylhet">Sylhet</option>
                                        <option value="Khulna">Khulna</option>
                                        <option value="Barishal">Barishal</option>
                                    </select>
                                </div>

                                {/* Area */}
                                <div className="mt-4">
                                    <h6 className="mb-0">Area</h6>
                                    <select
                                        className="form-select form-control border mt-2"
                                        name="area"
                                        value={filters.area}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Any</option>
                                        <option value="Zero Point">Zero Point</option>
                                        <option value="Rani Bazar">Rani Bazar</option>
                                        <option value="New Market">New Market</option>
                                        <option value="Railgate">Railgate</option>
                                        <option value="Alupotti">Alupotti</option>
                                        <option value="Talaimari">Talaimari</option>
                                        <option value="Kajla">Kajla</option>
                                        <option value="Binodpur">Binodpur</option>
                                        <option value="Khorkhori">Khorkhori</option>
                                    </select>
                                </div>

                                {/* Apply Filter Button */}
                                <div className="mt-4">
                                    <button className="btn btn-primary w-100" onClick={applyFilters}>
                                        Apply Filter
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Property Listings */}
                        <div className="col-lg-8 col-md-6 col-12">
                            <div className="row g-4">
                                {filteredProperties.map((item, index) => (
                                    <div className="col-lg-6 col-12" key={index}>
                                        <div className="card property border-0 shadow position-relative overflow-hidden rounded-3">
                                            <div className="property-image position-relative overflow-hidden shadow">
                                                {item.verified && (
                                                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
                                                        Verified
                                                    </span>
                                                )}
                                                <img src={item.image} className="img-fluid" alt="" />
                                            </div>
                                            <div className="card-body content p-4">
                                                <Link
                                                    to={`/property-detail/${item.id}`}
                                                    className="title fs-5 text-dark fw-medium"
                                                >
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
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

