'use client';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import CampaignModal from '@/components/admin/CampaignModal';

export default function CampaignWrapper({ products }: { products: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-action-yellow text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-500 transition-colors"
      >
        <Mail size={18} />
        Enviar Campaña
      </button>

      <CampaignModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        products={products} 
      />
    </>
  );
}