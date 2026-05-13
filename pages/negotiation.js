import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import FormNegotiation from '../components/FormNegotiation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Negotiation() {
  const router = useRouter();
  const { query } = router;
  const idLikes = query.id_likes || null; // Assign null as the default value if id_likes is not available
  const bien_id = query.bien_id || null;
  const idProprietaire = query.proprietaire_id || null;
  const [idClient, setidClient] = useState('');


  const handleGoBack = () => {
    router.back();
  };
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
        const decodedToken = jwt.decode(token); // Add the idLikes, idBien, and idProprietaire to the form data
        formData.id_likes = idLikes;
        formData.bien_id = bien_id;
        formData.proprietaire_id = idProprietaire;
        formData.client_id = idClient;
        formData.decodedToken = decodedToken;
  
        // Make an API request to create the negotiation
        const response = await fetch('/api/api_create_negotiation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          // If the negotiation was created successfully, display a notification and redirect to the /homesList page
          toast.success('Negociation a ete faite');
          router.push('/homesList');
        } else {
          // Handle the error case
          console.error('Failed to create negotiation');
        }
      }
    } catch (error) {
      console.error('Failed to create negotiation:', error);
    }
  };
  

  return (
    <div className="bg-white items-center">
    <Header />
    <div className="container mx-auto px-4 min-h-screen py-8 bg-white rounded-sm">
      <div className="bg-white">
        <h1 className="text-2xl text-center font-bold text-black mb-4">Page de négociation </h1>
        <FormNegotiation onSubmit={handleNegotiationSubmit} />
        
      </div>
    </div>
    <Footer />
    <ToastContainer />
  </div>
  );
}
