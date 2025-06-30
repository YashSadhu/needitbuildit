import React from 'react';
import { PenTool, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">Story Timeline</span>
              <p className="text-sm text-gray-600">Crafted by storyteller for storytellers and visionaries © 2025 needitbuildit</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <a 
              href="mailto:networks.yash@gmail.com" 
              className="hover:text-blue-600 transition-colors font-medium"
            >
              networks.yash@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};