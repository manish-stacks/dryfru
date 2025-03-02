
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Leaf, Heart, Award, ShieldCheck, Star, Users, TrendingUp, Mail, Phone, Globe, MapPin, Loader } from 'lucide-react';
import { Helmet } from 'react-helmet';

const About = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Products' },
    { number: '15+', label: 'Countries' },
    { number: '24/7', label: 'Support' },
  ];
  useEffect(() => {
    axios
      .get("https://api.dyfru.com/api/v1/get-about")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-2xl font-bold mb-2">Oops! Something went wrong.</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`About Us - DyFru | Premium Dry Fruits & Nuts Online`}</title>
        <meta
          name="description"
          content="Discover DyFru – your trusted source for premium quality dry fruits and nuts. Shop online for fresh, healthy, and delicious dry fruits delivered to your doorstep."
        />
        <meta
          name="keywords"
          content="DyFru, dry fruits online, buy nuts online, premium dry fruits, healthy snacks, organic nuts, almonds, cashews, pistachios, walnuts, healthy dry fruits"
        />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <Leaf className="h-16 w-16 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500 sm:text-7xl mb-6">
            {data.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {data.sections.map((section, index) => (
            <div
              key={section._id}
              className={`bg-white rounded-3xl p-8 transition-all duration-300 hover:bg-green-50 
                `}
            >
              <div className="flex items-center gap-4 mb-6">
                {/* {index % 4 === 0 && <ShieldCheck className="h-8 w-8 text-green-500" />}
                {index % 4 === 1 && <Heart className="h-8 w-8 text-red-500" />}
                {index % 4 === 2 && <Award className="h-8 w-8 text-yellow-500" />}
                {index % 4 === 3 && <Users className="h-8 w-8 text-blue-500" />} */}
                <p className="text-xl">{section.icon}</p>
                <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                {section.content}
              </p>
              {section.list.length > 0 && (
                <ul className="space-y-4">
                  {section.list.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-start bg-white bg-opacity-50 rounded-xl p-4 transition-all duration-300 hover:bg-opacity-100"
                    >
                      {/* <Star className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                       */}
                       <p className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-1">{item.icon}</p>
                      <div>
                        <span className="font-semibold text-gray-900">{item.title}</span>
                        <span className="text-gray-600"> – {item.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="bg-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-green-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a href={`mailto:${data.contact.email}`} className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300">
              <Mail className="h-6 w-6 text-green-600" />
              <span className="text-gray-800">{data.contact.email}</span>
            </a>
            <a href={`tel:${data.contact.phone}`} className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
              <Phone className="h-6 w-6 text-blue-600" />
              <span className="text-gray-800">{data.contact.phone}</span>
            </a>
            <a href={data.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-300">
              <Globe className="h-6 w-6 text-purple-600" />
              <span className="text-gray-800">{data.contact.website}</span>
            </a>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors duration-300">
              <MapPin className="h-6 w-6 text-yellow-600" />
              <span className="text-gray-800">{data.contact.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
