import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

export default function ModifierBienProprietaire() {
  const [biens, setBiens] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
  
    if (!token) {
      console.log('No token');
      router.push('/proprietaireHouses');
    } else {
      try {
        const decodedToken = jwt.decode(token);
        console.log('Decoded Token:', decodedToken);
  
        if (!decodedToken || !decodedToken.id) {
          console.log('Invalid token or missing id_proprietaire');
        } else {
          fetchProperties(decodedToken.id);
        }
      } catch (error) {
        console.log('Error decoding token:', error);
      }
    }
  }, []);
  
  const fetchProperties = async (id_proprietaire) => {
    try {
      const response = await fetch(`/api/modifier_bien_proprietaire?id_proprietaire=${id_proprietaire}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setBiens(data.Biens);
      } else {
        console.log('Error fetching properties:', response.status);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };
  
  

  return (
    <div>
      <h1>Modifier Bien Proprietaire</h1>
      <button onClick={() => router.push('/BienFormProprietaire')}>Ajouter un bien</button>
      <div className='bg-white'>
      <ul>
        {biens.map((bien) => (
          <li key={bien.id}>{bien.nom}</li>
        ))}
      </ul>
    </div>
    </div>
  );
}
