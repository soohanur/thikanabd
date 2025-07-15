import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { FiHeart } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';

import bg3 from "../../assect/images/property/3.jpg";
import { apiUrl } from "../../utils/api";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function GridSidebar() {
    // State for filters
    const [filters, setFilters] = useState({
        price: 100000,
        size: 0,
        type: "",
        beds: "",
        baths: "",
        verified: false,
        category: "",
        propertyType: "",
        location: "",
        area: "",
    });

    // State for all properties from backend
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const user = JSON.parse(localStorage.getItem('thikana_user') || '{}');

    const location = useLocation();
    const initializedFromState = useRef(false);

    // Fetch all properties from backend
    useEffect(() => {
        axios.get(apiUrl("/api/properties/all"))
            .then(res => {
                setProperties(res.data);
                setFilteredProperties(res.data);
            })
            .catch(() => {
                setProperties([]);
                setFilteredProperties([]);
            });
    }, []);

    // Fetch wishlist on mount
    useEffect(() => {
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

    // Set filters from location.state on first load only
    useEffect(() => {
        if (
            location.state &&
            !initializedFromState.current &&
            properties.length > 0
        ) {
            let { location: loc, area, category, type, propertyType, beds, baths } = location.state;
            // Normalize propertyType to match select options
            if (propertyType) {
                const validTypes = ["Family", "Bachelor", "Office"];
                const found = validTypes.find(
                    t => t.toLowerCase() === propertyType.toLowerCase().trim()
                );
                propertyType = found || "";
            }
            setFilters(prev => ({
                ...prev,
                location: loc || "",
                area: area || "",
                category: category || "",
                type: type || "",
                propertyType: propertyType || "",
                beds: beds || "",
                baths: baths || "",
            }));
            initializedFromState.current = true;
        }
    }, [location.state, properties]);

    // Filter by location.state if present
    useEffect(() => {
        if (location.state && properties.length > 0) {
            const { location: loc, area, category, type } = location.state;
            const filtered = properties.filter((property) => {
                return (
                    (loc === "" || property.location === loc) &&
                    (area === "" || property.area === area) &&
                    (category === "" || property.category === category) &&
                    (type === undefined || property.type === type)
                );
            });
            setFilteredProperties(filtered);
        }
    }, [location.state, properties]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Add a reset filters function
    const resetFilters = () => {
        setFilters({
            price: 100000,
            size: 0,
            type: "",
            beds: "",
            baths: "",
            verified: false,
            category: "",
            propertyType: "",
            location: "",
            area: "",
        });
    };

    // Real-time filter: update filteredProperties whenever filters or properties change
    useEffect(() => {
        const filtered = properties.filter((property) => {
            // Fix type case sensitivity
            const typeMatch = !filters.type || (property.type && property.type.toLowerCase() === filters.type.toLowerCase());
            // Beds/Baths: handle 5+ option
            const bedsMatch = !filters.beds || (filters.beds === "5" ? property.beds >= 5 : property.beds === parseInt(filters.beds));
            const bathsMatch = !filters.baths || (filters.baths === "5" ? property.baths >= 5 : property.baths === parseInt(filters.baths));
            return (
                (filters.price === 0 || property.price <= filters.price) &&
                (filters.size === 0 || property.size >= filters.size) &&
                typeMatch &&
                bedsMatch &&
                bathsMatch &&
                (!filters.verified || property.verified) &&
                (filters.category === "" || property.category === filters.category) &&
                (filters.propertyType === "" || property.propertyType === filters.propertyType) &&
                (filters.location === "" || property.location === filters.location) &&
                (filters.area === "" || property.area === filters.area)
            );
        });
        filtered.sort((a, b) => {
            return (b._id?.toString() || '').localeCompare(a._id?.toString() || '');
        });
        setFilteredProperties(filtered);
    }, [filters, properties]);

    // Area options for dynamic area select
    const areaOptions = {
        Dhaka: [
            { value: "Gazipur", label: "Gazipur" },
            { value: "Gulshan", label: "Gulshan" },
            { value: "Badda", label: "Badda" },
            { value: "Abdullahpur", label: "Abdullahpur" },
            { value: "Farmgate", label: "Farmgate" },
            { value: "Mirpur 1", label: "Mirpur 1" },
            { value: "Mirpur 2", label: "Mirpur 2" },
            { value: "Mirpur 10", label: "Mirpur 10" },
        ],
        Rajshahi: [
            { value: "Zero Point", label: "Zero Point" },
            { value: "Rani Bazar", label: "Rani Bazar" },
            { value: "New Market", label: "New Market" },
            { value: "Railgate", label: "Railgate" },
            { value: "Alupotti", label: "Alupotti" },
            { value: "Talaimari", label: "Talaimari" },
            { value: "Kajla", label: "Kajla" },
            { value: "Binodpur", label: "Binodpur" },
            { value: "Khorkhori", label: "Khorkhori" },
        ],
    };

    const [areaList, setAreaList] = useState([]);

    useEffect(() => {
        if (filters.location && areaOptions[filters.location]) {
            setAreaList(areaOptions[filters.location]);
            // Only reset area if location changed and area is not in the new list
            if (
                filters.area &&
                !areaOptions[filters.location].some(opt => opt.value === filters.area)
            ) {
                setFilters((prev) => ({ ...prev, area: "" }));
            }
        } else {
            setAreaList([]);
            if (filters.area) {
                setFilters((prev) => ({ ...prev, area: "" }));
            }
        }
        // eslint-disable-next-line
    }, [filters.location]);

    // Add/remove property from wishlist
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

    return (
        <>
            <Navbar navClass="defaultscroll sticky" menuClass="navigation-menu nav-left" />
            
            <div className="position-relative mt-3">
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
                    <div className="row g-4 flex flex-col lg:flex-row">
                        {/* Sidebar */}
                        <div className="col-lg-4 col-md-6 col-12 w-full lg:w-1/3 mb-4 lg:mb-0">
                            <div className="card bg-white p-4 rounded-4 shadow sticky-bar border border-gray-200" style={{boxShadow:'0 2px 16px 0 #e5e7eb'}}>
                                <h5 className="mb-4 font-bold text-lg text-green-700 flex items-center gap-2"><i className="mdi mdi-filter-variant"></i> Filter Properties</h5>
                                {/* Verified */}
                                <div className="mb-4 flex items-center gap-2">
                                    <label className="font-semibold mb-0">Verified</label>
                                    <label className="inline-flex relative items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            id="verified"
                                            name="verified"
                                            checked={filters.verified}
                                            onChange={handleFilterChange}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:bg-green-600 transition-all"></div>
                                        <span className="ml-2 text-sm text-gray-600">Only show verified</span>
                                    </label>
                                </div>
                                {/* Price Range */}
                                <div className="mb-4">
                                    <label className="mb-1 font-semibold">Current Price</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">৳1k</span>
                                        <input
                                            type="range"
                                            className="form-range flex-1 accent-green-600"
                                            min="1000"
                                            max="100000"
                                            step="1000"
                                            name="price"
                                            value={filters.price}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="text-xs text-gray-500">৳100k</span>
                                    </div>
                                    <div className="text-green-700 font-bold text-sm mt-1">Up to ৳{filters.price}</div>
                                </div>
                                {/* Size Range */}
                                <div className="mb-4">
                                    <label className="mb-1 font-semibold">Size (sq.ft)</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">0</span>
                                        <input
                                            type="range"
                                            className="form-range flex-1 accent-green-600"
                                            min="0"
                                            max="10000"
                                            step="100"
                                            name="size"
                                            value={filters.size}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="text-xs text-gray-500">10k+</span>
                                    </div>
                                    <div className="text-green-700 font-bold text-sm mt-1">From {filters.size} sq.ft</div>
                                </div>
                                {/* Type */}
                                <div className="mb-4">
                                    <label className="mb-1 font-semibold">Type</label>
                                    <select
                                        className="form-select border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        name="type"
                                        value={filters.type}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Any</option>
                                        <option value="Rent">Rent</option>
                                        <option value="Buy">Buy</option>
                                    </select>
                                </div>
                                
                                {/* Beds & Baths in one row */}
                                <div className="mb-4 flex gap-3">
                                    <div className="flex-1">
                                        <label className="mb-1 font-semibold">Beds</label>
                                        <select
                                            className="form-select border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                    <div className="flex-1">
                                        <label className="mb-1 font-semibold">Baths</label>
                                        <select
                                            className="form-select border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                </div>
                                
                                {/* Category & Property Type in one row */}
                                <div className="mb-4 flex gap-3">
                                    <div className="flex-1">
                                        <label className="mb-1 font-semibold">Category</label>
                                        <select
                                            className="form-select border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                    <div className="flex-1">
                                        <label className="mb-1 font-semibold">Property Type</label>
                                        <select
                                            className="form-select border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            name="propertyType"
                                            value={filters.propertyType}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Any</option>
                                            <option value="Family">Family</option>
                                            <option value="Bachelor">Bachelor</option>
                                            <option value="Office">Office</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Location & Area in one row */}
                                <div className="mb-4 flex gap-3">
                                    <div className="flex-1">
                                        <label className="mb-1 font-semibold">Location</label>
                                        <select
                                            className="form-select border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            name="location"
                                            value={filters.location}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Any</option>
                                            <option value="Dhaka">Dhaka</option>
                                            <option value="Rajshahi">Rajshahi</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="mb-1 font-semibold">Area</label>
                                        <select
                                            className="form-select border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            name="area"
                                            value={filters.area}
                                            onChange={handleFilterChange}
                                            disabled={!filters.location}
                                        >
                                            <option value="">Any</option>
                                            {areaList.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {/* Reset Button */}
                                <div className="mt-6 flex justify-frist ">
                                    <button type="button" className="btn  btn-outline-success px-4 py-2 rounded-full font-semibold border border-green-600 text-green-700 hover:bg-green-50 transition" onClick={resetFilters}>
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Property Listings */}
                        <div className="col-lg-8 col-md-6 col-12 w-full lg:w-2/3">
                            <div className="row g-4 flex flex-col sm:flex-row">
                                {filteredProperties.map((item, index) => (
                                    <div className="col-lg-6 col-12 w-full sm:w-1/2 mb-4" key={item._id || item.id || index}>
                                        <div className="card property border-0 shadow position-relative overflow-hidden rounded-3 h-full flex flex-col">
                                            <div className="property-image position-relative overflow-hidden shadow rounded-t-3xl">
                                                {/* Verified Tag */}
                                                {item.verified && (
                                                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
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
                                            <div className="card-body content p-4 flex-1 flex flex-col justify-between">
                                                <Link
                                                    to={`/property-detail/${item._id || item.id}`}
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
                                                            {[...Array(Math.floor(item.rating || 0))].map((_, i) => (
                                                                <li key={i} className="list-inline-item mb-0">
                                                                    <i className="mdi mdi-star"></i>
                                                                </li>
                                                            ))}
                                                            <li className="list-inline-item mb-0 text-dark">
                                                                {item.rating} ({item.reviews?.length || item.reviews || 0})
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

