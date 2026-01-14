
import React from 'react';
import { X } from 'lucide-react';

interface MediaViewerProps {
  url: string;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} />
      </button>
      <img 
        src={url} 
        alt="Full screen view" 
        className="max-w-full max-h-full object-contain rounded-lg"
      />
    </div>
  );
};

export default MediaViewer;
