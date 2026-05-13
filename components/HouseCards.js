import React from 'react'
import Image from 'next/image';
import {FiSettings} from 'react-icons/fi';
function HouseCards({img, location}) {
  return (
    <div className='flex bg-slate-400 items-center gap-x-1 bg-opacity-20 m-2  mt-4 space-x-4 rounded-xl cursor-pointer
     hover:bg-gray-400 hover:scale-110
      transition transform duration-300 ease-out'>
      <div className='relative h-16 w-16'>
        <Image src={img} layout='fill' className='rounded-lg' />
      </div>
      <div >
        <h2>{location}</h2>
      </div>
    </div>
  )
}

export default HouseCards