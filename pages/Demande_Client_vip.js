import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { FaSketch } from "react-icons/fa";
import HouseCards from '@/components/HouseCards';
import { FiArrowLeft, FiChevronLeft, FiHome, FiChevronDown, FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { HiOutlineHome } from 'react-icons/hi2';
import { HiUser } from 'react-icons/hi2';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { IoIosHand } from 'react-icons/io';
import jwt from 'jsonwebtoken';
import AjoutCard from '@/components/AjoutCard';
import Form_Demande_Client from '@/components/Form_Demande_Client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineCog } from "react-icons/hi2";
import Form_Demande_Client_vip from '@/components/Form_Demande_Client_vip';

export default function DemandeClientVIP() {
    const router = useRouter();
    const [ClientName, setClientName] = useState('');
    const [ClientEmail, setClientEmail] = useState('');
    const [decodedToken, setDecodedToken] = useState(null); // State variable to store decoded token
    const [open, setOpen] = useState(true);
    const [clientId, setClientId] = useState(null);
    const handleDevenirVIP = () => {
      setShowVIPWindow(true);
    };
    
    const handleModifierBien = () => {
      router.push('/gestionBien_modify');
    };
    const handleModifierProfil= () => {
      router.push('/Gestion_Profile_Proprietaire');
    };

    useEffect(() => {
      const token = localStorage.getItem('token');
      console.log("token:",token);
      if (token) {
        const decodedToken = jwt.decode(token);
        let id;
        if (decodedToken.userType === 'client') {
          id = decodedToken.id;
        } else if (decodedToken.userType === 'proprietaire') {
          id = decodedToken.id_client;
        }
        setClientId(id);
        console.log("decoded token:",decodedToken)
        if (decodedToken && decodedToken.nom) {
          setClientName(decodedToken.nom);
          setClientEmail(decodedToken.email);
          setDecodedToken(decodedToken);
        }
      }
    }, []);
  
    async function handlemSubmit(
      type_bien,
      prix_minimum,
      prix_maximum,
      surface_minimum,
      nbr_chambre_minimum,
      date_debut_rechercher,
      type_location_vip
    ) {
      try {
        const response = await fetch('/api/api_insert_demande_client_vip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({
            type_bien,
            prix_minimum,
            prix_maximum,
            surface_minimum,
            nbr_chambre_minimum,
            date_debut_rechercher,
            type_location_vip,
            id: clientId// Access the id from the decodedToken state variable
          }),
        });
  
        if (response.ok) {
          // Successful submission
          console.log('Demande_client submitted successfully');
          toast.success('Demande_client submitted successfully');
          // Optionally, you can navigate to another page after successful submission
          setTimeout(() => {
            router.push('/panel');
          }, 0);
                  } else {
          // Handle error
          console.error('Failed to submit Demande_client');
        }
      } catch (error) {
        console.error('API Error:', error);
      }
    };
  
    const menus = [
      { title: 'Dashboard', icon: HiOutlineHome },
      { title: 'Gestion de profil', icon: HiUser, button1:true}, /* hawlik sbab lmachakil 3ndou function fi ligne 48 ou render fi ligne 187, glhf :) */
      { title: 'Support', icon: FiPlus },
      { title: 'Devenir VIP', icon: FaSketch, button: true},
      { title: 'Paramètre', icon: HiOutlineCog }
    ];
    return (
      <div className=" min-h-screen">
        <Header />
        <main className="">
          <div className="flex bg-white text-gray-700">
            
          <div className={`${open ? 'w-60' : 'w-20'} h-auto relative bg-red-400`}>
              <FiChevronLeft
                className={`absolute bg-red-400 text-white border-red-400 rounded-full h-7 cursor-pointer 
                -right-3 top-9 w-7 border-2 border-dark-purple transition transform duration-300 ease-out ${
                  open ? 'rotate-180' : ''
                }`}
                onClick={() => setOpen(!open)}
              />
             <ul className={`gap-x-4 space-y-3 px-5 pt-6 origin-left items-center font-medium text-xl duration-300 ${!open ? 'flex flex-col' : ''}`}>
              {menus.map((menu, index) => (
              <li
                key={index}
                className={`rounded text-gray hover:border bg-red-500 bg-opacity-0 hover:bg-opacity-70 
                border-opacity-70  border-red-500 active:scale-95 text-s flex items-center
                 gap-x-4 cursor-pointer p-2 ${
                  !open ? 'transform scaleX(0)' : ''
                } transition transform duration-300 ease-out`}
              >
              {menu.button ? (
                <button className="flex items-center gap-x-2" onClick={handleDevenirVIP}>
                  {React.createElement(menu.icon, { className: 'text-white' })}
                  <span className={`text-white transition transform ${!open ? 'hidden' : ''}`}>
                    {menu.title}
                  </span>
                </button>
                ): null}
              {menu.button1 && (
                <button className="flex items-center gap-x-2" onClick={handleModifierProfil}>
                  {React.createElement(menu.icon, { className: 'text-white' })}
                  <span className={`text-white transition transform ${!open ? 'hidden' : ''}`}>
                    {menu.title}
                  </span>
                </button>
              )}
              {!menu.button && !menu.button1 && (<button className='flex items-center gap-x-2'>
                    {React.createElement(menu.icon, { className: 'text-white' })}
                    <span className={`text-white transition transform ${!open ? 'hidden' : ''}`}>
                      {menu.title}
                    </span>
                  </button>)}
              </li>
            ))}
            </ul>
            </div>
             <div className="flex items-center justify-between">
               <div className="max-w-md w-full p-6 bg-white rounded">
                 <h2 className="text-2xl font-semibold mb-4">Demande Personnalisée</h2>
                 <Form_Demande_Client_vip onSubmit={handlemSubmit} />
                 
               </div>
             </div>
             
           </div>
         
         </main>
        
         <ToastContainer />

         <Footer />
       </div>
       );
    }