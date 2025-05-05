import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
const page = () => {
  return (
    <div className='flex justify-center items-center h-screen flex-col space-y-3'>
      <h1 className='text-xl font-bold tracking-wide'>Manage Crud Application</h1>
      <Link href='/post'><Button variant="default" size="lg" >Click Here</Button></Link>
    </div>
  )
}

export default page