import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import defaultProfile from "../assect/images/profile-thumb.png";
import coverImg from "../assect/images/profile-cover.png";
import axios from "axios";
import { Link } from "react-router-dom";

function fetchUserProfile(token) {
  return axios.get("http://localhost:5000/api/user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export default function ProfileTab({ user, onUpdate }) {
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
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-xl">{form.name}</div>
        {user?.agent === "agent" && (
          <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full ml-2">Agent</span>
        )}
      </div>
      <div>
        <label className="block font-semibold mb-1">Name</label>
        <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Email</label>
        <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Phone</label>
        <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div>
        <label className="block font-semibold mb-1">Address</label>
        <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="address" value={form.address} onChange={handleChange} />
      </div>
      {success && <div className="text-green-600 font-bold">{success}</div>}
      {error && <div className="text-red-600 font-bold">{error}</div>}
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}