import { SignIn } from '@clerk/clerk-react'

const AuthLogin = () => {
  return (
    <div className='flex justify-center items-center h-dvh overflow-y-hidden'>
      <SignIn signUpUrl='/auth/register'/>
    </div>
  )
}

export default AuthLogin
