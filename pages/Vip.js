import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiArrowLeft, FiChevronLeft, FiHome, FiChevronDown, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/router';
import GestionCard from '@/components/CardGestion';
import Header_signup from '@/components/Header_signup';
import AjoutCard from '@/components/AjoutCard';
import DemandeClientCard from '@/components/DemandeClientCard';
import { HiOutlineHome } from "react-icons/hi2";
import { HiUser } from "react-icons/hi2";
import { HiUserGroup } from "react-icons/hi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { HiOutlineCog } from "react-icons/hi2";
import jwt from 'jsonwebtoken';
import { IoIosHand } from "react-icons/io";
import DemandeUsersCard from '@/components/demande_client_users_card';
import NegotiationCard from '@/components/negotiation_card';
import SearchCard from '@/components/SearchCard';
import EcrireDemande from '@/components/ecrire_card';
import ModifyCard from '@/components/modify_card';

export default function VipPnel({ exploreData, cardsData }) {
  const [open, setOpen] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  const [showVIPWindow, setShowVIPWindow] = useState(false);
  const menus = [
    { title: 'Gestion de profil', icon: HiUser, route: '/Gestion_Profile_Proprietaire' },
    { title: 'Gestion des annonces', icon: FaChalkboardTeacher },
    { title: 'Gestion des biens', icon: HiOutlineHome },
    { title: 'Support', icon: FiPlus },
    { title: 'Settings', icon: IoIosHand },
  ];
  

  const router = useRouter();

  const handleModifierBien = () => {
    router.push('/gestionBien_modify');
  };

  const [decodedToken, setDecodedToken] = useState(null);
  const [userType, setUserType] = useState(null); // Added userType state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.nom) {
        setProprietaireName(decodedToken.nom);
        setProprietaireEmail(decodedToken.email);
        setUserType(decodedToken.userType);
        setClientName(decodedToken.nom);
        setClientEmail(decodedToken.nom);
      }
      setHasToken(true);
    } else {
      router.push('/login_client'); // Redirect to the homepage
    }
  }, []);

  if (!hasToken) {
    return <div className='h-screen flex items-center place-content-center'><p className='font-bold text-4xl text-center items-center'>You are not connected ... redirecting to login</p></div>; // Display a message indicating that the user is not connected
  }



  const handleVoirNegotiationBien = () => {

        router.push('/negotiation_proprietaire_VIP');
  
  };
  const handleVoirNegotiationP = () => {

    
        router.push('/negotiation_client');
    
      
    
  };
