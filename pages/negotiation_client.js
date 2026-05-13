import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HiArrowLeft } from "react-icons/hi2";

const NegotiationClient = () => {
  const [negotiations, setNegotiations] = useState([]);
  const [clientName, setClientName] = useState('');
  const [proprietaireID, setProprietaireID] = useState('');
  const [clientID, setClientID] = useState('');
  const [hasRdv, setHasRdv] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwt.decode(token);
          const userType = decodedToken.userType;
          const clientID = userType === 'proprietaire' ? decodedToken.id_client : decodedToken.id;
          console.log(clientID);
          const clientName = decodedToken.nom; // Assuming the name is stored in the token
          setClientName(clientName);
        
          const res = await fetch(`/api/api_voir_negotiation_client?client_id=${clientID}`);
          const data = await res.json();
          const hasRdv = await checkRdvExistence(data.negotiations);
          setHasRdv(hasRdv);
          setProprietaireID(data.negotiations[0]?.Proprietaire?.id_proprietaire); // Access the first negotiation object and get the id_proprietaire
          setNegotiations(data.negotiations);
          setRdv(data.rdv);
          console.log('data.rdv:',data.rdv);
          console.log('rdv:',rdv);

        } else {
          router.push('/login'); // Redirect to the login page if the token is not found
        }
      } catch (error) {
        console.error('Failed to fetch negotiations:', error);
      }
    };
  
    fetchNegotiations();
  }, []);
  const checkRdvExistence = async (negotiations) => {
    try {
      const negotiationsWithRdv = [];
      for (const negotiation of negotiations) {
        const response = await fetch(`/api/api_check_rdv_existence?negotiationID=${negotiation.id_negotiation}`);
        const data = await response.json();
  
        if (data.hasRdv) {
          negotiation.rdv = data.rdv; // Add the rdv property to the negotiation object
        }
  
        negotiationsWithRdv.push(negotiation);
      }
      return negotiationsWithRdv;

    } catch (error) {
      console.error('Failed to check RDV existence:', error);
     

      return negotiations; // Return the original negotiations array
    }
  };
  console.log('negotiations',negotiations);

  const handleAnnuler = (id) => {
    // Logic for handling 'Annuler' button click
  };

  const handleAnullerr = (id) => {
    // Logic for handling 'Modifier' button click
  };

  const handleContacter = (negotiation) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    const userType = decodedToken.userType;
    const clientID = decodedToken.id;
    const proprietaireID = negotiation.Proprietaire?.id_proprietaire;
    const negotiationID = negotiation.id_negotiation;

    console.log("this is negotiation object", negotiation);
    console.log("negotiation id", negotiationID);
    console.log("proprietaire id", negotiation.Proprietaire.id_proprietaire);
    console.log("client id", clientID);

    if (proprietaireID && negotiationID) {
      router.push(`/Chat_client?clientId=${clientID}&proprietaireId=${proprietaireID}&negotiationId=${negotiationID}`);
    } else {
      console.error('Invalid negotiation object:', negotiation);
    }
  };


  const handleBackClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.userType) {
        const userType = decodedToken.userType;
        const statusVIP = decodedToken.statusVIP;
        if (statusVIP) {
          console.log('Redirecting to /Vip');
          router.push('/Vip');
        } else if (userType === 'proprietaire') {
          console.log('Redirecting to /panel');
          router.push('/panel');
        }
        else if (userType ==='client'){
          console.log('Redirecting to /panel')
          router.push('/panel')
        }
      
      }
    }
  };

  return (
    <div className="bg-white text-black">
    <Header />

    <div className="container min-h-screen mx-auto px-4 py-8">
      <div className="flex justify-start mb-4">
      <button
        onClick={handleBackClick}
        className="text-white text-xl bg-gradient-to-r bg-neutral-800 hover:bg-gradient-to-bl font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2"
      >
        <HiArrowLeft />
      </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Négociations pour le client: {clientName}</h1>
      {negotiations && negotiations.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {negotiations.map((negotiation, index) => (
      <div
        key={negotiation.id_negotiation}
        className="bg-gray-100 p-8 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-gray-300 transition-shadow duration-300 border border-gray-300"
      >
        {/* Display negotiation details */}
        <div className="pb-4 text-lg">
          <div className=" pb-2">
            <p className="pb-2">
              Prix Proposé: 
            </p>
            <p className='block border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline w-full'>{negotiation.prix_propose}</p>
            <p className="">Durée: </p>
            <p className='block border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline w-full'>{negotiation.duree}</p>
            <p className="">
              Statut:{" "}
              <span
                className={`text-lg ${
                  negotiation.statut === "waiting"
                    ? "text-yellow-500"
                    : negotiation.statut === "validated"
                    ? "text-green-500"
                    : ""
                }`}
              >
                <p className='block border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline w-full'>{negotiation.statut}</p>
              </span>
            </p>
          </div>

          <p className="text-lg">
            Type de bien: <p className='block border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline w-full'>{negotiation.biens?.type_bien}</p>
          </p>

          {/* Display Proprietaire information */}
          <div className="">
            <p className="text-lg pb-2">
              Nom du propriétaire: <p className='block border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline w-full'>{negotiation.Proprietaire?.nom}</p>
            </p>
            <p className="text-lg">Nom du Client: <p className='block border rounded py-2 px-3
             text-black leading-tight focus:outline-none 
             focus:shadow-outline w-full'>{clientName}</p></p>
          </div>
      
              {/* Display RDV information */}
              {negotiation.rdv && negotiation.rdv?.length > 0 && (
  <div className="border-t-2 mt-4 pt-4">
    <p className="text-lg border-b pb-2">RDV Dates:</p>
    {negotiation.rdv.map((rdv, index) => (
      <p key={index} className="text-lg">
        {index + 1}. {rdv.date_rdv}
      </p>
    ))}
  </div>
)}

            </div>

      

        {/* Buttons */}
              <div className="flex justify-end mt-4 space-x-4">
                {negotiation.rdv ? (
                  <button
                    onClick={() => handleModifier(negotiation.id_negotiation)}
                    className="inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
                  >
                    Anuller
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAnnuler(negotiation.id_negotiation)}
                      className="inline-block rounded-full bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
                    >
                      Annuler
                    </button>

                    <button
                      onClick={() => handleAnullerr(negotiation.id_negotiation)}
                      className="inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
                    >
                      Modifier
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleContacter(negotiation)}
                  className="inline-block rounded border border-neutral-400 bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
                >
                  Contacter
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune négociation trouvée pour le client.</p>
      )}
    </div>

    <Footer />  
  </div>
  
  );
};

export default NegotiationClient;
