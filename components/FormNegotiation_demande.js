import React, { useState } from 'react';
import jwt from 'jsonwebtoken';

function FormNegotiationDemande({ onSubmit }) {
  const [prixPropose, setPrixPropose] = useState('');
  const [duree, setDuree] = useState('');
  const [commentaire, setCommentaire] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let decodedToken = null; // Declare decodedToken variable with default value

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
      let proprietaire_id = decodedToken.id;
  
      // Prepare the form data
      const formData = {
        prixPropose,
        duree,
        commentaire,
        token,
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
<form onSubmit={handleSubmit} className="max-w-sm mx-auto">
  <div className="mb-4 text-black">
    <label htmlFor="prixPropose" className="block font-bold text-black">
      Prix Proposé:
    </label>
    <input
      type="number"
      id="prixPropose"
      value={prixPropose}
      onChange={(e) => setPrixPropose(e.target.value)}
      className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
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
  <div className="mb-4 font-bold text-black">
    <label htmlFor="commentaire" className="block text-gray-700">
      Commentaire:
    </label>
    <textarea
      id="commentaire"
      value={commentaire}
      onChange={(e) => setCommentaire(e.target.value)}
      className="border border-gray-300 px-4 py-2 font-normal rounded-lg w-full focus:outline-none focus:border-blue-500"
    ></textarea>
  </div>
  <button
    type="submit"
    className="inline-block w-full rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
  >
    Envoyer
  </button>
</form>

  );
}

export default FormNegotiationDemande;