console.log(userType);
  const handleVoirDemandes = () => {
    router.push('/see_demande_client');
  };
  const handleVoirDemandes_vip = () => {
    router.push('/see_demande_client_vip');
  };
  
  
  return (
    <div>
      <Header />
      <div>
        <main>
          <div className="flex bg-gray-100 text-gray-700">
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
                    onClick={() => menu.route ? router.push(menu.route) : null}
                  >
                    {menu.button ? (
                      <button
                        className="flex items-center gap-x-2"
                        onClick={handleDevenirVIP} // Call the function when the button is clicked
                      >
                        {React.createElement(menu.icon, { className: 'text-white' })}
                        <span className={`text-white transition transform ${!open ? 'hidden' : ''}`}>
                          {menu.title}
                        </span>
                      </button>
                    ) : (
                      <>
                        {React.createElement(menu.icon, { className: 'text-white' })}
                        <span className={`text-white transition transform ${!open ? 'hidden' : ''}`}>
                          {menu.title}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
 <div className='grid grid-cols-3'>
            <div className="mt-5 ml-5 text-2xl font-semibold flex flex-col h-screen">
              <h1 className="font-bold text-gray-700 text-4xl">Gestion Des Biens</h1>
              {userType=== 'client' && (
                <div>
                <p className=' text-red-1000 text-sm'>* ajouter au moin un bien pour devenir proprietaire</p>
                <button className="text-left sm:grid-cols-2 lg:grid-cols-3
                xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                 transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent w-full" 
                 onClick={() => router.push('/BienFormProprietaire')}>
                <AjoutCard key="gestion" text="Ajouter un bien" />
                </button>
                </div>                
              )}
                  {userType === 'proprietaire' && (
      <>
        <button className="text-left  sm:grid-cols-2 lg:grid-cols-3 
                xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                 transform hover:scale-105 hover:cursor-pointer 
                 font-mono bg-transparent" onClick={() => router.push('/BienFormProprietaire')}>
          <AjoutCard key="gestion" text="Ajouter un bien" />
        </button>

        <button className="text-left  sm:grid-cols-2 lg:grid-cols-3 
                xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                 transform hover:scale-105 hover:cursor-pointer 
                 font-mono bg-transparent" onClick={() => router.push('/BienFormProprietaireVIP')}>
          <AjoutCard key="gestion" text="Ajouter un bien VIP" />
        </button>
      </>
    )}
     <button 
                className="text-left sm:grid-cols-2 lg:grid-cols-3 
                xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent" 
                onClick={() => router.push('/homesListVIP')}>
                <SearchCard key="gestion" text="Consulter les biens VIP"/>
              </button>
             {userType === 'proprietaire' && (
                <button className="text-left  sm:grid-cols-2 lg:grid-cols-3 
                xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                 transform hover:scale-105 hover:cursor-pointer 
                 font-mono bg-transparent" onClick={handleModifierBien}>
                  <GestionCard key="gestion" text="Modifier un bien" />
                </button>
              )}

        
               
                
              <button 
                className="text-left sm:grid-cols-2 lg:grid-cols-3 
                xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent" 
                onClick={() => router.push('/homesList')}>
                <SearchCard key="gestion" text="Consulter les biens"/>
              </button>
             
            </div>
       
            <div className="mt-5 ml-5 text-2xl font-semibold flex flex-col h-screen">
              <h1 className="font-bold text-gray-700 text-4xl">Gestion Des Négotiations</h1>
              {userType === 'proprietaire' && (
                     <button
                  className="text-left sm:grid-cols-2 lg:grid-cols-3 
                  xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                   transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent"
                  onClick={() => handleVoirNegotiationBien()}
                >
                  <NegotiationCard key="gestion" text="Negotiations sur votre biens" />
                </button>       
                )}
              <button
                  className="text-left sm:grid-cols-2 lg:grid-cols-3 
                  xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                   transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent"
                  onClick={() => handleVoirNegotiationDemandeClient()}
                >
                  <NegotiationCard key="gestion" text="Negotiations sur votre demandes client" />
                </button>  
                <button
                  className="text-left sm:grid-cols-2 lg:grid-cols-3 
                  xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                   transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent"
                  onClick={() => handleVoirNegotiationP()}
                >
                  <NegotiationCard key="gestion" text="Negotiations avec les proprietaires" />
                </button>
            
                     {userType === 'proprietaire' && (
                     <button
                  className="text-left sm:grid-cols-2 lg:grid-cols-3 
                  xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                   transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent"
                  onClick={() => handleVoirNegotiationDemande()}
                >
                  <NegotiationCard key="gestion" text="Negotiations sur les demandes des clients" />
                </button>       
                )}
                
              </div>
              <div className="p-7 text-2xl font-semibold h-screen flex flex-col">
              <h1 className="font-bold text-gray-700 text-4xl">Gestion Des Annonces</h1>
                <button
                  className="text-left sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                   text-gray-690 transition duration-300 ease-in-out transform hover:scale-105 
                   hover:cursor-pointer font-mono bg-transparent"
                  onClick={() => router.push('/Demande_Client')}
                >
                  <EcrireDemande key="gestion" text="Faire Une Demande Personnalisée" />
                </button>
                <button
                  className="text-left sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                   text-gray-690 transition duration-300 ease-in-out transform hover:scale-105 
                   hover:cursor-pointer font-mono bg-transparent"
                  onClick={() => router.push('/Demande_Client_vip')}
                >
                  <EcrireDemande key="gestion" text="Faire Une Demande Personnalisée VIP" />
                </button>
                <button
                  className="text-left sm:grid-cols-2 lg:grid-cols-3 
                  xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
                   transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent"
                  onClick={() => router.push('/Modifier_Demande_Client')}
                >
                  <ModifyCard key="gestion" text="Consulter Et Modifier Votre Demandes Personnalisée" />
                </button>
              
                {userType === 'proprietaire' && (
              <button className="text-left sm:grid-cols-2 lg:grid-cols-3 
              xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
               transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent"
              onClick={() => handleVoirDemandes()}              >
                <DemandeUsersCard key="gestion" text="Voir Les Demandes Des Clients" />
              </button> 
            
               )}
 {userType === 'proprietaire' && (
              <button className="text-left sm:grid-cols-2 lg:grid-cols-3 
              xl:grid-cols-4 text-gray-690 transition duration-300 ease-in-out
               transform hover:scale-105 hover:cursor-pointer font-mono bg-transparent"
              onClick={() => handleVoirDemandes_vip()}              >
                <DemandeUsersCard key="gestion" text="Voir Les Demandes Des Clients VIP" />
              </button> 
            
               )}
               
                  
             
            </div>
            </div>
          </div>
        </main>
      </div>

   
      <Footer />
    </div>
  );
}

