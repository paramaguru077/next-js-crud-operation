"use client"
import React, { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import UserTable from '@/compontents/UserTable'
import image from '../../images/dummy.jpg'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userFormSchema, UserFormValues } from '../../schema/Formdata'
type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  status: 'active' | 'inactive'
  avatar: string
}
const Page = () => {
  const [users, setUser] = useState<User[]>([])
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [open, setOpen] = useState<boolean>(false)
  const [editingUser, setEditing] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      status: 'active',
    }
  })

  useEffect(() => {
    fetchUsers()
  }, [page])

  useEffect(() => {
    if (editingUser) {
      reset({
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
        status: editingUser.status,
      })
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        status: 'active',
      })
    }
  }, [editingUser, reset])

  const fetchUsers = async () => {
    try {
      const data:User[] = await getUsers(page)
      const usersDataStatus = data.map(user => ({
        ...user,
        status: Math.random() > 0.5 ? 'active' : 'inactive'
      }))
      setUser(usersDataStatus)
    } catch (e) {
      console.log(e)
    }
  }

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || user.status === statusFilter)
  )

  const onSubmit = async (formData: UserFormValues) => {
    if (editingUser) {
      const updated = await updateUser(editingUser.id, {
        ...formData,
        avatar: editingUser.avatar || image.src
      })
      if (updated) {
        const updatedUsers = users.map(user =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
        setUser(updatedUsers)
      }
      setEditing(null)
    } else {
      const res = await createUser({
        ...formData,
        avatar: image.src
      })
      if (res) {
        setUser([res, ...users])
      } else {
        alert("API call failed. User not created.")
      }
    }

    reset()
    setOpen(false)
  }

  const handleEdit = (user:User) => {
    setEditing(user)
    setOpen(true)
  }

  const handleDelete = (userId:number) => {
    setDeletingUserId(userId)
    setDeleteDialogOpen(true)
  }

  const handleView = (user:User) => {
    setViewingUser(user)
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between p-1 mb-4'>
        <h1 className='font-bold tracking-wide text-2xl ml-5'>User Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>{editingUser ? "Edit User" : "Add User"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 mt-4'>
              <div className='flex flex-col space-y-1.5'>
                <label>First Name</label>
                <input type="text" {...register("first_name")} className='p-2 border border-neutral-300 focus:ring-1 outline-none' />
                {errors.first_name && <p className='text-red-500 text-sm'>{errors.first_name.message}</p>}
              </div>
              <div className='flex flex-col space-y-1.5'>
                <label>Last Name</label>
                <input type="text" {...register("last_name")} className='p-2 border border-neutral-300 focus:ring-1 outline-none' />
                {errors.last_name && <p className='text-red-500 text-sm'>{errors.last_name.message}</p>}
              </div>
              <div className='flex flex-col space-y-1.5'>
                <label>Email</label>
                <input type="text" {...register("email")} className='p-2 border border-neutral-300 focus:ring-1 outline-none' />
                {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
              </div>
              <Select onValueChange={(value) => reset((prev) => ({ ...prev, status: value }))} defaultValue="active">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter className='mt-3'>
                <Button type="submit">{editingUser ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter/Search Bar */}
      <div className='p-2 mb-5 flex gap-4 relative w-[70%] z-30'>
        <Input placeholder='Search users...' value={search} onChange={(e) => setSearch(e.target.value)} className='relative pl-9' />
        <Search className='absolute top-3 ml-2' />
        <div className='relative z-30'>
          <Select onValueChange={(value) => setStatusFilter(value)} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className='bg-amber-100 border border-neutral-300'>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <UserTable users={filteredUsers} handleEdit={handleEdit} handleDelete={handleDelete} handleView={handleView} />

      {/* Pagination */}
      <div className='flex justify-between items-center mt-5'>
        <Button disabled={page === 1} variant="outline" className='cursor-pointer' onClick={() => setPage(page - 1)}>Previous</Button>
        <p>Page {page}</p>
        <Button onClick={() => setPage(page + 1)} disabled={page === 2} variant="outline" className='cursor-pointer'>Next</Button>
      </div>

      {/* View User Modal */}
      {
        viewingUser && (
          <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              <div className='flex flex-col '>
                <div className='flex justify-center'>
                  <Image src={viewingUser.avatar} className='rounded-full' width={150} height={150} alt='name' />
                </div>
                <div className='flex flex-col space-y-2.5'>
                  <h1 className='font-bold'>Name</h1>
                  <p>{viewingUser.first_name} {viewingUser.last_name}</p>
                </div>
                <div className='flex flex-col space-y-2.5'>
                  <h1 className='font-bold'>Email</h1>
                  <p>{viewingUser.email}</p>
                </div>
                <div className='flex flex-col space-y-2.5'>
                  <h1 className='font-bold'>Status</h1>
                  <p>{viewingUser.status}</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setViewingUser(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this user?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="ghost" className='border bg-red-400' onClick={async () => {
              const success = await deleteUser(deletingUserId)
              if (success) {
                setUser(users.filter((user) => user.id !== deletingUserId))
                setDeleteDialogOpen(false)
                setDeletingUserId(null)
              } else {
                alert("Failed to delete")
              }
            }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page
