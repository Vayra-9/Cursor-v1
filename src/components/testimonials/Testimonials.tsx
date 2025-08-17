import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    location: "Toronto, Canada",
    content: "VAYRA helped me pay off $45,000 in student loans in just 18 months. The analytics and payoff strategies are game-changing!",
    rating: 5,
    avatar: "SC"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    location: "Austin, Texas",
    content: "Finally found a debt management tool that actually works. The DTI calculator and payment tracker kept me motivated throughout my journey.",
    rating: 5,
    avatar: "MR"
  },
  {
    id: 3,
    name: "Priya Patel",
    location: "London, UK",
    content: "As a freelancer, managing multiple income streams and debts was overwhelming. VAYRA's dashboard made everything crystal clear.",
    rating: 5,
    avatar: "PP"
  },
  {
    id: 4,
    name: "David Kim",
    location: "Seoul, South Korea",
    content: "The AI insights and personalized strategies helped me save thousands in interest. Highly recommend for anyone serious about debt freedom.",
    rating: 5,
    avatar: "DK"
  },
  {
    id: 5,
    name: "Emma Thompson",
    location: "Melbourne, Australia",
    content: "From drowning in credit card debt to debt-free in 2 years. VAYRA's tools and community support made all the difference.",
    rating: 5,
    avatar: "ET"
  },
  {
    id: 6,
    name: "Carlos Mendez",
    location: "Mexico City, Mexico",
    content: "La mejor herramienta de gestión de deudas que he usado. Los gráficos y análisis son increíbles para visualizar el progreso.",
    rating: 5,
    avatar: "CM"
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join our community of debt-free achievers who transformed their financial lives with VAYRA
          </p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 relative">
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 text-blue-200 dark:text-blue-800">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="text-center">
                  {/* Rating */}
                  <div className="flex justify-center mb-6">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                    "{currentTestimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {currentTestimonial.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentTestimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              50K+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Active Users
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              $2.5M+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Debt Paid Off
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
              4.9/5
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              User Rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
