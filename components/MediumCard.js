import React from 'react'
import Image from 'next/image'

function MediumCard({ img, title }) {
  return (
    <div className='relative cursor-pointer rounded-xl hover:bg-slate-600 
    transform transition duration-300 ease-out group'>
      <div className='relative h-80 w-80'>
        <Image src={img} fill className='group-hover:opacity-25 rounded-xl object-cover' alt={title} />
      </div>
      <h3 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0  
      group-hover:opacity-100 text-2xl mt-3 transform transition duration-300 ease-out'>
        {title}
      </h3>
    </div>
  )
}

export default MediumCard