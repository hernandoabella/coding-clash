"use client";

import { useState, useEffect } from "react";
import { FaPlay, FaCode, FaUsers, FaTrophy, FaArrowRight } from "react-icons/fa";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const stats = [
    { value: "5,000+", label: "Active Coders" },
    { value: "25,000+", label: "Battles Fought" },
    { value: "98%", label: "Satisfaction Rate" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Code, Compete,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Conquer
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Join the ultimate coding battlefield where programmers test their skills in real-time battles. 
              Challenge opponents, climb leaderboards, and earn your place among coding elites.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Coding Battle <FaPlay className="ml-2" />
              </button>
              <button className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center">
                Watch Demo <FaArrowRight className="ml-2" />
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-gray-500 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Content */}
          <div className="lg:w-1/2 relative">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform rotate-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm text-gray-500">battle.js</div>
              </div>
              
              <div className="font-mono text-sm text-gray-700">
                <div className="flex">
                  <div className="text-gray-400 mr-4">1</div>
                  <div><span className="text-purple-600">function</span> <span className="text-blue-600">calculateWinner</span>() {"{"}</div>
                </div>
                <div className="flex">
                  <div className="text-gray-400 mr-4">2</div>
                  <div className="ml-4"><span className="text-purple-600">return</span> <span className="text-green-600">"You win!"</span>;</div>
                </div>
                <div className="flex">
                  <div className="text-gray-400 mr-4">3</div>
                  <div>{"}"}</div>
                </div>
                <div className="flex">
                  <div className="text-gray-400 mr-4">4</div>
                  <div></div>
                </div>
                <div className="flex">
                  <div className="text-gray-400 mr-4">5</div>
                  <div><span className="text-blue-600">console</span>.<span className="text-yellow-600">log</span>(calculateWinner());</div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-blue-100 rounded-lg p-4 shadow-lg transform rotate-6">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-full mr-3">
                  <FaTrophy className="text-white text-lg" />
                </div>
                <div>
                  <div className="font-bold text-blue-700">Rank #24</div>
                  <div className="text-xs text-blue-500">Climbing +3</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-green-100 rounded-lg p-4 shadow-lg transform -rotate-3">
              <div className="flex items-center">
                <div className="bg-green-600 p-2 rounded-full mr-3">
                  <FaUsers className="text-white text-lg" />
                </div>
                <div>
                  <div className="font-bold text-green-700">3 Opponents</div>
                  <div className="text-xs text-green-500">Waiting for you</div>
                </div>
              </div>
            </div>
            
            {/* Animated language indicator */}
            <div className="absolute top-1/2 -right-6 bg-white rounded-full p-3 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                {activeIndex === 0 && <span className="text-white font-bold text-xs">HTML</span>}
                {activeIndex === 1 && <span className="text-white font-bold text-xs">JS</span>}
                {activeIndex === 2 && <span className="text-white font-bold text-xs">PY</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}