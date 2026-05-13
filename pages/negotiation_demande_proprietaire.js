import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiArrowLeft } from "react-icons/hi2";

const NegotiationProprietaire = () => {
  const [negotiations, setNegotiations] = useState([]);
  const [proprietaireID, setProprietaireID] = useState([]);
  const [proprietaireNom, setProprietaireNom] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [ClientID, setClientID] = useState([]);
  const [NegotiationID, setNegotiationID] = useState([]);
  const [bienid, setBienid] = useState([]);
  const [isRDVSet, setIsRDVSet] = useState(false); // Add state for checking if RDV is set
  const [index, setIndex] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchNegotiations = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = jwt.decode(token);
      const proprietaireID = decodedToken.id;
      console.log('proprietaire id', proprietaireID);
      if (proprietaireID) {
        try {
          const response = await fetch(`/api/api_voir_negotiation_demande_proprietaire?proprietaireID=${proprietaireID}`);
          const data = await response.json();
          setNegotiations(data.negotiations);
          setBienid(data.negotiation.biens.id_biens);
          console.log("bien id " ,bienid);
          setProprietaireID(proprietaireID);
          setProprietaireNom(decodedToken.nom);
         
        } catch (error) {
          console.error('Failed to fetch negotiations:', error);
        }
      } else {
        console.error('Invalid negotiation object:', proprietaireID);
      }
    };

    fetchNegotiations();
  }, []);



  const handleAnnuler = (id) => {
    // Logic for handling 'Annuler' button click
  };
  const handleValider = async (negotiation) => {
    console.log(negotiation);
    try {
      if (!negotiation) {
        throw new Error('Invalid negotiation:', negotiation);
      }
  
      const bienId = negotiation.biens ? negotiation.biens.id_biens : null;
      console.log("bien id ", bienId);
  
      if (!bienId) {
        throw new Error('Invalid bien_id:', bienId);
      }
  
      // Create a new biens_loue entry
      const response = await fetch('/api/api_valider_negotiation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiationId: negotiation.id_negotiation,
          biensData: {
            id_client: negotiation.client_id,
            description : negotiation.description,
           

          },
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to validate negotiation');
      }
  
      const data = await response.json();
      // Optional: Add additional logic or display a success message here
  
      // Show a toast notification for success
      toast.success('Negotiation validated successfully');
    } catch (error) {
      console.error('Failed to validate negotiation:', error);
      // Optional: Handle the error or display an error message here
      // Show a toast notification for error
      toast.error('Failed to validate negotiation');
    }
  };
  
  const handleBackClick = () => {
    router.push('/panel');
  };
  
  const handleContacter = (negotiation) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    const proprietaireID = decodedToken.id;
    const clientID = negotiation.client_id;
    const negotiationID = negotiation.id_negotiation;
  
    console.log("this is negotiation object", negotiation);
    console.log("negotiation id", negotiationID);
    console.log("proprietaire id", proprietaireID);
    console.log("client id", clientID);
  
    if (proprietaireID && clientID && negotiationID) {
      router.push(`/Chat_proprietaire?clientId=${clientID}&proprietaireId=${proprietaireID}&negotiationId=${negotiationID}`);
    } else {
      console.error('Invalid negotiation object:', negotiation);
    }
  };
  const handleProposerRendezvous = (negotiationId,index) => {
    // Handle Proposer Rendezvous button click
    setShowDatePicker(negotiationId);
    setIndex(index);

  };
  
  const handleSubmit = async (negotiation, index) => {
    if (!selectedDate) {
      console.error('Date not selected');
      return;
    }
  
    setShowDatePicker(false);
  
    try {
      console.log('selectedDate',selectedDate);
      console.log('negotiation inside handel submit',negotiation);
      console.log('index',index);

      await handleRdv(selectedDate, negotiation, index);
  
      // Call handleRdv with the selected date, negotiation, and index
      // Optional: Add additional logic or display a success message here
    } catch (error) {
      console.error('Failed to create RDV:', error);
      // Optional: Handle the error or display an error message here
    }
  };
  

  const handleNegotiationChange = (event) => {
    setNegotiation(event.target.value);
  };

  const handleIndexChange = (event) => {
    setIndex(event.target.value);
  };
  useEffect(() => {
    // Check if the RDV is set based on selectedDate
    setIsRDVSet(!!selectedDate);
  }, [selectedDate]);
  
  const handleRdv = async (selectedDate, negotiation, index) => {
    if (!negotiation || index < 0 || index >= negotiation.length) {
      console.error('Invalid negotiation object or index:', negotiation, index);
      return;
    }
  
    console.log('index', index);
  
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    const proprietaireID = decodedToken.id;
  
    const N_ID = negotiation.id_negotiation;
    console.log('negotiation id', N_ID);
  
    const C_id = negotiation.client_id;
    console.log('client id', C_id);
  
    const rdvData = {
      date: selectedDate,
      id_client: C_id,
      negotiationID: N_ID,
      proprietaireID: proprietaireID,
    };
  
    try {
      const response = await fetch('/api/api_create_rdv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rdvData),
      });
  
      if (response.ok) {
        toast.success('Rdv created!');
      }
  
      if (!response.ok) {
        throw new Error('Failed to create RDV');
      }
    } catch (error) {
      console.error('Failed to create RDV:', error);
      throw error;
    }
  };
  
  
  

  
  const handleDatePickerChange = (event) => {
    setSelectedDate(event.target.value);
  };
  

  const handleBackToClientHousesClick = () => {
    router.push('/panel');
  };

  const handleBackToProprietaireHousesClick = () => {
    router.push('/panel');
  };
  
 return (
  <div className="bg-white text-black min-h-screen">
  <Header />

  <div className="container mx-auto px-4 py-8">
    <div className="flex justify-start mb-4">
    <button
        onClick={handleBackClick}
        className="text-white text-xl bg-gradient-to-r bg-neutral-800 hover:bg-gradient-to-bl font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2"
      >
        <HiArrowLeft />
      </button>
    </div>
    <h1 className="text-2xl font-bold mb-4">
      Négociations pour le proprietaire: {proprietaireNom}
    </h1>
    {negotiations && negotiations.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {negotiations.map((negotiation, index) => (
          <div
            key={negotiation.id_negotiation}
            className="bg-gray-100 p-4 rounded-lg shadow-md  transition-shadow duration-300"
          >
            {/* Display negotiation details */}
            <p className="font-bold text-lg">
              Négociation ID: {negotiation.id_negotiation}
            </p>
            {/* Display additional negotiation details */}
            <p className="text-sm">Prix Proposé: {negotiation.prix_propose}</p>
            <p className="text-sm">Durée: {negotiation.duree}</p>
            <p className="text-sm">Statut: {negotiation.statut}</p>

            {/* Display biens information */}
            <p className="text-sm">Type de bien: {negotiation.biens?.type_bien}</p>

            {/* Display Proprietaire information */}
            <p className="text-sm">Nom du propriétaire: {negotiation.Proprietaire?.nom}</p>

            {/* Buttons */}
            <div>
            <div className="flex place-content-center mt-5">
              <div className="flex  flex-col place-content-center">
                <div className='flex place-content-center space-x-3 ml-3'>
                <button
                  onClick={() => handleValider(negotiation)}
                  className="inline-block rounded border border-neutral-400 bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
                >
                  Valider
                </button>
                <button
                  onClick={() => handleContacter(negotiation)}
                  className="inline-block rounded border border-neutral-400 bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
                >
                  Contacter
                </button>
                </div>
                <div className='flex flex-col '>
                <button
                  onClick={() => handleAnnuler(negotiation.id_negotiation)}
                  className="inline-block rounded bg-neutral-800 mt-3 ml-3 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
                >
                  Annuler
                </button>
              <ToastContainer />
              <button
                onClick={() => handleProposerRendezvous(negotiation.id_negotiation,index)}
                className="inline-block rounded bg-neutral-800 mt-3 ml-3 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
              >
                Proposer un rendez-vous
              </button>
              </div>
              </div>
            </div>

              {showDatePicker === negotiation.id_negotiation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-4 rounded-md">
                    <h2 className="text-xl font-bold mb-4">Choisissez une date</h2>
                    <input
                      type="date"
                      className="border-gray-300 border p-2 mb-4"
                      value={selectedDate}
                      onChange={handleDatePickerChange}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSubmit(negotiation, index)}
                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Valider
                      </button>

                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>Aucune négociation trouvée pour le propriétaire.</p>
    )}
  </div>

  <Footer />
</div>

  

  
  )};
  

export default NegotiationProprietaire;
 