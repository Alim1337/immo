import React from 'react';

const Demande_client_card_show = ({
  demandeClient,
  cardIndex,
  handleModifier,
  handleSupprimer,
  handleIntereser,
}) => {
  const {
    id_demande_client,
    type_bien,
    type_transaction,
    prix_minimum,
    prix_maximum,
    surface_minimum,
    nbr_chambre_minimum,
    date_debut_recherche,
    statut_demande,
  } = demandeClient;
  

    return (
    <div className="bg-white rounded-lg font-mono shadow-md font-medium my-2 mx-1 
    p-6 mb-4">
      <h2 className="block text-lg text-gray-700 font-bold mb-2 pt-2">Demande Client {cardIndex}:</h2>
      <ul className="list-disc ml-6">
        {demandeClient.map((demande, index) => (
          <div key={index} className="mb-4">
            {/* Display the relevant data from the demande object */}
            <p className="mb-2">
              <span className="block text-lg text-gray-700 font-bold mb-2 pt-2">Type de bien:</span><p className='block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full text-sm'>{demande.type_bien || ''}</p> 
            </p>
            <p className="mb-2">
              <span className="block text-lg text-gray-700 font-bold mb-2 pt-2">Type de transaction:</span> <p className='block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full text-sm'>{demande.type_de_transaction || ''}</p> 
            </p>
            <p className="mb-2">
              <span className="block text-lg text-gray-700 font-bold mb-2 pt-2">Prix maximum:</span> <p className='block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full text-sm'>{demande.prix_maximum || ''}</p> 
            </p>
            <p className="mb-2">
              <span className="block text-lg text-gray-700 font-bold mb-2 pt-2">Surface minimum:</span><p className='block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full text-sm'> {demande.surface_minimum || ''}</p> 
            </p>
            <p className="mb-2">
              <span className="block text-lg text-gray-700 font-bold mb-2 pt-2">Nombre de chambres minimum:</span><p className='block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full text-sm'> {demande.nbr_chambre_minimum || ''}</p> 
            </p>
            <p className="mb-2">
              <span className="block text-lg text-gray-700 font-bold mb-2 pt-2">Date de début de recherche:</span><p className='block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full text-sm'> {demande.date_debut_rechercher}</p> 
            </p>
            <p className="mb-2">
              <span className="block text-lg text-gray-700 font-bold mb-2 pt-2">Date de fin de recherche:</span><p className='block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full text-sm'> {demande.date_fin_rechercher || ''}</p> 
            </p>
            <p className="mb-2">
              <span className="block text-lg text-gray-700 font-bold mb-2 pt-2">Statut de la demande:</span><p className='block border rounded py-2 px-3 text-gray-700 leading-tight 
                        focus:outline-none focus:shadow-outline w-full text-sm'> {demande.statut_demande || ''}</p> 
            </p>
            <button
              className="w-full inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
              onClick={() => handleIntereser(demande.id_demande_client)}
            >
              négocier
            </button>
            <div className="flex items-center space-x-4"></div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Demande_client_card_show;
