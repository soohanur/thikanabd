import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../utils/api";
import Select from "react-select";
import { useDropzone } from "react-dropzone";

const ALL_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur", "Chapai Nawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
];

const ALL_THANA_OPTIONS = {
  // ...existing code from BecomeAgentTab.js...
};

export default function Buy() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    permanentAddress: "",
    district: "",
    thana: "",
    profession: "",
    university: "",
    institution: "",
    phone: "",
    nidFront: null,
    nidBack: null,
  });
  const [thanaList, setThanaList] = useState([]);
  const [nidFrontPreview, setNidFrontPreview] = useState(null);
  const [nidBackPreview, setNidBackPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (form.district && ALL_THANA_OPTIONS[form.district]) {
      setThanaList(ALL_THANA_OPTIONS[form.district]);
      if (!ALL_THANA_OPTIONS[form.district].includes(form.thana)) {
        setForm(f => ({ ...f, thana: "" }));
      }
    } else {
      setThanaList([]);
      setForm(f => ({ ...f, thana: "" }));
    }
  }, [form.district]);

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
    setError("");
    try {
      const token = localStorage.getItem("thikana_token");
      if (!token) {
        navigate(`/auth-login?redirect=/buy/${propertyId}`);
        return;
      }
      // Save phone to localStorage for payment page
      localStorage.setItem("thikana_buyer_phone", form.phone);
      const formData = new FormData();
      formData.append("permanentAddress", form.permanentAddress);
      formData.append("district", form.district);
      formData.append("thana", form.thana);
      formData.append("profession", form.profession);
      if (form.profession === "Student") formData.append("university", form.university);
      if (form.profession === "Doing Job") formData.append("institution", form.institution);
      formData.append("phone", form.phone);
      if (form.nidFront instanceof File) formData.append("nidFront", form.nidFront);
      if (form.nidBack instanceof File) formData.append("nidBack", form.nidBack);
      formData.append("propertyId", propertyId);
      setTimeout(() => {
        navigate(`/PaymentBuy?propertyId=${propertyId}`);
      }, 1000);
    } catch (err) {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 space-y-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Buy Property</h2>
      <div>
        <label className="block font-semibold mb-1">Permanent Address</label>
        <input className="form-input w-full" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} required />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">District</label>
          <Select
            name="district"
            value={form.district ? { value: form.district, label: form.district } : null}
            onChange={option => setForm(f => ({ ...f, district: option ? option.value : "", thana: "" }))}
            options={ALL_DISTRICTS.map(d => ({ value: d, label: d }))}
            isClearable
            isSearchable
            placeholder="Select or search district"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Thana</label>
          <Select
            name="thana"
            value={form.thana ? { value: form.thana, label: form.thana } : null}
            onChange={option => setForm(f => ({ ...f, thana: option ? option.value : "" }))}
            options={thanaList.map(thana => ({ value: thana, label: thana }))}
            isClearable
            isSearchable
            placeholder="Select or search thana"
            isDisabled={!form.district}
          />
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Profession</label>
        <select className="form-input w-full" name="profession" value={form.profession} onChange={handleChange} required>
          <option value="">Select Profession</option>
          <option value="Student">Student</option>
          <option value="Doing Job">Doing Job</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {form.profession === "Student" && (
        <div>
          <label className="block font-semibold mb-1">University</label>
          <input className="form-input w-full" name="university" value={form.university} onChange={handleChange} required />
        </div>
      )}
      {form.profession === "Doing Job" && (
        <div>
          <label className="block font-semibold mb-1">Institution</label>
          <input className="form-input w-full" name="institution" value={form.institution} onChange={handleChange} required />
        </div>
      )}
      <div>
        <label className="block font-semibold mb-1">Phone Number</label>
        <input className="form-input w-full" name="phone" value={form.phone} onChange={handleChange} required type="tel" pattern="[0-9+\- ]{8,}" placeholder="Enter your phone number" />
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
      {error && <div className="text-red-600 font-bold">{error}</div>}
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit & Proceed to Payment"}
      </button>
    </form>
  );
}
