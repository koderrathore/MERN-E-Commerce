import { SignUp } from '@clerk/clerk-react'
import React from 'react'

const AuthRegister = () => {
  return (
    <div className='flex justify-center items-center h-dvh'>
      <SignUp signInUrl='/auth/login'/>

    </div>
  )
}

export default AuthRegister
