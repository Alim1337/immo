import React, { useState } from 'react';
import jwt from 'jsonwebtoken';

function FormNegotiation({ onSubmit }) {
  const [prixPropose, setPrixPropose] = useState('');
  const [duree, setDuree] = useState('');
  const [commentaire, setCommentaire] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let decodedToken = null; // Declare decodedToken variable with default value

  const handleGoBack = () => {
    router.back();
  };

  if (token) {
    decodedToken = jwt.decode(token);
    try {
      console.log("Decoded token:", decodedToken);
      console.log("Decoded client:", decodedToken.id);
    } catch (error) {
      console.error('Failed to verify JWT token:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let clientId = decodedToken.id;
  
      // Prepare the form data
      const formData = {
        prixPropose,
        duree,
        commentaire,
        token,
        client_id: clientId,
      };
  
      console.log(formData); // Review the formData in the console
  
      // Call the onSubmit function provided by the parent component
      onSubmit(formData);
  
      // Reset the form fields
      setPrixPropose('');
      setDuree('');
      setCommentaire('');
    } catch (error) {
      console.error('Failed to verify JWT token:', error);
    }
  };

  return (
    <div className="max-w-sm mx-auto border-2 border-gray-300 rounded-lg shadow-md">
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label htmlFor="prixPropose" className="block font-bold text-black">
          Prix Proposé pour le mois (DA):
        </label>
        <input
          type="number"
          id="prixPropose"
          value={prixPropose}
          onChange={(e) => setPrixPropose(e.target.value)}
          className="border text-black border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="duree" className="block font-bold text-black">
          Durée:
        </label>
        <select
      type="text"
      id="duree"
      value={duree}
      onChange={(e) => setDuree(e.target.value)}
      className="border border-gray-300 text-bl text-black px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
    >
      <option value="1 mois ">1 mois </option>
      <option value="2 mois ">2 mois </option>
      <option value="3 mois ">3 mois </option>
      <option value="4 mois ">4 mois </option>
      <option value="5 mois ">5 mois </option>
      <option value="6 mois ">6 mois </option>
      <option value="7 mois ">7 mois </option>
      <option value="8 mois ">8 mois </option>
      <option value="9 mois ">9 mois </option>
      <option value="10 mois">10 mois</option>
      <option value="11 mois">11 mois</option>
      <option value="1 ans  ">1 ans  </option>
      <option value="2 ans  ">2 ans  </option>
    </select>
      </div>
      <div className="mb-4">
        <label htmlFor="commentaire" className="block font-bold text-black">
          Commentaire:
        </label>
        <textarea
          id="commentaire"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          className="border text-black font-medium border-gray-300 px-4 py-2 rounded-lg w-full 
        focus:outline-none focus:border-blue-500 hover:border-blue-500 hover:shadow-md"
        ></textarea>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="inline-block w-full border border-neutral-600 rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
        >
          Submit
        </button>
        
          <button
            className="inline-block w-full rounded ml-5 bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
            onClick={handleGoBack}
          >
          Annuler
          </button>
        
      </div>
    </form>
  </div>
  


  );
}

export default FormNegotiation;
