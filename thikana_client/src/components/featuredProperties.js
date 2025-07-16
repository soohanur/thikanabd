import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiHeart } from '../assect/icons/vander';
import { FaCheck } from 'react-icons/fa';
import axios from "axios";
import { apiUrl } from "../utils/api";

export default function FeaturedProperties() {
    const [properties, setProperties] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        // Fetch all properties from backend
        axios.get(apiUrl("/api/properties/all"))
            .then(res => setProperties(res.data))
            .catch(() => setProperties([]));
        // Fetch wishlist
        const fetchWishlist = async () => {
            try {
                const token = localStorage.getItem('thikana_token');
                const res = await axios.get(apiUrl('/api/wishlist'), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWishlist(res.data || []);
            } catch {
                setWishlist([]);
            }
        };
        fetchWishlist();
    }, []);

    const toggleWishlist = async (propertyId) => {
        const token = localStorage.getItem('thikana_token');
        const isWishlisted = wishlist.some(p => p._id === propertyId || p.id === propertyId);
        try {
            if (!isWishlisted) {
                await axios.post(apiUrl(`/api/wishlist/${propertyId}`), {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWishlist(prev => [...prev, { _id: propertyId }]);
            } else {
                await axios.delete(apiUrl(`/api/wishlist/${propertyId}`), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWishlist(prev => prev.filter(p => (p._id || p.id) !== propertyId));
            }
        } catch {}
    };

    // Sort properties: latest upload first (by _id descending)
    const sortedPropertyData = properties.slice().sort((a, b) => {
        return (b._id?.toString() || '').localeCompare(a._id?.toString() || '');
    });

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
                                        <span className="badge bg-success position-absolute apple-blur2 top-0 start-0 m-2">
                                            Verified
                                        </span>
                                    )}
                                    <img 
                                      src={item.coverImage ? (item.coverImage.startsWith('http') ? item.coverImage : apiUrl(`/uploads/${item.coverImage}`)) : item.image || ''} 
                                      className="img-fluid" 
                                      alt="" 
                                      style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'center center', borderRadius: '12px' }}
                                    />
                                    <ul className="list-unstyled property-icon">
                                        <li className="mt-1">
                                            <button
                                                type="button"
                                                className={`btn btn-sm btn-icon btn-pills ${wishlist.some(p => (p._id || p.id) === (item._id || item.id)) ? '' : 'btn-primary'}`}
                                                style={wishlist.some(p => (p._id || p.id) === (item._id || item.id)) ? { backgroundColor: '#166534', color: '#fff' } : {}}
                                                onClick={() => toggleWishlist(item._id || item.id)}
                                            >
                                                {wishlist.some(p => (p._id || p.id) === (item._id || item.id))
                                                    ? <FaCheck className="icons" />
                                                    : <FiHeart className="icons" />}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body content p-4">
                                    <Link to={`/property-detail/${item._id || item.id}`} className="title fs-5 text-dark fw-medium">
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
                                                {[...Array(Math.floor(item.rating || 0))].map((_, i) => (
                                                    <li key={i} className="list-inline-item mb-0">
                                                        <i className="mdi mdi-star"></i>
                                                    </li>
                                                ))}
                                                <li className="list-inline-item mb-0 text-dark">
                                                    {item.rating} ({item.reviews?.length || 0})
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    {/* Show posted by userId for tracking */}
                                    <div className="mt-2 hidden text-muted" style={{fontSize:'12px'}}>Posted by: {item.userId}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="col-12 mt-4 pt-2">
                    <div className="text-center">
                        <Link to="/grid-sidebar" className="btn btn-primary px-6 py-2 font-semibold rounded-full shadow">
                            View More Properties <i className="mdi mdi-arrow-right align-middle"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}