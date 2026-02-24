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
      <div className='absolute right-[50%] top-[-50%] translate-x-[50%] translate-y-[50%] w-full h-screen justify-center items-center flex md:w-1/2 md:h-screen text-white'>
        <Outlet/>
      </div>
    </div>
  )
}

export default AuthLayout
