"use client";

import { useState } from "react";
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      company: "TechSolutions Inc.",
      image: null,
      rating: 5,
      text: "Coding Clash completely transformed how I practice coding. The real-time battles against other developers pushed me to improve my JavaScript skills faster than any tutorial could.",
      language: "JavaScript"
    },
    {
      name: "Maria Rodriguez",
      role: "Computer Science Student",
      company: "University of Tech",
      image: null,
      rating: 5,
      text: "As a student, finding engaging ways to practice coding has been challenging. Coding Clash makes learning fun and competitive. I've improved my Python skills dramatically in just a month!",
      language: "Python"
    },
    {
      name: "James Chen",
      role: "Full Stack Developer",
      company: "StartUp Ventures",
      image: null,
      rating: 4,
      text: "The HTML/CSS battles are incredibly creative. I've learned so many new techniques from seeing how others solve the same challenges. It's like pair programming but with competition!",
      language: "HTML/CSS"
    },
    {
      name: "Sarah Williams",
      role: "Software Engineer",
      company: "DataSystems Corp",
      image: null,
      rating: 5,
      text: "I use Coding Clash to warm up before work and during breaks. It's the perfect way to stay sharp and learn new approaches. The community is supportive and incredibly talented.",
      language: "JavaScript"
    },
    {
      name: "David Kim",
      role: "DevOps Engineer",
      company: "CloudTech Services",
      image: null,
      rating: 5,
      text: "Even with years of experience, I still learn something new every time I play. The time pressure really simulates real-world coding challenges. Highly recommend for any developer!",
      language: "Python"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const getLanguageColor = (language: string): string => {
    switch(language) {
      case "JavaScript": return "bg-yellow-100 text-yellow-800";
      case "Python": return "bg-blue-100 text-blue-800";
      case "HTML/CSS": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Developers Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of developers who are leveling up their skills through friendly competition.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-12 relative">
          <div className="absolute top-6 left-6 text-blue-200 text-4xl">
            <FaQuoteLeft />
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* User Avatar */}
            <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                {testimonials[activeTestimonial].image ? (
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  testimonials[activeTestimonial].name.charAt(0)
                )}
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="flex-1">
              <div className="flex items-center mb-4">
                {/* Stars */}
                <div className="flex mr-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`text-lg ${i < testimonials[activeTestimonial].rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                
                {/* Language Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLanguageColor(testimonials[activeTestimonial].language)}`}>
                  {testimonials[activeTestimonial].language}
                </span>
              </div>

              <p className="text-gray-700 text-lg mb-6 italic">
                "{testimonials[activeTestimonial].text}"
              </p>

              <div>
                <h4 className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</h4>
                <p className="text-gray-600">
                  {testimonials[activeTestimonial].role} • {testimonials[activeTestimonial].company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute bottom-6 right-6 flex space-x-3">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              aria-label="Next testimonial"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="flex mr-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`text-sm ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(testimonial.language)}`}>
                  {testimonial.language}
                </span>
              </div>

              <p className="text-gray-600 mb-4 text-sm italic">
                "{testimonial.text.slice(0, 120)}..."
              </p>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold mr-3">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    testimonial.name.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to join our community of passionate coders?
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg">
            Start Your Coding Journey
          </button>
        </div>
      </div>
    </section>
  );
}