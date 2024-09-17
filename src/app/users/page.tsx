'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'

interface User {
    id: string
    username: string
    email: string
    role: string
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
            // Simular una llamada a la API
            await new Promise(resolve => setTimeout(resolve, 1000))
            const mockUsers: User[] = [
                { id: '1', username: 'admin', email: 'admin@example.com', role: 'Administrador' },
                { id: '2', username: 'user1', email: 'user1@example.com', role: 'Usuario' },
                { id: '3', username: 'user2', email: 'user2@example.com', role: 'Usuario' },
            ]
            setUsers(mockUsers)
        } catch (error) {
            console.error('Error fetching users:', error)
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
            <ToastProvider>
                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios del Sistema</CardTitle>
                        <CardDescription>Lista de usuarios registrados en el sistema DLT</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rol</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </ToastProvider>
        </AdminLayout>
    )
}