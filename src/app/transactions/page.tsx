'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'

interface Transaction {
    id: string
    amount: number
    fromAccount: string
    toAccount: string
    timestamp: string
    status: 'completed' | 'pending' | 'failed'
}

export default function Transactions() {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [apiUrl, setApiUrl] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) {
            setApiUrl(`https://api.bancoseguro.pe/users/${storedUsername}`)
            fetchTransactions()
        }
    }, [])

    const fetchTransactions = async () => {
        try {
            // Datos de ejemplo para desarrollo
            const mockTransactions: Transaction[] = [
                { id: '1', amount: 1000, fromAccount: '123456', toAccount: '789012', timestamp: '2024-09-01T12:00:00Z', status: 'completed' },
                { id: '2', amount: 500, fromAccount: '789012', toAccount: '345678', timestamp: '2024-09-01T13:30:00Z', status: 'pending' },
                { id: '3', amount: 750, fromAccount: '345678', toAccount: '123456', timestamp: '2024-09-01T14:45:00Z', status: 'completed' },
            ];

            setTransactions(mockTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar las transacciones.",
                variant: "destructive",
            })
            // Si hay un error, establece transactions como un array vacío
            setTransactions([])
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
                        <CardTitle>Transacciones Recientes</CardTitle>
                        <CardDescription>
                            Lista de las últimas transacciones procesadas por el sistema DLT
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {transactions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Monto</TableHead>
                                        <TableHead>De</TableHead>
                                        <TableHead>Para</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{transaction.id}</TableCell>
                                            <TableCell>S/. {transaction.amount.toFixed(2)}</TableCell>
                                            <TableCell>{transaction.fromAccount}</TableCell>
                                            <TableCell>{transaction.toAccount}</TableCell>
                                            <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                                            <TableCell>{transaction.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-4">
                                No hay transacciones disponibles.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </ToastProvider>
        </AdminLayout>
    )
}