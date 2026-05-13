import Image from "next/image";
import { useRouter } from "next/router";
import BgLogin from "../components/bg_login";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

function SignUp() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [mdps, setMdps] = useState('');
  const [dateN, setDateN] = useState('');
  const [sexe, setSexe] = useState('');
  const [dateI, setDateI] = useState('');
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {         
      nom,              
      prenom,          
      email,            
      telephone,        
      mdps,             
      dateN,
      dateI,
      sexe       
    };
    setDateI(Date.now)
    console.log(formData);
    // Submit logic here
  };

  return (
   <div>
   <div className="flex flex-col min-h-screen">
  <Header />
  <BgLogin />
  <form
    onSubmit={handleSubmit}
    className="max-w-sm mx-auto bg-center cursor-pointer bg-slate-50 transition transform duration-100 ease-out 
    p-6 rounded shadow-md flex flex-col justify-center"
  >
    <div className="mb-4">
      <label htmlFor="nom" className="block text-gray-700 font-bold mb-2">
        nom  
      </label>
      <input
        type="text"
        id="nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="prenom" className="block text-gray-700 font-bold mb-2">
      Prenom 
      </label>
      <input
        type="text"
        id="prenom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
      email 
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="telephone" className="block text-gray-700 font-bold mb-2">
      Telephone 
      </label>
      <input
        type="text"
        id="telephone"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="mdps" className="block text-gray-700 font-bold mb-2">
      Mot de pass 
      </label>
      <input
        type="password"
        id="mdps"
        value={mdps}
        onChange={(e) => setMdps(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="date de naissance" className="block text-gray-700 font-bold mb-2">
      Date de naissance 
      </label>
      <input
        type="date"
        id="dateN"
        value={dateN}
        onChange={(e) => setDateN(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="sexe" className="block text-gray-700 font-bold mb-2">
      Sexe
      </label>
      <select
        id="sexe"
        value={sexe}
        onChange={(e) => setSexe(e.target.value)}
        className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      >
        <option value="H">Homme</option>
        <option value="F">Famme</option>
      </select>
    </div>
    
        
      
    
    <div className="flex justify-center">
    <button
          className="pl-5 text-red-500 bg-white border border-red-100 px-10 py-2 font-mono shadow-md rounded-full font-bold my-4 hover:shadow-2xl active:scale-90 transition duration-150"
          onClick={() => router.push({
            pathname : "/",
            query: {
              client : "online"
            }
          })}
        >
          Inscrire
        </button>
    </div>
  </form>
</div>
<Footer/>

</div>

  );
}

export default SignUp;
