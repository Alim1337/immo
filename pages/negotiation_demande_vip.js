import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FormNegotiationDemande from '@/components/FormNegotiation_demande';

export default function NegotiationDemande() {
    const router = useRouter();
    const { id_likes } = router.query;// Assign null as the default value if id_likes is not available
  const [idClient, setidClient] = useState('');
console.log("outsideidLikes ",id_likes),

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.decode(token);
      try {
        console.log("Decoded token:", decodedToken);
        console.log("Decoded client:", decodedToken.id);
  
        if (decodedToken.userType === 'proprietaire') {
          setidClient(decodedToken.id_client);
        } else if (decodedToken.userType === 'client') {
          setidClient(decodedToken.id);
          console.log("id_client",idClient);
        }
  
      } catch (error) {
        console.error('Failed to verify JWT token:', error);
      }
    }
  }, []);
  

  const handleNegotiationSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwt.decode(token);
        formData.proprietaire_id = decodedToken.id;
        formData.client_id = idClient;
        formData.decodedToken = decodedToken;
        formData.id_likes = id_likes;

        const response = await fetch('/api/api_create_negotiation_demande_vip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success('Negociation a ete faite');
          router.push('/panel'); // Redirect to the "panel" page
        } else {
          console.error('Failed to create negotiation');
        }
      }
    } catch (error) {
      console.error('Failed to create negotiation:', error);
    }
  };
  

  return (
    <div className='bg-white items-center'>
      <Header />
      <div className="container mx-auto px-4 py-8 bg-white rounded-sm">
        <div className='bg-white'>
          <h1 className="text-2xl text-center font-bold text-black mb-4">Negotiation Page</h1>
          <FormNegotiationDemande onSubmit={handleNegotiationSubmit} />
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
