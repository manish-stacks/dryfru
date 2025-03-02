import { useEffect, useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';
import { findSettings } from '../../utils/Api';
import axios from 'axios'
import { Helmet } from 'react-helmet';
function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    const dataFetchSettings = async () => {
      const dataSetting = await findSettings()

      setSettings(dataSetting)
    }

    dataFetchSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Message: formData.message
      }
      const response = await axios.post('https://api.dyfru.com/api/v1/support-request', data);
      console.log(response);

      if (response.status === 201) {
        setTimeout(() => {
          setSubmitted(true);

          setTimeout(() => {
            setSubmitted(false);
          }, 3000);
        }, 200);
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })

    } catch (error) {
      console.error("Error during form submission:", error);
    }
    console.log(formData);
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
   <>
   <Helmet>
  <title>{`Get in Touch - DyFru | Contact Us for Premium Dry Fruits & Nuts`}</title>
  <meta 
    name="description" 
    content="Have questions or need assistance? Get in touch with DyFru! Contact us for inquiries about our premium dry fruits, nuts, orders, or wholesale deals." 
  />
  <meta 
    name="keywords" 
    content="Contact DyFru, get in touch, dry fruits customer support, nuts online help, buy dry fruits, wholesale dry fruits, DyFru support, premium nuts supplier" 
  />
</Helmet>

   
   <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-12">Get in Touch</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-8 text-green-700">Contact Information</h2>

            <div className="space-y-8">
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Call Us</p>
                  <p className="text-green-600">{settings?.contactNumber}</p>
                  <p className="text-sm text-green-500">Mon-Fri: 9:00 AM - 5:00 PM</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Email Us</p>
                  <p className="text-green-600">{settings?.supportEmail}</p>
                </div>
              </div>



              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Visit Us</p>
                  <p className="text-green-600">{settings?.address}</p>

                </div>
              </div>
            </div>

            {/* Map with iframe */}
            <div className="mt-8 rounded-xl overflow-hidden shadow-lg h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564749872!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                <p className="text-green-600">We have received your message and will get back to you soon.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-8 text-green-700">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-green-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border rounded-lg border-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-green-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border rounded-lg border-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-green-700">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border rounded-lg border-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-green-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      required
                      className="mt-1 block w-full border rounded-lg border-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3 transition-colors duration-200"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-[1.02] transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
   </>
  );
}

export default Support;