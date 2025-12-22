import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { authLogOut } from '/store/authSlice'
import { useToast } from '@/hooks/use-toast'

const AdminHeader = ({setOpen}) => {
  const dispatch = useDispatch()
  const {toast} = useToast()
  const handleLogOut = ()=>{
    dispatch(authLogOut()).then((data)=>{
      if(data){
        console.log(data)
        toast({
          title:data.payload.data?.message
        })
      }
    }).catch((err)=>console.log(err))
  }
  return (
    <div className='flex justify-between px-4 py-2'> 
      <Button onClick={()=>{
        setOpen(true)
      }} className="lg:hidden sm:block">
        <AlignJustify/>
      </Button>
      <div className='flex justify-end flex-1 items-center'>
        <Button onClick={handleLogOut} className=" font-semibold text-sm shadow-xl">
        <LogOut/>
            LogOut
        </Button>
      </div>
    </div>
  )
}

export default AdminHeader
