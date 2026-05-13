import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiOutlineHome, HiUser, HiOutlineCog } from "react-icons/hi";
import { FiPlus }from "react-icons/fi";
import { FaSketch} from  "react-icons/fa";

function Sidebar() {
    const menus = [
        { title: 'Dashboard', icon: HiOutlineHome },
        { title: 'Gestion de profil', icon: HiUser, button1:true}, /* hawlik sbab lmachakil 3ndou function fi ligne 48 ou render fi ligne 187, glhf :) */
        { title: 'Support', icon: FiPlus },
        { title: 'Devenir VIP', icon: FaSketch, button: true},
        { title: 'Paramètre', icon: HiOutlineCog }
    ];
    const [open, setOpen] = useState(true);
    const [showVIPWindow, setShowVIPWindow] = useState(false);
    const [showConfirmationWindow, setShowConfirmationWindow] = useState(false); // New state variable
    const router = useRouter();

  const handleModifierBien = () => {
    router.push('/gestionBien_modify');
  };
  const handleModifierProfil= () => {
    router.push('/Gestion_Profile_Proprietaire');
  };

  return (
    <div>
      
    </div>
  )
}

export default Sidebar
