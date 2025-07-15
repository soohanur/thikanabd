import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/navbar";
import bg4 from "../assect/images/bg/04.jpg"

import { FiPhone, FiHexagon, FiMapPin, FiMail } from "../assect/icons/vander"
import Footer from "../components/footer";
export default function ContactUs() {
    return (
        <>
            <Navbar navClass="defaultscroll sticky" menuClass="navigation-menu nav-left" />
            
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
            <section className="mt-[30px] py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
  <div className="container max-w-xl mx-auto">
    <div className="flex justify-center">
      <form className="w-full bg-white rounded-xl shadow p-8 space-y-6">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-green-700 tracking-tight">Contact Us</h2>
        <div>
          <label className="block font-semibold mb-1">Your Name <span className="text-red-500">*</span></label>
          <input name="name" id="name" type="text" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} placeholder="Name" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Your Email <span className="text-red-500">*</span></label>
          <input name="email" id="email" type="email" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} placeholder="Email" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Subject</label>
          <input name="subject" id="subject" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} placeholder="Subject" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Comments <span className="text-red-500">*</span></label>
          <textarea name="comments" id="comments" rows="4" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} placeholder="Message" required></textarea>
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" >Send Message</button>
      </form>
    </div>
  </div>
  {/* Contact Info Cards */}
  <div className="container mt-20">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <FiPhone className="text-green-600 text-3xl" />
        </div>
        <h5 className="mb-2 text-lg font-bold text-gray-800">Phone</h5>
        <p className="text-gray-500 mb-2">Feel free to reach out to us for any inquiries or support.</p>
        <a href="tel:+8801723456789" className="text-green-600 font-semibold hover:underline">+880 172-345-6789</a>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <FiMail className="text-blue-600 text-3xl" />
        </div>
        <h5 className="mb-2 text-lg font-bold text-gray-800">Email</h5>
        <p className="text-gray-500 mb-2">We are here to assist you. Drop us an email anytime.</p>
        <a href="mailto:support@thikana.com" className="text-blue-600 font-semibold hover:underline">support@thikana.com</a>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
          <FiMapPin className="text-yellow-600 text-3xl" />
        </div>
        <h5 className="mb-2 text-lg font-bold text-gray-800">Location</h5>
        <p className="text-gray-500 mb-2">456 University Road,<br />Rajshahi, Bangladesh</p>
        <a href="https://www.google.com/maps?q=Rajshahi+Bangladesh" target="_blank" rel="noopener noreferrer" className="text-yellow-600 font-semibold hover:underline">View on Google map</a>
      </div>
    </div>
  </div>
</section>
            <Footer />
        </>
    )
}