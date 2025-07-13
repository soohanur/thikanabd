import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import { propertyData } from "../../data/data";

import Lightbox from "react-18-image-lightbox";
import "../../../node_modules/react-18-image-lightbox/style.css";

export default function PropertyDetails() {
    const params = useParams();
    const id = params.id;
    const data = propertyData.find((item) => item.id === parseInt(id));

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [open, setIsOpen] = useState(false);

    const images = data?.images || []; // Use dynamic images from propertyData

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
            <section className="section mt-5 pt-5">
                <div className="container mt-2">
                    <div className="row g-2">
                        <div className="col-md-6">
                            <Link to="#" onClick={() => handleImageClick(0)} className="lightbox" title="">
                                <img src={images[0]} className="img-fluid rounded-3 shadow" alt="Property" />
                            </Link>
                        </div>

                        <div className="col-md-6">
                            <div className="row g-2">
                                {images.slice(1).map((image, index) => (
                                    <div className="col-6" key={index}>
                                        <Link to="#" onClick={() => handleImageClick(index + 1)} className="lightbox" title="">
                                            <img src={image} className="img-fluid rounded-3 shadow" alt="Property" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mt-100 mt-60">
                    <div className="row g-4">
                        <div className="col-lg-8 col-md-7 col-12">
                            <div className="section-title">
                                <h4 className="title mb-0">{data?.title || "Property Title"}</h4>

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

                                <div className="card map border-0">
                                    <div className="card-body p-0">
                                        <iframe
                                            src={data?.map || "https://www.google.com/maps"}
                                            className="rounded-3"
                                            style={{ border: "0" }}
                                            title="Property Location"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-5 col-12">
                            <div className="rounded-3 shadow bg-white sticky-bar p-4">
                                <h5 className="mb-3">Price:</h5>

                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className="mb-0">৳ {data?.price || "N/A"}</h5>
                                    <span className="badge bg-primary">{data?.type || "N/A"}</span>
                                </div>

                                <div className="d-flex mt-3">
                                    <Link to="#" className="btn btn-primary w-100 me-2">
                                        Call Now
                                    </Link>
                                    <Link to="#" className="btn btn-primary w-100">
                                        Massege
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