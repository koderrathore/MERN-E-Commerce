import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppingHeader from './Header'

const ShoppingLayout = () => {
  return (
    <div className='w-[100%] h-screen flex flex-col overflow-x-hidden'>
      <div>
        <ShoppingHeader/>
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default ShoppingLayout
