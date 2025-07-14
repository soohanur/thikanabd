import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function BecomeAgentTab({ user, onUpdate }) {
  const [form, setForm] = useState({
    fullAddress: user?.fullAddress || "",
    thana: user?.thana || "",
    zip: user?.zip || "",
    bkash: user?.bkash || "",
    agentCharge: user?.agentCharge || "",
    nidFront: null,
    nidBack: null,
  });
  const [nidFrontPreview, setNidFrontPreview] = useState(null);
  const [nidBackPreview, setNidBackPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Dropzone for NID Front
  const { getRootProps: getNidFrontRootProps, getInputProps: getNidFrontInputProps, isDragActive: isNidFrontDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, nidFront: files[0] }));
      setNidFrontPreview(URL.createObjectURL(files[0]));
    }
  });
  // Dropzone for NID Back
  const { getRootProps: getNidBackRootProps, getInputProps: getNidBackInputProps, isDragActive: isNidBackDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, nidBack: files[0] }));
      setNidBackPreview(URL.createObjectURL(files[0]));
    }
  });

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
      formData.append("fullAddress", form.fullAddress);
      formData.append("thana", form.thana);
      formData.append("zip", form.zip);
      formData.append("bkash", form.bkash);
      formData.append("agentCharge", form.agentCharge);
      if (form.nidFront) formData.append("nidFront", form.nidFront);
      if (form.nidBack) formData.append("nidBack", form.nidBack);
      formData.append("agent", "agent");
      const token = localStorage.getItem("thikana_token");
      await axios.post("http://localhost:5000/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated! You are now an agent.");
      if (onUpdate) onUpdate();
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Always keep form in sync with latest user prop
  useEffect(() => {
    setForm(f => ({
      ...f,
      fullAddress: user?.fullAddress || "",
      thana: user?.thana || "",
      zip: user?.zip || "",
      bkash: user?.bkash || "",
      agentCharge: user?.agentCharge !== undefined && user?.agentCharge !== null ? String(user.agentCharge) : "",
    }));
    // Show latest NID images if present in user
    setNidFrontPreview(user?.nidFront ? (user.nidFront.startsWith('http') ? user.nidFront : `http://localhost:5000${user.nidFront}`) : null);
    setNidBackPreview(user?.nidBack ? (user.nidBack.startsWith('http') ? user.nidBack : `http://localhost:5000${user.nidBack}`) : null);
  }, [user]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Become an Agent</h2>
      <div>
        <label className="block font-semibold mb-1">Full Address</label>
        <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="fullAddress" value={form.fullAddress} onChange={handleChange} required />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Thana</label>
          <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="thana" value={form.thana} onChange={handleChange} required />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Zip Code</label>
          <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="zip" value={form.zip} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Bkash Number</label>
        <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="bkash" value={form.bkash} onChange={handleChange} required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Set Agent Charge (৳)</label>
        <input type="number" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="agentCharge" value={form.agentCharge} onChange={handleChange} required min="0" />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Upload NID Front</label>
          <div {...getNidFrontRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isNidFrontDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
            <input {...getNidFrontInputProps()} />
            {nidFrontPreview ? (
              <img src={nidFrontPreview} alt="NID Front Preview" className="mx-auto h-24 w-auto object-contain rounded shadow mb-2" />
            ) : (
              <span className="text-gray-500">Drag & drop or click to select NID front image</span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Upload NID Back</label>
          <div {...getNidBackRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isNidBackDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
            <input {...getNidBackInputProps()} />
            {nidBackPreview ? (
              <img src={nidBackPreview} alt="NID Back Preview" className="mx-auto h-24 w-auto object-contain rounded shadow mb-2" />
            ) : (
              <span className="text-gray-500">Drag & drop or click to select NID back image</span>
            )}
          </div>
        </div>
      </div>
      {success && <div className="text-green-600 font-bold">{success}</div>}
      {error && <div className="text-red-600 font-bold">{error}</div>}
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}