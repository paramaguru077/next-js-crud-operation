import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import Image from 'next/image'
  import{Eye,Pencil,Trash2} from 'lucide-react';
import { Button } from '@/components/ui/button';
  
const UserTable = ({users,handleDelete,handleEdit,handleView}) => {
  console.log(users);
  return (
    
        <Table className='border rounded-xl border-neutral-400 text-sm'>
          
          <TableHeader className='bg-gray-100 text-left' >
            <TableRow>
              <TableHead className="w-[100px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead >Status</TableHead>
              <TableHead className='text-right' >Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              users.map(user=>(
                <TableRow className='' key={user.id}>
                  <TableCell className="font-medium">
                    <Image src={user.avatar} alt={user.first_name} width={40} height={40} className='rounded-full'/>
                  </TableCell>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right "><p className='bg-neutral-200 rounded-3xl p-1 text-center md:w-[50px]'>{user.status}</p></TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button size="icon" variant="ghost" className='hover:bg-neutral-100 rounded-full' onClick={()=>handleView(user)}>
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button size="icon" variant="ghost" className='hover:bg-neutral-100 rounded-full' onClick={()=>handleEdit(user)}>
                      <Pencil className='h-4 w-4'/>
                    </Button>
                    <Button size="icon" variant="ghost" className='hover:bg-neutral-100 rounded-full' onClick={()=>handleDelete(user.id)}>
                      <Trash2 className='h-4 w-4 text-red-600'/>
                    </Button>
                  

                  </TableCell>
            </TableRow>
              ))
            }
          </TableBody>
        </Table>

  )
}

export default UserTable