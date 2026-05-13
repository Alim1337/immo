import React from 'react'
import Link from 'next/link'
import Image from "next/image";
import { RxSketchLogo , RxDashboard ,RxPerson } from 'react-icons/rx';
import {FiSettings } from 'react-icons/fi'
import {HiOutlineShoppingBag} from 'react-icons/hi'
const Sidebar = ({children}) => {
    return (
      <div className='fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between ml-0'
      style={{position: 'fixed', left: 0, top: 0, bottom: 0}}>
        <div className='flex flex-col items-center'>
          <Link href='/'>
            <div className='bg-red-300 cursor-pointer hover:bg-red-600 text-white
            p-3 rounded-lg inline-block'>
              <RxSketchLogo size={30} />
            </div>
          </Link>
          <span className='border-b-[1px] border-gray-200 w-full p-2'></span>
          <Link href='/'>
            <div className='bg-red-300 my-4 cursor-pointer hover:bg-red-600 text-white
            p-3 rounded-lg inline-block'>
              <RxDashboard size={30} />
            </div>
          </Link>
          <Link href='/'>
            <div className='bg-red-300 my-4 cursor-pointer hover:bg-red-600 text-white
            p-3 rounded-lg inline-block'>
              <RxPerson size={30} />
            </div>
          </Link>
          <Link href='/'>
            <div className='bg-red-300 my-4 cursor-pointer hover:bg-red-600 text-white
            p-3 rounded-lg inline-block'>
              <HiOutlineShoppingBag size={30} />
            </div>
          </Link>
          <Link href='/'>
            <div className='bg-red-300 my-4 cursor-pointer hover:bg-red-600 text-white
            p-3 rounded-lg inline-block'>
              <FiSettings size={30} />
            </div>
          </Link>
        </div>
        <main className='bg-white'>{children}</main>
      </div>
    )
  }
  
  export default Sidebar
  