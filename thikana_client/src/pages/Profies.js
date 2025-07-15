import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import coverImg from "../assect/images/profile-cover.png";
import defaultProfile from "../assect/images/profile-thumb.png";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDropzone } from 'react-dropzone';
import LeafletLocationPicker from '../components/LeafletLocationPicker';
import DashboardTab from "../components/DashboardTab";
import PropertyListTab from "../components/PropertyListTab";
import PostPropertyTab from "../components/PostPropertyTab";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import WalletTab from "../components/WalletTab";
import WishlistTab from "../components/WishlistTab";
import ProfileTab from "../components/ProfileTab";
import BecomeAgentTab from "../components/BecomeAgentTab";
import BookingListTab from "../components/CurrentBookingTab";
import CurrentBookingTab from "../components/CurrentBookingTab";
import BookedPropertyTab from "../components/BookedPropertyTab";
import BookedAgentTab from "../components/BookedAgentTab";
import { apiUrl } from "../utils/api";

async function fetchUserProfile(token) {
  const res = await axios.get(apiUrl("/api/user/profile"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

function ProfileEditTab({ user, onUpdate }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    profilePicture: null,
    coverPicture: null,

  });
  const [avatarPreview, setAvatarPreview] = useState(user?.profilePicture || defaultProfile);
  const [coverPreview, setCoverPreview] = useState(user?.coverPicture || coverImg);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Dropzone for avatar
  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps, isDragActive: isAvatarDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, profilePicture: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    }
  });
  // Dropzone for cover
  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, coverPicture: files[0] }));
      setCoverPreview(URL.createObjectURL(files[0]));
    }
  });

  useEffect(() => {
    // On mount, fetch latest user profile
    const token = localStorage.getItem("thikana_token");
    if (token) {
      fetchUserProfile(token).then(data => {
        setForm(f => ({
          ...f,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          profilePicture: null,
          coverPicture: null,
        }));
        setAvatarPreview(data.profilePicture || defaultProfile);
        setCoverPreview(data.coverPicture || coverImg);
      });
      // Prevent scroll to bottom on mount
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) formData.append(k, v);
      });
      const token = localStorage.getItem("thikana_token");
      await axios.post(apiUrl("/api/user/profile"), formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Fetch latest user profile and update UI/localStorage
      const data = await fetchUserProfile(token);
      setSuccess("Profile updated successfully!");
      setForm(f => ({
        ...f,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        profilePicture: null,
        coverPicture: null,
      }));
      setAvatarPreview(data.profilePicture || defaultProfile);
      setCoverPreview(data.coverPicture || coverImg);
      localStorage.setItem('thikana_user', JSON.stringify(data));
      if (onUpdate) onUpdate(data);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div {...getCoverRootProps()} className={`w-full h-40 rounded-2xl border-2 border-dashed flex items-center justify-center mb-2 cursor-pointer ${isCoverDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
          <input {...getCoverInputProps()} />
          <img src={coverPreview} alt="Cover" className="w-full h-40 object-cover rounded-2xl" />
        </div>
        <div {...getAvatarRootProps()} className={`w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden shadow-lg cursor-pointer ${isAvatarDragActive ? 'border-green-500' : ''}`}>
          <input {...getAvatarInputProps()} />
          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Name</label>
        <input className="form-input w-full" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Email</label>
        <input className="form-input w-full" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Phone</label>
        <input className="form-input w-full" name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div>
        <label className="block font-semibold mb-1">Address</label>
        <input className="form-input w-full" name="address" value={form.address} onChange={handleChange} />
      </div>
      {success && <div className="text-green-600 font-bold">{success}</div>}
      {error && <div className="text-red-600 font-bold">{error}</div>}
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}



export default function Profiles() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profileDetails");
  const [properties, setProperties] = useState([]); // Start with empty array, not propertiesData
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editProperty, setEditProperty] = useState(null);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user data from localStorage (set after login)
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('thikana_user');
    return userData ? JSON.parse(userData) : null;
  });

  // Move fetchProperties outside useEffect so it can be called anywhere
  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('thikana_token');
      const res = await axios.get(apiUrl('/api/properties/user'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
    } catch (err) {
      setProperties([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('thikana_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProperties();
  }, []);

  const handleEditProperty = async (property) => {
    // Fetch property details if needed (or just use property if all data is present)
    setEditProperty(property);
    setActiveTab("editProperty");
    setEditFormVisible(true);
  };

  const handleDeleteProperty = async (property) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const token = localStorage.getItem('thikana_token');
      await axios.delete(apiUrl(`/api/properties/${property._id || property.id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties((prev) => prev.filter((p) => (p._id || p.id) !== (property._id || property.id)));
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  // Fetch wishlist (for badge and saved tab)
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

  // Fetch wishlist when dashboard or saved tab is active
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'saved') {
      fetchWishlist();
    }
  }, [activeTab]);



  // Fetch latest user profile when dashboard tab is activated
  useEffect(() => {
    if (activeTab === "dashboard") {
      const token = localStorage.getItem("thikana_token");
      if (token) {
        fetchUserProfile(token).then((data) => {
          setUser(data);
          localStorage.setItem("thikana_user", JSON.stringify(data));
        });
      }
    }
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ff] min-h-screen">
      {/* Navbar */}
      <Navbar navClass="defaultscroll sticky top-0 z-50" menuClass="navigation-menu nav-left" />
      {/* Hamburger icon at the very left of the page, after navbar, for mobile */}
      {!sidebarOpen && (
        <button
          className="lg:hidden fixed left-4 top-[88px] z-50 p-2 rounded-md bg-white shadow-md border border-gray-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <i className="fas fa-bars text-xl text-green-700"></i>
        </button>
      )}
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex lg:hidden" onClick={() => setSidebarOpen(false)}>
          <aside
            className={`fixed left-0 top-[72px] h-[calc(100vh-72px)] w-4/5 max-w-xs bg-white shadow-lg flex flex-col py-8 px-4 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
            {/* Sidebar content (same as below) */}
            <ul className="space-y-6 mt-8">
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "dashboard" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
                >
                  <i className={`fas fa-gauge text-lg ${activeTab === "dashboard" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">Dashboard</span>
                </button>
              </li>
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "propertyList" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => { setActiveTab("propertyList"); setSidebarOpen(false); }}
                >
                  <i className={`fas fa-layer-group text-lg ${activeTab === "propertyList" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">Property List</span>
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{properties.length}</span>
                </button>
              </li>
              {/* Current Booking only for agents, with badge */}
              {user?.agent === "agent" && (
                <li className="group">
                  <button
                    className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "bookingList" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                    onClick={() => { setActiveTab("bookingList"); setSidebarOpen(false); }}
                  >
                    <i className={`fas fa-list-alt text-lg ${activeTab === "bookingList" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                    <span className="group-hover:text-green-700">Current Booking</span>
                  </button>
                </li>
              )}
              {/* Booked Agents only for normal users (not agents), with badge */}
              {user?.agent !== "agent" && (
                <li className="group">
                  <button
                    className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "bookedAgents" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                    onClick={() => { setActiveTab("bookedAgents"); setSidebarOpen(false); }}
                  >
                    <i className={`fas fa-user-tie text-lg ${activeTab === "bookedAgents" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                    <span className="group-hover:text-green-700">Booked Agents</span>
                  </button>
                </li>
              )}
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "bookedProperty" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => { setActiveTab("bookedProperty"); setSidebarOpen(false); }}
                >
                  <i className={`fas fa-book text-lg ${activeTab === "bookedProperty" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">Booked Property</span>
                </button>
              </li>
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "postProperty" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => { setActiveTab("postProperty"); setSidebarOpen(false); }}
                >
                  <i className={`fas fa-file-alt text-lg ${activeTab === "postProperty" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">Post Property</span>
                </button>
              </li>
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "wallet" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => { setActiveTab("wallet"); setSidebarOpen(false); }}
                >
                  <i className={`fas fa-wallet text-lg ${activeTab === "wallet" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">My Wallet</span>
                </button>
              </li>
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "saved" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => { setActiveTab("saved"); setSidebarOpen(false); }}
                >
                  <i className={`fas fa-heart text-lg ${activeTab === "saved" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">Wishlist</span>
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{wishlist.length}</span>
                </button>
              </li>
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "profile" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => { setActiveTab("profile"); setSidebarOpen(false); }}
                >
                  <i className={`fas fa-user text-lg ${activeTab === "profile" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">My Profile</span>
                </button>
              </li>
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "becomeAgent" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => { setActiveTab("becomeAgent"); setSidebarOpen(false); }}
                >
                  <i className={`fas fa-user-tie text-lg ${activeTab === "becomeAgent" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">Become a Agent</span>
                </button>
              </li>
            </ul>

            <button className="w-full btn btn-success mt-8" onClick={() => {
              localStorage.removeItem('thikana_token');
              localStorage.removeItem('thikana_user');
              window.location.href = '/';
            }}>
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </aside>
        </div>
      )}
      <div className="flex flex-col lg:flex-row w-full" style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '72px' }}>
        {/* Left Sidebar (desktop) */}
        <aside className="hidden lg:flex sticky top-[72px] h-[calc(100vh-72px)] w-1/5 bg-white shadow-lg flex-col py-8 px-4 z-10">
          <ul className="space-y-6">
            <li className="group">
              <button
                className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "dashboard" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                onClick={() => setActiveTab("dashboard")}
              >
                <i className={`fas fa-gauge text-lg ${activeTab === "dashboard" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                <span className="group-hover:text-green-700">Dashboard</span>
              </button>
            </li>
            <li className="group">
              <button
                className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "propertyList" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                onClick={() => setActiveTab("propertyList")}
              >
                <i className={`fas fa-layer-group text-lg ${activeTab === "propertyList" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                <span className="group-hover:text-green-700">Property List</span>
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{properties.length}</span>
              </button>
            </li>
            {/* Current Booking only for agents, with badge */}
            {user?.agent === "agent" && (
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "bookingList" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => setActiveTab("bookingList")}
                >
                  <i className={`fas fa-list-alt text-lg ${activeTab === "bookingList" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">Current Booking</span>
                </button>
              </li>
            )}
            {/* Booked Agents only for normal users (not agents), with badge */}
            {user?.agent !== "agent" && (
              <li className="group">
                <button
                  className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "bookedAgents" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                  onClick={() => setActiveTab("bookedAgents")}
                >
                  <i className={`fas fa-user-tie text-lg ${activeTab === "bookedAgents" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                  <span className="group-hover:text-green-700">Booked Agents</span>
                </button>
              </li>
            )}
            <li className="group">
              <button
                className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "bookedProperty" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                onClick={() => setActiveTab("bookedProperty")}
              >
                <i className={`fas fa-book text-lg ${activeTab === "bookedProperty" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                <span className="group-hover:text-green-700">Booked Property</span>
              </button>
            </li>
            <li className="group">
              <button
                className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "postProperty" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                onClick={() => setActiveTab("postProperty")}
              >
                <i className={`fas fa-file-alt text-lg ${activeTab === "postProperty" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                <span className="group-hover:text-green-700">Post Property</span>
              </button>
            </li>
            <li className="group">
              <button
                className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "wallet" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                onClick={() => setActiveTab("wallet")}
              >
                <i className={`fas fa-wallet text-lg ${activeTab === "wallet" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                <span className="group-hover:text-green-700">My Wallet</span>
              </button>
            </li>
            <li className="group">
              <button
                className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "saved" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                onClick={() => setActiveTab("saved")}
              >
                <i className={`fas fa-heart text-lg ${activeTab === "saved" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                <span className="group-hover:text-green-700">Wishlist</span>
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{wishlist.length}</span>
              </button>
            </li>
            <li className="group">
              <button
                className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "profile" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                onClick={() => setActiveTab("profile")}
              >
                <i className={`fas fa-user text-lg ${activeTab === "profile" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                <span className="group-hover:text-green-700">My Profile</span>
              </button>
            </li>
            <li className="group">
              <button
                className={`flex items-center gap-3 font-semibold w-full text-left ${activeTab === "becomeAgent" ? "text-green-700" : "text-black"} group-hover:text-green-700`}
                onClick={() => setActiveTab("becomeAgent")}
              >
                <i className={`fas fa-user-tie text-lg ${activeTab === "becomeAgent" ? "text-green-700" : ""} group-hover:text-green-700`}></i>
                <span className="group-hover:text-green-700">Become a Agent</span>
              </button>
            </li>
          </ul>

          <button className="w-full btn btn-success mt-8" onClick={() => {
            localStorage.removeItem('thikana_token');
            localStorage.removeItem('thikana_user');
            window.location.href = '/';
          }}>
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </aside>
        {/* Right Content Area */}
        <main className="flex-1 w-full pt-8 pb-24 transition-all duration-300 px-[15px] lg:pl-[50px] lg:pr-[50px] lg:pt-12">
          {activeTab === "dashboard" ? (
            <>
              <DashboardTab user={user} properties={properties} />

            </>
          ) : activeTab === "postProperty" ? (
            // REMOVE everything here (the old form and logic)
            <PostPropertyTab
              user={user}
              onSuccess={() => { fetchProperties(); setEditProperty(null); setActiveTab('dashboard'); }}
              editProperty={editProperty}
            />
          ) : activeTab === "editProperty" && editFormVisible ? (
            <PostPropertyTab
              user={user}
              onSuccess={() => {
                fetchProperties();
                setEditFormVisible(false);
                setEditProperty(null);
                setActiveTab("dashboard");
              }}
              editProperty={editProperty}
            />
          ) : activeTab === "propertyList" ? (
            <>
              <PropertyListTab
                properties={properties}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
              />
            </>
          ) : activeTab === "saved" ? (
            <>
              <WishlistTab
                wishlist={wishlist}
                onRemove={async (property) => {
                  try {
                    const token = localStorage.getItem('thikana_token');
                    await axios.delete(apiUrl(`/api/wishlist/${property._id || property.id}`), {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setWishlist(prev => prev.filter(p => (p._id || p.id) !== (property._id || property.id)));
                  } catch { }
                }}
              />
            </>
          ) : activeTab === "wallet" ? (
            <WalletTab user={user} />
          ) : activeTab === "profile" ? (
            <ProfileTab user={user} onUpdate={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem('thikana_user', JSON.stringify(updatedUser));
            }} />
          ) : activeTab === "becomeAgent" ? (
            <BecomeAgentTab user={user} onUpdate={() => {
              // Optionally refresh user profile after update
              const token = localStorage.getItem("thikana_token");
              if (token) {
                fetchUserProfile(token).then((data) => {
                  setUser(data);
                  localStorage.setItem("thikana_user", JSON.stringify(data));
                });
              }
            }} />
          ) : activeTab === "bookingList" ? (
            <CurrentBookingTab user={user} />
          ) : activeTab === "bookedAgents" ? (
            <BookedAgentTab user={user} />
          ) : activeTab === "bookedProperty" ? (
            <BookedPropertyTab user={user} />
          ) : (
            <div className="w-full h-full"></div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}