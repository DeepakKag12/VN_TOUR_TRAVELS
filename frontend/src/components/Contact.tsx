import React, { useState, useEffect } from "react";
import { useSiteSettings } from "../siteSettingsContext";
import { getContactInfo, ContactInfo } from "../api";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Contact: React.FC = () => {
  const { settings } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    getContactInfo().then(setContactInfo).catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappMessage = `Name: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.number}%0AMessage: ${formData.message}`;

    const rawWhatsapp =
      contactInfo?.whatsapp ||
      contactInfo?.phonePrimary ||
      settings?.whatsapp ||
      settings?.phone ||
      "+91 91098 79836";

    const primary = (rawWhatsapp.includes("00000")
      ? "+91 91098 79836"
      : rawWhatsapp
    ).replace(/\D/g, "") || "919109879836";

    window.open(`https://wa.me/${primary}?text=${whatsappMessage}`, "_blank");

    setFormData({ name: "", email: "", number: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-white via-[#eef2f7]/60 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl font-bold text-blue-700 uppercase mb-2 tracking-wide">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto text-base">
            For bookings, tours, or any travel-related queries, feel free to
            reach out to us anytime!
          </p>
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Contact Info */}
            <div className="md:w-1/2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">
                {contactInfo?.companyName ||
                  settings?.companyName ||
                  "VN Tour & Travels"}
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">Email</h4>
                    <p className="text-gray-600">
                      {contactInfo?.email ||
                        settings?.email ||
                        "vn.travel09@gmail.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">Phone</h4>
                    {(() => {
                      const p1 =
                        contactInfo?.phonePrimary ||
                        settings?.phone ||
                        "+91 91098 79836";
                      const healed1 = /00000/.test(p1)
                        ? "+91 91098 79836"
                        : p1;

                      const p2raw =
                        contactInfo?.phoneSecondary ||
                        contactInfo?.phones?.[0] ||
                        (settings as any)?.phones?.[0] ||
                        "+91 99938 83995";
                      const healed2 = /00000/.test(p2raw)
                        ? "+91 99938 83995"
                        : p2raw;

                      return (
                        <>
                          <p className="text-gray-600 font-medium">{healed1}</p>
                          <p className="text-gray-600">{healed2}</p>
                          {contactInfo?.phones &&
                            contactInfo.phones
                              .slice(1)
                              .map((p) => (
                                <p key={p} className="text-gray-600">
                                  {p}
                                </p>
                              ))}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      Location
                    </h4>
                    <p className="text-gray-600">
                      {contactInfo?.address ||
                        settings?.address ||
                        "Scheme No 71, Gumasta Nagar, Indore (M.P.)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  <a
                    href={`https://instagram.com/${(
                      contactInfo?.instagram ||
                      (settings as any)?.instagram ||
                      "VN_TOUR_AND_TRAVELS"
                    ).replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-transform duration-500 transform hover:rotate-12"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href="https://facebook.com/VNtourandtravels"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-transform duration-500 transform hover:rotate-12"
                  >
                    <FaFacebook size={20} />
                  </a>
                  <a
                    href={`https://wa.me/${(
                      contactInfo?.whatsapp ||
                      contactInfo?.phonePrimary ||
                      settings?.whatsapp ||
                      settings?.phone ||
                      "+91 91098 79836"
                    )
                      .replace(/\D/g, "")
                      .replace(/00000/g, "9109879836") || "919109879836"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-transform duration-500 transform hover:rotate-12"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:w-1/2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">
                Book or Enquire Now
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Full Name"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Phone Number
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-900 transition-transform duration-300 hover:scale-105 shadow-md"
                >
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
