import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import LeafletLocationPicker from "../components/LeafletLocationPicker";
import { apiUrl } from "../utils/api";

const locationOptions = [
  { value: "Dhaka", label: "Dhaka" },
  { value: "Rajshahi", label: "Rajshahi" },
];
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
const categoryOptions = [
  { value: "Houses", label: "Houses" },
  { value: "Apartment", label: "Apartment" },
  { value: "Offices", label: "Offices" },
  { value: "Sub-let", label: "Sub-let" },
];
const propertyTypeOptions = [
  { value: "Family", label: "Family" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Office", label: "Office" },
];
const bedBathOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

export default function PostPropertyTab({ user, onSuccess, editProperty }) {
  const [tab, setTab] = useState("rent");
  const [form, setForm] = useState({
    type: "rent",
    title: "",
    description: "",
    price: "",
    location: "Dhaka",
    area: "",
    category: "",
    propertyType: "",
    beds: "1",
    baths: "1",
    size: "",
    coverImage: null,
    galleryImages: [],
    map: "",
    beforePrice: "",
    status: "",
  });
  const [areaList, setAreaList] = useState(areaOptions["Dhaka"]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [mapCoords, setMapCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editProperty) {
      setForm({
        ...form,
        ...editProperty,
        beds: editProperty.beds ? String(editProperty.beds) : "1",
        baths: editProperty.baths ? String(editProperty.baths) : "1",
        coverImage: null,
        galleryImages: [],
        map: editProperty.map || "",
        beforePrice: editProperty.beforePrice || "",
        status: editProperty.status || "",
      });
      if (editProperty.image) {
        setMainImagePreview(editProperty.image.startsWith("http") ? editProperty.image : apiUrl(editProperty.image));
      } else if (editProperty.coverImage) {
        setMainImagePreview(editProperty.coverImage.startsWith("http") ? editProperty.coverImage : apiUrl(`/uploads/${editProperty.coverImage}`));
      } else {
        setMainImagePreview(null);
      }
      if (editProperty.galleryImages && Array.isArray(editProperty.galleryImages)) {
        setGalleryPreviews(editProperty.galleryImages.map(img => img.startsWith("http") ? img : apiUrl(`/uploads/${img}`)));
      } else {
        setGalleryPreviews([]);
      }
      if (editProperty.map && typeof editProperty.map === "object") {
        setMapCoords(editProperty.map);
      }
    }
    // eslint-disable-next-line
  }, [editProperty]);

  useEffect(() => {
    setAreaList(areaOptions[form.location] || []);
    if (form.area && !(areaOptions[form.location] || []).some(opt => opt.value === form.area)) {
      setForm(f => ({ ...f, area: "" }));
    }
    // eslint-disable-next-line
  }, [form.location]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "coverImage") {
        setForm(f => ({ ...f, coverImage: files[0] }));
        setMainImagePreview(URL.createObjectURL(files[0]));
      } else if (name === "galleryImages") {
        setForm(f => ({ ...f, galleryImages: Array.from(files) }));
        setGalleryPreviews(Array.from(files).map(f => URL.createObjectURL(f)));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleTab = t => {
    setTab(t);
    setForm(f => ({ ...f, type: t }));
  };

  const handleMapChange = coords => {
    setMapCoords(coords);
    setForm(f => ({ ...f, map: coords }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "galleryImages" && Array.isArray(v)) {
          v.forEach(img => formData.append("galleryImages", img));
        } else if (k === "map" && typeof v === "object" && v !== null) {
          formData.append("map", JSON.stringify(v));
        } else if (k !== "_id" && v) {
          formData.append(k, v);
        }
      });
      const token = localStorage.getItem("thikana_token");
      if (editProperty && editProperty._id) {
        await fetch(apiUrl(`/api/properties/${editProperty._id}`), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        setSuccess("Property updated successfully!");
      } else {
        await fetch(apiUrl("/api/properties"), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        setSuccess("Property posted successfully!");
      }
      setForm({
        type: tab,
        title: "",
        description: "",
        price: "",
        location: "Dhaka",
        area: "",
        category: "",
        propertyType: "",
        beds: "1",
        baths: "1",
        size: "",
        coverImage: null,
        galleryImages: [],
        map: "",
        beforePrice: "",
        status: "",
      });
      setMainImagePreview(null);
      setGalleryPreviews([]);
      setMapCoords(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to post property");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, coverImage: files[0] }));
      setMainImagePreview(URL.createObjectURL(files[0]));
    }
  });
  const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: files => {
      setForm(f => ({ ...f, galleryImages: files }));
      setGalleryPreviews(Array.from(files).map(f => URL.createObjectURL(f)));
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <div className="flex gap-2 mb-8">
        <button
          className={`px-6 py-2 w-full rounded-t-lg font-bold ${tab === "rent" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => handleTab("rent")}
        >
          Rent
        </button>
        <button
          className={`px-6 py-2 w-full rounded-t-lg font-bold ${tab === "buy" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => handleTab("buy")}
        >
          Buy
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="description" value={form.description} onChange={handleChange} required />
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
              <option value="">Select Area</option>
              {areaList.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select className="form-select w-full" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Property Type</label>
          <select className="form-select w-full" name="propertyType" value={form.propertyType} onChange={handleChange} required>
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
            <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', paddingLeft: '10px',paddingTop:'6px',paddingBottom:'6px' }} name="size" value={form.size} onChange={handleChange} required />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Rent (৳/Month)</label>
            <input type="number" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="price" value={form.price} onChange={handleChange} required min="0" />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Previous Rent (৳/Month)</label>
            <input type="number" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="beforePrice" value={form.beforePrice} onChange={handleChange} min="0" />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Main Image</label>
          <div {...getCoverRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isCoverDragActive ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-300"}`}>
            <input {...getCoverInputProps()} name="coverImage" />
            {mainImagePreview ? (
              <img src={mainImagePreview} alt="Main Preview" className="mx-auto h-32 w-auto object-contain rounded shadow mb-2" />
            ) : (
              <span className="text-gray-500">Drag & drop or click to select a main image</span>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Gallery Images</label>
          <div {...getGalleryRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isGalleryDragActive ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-300"}`}>
            <input {...getGalleryInputProps()} name="galleryImages" />
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
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" disabled={loading}>
          {loading ? (editProperty ? "Updating..." : "Posting...") : (editProperty ? "Update Property" : "Post Property")}
        </button>
      </form>
    </div>
  );
}