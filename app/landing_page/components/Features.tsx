"use client";

import { useState } from "react";
import { FaCode, FaUsers, FaTrophy, FaClock, FaGlobe, FaMobile } from "react-icons/fa";

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FaCode className="text-3xl" />,
      title: "Multi-Language Support",
      description: "Code in HTML, JavaScript, Python and more. Choose your preferred language for each battle.",
      highlights: ["HTML/CSS", "JavaScript", "Python", "More coming soon"]
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Real-Time Battles",
      description: "Challenge coders from around the world in live coding competitions with real-time progress tracking.",
      highlights: ["Live opponents", "Progress tracking", "Head-to-head matches", "Spectator mode"]
    },
    {
      icon: <FaTrophy className="text-3xl" />,
      title: "Competitive Rankings",
      description: "Climb the leaderboards, earn badges, and establish yourself as a coding champion.",
      highlights: ["Global leaderboard", "Achievement badges", "Skill-based matchmaking", "Seasonal rewards"]
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Time-Based Challenges",
      description: "Test your speed and accuracy with challenges that push your coding skills to the limit.",
      highlights: ["Countdown timer", "Speed scoring", "Efficiency metrics", "Time bonuses"]
    },
    {
      icon: <FaGlobe className="text-3xl" />,
      title: "Global Community",
      description: "Join a worldwide community of developers improving their skills through friendly competition.",
      highlights: ["Global matchmaking", "Community events", "Multi-language support", "Cultural exchange"]
    },
    {
      icon: <FaMobile className="text-3xl" />,
      title: "Mobile Friendly",
      description: "Code on the go with our responsive design that works perfectly on desktop and mobile devices.",
      highlights: ["Responsive design", "Touch-friendly", "Cross-platform", "Offline practice"]
    }
  ];

  return (
    <section id="features" className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Coding Clash</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Level up your coding skills through exciting challenges, competitive gameplay, and a supportive community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              
              <ul className="space-y-2">
                {feature.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature Visualization */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {features[activeFeature].title}
              </h3>
              <p className="text-blue-100 mb-6">
                {features[activeFeature].description}
              </p>
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                Try It Now
              </button>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                
                <div className="font-mono text-sm">
                  <div className="flex">
                    <span className="text-blue-200 mr-4">1</span>
                    <span className="text-cyan-200">function</span> 
                    <span className="text-white"> calculateScore</span>
                    <span className="text-yellow-200">()</span> 
                    <span className="text-white"> {"{"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-blue-200 mr-4">2</span>
                    <span className="text-white ml-4">  </span>
                    <span className="text-pink-200">return</span> 
                    <span className="text-yellow-200"> speed</span> 
                    <span className="text-white"> * </span>
                    <span className="text-green-200">accuracy</span> 
                    <span className="text-white"> + </span>
                    <span className="text-purple-200">bonus</span>
                    <span className="text-white">;</span>
                  </div>
                  <div className="flex">
                    <span className="text-blue-200 mr-4">3</span>
                    <span className="text-white">{"}"}</span>
                  </div>
                  <div className="flex mt-4">
                    <span className="text-blue-200 mr-4">4</span>
                    <span className="text-gray-400">// {features[activeFeature].highlights[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">10,000+</div>
            <div className="text-gray-600">Active Coders</div>
          </div>
          <div className="bg-cyan-50 rounded-xl p-4">
            <div className="text-2xl md:text-3xl font-bold text-cyan-600">50,000+</div>
            <div className="text-gray-600">Battles Fought</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">95%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="bg-cyan-50 rounded-xl p-4">
            <div className="text-2xl md:text-3xl font-bold text-cyan-600">24/7</div>
            <div className="text-gray-600">Active Community</div>
          </div>
        </div>
      </div>
    </section>
  );
}