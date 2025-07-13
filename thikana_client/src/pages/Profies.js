import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import coverImg from "../assect/images/profile-cover.png";
import defaultProfile from "../assect/images/profile-thumb.png";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDropzone } from 'react-dropzone';
import LeafletLocationPicker from '../components/LeafletLocationPicker';

import Navbar from "../components/navbar";
import Footer from "../components/footer";

const locationOptions = [
  { value: "1", label: "Dhaka" },
  { value: "2", label: "Rajshahi" },
];
const areaOptions = {
  Dhaka: [
    { value: "1", label: "Gazipur" },
    { value: "2", label: "Gulshan" },
    { value: "3", label: "Badda" },
    { value: "4", label: "Abdullahpur" },
    { value: "5", label: "Farmgate" },
    { value: "6", label: "Mirpur 1" },
    { value: "7", label: "Mirpur 2" },
    { value: "8", label: "Mirpur 10" },
  ],
  Rajshahi: [
    { value: "1", label: "Zero Point" },
    { value: "2", label: "Rani Bazar" },
    { value: "3", label: "New Market" },
    { value: "4", label: "Railgate" },
    { value: "5", label: "Alupotti" },
    { value: "6", label: "Talaimari" },
    { value: "7", label: "Kajla" },
    { value: "8", label: "Binodpur" },
    { value: "9", label: "Talaimari" },
    { value: "10", label: "Khorkhori" },
  ],
};
// Category and Property Type options (single select)
const categoryOptions = [
  { value: '1', label: 'Houses' },
  { value: '2', label: 'Apartment' },
  { value: '3', label: 'Offices' },
  { value: '4', label: 'Sub-let' },
];
const propertyTypeOptions = [
    { value: '1', label: 'Family' },
    { value: '2', label: 'Bachelor' },
    { value: '3', label: 'Office' }
];
const bedBathOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
const buyCategoryOptions = [
  { value: '1', label: 'Land' },
  { value: '2', label: 'Houses' },
  { value: '3', label: 'Apartments' },
];
const buyStatusOptions = [
  { value: '1', label: 'New' },
  { value: '2', label: 'Used' },
  { value: '3', label: 'Renovated' },
];

