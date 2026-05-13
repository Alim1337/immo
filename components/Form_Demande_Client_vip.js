import React, { useState } from 'react';

const Form_Demande_Client_vip = ({ onSubmit }) => {
  const [type_bien, setType_bien] = useState('');
  const [prix_minimum, setPrixMinimum] = useState('');
  const [prix_maximum, setPrixMaximum] = useState('');
  const [surface_minimum, setSurfaceMinimum] = useState('');
  const [nbr_chambre_minimum, setNbrChambreMinimum] = useState('');
  const [date_debut_rechercher, setDateDebutRechercher] = useState(new Date().toISOString().slice(0, 10));
  const [date_fin_recherche, setDateFinRecherche] = useState('');
  const [type_location_vip, setType_location_vip] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(
      type_bien,
      prix_minimum,
      prix_maximum,
      surface_minimum,
      nbr_chambre_minimum,
      date_debut_rechercher,
      type_location_vip,
    );
  }

  return (
    <div className=" max-w-md mx-auto bg-white rounded p-6">
      <form id="form" onSubmit={handleSubmit}>
      <div className="mt-1">
                      <select
                        id="typeLocation"
                        name="typeLocation"
                        required
                        className="block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full"
                        value={type_location_vip}
                        onChange={(e) => setType_location_vip(e.target.value)}
                      >
                        <option >Select type de location</option>
                        <option value="evenement">évenement</option>
                        <option value="vacances">vacances</option>
                        <option value="courte durée">courte durée</option>
                      </select>
                    </div>
        <div className="mb-4">
          <label htmlFor="type_bien" className="block font-medium mb-2">
            Type de bien
          </label>
          <select
            id="type_bien"
            value={type_bien}
            onChange={(e) => setType_bien(e.target.value)}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full"
          >
            <option value="">-- Choisissez --</option>
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="prix_maximum" className="block font-medium mb-2">
            Prix maximum
          </label>
          <input
            type="number"
            id="prix_maximum"
            value={prix_maximum}
            onChange={(e) => setPrixMaximum(e.target.value)}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="surface_minimum" className="block font-medium mb-2">
            Surface minimum (optionnel)
          </label>
          <input
            type="number"
            id="surface_minimum"
            value={surface_minimum}
            onChange={(e) => setSurfaceMinimum(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nbr_chambre_minimum" className="block font-medium mb-2">
            Nombre de chambres minimum
          </label>
          <select
            id="nbr_chambre_minimum"
            value={nbr_chambre_minimum}
            onChange={(e) => setNbrChambreMinimum(e.target.value)}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full"
          >
            <option value="">-- Choisissez --</option>
            <option value="F1">F1</option>
            <option value="F2">F2</option>
            <option value="F3">F3</option>
            <option value="F4">F4</option>
            <option value="F5">F5</option>
            <option value="F6">F6</option>
            <option value="F7">F7</option>
            <option value="F8">F8</option>
            <option value="F9">F9</option>
            <option value="F10">F10</option>
            <option value="F11">F11</option>
            <option value="F12">F12</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="date_fin_recherche" className="block font-medium mb-2">
            Date de fin de recherche (optionnel)
          </label>
          <input
            type="date"
            id="date_fin_recherche"
            value={date_fin_recherche}
            onChange={(e) => setDateFinRecherche(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <button type="submit" className="inline-block w-full rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]">
          Postuler
        </button>
      </form>
    </div>
  );
};

export default Form_Demande_Client_vip;
