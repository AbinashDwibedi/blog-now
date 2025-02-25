import React from "react";
import Navbar from "../components/Navbar";

function Contact() {
  const contactDetails = {
    email: "dwibedi.abinash123@gmail.com",
    // phone: "+123-456-7890",
    location: "Sambalpur, Odisha",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/AbinashDwibedi", icon: "fa-github" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: "fa-linkedin" },
      // { platform: "Twitter", url: "https://twitter.com/johndoe", icon: "fa-twitter" },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl bg-white text-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Contact Me</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div>
              <h2 className="text-xl font-semibold text-blue-600">Get in Touch</h2>
              <p className="mt-4">
                Feel free to reach out to me via email or phone, or connect with me on social media.
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <i className="fa fa-envelope text-blue-600 mr-2"></i>
                  <a href={`mailto:${contactDetails.email}`} className="hover:underline">
                    {contactDetails.email}
                  </a>
                </li>
                {/* <li>
                  <i className="fa fa-phone text-blue-600 mr-2"></i>
                  <a href={`tel:${contactDetails.phone}`} className="hover:underline">
                    {contactDetails.phone}
                  </a>
                </li> */}
                <li>
                  <i className="fa fa-map-marker-alt text-blue-600 mr-2"></i>
                  {contactDetails.location}
                </li>
              </ul>
              <div className="mt-6 flex space-x-4">
                {contactDetails.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl hover:text-blue-600"
                    aria-label={link.platform}
                  >
                    <i className={`fa-brands ${link.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
            {/* <div>
              <h2 className="text-xl font-semibold text-blue-600">Send a Message</h2>
              <form className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500"
                >
                  Send Message
                </button>
              </form>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
