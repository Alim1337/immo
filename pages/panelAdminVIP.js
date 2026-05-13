import React from 'react'
import { HiOutlineHome } from "react-icons/hi2";
import { HiUser } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { FaSketch } from "react-icons/fa";
import { useRouter } from 'next/router';

function PanelAdminVIP() {
  const menus = [
    { title: 'Gérer les bien', icon: HiOutlineHome,button: true},
    { title: 'Gérer les cliens', icon: HiUser, button1 : true},
    { title: 'Gérer les demande VIP', icon: FaSketch, button2 : true},
  ];

  const router = useRouter();

  const handleGestionBien = () => {
    router.push('/panelAdmin');
  };
  const handleGestionClient = () => {
    router.push('/panelAdminClient');
  };
  const handleGestionVIP = () => {
    router.push('/panelAdminVIP');
  };

  return (
    <div className='bg-slate-100'>
      <div className='flex flex-row'>
        <div className='h-auto min-h-screen w-72 relative bg-neutral-800'>
          <ul className={`gap-x-4 space-y-3 px-5 pt-6 origin-left text-left items-center font-medium text-xl duration-300`}>
              {menus.map((menu, index) => (
              <li
                key={index}
                className={`rounded text-gray hover:border bg-red-500 bg-opacity-0 hover:bg-opacity-70 
                border-opacity-70  border-red-500 active:scale-95 text-s flex items-center
                gap-x-4 cursor-pointer p-2 transition transform duration-300 ease-out`}
              >
              {menu.button ? (
                <button className="flex items-center gap-x-2" onClick={handleGestionBien}>
                  {React.createElement(menu.icon, { className: 'text-white' })}
                  <span className={`text-white transition transform`}>
                    {menu.title}
                  </span>
                </button>
                ): null}
              {menu.button1 && (
                <button className="flex items-center gap-x-2" onClick={handleGestionClient}>
                  {React.createElement(menu.icon, { className: 'text-white' })}
                  <span className={`text-white transition transform`}>
                    {menu.title}
                  </span>
                </button>
              )}
              {menu.button2 && (
                <button className="flex items-center gap-x-2" onClick={handleGestionVIP}>
                  {React.createElement(menu.icon, { className: 'text-white' })}
                  <span className={`text-white transition transform`}>
                    {menu.title}
                  </span>
                </button>
              )}
              {!menu.button && !menu.button1 && !menu.button2 && (<button className='flex items-center gap-x-2'>
                    {React.createElement(menu.icon, { className: 'text-white' })}
                    <span className={`text-white transition transform`}>
                      {menu.title}
                    </span>
                  </button>)}
              </li>
            ))}
            </ul>
        </div>
        <div className='container mx-auto '>
          <div className='text-black'>
            <div className='flex flex-row w-auto items-center justify-between'>
              <p className='ml-8 mt-5 text-2xl mb-0 font-semibold'>Gérer les demande VIP :</p>
              <button className='mt-8 inline-block mr-5 rounded border border-neutral-400 bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]'>
                Deconnecter</button>
            </div>
            <p className='ml-8 text-md mb-5'>*nombre de demande : n°</p>
            <div className='mb-5 divide-y rounded-lg mx-6 h-screen flex flex-col border-4 bg-white border-neutral-400'> 
                <div className=' w-full h-8 grid grid-cols-4 divide-x-2 text-center'>
                  <p>ID</p>
                  <p>Nom</p>
                  <p>Email</p>
                  <p>ACTION</p>
                </div>
                <div className='w-full h-8 grid grid-cols-4 divide-x-2 text-center'>
                  <p className='my-1'>no VIP request yet</p>
                  <p></p>
                  <p></p>
                  <div className='flex place-content-center mr-5 py-1'>
                    <button className='inline-block rounded border border-neutral-400 bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]'>
                      ACCEPTER
                    </button>
                    <button className='inline-block w-fit ml-5 rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]'>
                      REFUSER
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelAdminVIP
