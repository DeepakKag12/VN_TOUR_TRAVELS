import React from "react";
import { Github as GitHub, Linkedin, Mail, MapPin } from "lucide-react";

const Contact: React.FC = () => {
    return (
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Get In Touch
                    </h2>
                    <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Have a project in mind or want to discuss potential opportunities? Feel free to reach out!
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 animate-fadeInLeft">
                            <div className="bg-gray-50 p-8 rounded-lg shadow-md h-full">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                                    Contact Information
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <Mail className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-gray-800">
                                                Email
                                            </h4>
                                            <p className="text-gray-600">
                                                kagdeepak45@gmail.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <MapPin className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-gray-800">
                                                Location
                                            </h4>
                                            <p className="text-gray-600">
                                                India
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <Mail className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-gray-800">
                                                Phone
                                            </h4>
                                            <p className="text-gray-600">
                                                +91 74222 2924
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <Linkedin className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-gray-800">
                                                LinkedIn
                                            </h4>
                                            <p className="text-gray-600">
                                                Deepak Kag
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Socials */}
                                <div className="mt-8">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                                        Follow Me
                                    </h4>
                                    <div className="flex space-x-4">
                                        <a
                                            href="https://github.com/DeepakKag12"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors"
                                        >
                                            <GitHub size={20} />
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/in/deepak-kag-50241328a/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors"
                                        >
                                            <Linkedin size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2 animate-fadeInRight">
                            <form className="bg-white p-8 rounded-lg shadow-md">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                                    Send Me a Message
                                </h3>

                                <div className="mb-6">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="John Smith"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Project Inquiry"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Your message here..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                                >
                                    Send Message
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
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
