import Image from 'next/image';

function DemandeClientLike({ id_biens, description, type_bien, adresse, ville, code_postal, prix_estime, etat, Proprietaire }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-out transform hover:scale-105 hover:shadow-lg">
      <div className="relative h-32 w-full mb-4">
        <Image src="https://www.designferia.com/sites/default/files/styles/article_images__s640_/public/field/image/petit-appartement-amenage.jpg?itok=GapSYMo3" alt="Property Image" layout="fill" objectFit="cover" className="rounded-lg" />
      </div>
      <h3 className="text-lg font-bold mb-2">ID: {id_biens}</h3>
      <p className="text-sm mb-2">Description: {description}</p>
      <p className="text-sm mb-2">Type: {type_bien}</p>
      <p className="text-sm mb-2">Address: {adresse}</p>
      <p className="text-sm mb-2">City: {ville}</p>
      <p className="text-sm mb-2">Postal Code: {code_postal && code_postal.join(', ')}</p>
      <p className="text-sm mb-2">Estimated Price: {prix_estime}</p>
      <p className="text-sm mb-2">State: {etat}</p>
      <p className="text-sm mb-2">Owner: {Proprietaire && Proprietaire.nom}</p>

      {/* Buttons */}
      <div className="flex justify-end mt-4">
        <button   className='text-red-500 bg-white px-8 py-4 font-mono
        shadow-md rounded-full font-bold my-3
        hover:shadow-2xl active:scale-90
        transition duration-150
        '>I like this</button>
      </div>
    </div>
  );
}

export default DemandeClientLike;
