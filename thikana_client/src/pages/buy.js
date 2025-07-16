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
      Bagerhat: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
      Bandarban: ["Bandarban Sadar", "Thanchi", "Ruma", "Rowangchhari", "Lama", "Alikadam", "Naikhongchhari"],
      Barguna: ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali"],
      Barisal: ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Barisal Sadar", "Mehendiganj", "Muladi", "Wazirpur"],
      Bhola: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
      Bogra: ["Adamdighi", "Bogra Sadar", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"],
      Brahmanbaria: ["Ashuganj", "Banchharampur", "Brahmanbaria Sadar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail", "Bijoynagar"],
      Chandpur: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
      Chapai_Nawabganj: ["Bholahat", "Gomostapur", "Nachole", "Chapai Nawabganj Sadar", "Shibganj"],
      Chattogram: ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda", "Chattogram Sadar"],
      Chuadanga: ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"],
      Comilla: ["Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Comilla Sadar", "Comilla Sadar Dakshin", "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Meghna", "Monohorgonj", "Muradnagar", "Nangalkot", "Titas"],
      "Cox's Bazar": ["Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia"],
      Dhaka: ["Dhanmondi", "Gulshan", "Badda", "Mirpur", "Mohammadpur", "Tejgaon", "Uttara", "Ramna", "Motijheel", "Pallabi", "Khilgaon", "Sabujbagh", "Lalbagh", "Kotwali", "Hazaribagh", "Kamrangirchar", "Shahbagh", "Sher-e-Bangla Nagar", "Kafrul", "Banani", "Airport", "Cantonment", "Shyampur", "Demra", "Jatrabari", "Wari", "Sutrapur"],
      Dinajpur: ["Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Dinajpur Sadar", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
      Faridpur: ["Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Faridpur Sadar", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"],
      Feni: ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Fulgazi", "Parshuram", "Sonagazi"],
      Gaibandha: ["Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
      Gazipur: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
      Gopalganj: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
      Habiganj: ["Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj"],
      Jamalpur: ["Baksiganj", "Dewanganj", "Islampur", "Jamalpur Sadar", "Madarganj", "Melandaha", "Sarishabari"],
      Jashore: ["Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargacha", "Keshabpur", "Jashore Sadar", "Manirampur", "Sharsha"],
      Jhalokathi: ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
      Jhenaidah: ["Harinakunda", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
      Joypurhat: ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"],
      Khagrachari: ["Dighinala", "Khagrachhari Sadar", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
      Khulna: ["Batiaghata", "Dacope", "Dumuria", "Dighalia", "Khalishpur", "Khan Jahan Ali", "Kotwali", "Paikgachha", "Phultala", "Rupsa", "Terokhada"],
      Kishoreganj: ["Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"],
      Kurigram: ["Bhurungamari", "Char Rajibpur", "Chilmari", "Fulbari", "Kurigram Sadar", "Nageshwari", "Rajarhat", "Raomari", "Ulipur"],
      Kushtia: ["Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur"],
      Lakshmipur: ["Kamalnagar", "Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati"],
      Lalmonirhat: ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"],
      Madaripur: ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar"],
      Magura: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
      Manikganj: ["Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar", "Saturia", "Shibalaya", "Singair"],
      Meherpur: ["Gangni", "Meherpur Sadar", "Mujibnagar"],
      Moulvibazar: ["Barlekha", "Juri", "Kamalganj", "Kulaura", "Moulvibazar Sadar", "Rajnagar", "Sreemangal"],
      Munshiganj: ["Gazaria", "Lohajang", "Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Tongibari"],
      Mymensingh: ["Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Mymensingh Sadar", "Nandail", "Phulpur", "Trishal"],
      Naogaon: ["Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur", "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
      Narail: ["Kalia", "Lohagara", "Narail Sadar"],
      Narayanganj: ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"],
      Narsingdi: ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"],
      Natore: ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Natore Sadar", "Singra"],
      Netrokona: ["Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala"],
      Nilphamari: ["Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Nilphamari Sadar", "Saidpur"],
      Noakhali: ["Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Noakhali Sadar", "Senbagh", "Subarnachar"],
      Pabna: ["Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar"],
      Panchagarh: ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"],
      Patuakhali: ["Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Patuakhali Sadar", "Rangabali"],
      Pirojpur: ["Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Pirojpur Sadar", "Zianagar"],
      Rajbari: ["Baliakandi", "Goalanda", "Kalukhali", "Pangsha", "Rajbari Sadar"],
      Rajshahi: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba", "Godagari", "Tanore", "Durgapur", "Bagmara", "Charghat", "Puthia", "Bagha"],
      Rangamati: ["Baghaichhari", "Barkal", "Kawkhali", "Belaichhari", "Kaptai", "Juraichhari", "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar"],
      Rangpur: ["Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj"],
      Satkhira: ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"],
      Shariatpur: ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zajira"],
      Sherpur: ["Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi"],
      Sirajganj: ["Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullapara"],
      Sunamganj: ["Bishwamvarpur", "Chhatak", "Dakshin Sunamganj", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Sunamganj Sadar", "Tahirpur"],
      Sylhet: ["Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Sylhet Sadar", "Zakiganj"],
      Tangail: ["Basail", "Bhuapur", "Delduar", "Dhaka Sadar", "Dhanbari", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar"],
      Thakurgaon: ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"]
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

      // --- Save booking to backend ---
      await axios.post(apiUrl("/api/property-bookings"), formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeout(() => {
        navigate(`/PaymentBuy?propertyId=${propertyId}`);
      }, 1000);
    } catch (err) {
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
            required
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
            required
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
            <input {...getNidFrontInputProps()} required />
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
            <input {...getNidBackInputProps()} required />
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
