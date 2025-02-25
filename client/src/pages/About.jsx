import React from "react";
import Navbar from "../components/Navbar";

function About() {
  const developer = {
    name: "Abinash Dwibedi",
    role: "Full-Stack Developer",
    description:
      "Passionate about building user-friendly, scalable, and efficient applications. I specialize in React, Node.js, and modern web technologies. I enjoy learning new skills and contributing to open-source projects.",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/AbinashDwibedi", icon: "fa-github" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: "fa-linkedin" },
    ],
    photo: "https://abinash-dwibedi.web.app/assets/image-B8BngXR8.jpg",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="max-w-4xl bg-white text-gray-800 rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={developer.photo}
            alt="Developer"
            className="rounded-full h-40 w-40 border-4 border-indigo-500 object-cover"
          />
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{developer.name}</h1>
            <h2 className="text-xl text-indigo-500">{developer.role}</h2>
            <p className="mt-4">{developer.description}</p>
            <div className="mt-6 flex space-x-4">
              {developer.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-indigo-500"
                  aria-label={link.platform}
                >
                  <i className={`fa-brands ${link.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
