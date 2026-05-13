import BgLogin from "../components/bg_login";
import Header from "@/components/Header";
import { useRouter } from 'next/router';

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BienFormVip from "@/components/BienFormVIP";

export default function Page() {
  const [BienCompleted, setBienCompleted] = useState(false);
  const router = useRouter();

  async function handleSubmit(
    description,
    typeBien,
    type_location_vip,
    nbrChambre,
    selectedAddress, 
    ville,
    codePostal,
    minPrixEstime,
    etat
  ) {
    const token = localStorage.getItem('token'); // Retrieve the token from storage

    try {
      console.log('Submitting form...');
      console.log('Form data:', {
        description,
    typeBien,
    type_location_vip,
    nbrChambre,
    selectedAddress, 
    ville,
    codePostal,
    minPrixEstime,
    etat
      });

      const response = await fetch('/api/addBienProprietaireVIP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          typeBien,
          type_location_vip,
          nbrChambre,
          selectedAddress, 
          ville,
          codePostal,
          minPrixEstime,
          etat
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        setBienCompleted(true);
        toast.success('Bien ajouté!', {
          position: toast.POSITION.TOP_CENTER,
          
        });router.push(`/Vip`);
      } else {
        const errorMessage = data?.error || 'Error creating user';
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error
    }
  }

  return (
    <div>
      <ToastContainer />
      <Header/>
      <BgLogin />
      <BienFormVip onSubmit={handleSubmit} />
    </div>
  );
}
