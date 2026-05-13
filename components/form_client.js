import { useState } from "react";
import { useRouter } from 'next/router';


function FormClient({ onSubmit }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [mdps, setMdps] = useState("");
  const [signupCompleted, setSignupCompleted] = useState(false);

  const [date_naissance, setDateNaissance] = useState();

  const [sexe, setSexe] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // Convert the string date to a DateTime object
    const formattedDate = date_naissance ? new Date(date_naissance) : null;

    onSubmit(nom, prenom, email, telephone, mdps, formattedDate, sexe);
  }

  function validateTelephone(value) {
    const onlyNumbers = /^[0-9]+$/;
    return onlyNumbers.test(value);
  }

  function validateEmail(value) {
    // Regular expression for email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(value);
  }

  return (
    <form
      id="form"
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-center bg-white bg-opacity-80 p-9 rounded shadow-md"
    >
      <div className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Nom :
          </label>
          <input
            className="block border rounded py-2 px-3 text-gray-700 leading-tight 
            focus:outline-none focus:shadow-outline w-full"
            id="nom"
            type="nom"
            placeholder="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Prenom :
          </label>
          <input
            className="block border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
            id="prenom"
            type="prenom"
            placeholder="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Email :
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              const { value } = e.target;
              setEmail(value);
              setErrorMessage(
                validateEmail(value) ? "" : "Please enter a valid email address"
              );
            }}
            required
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            N° Telephone: 
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="telephone"
            type="tel"
            placeholder="Enter your telephone number"
            value={telephone}
            onChange={(e) => {
              const { value } = e.target;
              if (validateTelephone(value)) {
                setTelephone(value);
              }
            }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Mot de pass :
          </label>
          <input
            className="block border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
            id="mdps"
            type="password"
            placeholder="Entrer votre mot de pass"
            value={mdps}
            onChange={(e) => setMdps(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
            Date De Naissance :
          </label>
          <input
            type="date"
            id="date_naissance"
            name="date_naissance"
            className="border-gray-400 text-black placeholder:text-gray-700 border-2 rounded-lg w-full px-4 py-2 mt-2"
            value={date_naissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Sex :
          </label>
          <select
            id="sexe"
            value={sexe}
            onChange={(e) => setSexe(e.target.value)}
            className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
          >
            <option value="H">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>

        <div className="flex items-center justify-between px-20 ">
          <button
            className="w-full inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
            type="submit"
          >
            Inscrire
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormClient;
