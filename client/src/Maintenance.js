import React from 'react';
import { 
  Wrench, 
  Clock, 
  Mail, 
  AlertCircle,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">

        <div className="bg-white rounded-2xl  p-8 md:p-12 text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
           
              <div className="absolute -top-2 -right-2">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            We're Under Maintenance
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            We're working hard to improve our website and we'll be back soon. Thank you for your patience!
          </p>

          {/* Status Updates */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expected Duration</h3>
              <p className="text-gray-600">Approximately 2 hours</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <a href="mailto:support@example.com" className="text-blue-500 hover:text-blue-600 transition-colors">
                support@example.com
              </a>
            </div>
          </div>

          
        </div>

        {/* Social Links */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Follow us for updates</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;