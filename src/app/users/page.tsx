'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToastProvider, ToastViewport, Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { getUsersUrl } from '@/utils/api'

// Custom Toaster component
const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <div className="font-medium">{title}</div>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

interface User {
    userId: string
    username: string
    email: string
    phoneNumber: string
    roleId: string
    roleName: string
    companyName: string
    department: string
    jobTitle: string
    createdAt: string
    lastLogin: string
    accountStatus: string
}

interface ApiResponse {
    success: boolean
    statusCode: number
    message: string
    data: User[]
    transactionId: string
    timestamp: string
    errors: string[]
    metadata: Record<string, unknown>
}

export default function Users() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const { toast } = useToast()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const userId = localStorage.getItem('userId')
            const jwtToken = localStorage.getItem('jwtToken')

            if (!userId || !jwtToken) {
                throw new Error('Información de usuario no encontrada')
            }

            const response = await axios.get<ApiResponse>(getUsersUrl(), {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            })

            if (response.data.success && response.data.statusCode === 200) {
                // Filtrar el usuario actual
                const filteredUsers = response.data.data.filter(user => user.userId !== userId)
                setUsers(filteredUsers)
            } else {
                throw new Error(response.data.message || 'Error al obtener los usuarios')
            }
        } catch (error) {
            console.error('Error al obtener los usuarios:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar los usuarios.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
    }

    return (
        <AdminLayout>
            <Toaster />
            <Card>
                <CardHeader>
                    <CardTitle>Usuarios del Sistema</CardTitle>
                    <CardDescription>Lista de usuarios registrados en el sistema DLT</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Empresa</TableHead>
                                <TableHead>Departamento</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.companyName}</TableCell>
                                    <TableCell>{user.department}</TableCell>
                                    <TableCell>{user.jobTitle}</TableCell>
                                    <TableCell>{user.accountStatus === 'A' ? 'Activo' : 'Inactivo'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    )
}