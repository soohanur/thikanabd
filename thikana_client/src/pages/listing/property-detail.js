import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import Lightbox from "react-18-image-lightbox";
import "../../../node_modules/react-18-image-lightbox/style.css";
import coverImg from "../../assect/images/profile-cover.png";
import defaultProfile from "../../assect/images/profile-thumb.png";

export default function PropertyDetails() {
    const params = useParams();
    const id = params.id;
    const [data, setData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [open, setIsOpen] = useState(false);
    const [postedUser, setPostedUser] = useState(null);

    useEffect(() => {
        // Fetch property details from backend by _id
        axios.get(`http://localhost:5000/api/properties/all`)
            .then(res => {
                const found = res.data.find(item => (item._id === id || item._id?.toString() === id));
                setData(found);

                if (found && found.userId) {
                    axios.get(`http://localhost:5000/api/users/${found.userId}`)
                        .then(res => setPostedUser(res.data.user))
                        .catch(() => setPostedUser(null));
                }
            })
            .catch(() => setData(null));
        // Prevent scroll to bottom on mount
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [id]);

    // Lightbox images: coverImage first, then galleryImages
    const images = [
        data?.coverImage ? (data.coverImage.startsWith('http') ? data.coverImage : `http://localhost:5000/uploads/${data.coverImage}`) : "",
        ...(data?.galleryImages ? data.galleryImages.map(img => img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`) : [])
    ];

    const handleMovePrev = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + images.length - 1) % images.length);
    };

    const handleMoveNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setIsOpen(true);
    };

    const currentImage = images[currentImageIndex];

    return (
        <>
            <Navbar navClass="defaultscroll sticky" menuClass="navigation-menu nav-left" />
            <section className="container section mt-5 pt-5">


                {/* Cover Image Full Width */}
                {data?.coverImage && (
                    <div className="container" style={{ width: '100%', maxHeight: '400px', overflow: 'hidden', marginBottom: '32px' }}>
                        <a href="#" onClick={e => { e.preventDefault(); setCurrentImageIndex(0); setIsOpen(true); }}>
                            <img
                                className="rounded-xl"
                                src={data.coverImage.startsWith('http') ? data.coverImage : `http://localhost:5000/uploads/${data.coverImage}`}
                                alt="Cover"
                                style={{ width: '100%', height: '400px', objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
                            />
                        </a>
                    </div>
                )}
                {/* Gallery Slider */}
                {data?.galleryImages && data.galleryImages.length > 0 && (
                    <div className="container mb-4">
                        <TinySlider
                            settings={{
                                items: 4,
                                gutter: 12,
                                slideBy: 1,
                                mouseDrag: true,
                                controls: true,
                                nav: false,
                                loop: false,
                                responsive: {
                                    0: { items: 1 },
                                    600: { items: 2 },
                                    900: { items: 3 },
                                    1200: { items: 4 }
                                }
                            }}
                        >
                            {data.galleryImages.map((img, idx) => (
                                <div key={idx} style={{ padding: '0 6px' }}>
                                    <a href="#" onClick={e => { e.preventDefault(); setCurrentImageIndex(idx + 1); setIsOpen(true); }}>
                                        <img
                                            src={img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`}
                                            alt={`Gallery ${idx + 1}`}
                                            style={{ width: '100%', height: '140px', objectFit: 'cover', objectPosition: 'center center', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                                        />
                                    </a>
                                </div>
                            ))}
                        </TinySlider>
                    </div>
                )}

                <div className="container mt-100 mt-60">
                    <div className="row g-4">
                        <div className="col-lg-8 col-md-7 col-12">
                            <div className="section-title">
                                <h4 className="title mb-0">
                                    {data?.title && data.title.length > 30
                                        ? data.title.slice(0, 30) + '...'
                                        : data?.title || "Property Title"}
                                </h4>

                                <ul className="list-unstyled mb-0 py-3">
                                    <li className="list-inline-item">
                                        <span className="d-flex align-items-center me-4">
                                            <i className="mdi mdi-arrow-expand-all fs-4 me-2 text-primary"></i>
                                            <span className="text-muted fs-5">{data?.size || "N/A"} sq.ft</span>
                                        </span>
                                    </li>

                                    <li className="list-inline-item">
                                        <span className="d-flex align-items-center me-4">
                                            <i className="mdi mdi-bed fs-4 me-2 text-primary"></i>
                                            <span className="text-muted fs-5">{data?.beds || "N/A"} Beds</span>
                                        </span>
                                    </li>

                                    <li className="list-inline-item">
                                        <span className="d-flex align-items-center me-4">
                                            <i className="mdi mdi-shower fs-4 me-2 text-primary"></i>
                                            <span className="text-muted fs-5">{data?.baths || "N/A"} Baths</span>
                                        </span>
                                    </li>

                                    <li className="list-inline-item">
                                        <span className="d-flex align-items-center">
                                            <i className="fas fa-building fs-4 me-2 text-primary"></i>
                                            <span className="text-muted fs-5">{data?.category || "N/A"} </span>
                                        </span>
                                    </li>
                                </ul>

                                <p className="text-muted">{data?.description || "No description available."}</p>

                                {/* Map Section */}
                                <div className="card map border-0">
                                    <div className="card-body p-0">
                                        {(() => {
                                            // If map is a stringified object, parse and use coordinates
                                            if (typeof data?.map === 'string' && data.map.trim().startsWith('{')) {
                                                try {
                                                    const coords = JSON.parse(data.map);
                                                    if (coords.lat && coords.lng) {
                                                        return (
                                                            <div style={{ width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
                                                                <iframe
                                                                    width="100%"
                                                                    height="300"
                                                                    frameBorder="0"
                                                                    style={{ border: 0, borderRadius: '12px' }}
                                                                    src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
                                                                    allowFullScreen
                                                                    title="Property Location"
                                                                ></iframe>
                                                            </div>
                                                        );
                                                    }
                                                } catch (e) { /* ignore */ }
                                            }
                                            // If map is an object with lat/lng
                                            if (typeof data?.map === 'object' && data.map && data.map.lat && data.map.lng) {
                                                return (
                                                    <div style={{ width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
                                                        <iframe
                                                            width="100%"
                                                            height="300"
                                                            frameBorder="0"
                                                            style={{ border: 0, borderRadius: '12px' }}
                                                            src={`https://maps.google.com/maps?q=${data.map.lat},${data.map.lng}&z=15&output=embed`}
                                                            allowFullScreen
                                                            title="Property Location"
                                                        ></iframe>
                                                    </div>
                                                );
                                            }
                                            // If map is a valid Google Maps URL
                                            if (typeof data?.map === 'string' && (data.map.includes('google.com/maps') || data.map.includes('maps.google.com'))) {
                                                return (
                                                    <iframe
                                                        src={data.map}
                                                        className="rounded-3"
                                                        style={{ border: "0", width: '100%', height: '300px', borderRadius: '12px' }}
                                                        title="Property Location"
                                                        allowFullScreen
                                                    ></iframe>
                                                );
                                            }
                                            // Fallback: show nothing or a placeholder
                                            return <div style={{ width: '100%', height: '300px', background: '#e0e0e0', borderRadius: '12px' }} />;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-5 col-12">

                            <div className="rounded-3 shadow bg-white sticky-bar p-4">
                                {/* Posted User Info Box */}
                                {postedUser && (
                                    <div className="rounded-3xl overflow-hidden w-full bg-white flex flex-col items-center pt-1 pb-4">
                                        <img
                                            src={postedUser.coverPicture ? (postedUser.coverPicture.startsWith('http') ? postedUser.coverPicture : `http://localhost:5000${postedUser.coverPicture}`) : coverImg}
                                            alt="Cover"
                                            className="w-full h-40 object-cover rounded-3xl mb-0"
                                            style={{ maxWidth: '100%', borderBottomLeftRadius: '0', borderBottomRightRadius: '0' }}
                                        />
                                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden shadow-lg mx-auto" style={{ marginTop: '-48px', zIndex: 10 }}>
                                            <img
                                                src={postedUser.profilePicture ? (postedUser.profilePicture.startsWith('http') || postedUser.profilePicture.startsWith('/uploads/') ? (postedUser.profilePicture.startsWith('http') ? postedUser.profilePicture : `http://localhost:5000${postedUser.profilePicture}`) : `http://localhost:5000/uploads/${postedUser.profilePicture}`) : defaultProfile}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="w-full text-center mt-2 flex flex-col items-center gap-2">
                                            <Link to={`/public-profile/${postedUser.username || postedUser._id}`} className="block text-lg font-bold text-gray-800 hover:text-green-700 transition">
                                                {postedUser.name || postedUser.username || 'User'}
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                <div className="d-flex align-items-center mt-5 justify-content-between">
                                    <span className="text-green-800 font-bold text-[20px] uppercase">{data?.type || "N/A"}</span>
                                    <h5 className="text-green-800 font-bold text-[20px] uppercase">৳ {data?.price || "N/A"}</h5>
                                </div>

                                <div className="d-flex mt-3">
                                    {/* Direct message button, only if logged in and postedUser is not null */}
                                    {localStorage.getItem('thikana_token') && postedUser && postedUser._id && (
                                        <Link to={`/messages/${postedUser._id}`} className="btn btn-primary w-100 me-2">
                                            Message
                                        </Link>
                                    )}
                                    <Link to="#" className="btn btn-primary w-100">
                                        {data?.type && data.type.toLowerCase() === 'buy' ? 'Buy Now' : 'Rent Now'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            {open && (
                <Lightbox
                    mainSrc={currentImage}
                    prevSrc={images[(currentImageIndex + images.length - 1) % images.length]}
                    nextSrc={images[(currentImageIndex + 1) % images.length]}
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={handleMovePrev}
                    onMoveNextRequest={handleMoveNext}
                />
            )}
        </>
    );
}