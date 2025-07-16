import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import { io } from "socket.io-client";
import moment from "moment";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import Lightbox from "react-18-image-lightbox";
import "../../../node_modules/react-18-image-lightbox/style.css";
import coverImg from "../../assect/images/profile-cover.png";
import defaultProfile from "../../assect/images/profile-thumb.png";
import { apiUrl } from "../../utils/api";

function AgentReviews({ agentId }) {
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/api/agent/${agentId}/ratings`));
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    if (agentId) fetchReviews();
  }, [agentId]);

  if (loading) return <div className="text-xs text-gray-400 mt-2">Loading reviews...</div>;
  if (!reviews.length) return <div className="text-xs text-gray-400 mt-2">No reviews yet.</div>;
  return (
    <div className="w-full mt-2">
      <div className="font-semibold text-gray-700 text-sm mb-1">Agent Reviews:</div>
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
        {reviews.map((r, i) => (
          <div key={i} className="bg-gray-50 border rounded p-2 flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-yellow-400 text-base">{'★'.repeat(r.rating)}</span>
              <span className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            {r.comment && <div className="text-xs text-gray-700 italic">{r.comment}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentRatingSummary({ agentId }) {
  const [avg, setAvg] = React.useState(null);
  const [count, setCount] = React.useState(null);
  React.useEffect(() => {
    async function fetchData() {
      try {
        const avgRes = await fetch(apiUrl(`/api/agent/${agentId}/rating/average`));
        const avgData = await avgRes.json();
        setAvg(avgData.averageRating || 0);
        const countRes = await fetch(apiUrl(`/api/agent/${agentId}/ratings`));
        const countData = await countRes.json();
        setCount(Array.isArray(countData) ? countData.length : 0);
      } catch {}
    }
    if (agentId) fetchData();
  }, [agentId]);
  if (avg > 0 && count > 0) {
    return (
      <div className="flex items-center justify-center mt-1">
        <span className="text-yellow-400 text-lg mr-1">★</span>
        <span className="font-bold text-base text-gray-800">{avg.toFixed(1)}</span>
        <span className="ml-2 text-gray-600 text-xs">({count} rating{count > 1 ? 's' : ''})</span>
      </div>
    );
  }
  return null;
}

export default function PropertyDetails() {
    const params = useParams();
    const id = params.id;
    const [data, setData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [open, setIsOpen] = useState(false);
    const [postedUser, setPostedUser] = useState(null);
    const [postedUserStatus, setPostedUserStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch property details from backend by _id
        axios.get(apiUrl(`/api/properties/all`))
            .then(res => {
                const found = res.data.find(item => (item._id === id || item._id?.toString() === id));
                setData(found);

                if (found && found.userId) {
                    axios.get(apiUrl(`/api/users/${found.userId}`))
                        .then(res => setPostedUser(res.data.user))
                        .catch(() => setPostedUser(null));
                }
            })
            .catch(() => setData(null));
        // Prevent scroll to bottom on mount
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [id]);

    useEffect(() => {
        if (!postedUser || !postedUser._id) return;
        const socket = io(apiUrl("/"), { path: "/socket.io", autoConnect: true, reconnection: true });
        socket.emit("check-user-status", postedUser._id);
        socket.on("user-status", ({ userId, online, lastSeen }) => {
            if (userId === postedUser._id) {
                setPostedUserStatus({ online, lastSeen });
            }
        });
        const interval = setInterval(() => {
            socket.emit("check-user-status", postedUser._id);
        }, 30000);
        return () => {
            clearInterval(interval);
            socket.disconnect();
        };
    }, [postedUser]);

    // Lightbox images: coverImage first, then galleryImages
    const images = [
        data?.coverImage
            ? (data.coverImage.startsWith('http')
                ? data.coverImage
                : data.coverImage.startsWith('/uploads')
                    ? apiUrl(data.coverImage)
                    : apiUrl(`/uploads/${data.coverImage}`))
            : "",
        ...(data?.galleryImages
            ? data.galleryImages.map(img =>
                img.startsWith('http')
                    ? img
                    : img.startsWith('/uploads')
                        ? apiUrl(img)
                        : apiUrl(`/uploads/${img}`)
            )
            : [])
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
                                src={data.coverImage
                                    ? (data.coverImage.startsWith('http')
                                        ? data.coverImage
                                        : data.coverImage.startsWith('/uploads')
                                            ? apiUrl(data.coverImage)
                                            : apiUrl(`/uploads/${data.coverImage}`))
                                    : ''}
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
                                            src={img.startsWith('http')
                                                ? img
                                                : img.startsWith('/uploads')
                                                    ? apiUrl(img)
                                                    : apiUrl(`/uploads/${img}`)}
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

                                {/* Location Data Section */}
                                <div className="mb-3 mt-3">
                                    <div className="flex flex-wrap gap-3 align-items-center">
                                        <span className="badge bg-green-700 text-white text-xl px-3 py-2 rounded font-semibold">
                                            {data?.location || 'N/A'}
                                        </span>
                                        <span className="badge bg-green-700 text-xl text-white px-3 py-2 rounded font-semibold">
                                            {data?.area || 'N/A'}
                                        </span>
                                        
                                    </div>
                                </div>

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
                                    <div className="rounded-3xl overflow-hidden w-full bg-white flex flex-col items-center pt-1 pb-4 relative">
                                        <img
                                            src={postedUser.coverPicture ? (postedUser.coverPicture.startsWith('http') ? postedUser.coverPicture : apiUrl(postedUser.coverPicture)) : coverImg}
                                            alt="Cover"
                                            className="w-full h-40 object-cover rounded-3xl mb-0"
                                            style={{ maxWidth: '100%', borderBottomLeftRadius: '0', borderBottomRightRadius: '0' }}
                                        />
                                        {/* Agent Charge badge (top right) */}
                                        {postedUser.agent === "agent" && postedUser.agentCharge && (
                                            <div style={{position: 'absolute', top: 16, right: 16, zIndex: 20}}>
                                                <span className="bg-green-600 text-white px-4 py-2 rounded-full shadow font-semibold text-sm">
                                                    Agent Charge: ৳{postedUser.agentCharge}
                                                </span>
                                            </div>
                                        )}
                                        <div className="relative mb-2" style={{ marginTop: '-48px', zIndex: 10 }}>
                                            <img
                                                src={postedUser.profilePicture ? (postedUser.profilePicture.startsWith('http') || postedUser.profilePicture.startsWith('/uploads/') ? (postedUser.profilePicture.startsWith('http') ? postedUser.profilePicture : apiUrl(postedUser.profilePicture)) : apiUrl(`/uploads/${postedUser.profilePicture}`)) : defaultProfile}
                                                alt="Profile"
                                                className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg transition-transform duration-200 ${postedUserStatus && postedUserStatus.online ? 'border-green-500' : 'border-gray-400'}`}
                                                style={{ boxShadow: postedUserStatus && postedUserStatus.online ? '0 0 0 4px #bbf7d0' : '0 0 0 4px #e5e7eb' }}
                                            />
                                            <span className={`absolute right-2 bottom-2 w-5 h-5 border-2 border-white rounded-full z-50 animate-pulse ${postedUserStatus && postedUserStatus.online ? 'bg-green-500' : 'bg-gray-400'}`}
                                                title={postedUserStatus && postedUserStatus.online ? 'Online' : 'Offline'}
                                            ></span>
                                            {postedUserStatus && (
                                                <span className={`absolute left-2 top-2 px-2 py-0.5 rounded-full text-xs font-bold shadow ${postedUserStatus.online ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-200 text-gray-600 border border-gray-300'}`}>{postedUserStatus.online ? 'Online' : 'Offline'}</span>
                                            )}
                                        </div>
                                        {/* Book Agent button for agent posts, visible to everyone, under profile pic */}
                                        <div className="w-full text-center mt-2 flex flex-col items-center gap-2">
                                            <Link to={`/public-profile/${postedUser.username || postedUser._id}`} className="block text-lg font-bold text-gray-800 hover:text-green-700 transition">
                                                {postedUser.name || postedUser.username || 'User'}
                                            </Link>
                                            {/* Agent Reviews and Rating Summary */}
                                            {postedUser.agent === "agent" && (
                                              <>
                                                <AgentRatingSummary agentId={postedUser._id} />
                                                <AgentReviews agentId={postedUser._id} />
                                              </>
                                            )}
                                            {/* Active status text below name */}
                                            {postedUserStatus && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {postedUserStatus.online ? (
                                                        <span className="text-green-600 font-semibold">Active now</span>
                                                    ) : postedUserStatus.lastSeen ? (
                                                        <span>Last seen {moment(postedUserStatus.lastSeen).fromNow()}</span>
                                                    ) : (
                                                        <span>Offline</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {postedUser.agent === "agent" && (
                                            <Link
                                                to={localStorage.getItem('thikana_token') ? "/book-agent/" + postedUser._id : "/auth-login?redirect=/book-agent/" + postedUser._id}
                                                className="btn bg-green-600 text-white w-100 mt-3 rounded-full font-semibold shadow"
                                                style={{whiteSpace:'nowrap'}}
                                            >
                                                Book Agent
                                            </Link>
                                        )}
                                    </div>
                                )}
                                {/* Show price/type/rent/buy only if postedUser is not an agent */}
                                {(!postedUser || postedUser.agent !== "agent") && (
                                  <>
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
                                      {data?.type && data.type.toLowerCase() === 'buy' ? (
                                        <button
                                          className="btn btn-primary w-100"
                                          onClick={() => {
                                            const token = localStorage.getItem('thikana_token');
                                            if (!token) {
                                              navigate(`/auth-login?redirect=/buy/${data._id}`);
                                            } else {
                                              navigate(`/buy/${data._id}`);
                                            }
                                          }}
                                        >
                                          Buy Now
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-primary w-100"
                                          onClick={() => {
                                            const token = localStorage.getItem('thikana_token');
                                            if (!token) {
                                              navigate(`/auth-login?redirect=/booking/${postedUser._id}`);
                                            } else {
                                              navigate(`/booking/${postedUser._id}`);
                                            }
                                          }}
                                        >
                                          Rent Now
                                        </button>
                                      )}
                                    </div>
                                  </>
                                )}
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