function PostPropertyTab({ user, onSuccess, editProperty }) {
  const [tab, setTab] = useState("rent");
  const [form, setForm] = useState({
    type: "rent",
    title: "",
    description: "",
    price: "",
    location: "1",
    area: "1",
    category: [],
    propertyType: [],
    beds: "1",
    baths: "1",
    size: "",
    coverImage: null,
    galleryImages: [],
    map: "",
  });
  const [areaList, setAreaList] = useState(areaOptions[locationOptions[0].label]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Main image preview
  const [mainImagePreview, setMainImagePreview] = useState(null);
  // Gallery image previews
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  // Add a state for map coordinates
  const [mapCoords, setMapCoords] = useState(form.map && typeof form.map === 'object' ? form.map : null);

  useEffect(() => {
    const locLabel = locationOptions.find(l => l.value === form.location)?.label;
    setAreaList(areaOptions[locLabel] || []);
    setForm(f => ({ ...f, area: (areaOptions[locLabel] && areaOptions[locLabel][0]?.value) || "" }));
  }, [form.location]);

  useEffect(() => {
    if (editProperty) {
      setForm({
        type: editProperty.type || "rent",
        title: editProperty.title || "",
        description: editProperty.description || "",
        price: editProperty.price || "",
        location: editProperty.location || "1",
        area: editProperty.area || "1",
        category: editProperty.category || "",
        propertyType: editProperty.propertyType || "",
        beds: editProperty.beds ? String(editProperty.beds) : "1",
        baths: editProperty.baths ? String(editProperty.baths) : "1",
        size: editProperty.size ? String(editProperty.size) : "",
        coverImage: null,
        galleryImages: [],
        map: editProperty.map || "",
        beforePrice: editProperty.beforePrice || "",
        // Always use _id for updates
        _id: editProperty._id || '',
      });
      // Main image preview
      if (editProperty.image) {
        setMainImagePreview(editProperty.image.startsWith('http') ? editProperty.image : `http://localhost:5000${editProperty.image}`);
      } else if (editProperty.coverImage) {
        setMainImagePreview(editProperty.coverImage.startsWith('http') ? editProperty.coverImage : `http://localhost:5000${editProperty.coverImage}`);
      } else {
        setMainImagePreview(null);
      }
      // Gallery images preview
      if (editProperty.galleryImages && Array.isArray(editProperty.galleryImages)) {
        setGalleryPreviews(editProperty.galleryImages.map(img => img.startsWith('http') ? img : `http://localhost:5000/${img}`));
      } else {
        setGalleryPreviews([]);
      }
      // If editing and map is coordinates, set mapCoords
      if (editProperty && editProperty.map && typeof editProperty.map === 'object') {
        setMapCoords(editProperty.map);
      }
    }
  }, [editProperty]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "coverImage") {
        setForm(f => ({ ...f, coverImage: files[0] }));
      } else if (name === "galleryImages") {
        setForm(f => ({ ...f, galleryImages: Array.from(files) }));
      }
    } else if (type === "select-multiple") {
      setForm(f => ({ ...f, [name]: Array.from(e.target.selectedOptions, o => o.value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleTab = t => {
    setTab(t);
    setForm(f => ({ ...f, type: t }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Always set userId before creating formData
      const userId = user?._id || user?.id || "";
      const formWithUser = { ...form, userId };
      const formData = new FormData();
      Object.entries(formWithUser).forEach(([k, v]) => {
        if (k === "galleryImages") {
          v.forEach(img => formData.append("galleryImages", img));
        } else if (Array.isArray(v)) {
          v.forEach(val => formData.append(k, val));
        } else if (k === "map" && typeof v === 'object' && v !== null) {
          formData.append('map', JSON.stringify(v));
        } else if (k !== "_id") {
          formData.append(k, v);
        }
      });
      const token = localStorage.getItem("thikana_token");
      if (editProperty && (editProperty._id)) {
        // Update property (use POST for compatibility with file uploads)
        await axios.post(`http://localhost:5000/api/properties/${editProperty._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Property updated successfully!");
      } else {
        // Create property
        await axios.post("http://localhost:5000/api/properties", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Property posted successfully!");
      }
      setForm({
        type: tab,
        title: "",
        description: "",
        price: "",
        location: "1",
        area: "1",
        category: [],
        propertyType: [],
        beds: "1",
        baths: "1",
        size: "",
        coverImage: null,
        galleryImages: [],
        map: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      let msg = editProperty ? "Failed to update property" : "Failed to post property";
      if (err.response && err.response.data && err.response.data.message) {
        msg += ": " + err.response.data.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Dropzone for main image
  const {
    getRootProps: getCoverRootProps,
    getInputProps: getCoverInputProps,
    isDragActive: isCoverDragActive
  } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setForm(f => ({ ...f, coverImage: acceptedFiles[0] }));
      setMainImagePreview(URL.createObjectURL(acceptedFiles[0]));
    }
  });
  // Dropzone for gallery images
  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
    isDragActive: isGalleryDragActive
  } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    onDrop: acceptedFiles => {
      setForm(f => ({ ...f, galleryImages: acceptedFiles }));
      setGalleryPreviews(acceptedFiles.map(f => URL.createObjectURL(f)));
    }
  });

  const handleMapChange = (coords) => {
    setMapCoords(coords);
    setForm(f => ({ ...f, map: coords }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-t-lg font-bold ${tab === "rent" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => handleTab("rent")}
        >
          Rent
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-bold ${tab === "buy" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => handleTab("buy")}
        >
          Buy
        </button>
      </div>
      {tab === "rent" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div style={{ display: 'none' }} >
            <label className="block font-semibold mb-1">Type</label>
            <input className="form-input w-full"  value="Rent" disabled readOnly />
          </div>
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px' ,padding: '10px'}}
 name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px',padding: '10px'}} name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Location</label>
              <select className="form-select w-full" name="location" value={form.location} onChange={handleChange} required>
                {locationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Area</label>
              <select className="form-select w-full" name="area" value={form.area} onChange={handleChange} required>
                {areaList.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              className="form-select w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Property Type</label>
            <select
              className="form-select w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              required
            >
              <option value="">Select Property Type</option>
              {propertyTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Beds</label>
              <select className="form-select w-full" name="beds" value={form.beds} onChange={handleChange} required>
                {bedBathOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Baths</label>
              <select className="form-select w-full" name="baths" value={form.baths} onChange={handleChange} required>
                {bedBathOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Size (sq.ft)</label>
              <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px',paddingLeft: '10px',paddingTop: '5px',paddingBottom: '5px' }} name="size" value={form.size} onChange={handleChange} required />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Rent (৳/month)</label>
              <input
                type="number"
                className="form-input w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                name="beforePrice"
                value={form.beforePrice || ''}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="30000"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Current Rent (৳/month)</label>
              <input
                type="number"
                className="form-input w-full border border-green-500 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 font-bold text-green-700 bg-green-50"
                name="price"
                value={form.price || ''}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="25000"
                required
              />
            </div>
          </div>
          {/* Main image upload with preview */}
          <div>
            <label className="block font-semibold mb-1">Main Image</label>
            <div {...getCoverRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isCoverDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}> 
              <input {...getCoverInputProps()} />
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="Main Preview" className="mx-auto h-32 w-auto object-contain rounded shadow mb-2" />
              ) : (
                <span className="text-gray-500">Drag & drop or click to select a main image</span>
              )}
            </div>
          </div>
          {/* Gallery images upload with thumbnails */}
          <div>
            <label className="block font-semibold mb-1">Gallery Images</label>
            <div {...getGalleryRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isGalleryDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}> 
              <input {...getGalleryInputProps()} />
              {galleryPreviews.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {galleryPreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`Gallery ${idx}`} className="h-16 w-16 object-cover rounded shadow" />
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Drag & drop or click to select gallery images</span>
              )}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Map Location</label>
            <LeafletLocationPicker value={mapCoords} onChange={handleMapChange} />
            {mapCoords && (
              <div className="text-xs text-gray-500 mt-1">Selected: Lat {mapCoords.lat}, Lng {mapCoords.lng}</div>
            )}
          </div>
          {success && <div className="text-green-600 font-bold">{success}</div>}
          {error && <div className="text-red-600 font-bold">{error}</div>}
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold" disabled={loading}>
            {loading ? (editProperty ? "Updating..." : "Posting...") : (editProperty ? "Update Property" : "Post Property")}
          </button>
        </form>
      )}
      {tab === "buy" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div style={{ display: 'none' }} >
            <label className="block font-semibold mb-1">Type</label>
            <input className="form-input w-full"  value="buy" disabled readOnly />
          </div>
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px' ,padding: '10px'}}
 name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px',padding: '10px'}}
 name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Location</label>
              <select className="form-select w-full" name="location" value={form.location} onChange={handleChange} required>
                {locationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Area</label>
              <select className="form-select w-full" name="area" value={form.area} onChange={handleChange} required>
                {areaList.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              className="form-select w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {buyCategoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              className="form-select w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              name="status"
              value={form.status || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              {buyStatusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Beds</label>
              <select className="form-select w-full" name="beds" value={form.beds} onChange={handleChange}>
              <option value="">Select Beds (If have)</option>
                {bedBathOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Baths</label>
              <select className="form-select w-full" name="baths" value={form.baths} onChange={handleChange}>
              <option value="">Select Baths (If have)</option>
                {bedBathOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Size (sq.ft)</label>
              <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px',paddingLeft: '10px',paddingTop: '5px',paddingBottom: '5px'}} name="size" value={form.size} onChange={handleChange} required />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Price ৳</label>
              <input
                type="number"
                className="form-input w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                name="beforePrice"
                value={form.beforePrice || ''}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="30000"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Sell Price ৳</label>
              <input
                type="number"
                className="form-input w-full border border-green-500 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 font-bold text-green-700 bg-green-50"
                name="price"
                value={form.price || ''}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="25000"
                required
              />
            </div>
          </div>
          {/* Main image upload with preview */}
          <div>
            <label className="block font-semibold mb-1">Main Image</label>
            <div {...getCoverRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isCoverDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}> 
              <input {...getCoverInputProps()} />
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="Main Preview" className="mx-auto h-32 w-auto object-contain rounded shadow mb-2" />
              ) : (
                <span className="text-gray-500">Drag & drop or click to select a main image</span>
              )}
            </div>
          </div>
          {/* Gallery images upload with thumbnails */}
          <div>
            <label className="block font-semibold mb-1">Gallery Images</label>
            <div {...getGalleryRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isGalleryDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}> 
              <input {...getGalleryInputProps()} />
              {galleryPreviews.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {galleryPreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`Gallery ${idx}`} className="h-16 w-16 object-cover rounded shadow" />
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Drag & drop or click to select gallery images</span>
              )}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Map Location</label>
            <LeafletLocationPicker value={mapCoords} onChange={handleMapChange} />
            {mapCoords && (
              <div className="text-xs text-gray-500 mt-1">Selected: Lat {mapCoords.lat}, Lng {mapCoords.lng}</div>
            )}
          </div>
          {success && <div className="text-green-600 font-bold">{success}</div>}
          {error && <div className="text-red-600 font-bold">{error}</div>}
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold" disabled={loading}>
            {loading ? (editProperty ? "Updating..." : "Posting...") : (editProperty ? "Update Property" : "Post Property")}
          </button>
        </form>
      )}
    </div>
  );
}

async function fetchUserProfile(token) {
  const res = await axios.get("http://localhost:5000/api/user/profile", {
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
      await axios.post("http://localhost:5000/api/user/profile", formData, {
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
    const [activeSection, setActiveSection] = useState("profileDetails");
    const [properties, setProperties] = useState([]); // Start with empty array, not propertiesData
    const [activeTab, setActiveTab] = useState("dashboard");
    const [editProperty, setEditProperty] = useState(null);
    const [editFormVisible, setEditFormVisible] = useState(false);

    // Get user data from localStorage (set after login)
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('thikana_user');
        return userData ? JSON.parse(userData) : null;
    });

    // Move fetchProperties outside useEffect so it can be called anywhere
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('thikana_token');
        const res = await axios.get('http://localhost:5000/api/properties/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(res.data);
      } catch (err) {
        setProperties([]);
      }
    };

    useEffect(() => {
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
            await axios.delete(`http://localhost:5000/api/properties/${property._id || property.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProperties((prev) => prev.filter((p) => (p._id || p.id) !== (property._id || property.id)));
        } catch (err) {
            alert('Failed to delete property');
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case "profileDetails":
                return (
                    <div>
                        <h5 className="card-title">Profile Details</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Name:</strong> {user?.name}
                            </li>
                            <li className="list-group-item">
                                <strong>Email:</strong> {user?.email}
                            </li>
                            <li className="list-group-item">
                                <strong>Phone:</strong> {user?.phone}
                            </li>
                            <li className="list-group-item">
                                <strong>Address:</strong> {user?.address}
                            </li>
                        </ul>
                        <div className="mt-4">
                            <Link to="/edit-profile" className="btn btn-primary">Edit Profile</Link>
                        </div>
                    </div>
                );
            case "propertyList":
                return (
                    <div>
                        <div className="text-black-700" style={{paddingTop:'100px'}}>
                            <h2 className="text-2xl font-bold mb-6">My Properties</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                            {properties.map((property) => (
                                <div key={property.id || property._id} className="card property border-0 shadow position-relative overflow-hidden rounded-3">
                                    {property.verified && (
                                        <span className="badge bg-green-500 text-white absolute top-3 left-3 z-10">Verified</span>
                                    )}
                                    <img src={property.image ? (property.image.startsWith('http') ? property.image : `http://localhost:5000${property.image}`) : defaultProfile} className="w-full h-48 object-cover rounded-t-3" alt={property.title} />
                                    <div className="bg-white p-4 rounded-b-3">
                                        <h4 className="font-bold text-lg mb-2">{property.title}</h4>
                                        <div className="flex items-center text-gray-500 text-sm mb-2">
                                            <span className="mr-4 flex items-center"><i className="fas fa-expand text-green-700 mr-1"></i>{property.size} sq.ft</span>
                                            <span className="mr-4 flex items-center"><i className="fas fa-bed text-green-700 mr-1"></i>{property.beds} Beds</span>
                                            <span className="flex items-center"><i className="fas fa-bath text-green-700 mr-1"></i>{property.baths} Baths</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div>
                                                <span className="text-gray-500 text-xs">Price</span>
                                                <div className="font-bold text-green-700">৳{property.nowPrice || property.price}/month</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-xs">Rating</span>
                                                <div className="flex items-center">
                                                  {[...Array(Math.floor(property.rating || 0))].map((_, i) => (
                                                      <i key={i} className="fas fa-star text-yellow-400 mr-1"></i>
                                                  ))}
                                                  <span className="ml-1 text-gray-700 font-semibold">{property.rating || 0} ({property.reviews?.length || 0})</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Edit/Delete Buttons */}
                                        <div className="flex gap-2 absolute bottom-4 right-4 z-20">
                                            <button
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold text-sm shadow"
                                                onClick={() => handleEditProperty(property)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold text-sm shadow"
                                                onClick={() => handleDeleteProperty(property)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "postProperty":
                return (
                    <div>
                        <h5 className="card-title">Post a Property</h5>
                        <PostPropertyTab user={user} onSuccess={() => { setEditProperty(null); setActiveTab('dashboard'); }} />
                    </div>
                );
            default:
                return null;
        }
    };

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
        <div className="bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ff]">
            {/* Layout: Navbar is above, so add top margin to sidebars and content */}
            <Navbar navClass="defaultscroll sticky top-0 z-50" menuClass="navigation-menu nav-left" />
            <div className="flex w-full" style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '72px' }}>
                {/* Left Sidebar */}
                <aside className="sticky top-[72px] h-[calc(100vh-72px)] w-1/5 bg-white shadow-lg flex flex-col py-8 px-4 z-10" >
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
                                <span className="group-hover:text-green-700">Saved</span>
                                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">32</span>
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
                <main className="w-4/5 pl-[5pc] pr-5 pt-12" style={{paddingTop:'50px',paddingBottom:'100px'}}>
                    {activeTab === "dashboard" ? (
                        <>
                            <div className="w-full mb-8 relative">
                                <div className="rounded-3xl overflow-hidden shadow-lg w-full">
                                    <img src={user?.coverPicture ? (user.coverPicture.startsWith('http') ? user.coverPicture : `http://localhost:5000${user.coverPicture}`) : coverImg} alt="Cover" className="w-full h-56 object-cover rounded-3xl" />
                                    {/* Avatar and name on left, buttons on right */}
                                    <div className="absolute left-8 bottom-[-58px] flex items-center gap-4">
                                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden shadow-lg">
                                            <img
                                                src={user?.profilePicture || defaultProfile}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-2">
                                            <h3 className="text-xl mt-5 font-bold text-gray-800">{user?.name || "User Name"}</h3>
                                        </div>
                                    </div>
                                    <div className="absolute right-8 top-8 flex gap-4">
                                        <button
                                            className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
                                            onClick={() => setActiveTab("profile")}
                                        >
                                            Edit Profile
                                        </button>
                                        <button
                                            className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
                                            onClick={() => setActiveTab("postProperty")}
                                        >
                                            Post Property
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Property Items */}
                            <div className="text-black-700" style={{paddingTop:'100px'}}>
                                <h2 className="text-2xl font-bold mb-6">My Properties</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                                {properties.map((property) => (
                                    <div key={property.id || property._id} className="card property border-0 shadow position-relative overflow-hidden rounded-3">
                                        {property.verified && (
                                            <span className="badge bg-green-500 text-white absolute top-3 left-3 z-10">Verified</span>
                                        )}
                                        <img src={property.image ? (property.image.startsWith('http') ? property.image : `http://localhost:5000${property.image}`) : defaultProfile} className="w-full h-48 object-cover rounded-t-3" alt={property.title} />
                                        <div className="bg-white p-4 rounded-b-3">
                                            <h4 className="font-bold text-lg mb-2">{property.title}</h4>
                                            <div className="flex items-center text-gray-500 text-sm mb-2">
                                                <span className="mr-4 flex items-center"><i className="fas fa-expand text-green-700 mr-1"></i>{property.size} sq.ft</span>
                                                <span className="mr-4 flex items-center"><i className="fas fa-bed text-green-700 mr-1"></i>{property.beds} Beds</span>
                                                <span className="flex items-center"><i className="fas fa-bath text-green-700 mr-1"></i>{property.baths} Baths</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div>
                                                    <span className="text-gray-500 text-xs">Price</span>
                                                    <div className="font-bold text-green-700">৳{property.nowPrice || property.price}</div>
                                                </div>
                                                
                                            </div>
                                            {/* Edit/Delete Buttons */}
                                            <div className="flex gap-2 absolute bottom-4 right-4 z-20">
                                                <button
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold text-sm shadow"
                                                    onClick={() => handleEditProperty(property)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold text-sm shadow"
                                                    onClick={() => handleDeleteProperty(property)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        </>
                    ) : activeTab === "postProperty" ? (
                        <PostPropertyTab user={user} onSuccess={() => { fetchProperties(); setEditProperty(null); setActiveTab('dashboard'); }} />
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
                            <div className="text-black-700">
                                <h2 className="text-2xl font-bold mb-6">My Properties</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                                {properties.map((property) => (
                                    <div key={property.id || property._id} className="card property border-0 shadow position-relative overflow-hidden rounded-3">
                                        {property.verified && (
                                            <span className="badge bg-green-500 text-white absolute top-3 left-3 z-10">Verified</span>
                                        )}
                                        <img src={property.image ? (property.image.startsWith('http') ? property.image : `http://localhost:5000${property.image}`) : defaultProfile} className="w-full h-48 object-cover rounded-t-3" alt={property.title} />
                                        <div className="bg-white p-4 rounded-b-3">
                                            <h4 className="font-bold text-lg mb-2">{property.title}</h4>
                                            <div className="flex items-center text-gray-500 text-sm mb-2">
                                                <span className="mr-4 flex items-center"><i className="fas fa-expand text-green-700 mr-1"></i>{property.size} sq.ft</span>
                                                <span className="mr-4 flex items-center"><i className="fas fa-bed text-green-700 mr-1"></i>{property.beds} Beds</span>
                                                <span className="flex items-center"><i className="fas fa-bath text-green-700 mr-1"></i>{property.baths} Baths</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div>
                                                    <span className="text-gray-500 text-xs">Price</span>
                                                    <div className="font-bold text-green-700">৳{property.nowPrice || property.price}</div>
                                                </div>
                                                
                                            </div>
                                            {/* Edit/Delete Buttons */}
                                            <div className="flex gap-2 absolute bottom-4 right-4 z-20">
                                                <button
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold text-sm shadow"
                                                    onClick={() => handleEditProperty(property)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold text-sm shadow"
                                                    onClick={() => handleDeleteProperty(property)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : activeTab === "profile" ? (
                        <ProfileEditTab user={user} onUpdate={(updatedUser) => {
                setUser(updatedUser); // Update user state in real time
                localStorage.setItem('thikana_user', JSON.stringify(updatedUser));
            }} />
                    ) : (
                        <div className="w-full h-full"></div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}