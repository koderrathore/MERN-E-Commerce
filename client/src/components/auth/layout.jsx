import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Hyperspeed from '../Hyperspeed'

const AuthLayout = () => {
  const location = useLocation()
  return (
    <div className='relative w-screen h-screen flex flex-col md:flex-row overflow-hidden justify-center'>
      <div className='w-full h-full bg-black'>  
      <Hyperspeed/>
      </div>
      {/* <div className='absolute left-0 w-full h-1/5 flex flex-col bg-transparent item-center justify-center items-center sm:flex sm:justify-center sm:items-center sm:flex-col text-white md:w-1/2 md:h-screen lg:text-8xl text-center'>
      <div className='text-3xl'>
      {
        location.pathname.includes('/auth/login')?"Welcome Again":"Welcome to E-commerce Shooping"
      }
      </div>
      <div className='hidden md:flex-col'>

      </div>
      </div> */}
      <div className='absolute right-[50%] top-[-50%] translate-x-[50%] translate-y-[50%] w-full h-screen justify-center items-center flex md:w-1/2 md:h-screen text-white'>
        <Outlet/>
      </div>
    </div>
  )
}

export default AuthLayout
