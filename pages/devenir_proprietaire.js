import { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/router";
import BgLogin from "../components/bg_login";
import Footer from "@/components/Footer";
import Header_signup from "@/components/Header_signup";


function DevenirProprietaireForm() {
  const [description, setDescription] = useState('');
  const [typeBien, setTypeBien] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [etat, setEtat] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      nom: '',
      prenom: '',
      email: '',
      ville: '',
      telephone: '',
      mdps: '',
      date_naissance: '',
      sex: '',
      date_dinscription: ''
    };
    console.log(formData);
  
    // Insert new record using Prisma
    const newProprietaire = await prisma.proprietaire.create({
      data: {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        ville: formData.ville,
        telephone: formData.telephone,
        mdps: formData.mdps,
        date_naissance: formData.date_naissance,
        sex: formData.sex,
        date_dinscription: formData.date_dinscription
      }
    });
  
    console.log(newProprietaire);
  };

  return (
   <div>
   <div className="flex flex-col min-h-screen">
  <Header_signup />
  <BgLogin />
  <form
    onSubmit={handleSubmit}
    className="max-w-sm mx-auto bg-center cursor-pointer hover:bg-transparent transition transform duration-100 ease-out bg-transparent p-6 rounded shadow-md flex flex-col justify-center"
  >
    <div className="mb-4">
      <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
        Description <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="type_bien" className="block text-gray-700 font-bold mb-2">
        Type de bien <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="type_bien"
        value={typeBien}
        onChange={(e) => setTypeBien(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="adresse" className="block text-gray-700 font-bold mb-2">
        Adresse<span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="adresse"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="ville" className="block text-gray-700 font-bold mb-2">
        Ville<span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="ville"
        value={ville}
        onChange={(e) => setVille(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="etat" className="block text-gray-700 font-bold mb-2">
        État<span className="text-red-500">*</span>
      </label>
      <select
        id="etat"
        value={etat}
        onChange={(e) => setEtat(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      >
        <option value="">Choisir un état</option>
        <option value="neuf">Neuf</option>
        <option value="bon etat">Bon état</option>
        <option value="a renover">À rénover</option>
        <option value="a demolir">À démolir</option>
      </select>
    </div>
    <div className="flex justify-center">
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Envoyer
      </button>
    </div>
  </form>
</div>
<Footer/>

</div>

  );
}

export default DevenirProprietaireForm;
