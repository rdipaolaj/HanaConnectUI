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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { getTransactionUrl } from '@/utils/api'

interface Transaction {
    id: string
    userBankTransactionId: string
    transactionDate: string
    status: number
    blockId: string
    transactionData: string
    storageUrl: string
}

export default function Transactions() {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortColumn, setSortColumn] = useState<keyof Transaction>('transactionDate')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const { toast } = useToast()

    useEffect(() => {
        fetchTransactions()
    }, [])

    useEffect(() => {
        const filtered = transactions.filter(transaction =>
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.blockId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (transaction.storageUrl && transaction.storageUrl.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        setFilteredTransactions(filtered)
        setTotalPages(Math.ceil(filtered.length / pageSize))
        setCurrentPage(1)
    }, [searchTerm, transactions, pageSize])

    const fetchTransactions = async () => {
        try {
            const userId = localStorage.getItem('userId')
            const rolId = localStorage.getItem('rolId')
            const jwtToken = localStorage.getItem('jwtToken')

            if (!userId || !rolId || !jwtToken) {
                throw new Error('User information not found')
            }

            const response = await axios.get(getTransactionUrl(userId, rolId),
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                }
            )

            if (response.data.success && response.data.statusCode === 200) {
                setTransactions(response.data.data)
                setFilteredTransactions(response.data.data)
                setTotalPages(Math.ceil(response.data.data.length / pageSize))
            } else {
                throw new Error(response.data.message || 'Failed to fetch transactions')
            }
        } catch (error) {
            console.error('Error fetching transactions:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar las transacciones.",
                variant: "destructive",
            })
            setTransactions([])
            setFilteredTransactions([])
        } finally {
            setLoading(false)
        }
    }

    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return 'Pendiente'
            case 1: return 'Completado'
            case 2: return 'Confirmado'
            case 3: return 'Fallido'
            default: return 'Desconocido'
        }
    }

    const handleSort = (column: keyof Transaction) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
        return 0
    })

    const paginatedTransactions = sortedTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const SortIcon = ({ column }: { column: keyof Transaction }) => {
        if (column !== sortColumn) return <ChevronsUpDown className="ml-2 h-4 w-4" />
        return sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
    }

    const getFileNameFromUrl = (url: string) => {
        if (!url) return ''
        const parts = url.split('/')
        return parts[parts.length - 1]
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
                        <div className="flex justify-between items-center mb-4">
                            <Input
                                placeholder="Buscar transacciones..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccionar tamaño de página" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 por página</SelectItem>
                                    <SelectItem value="10">10 por página</SelectItem>
                                    <SelectItem value="20">20 por página</SelectItem>
                                    <SelectItem value="50">50 por página</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {paginatedTransactions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                                            ID <SortIcon column="id" />
                                        </TableHead>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('storageUrl')}>
                                            Archivo <SortIcon column="storageUrl" />
                                        </TableHead>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('transactionDate')}>
                                            Fecha <SortIcon column="transactionDate" />
                                        </TableHead>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                                            Estado <SortIcon column="status" />
                                        </TableHead>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('blockId')}>
                                            Block ID <SortIcon column="blockId" />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{transaction.id}</TableCell>
                                            <TableCell>
                                                {transaction.storageUrl ? (
                                                    <a 
                                                        href={transaction.storageUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-blue-600 hover:underline flex items-center"
                                                    >
                                                        <Icons.download className="mr-2 h-4 w-4" />
                                                        {getFileNameFromUrl(transaction.storageUrl)}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500">No disponible</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{new Date(transaction.transactionDate).toLocaleString()}</TableCell>
                                            <TableCell>{getStatusText(transaction.status)}</TableCell>
                                            <TableCell className="font-mono text-xs">{transaction.blockId}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-4">
                                No hay transacciones disponibles.
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                Mostrando {paginatedTransactions.length} de {filteredTransactions.length} transacciones
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ToastProvider>
        </AdminLayout>
    )
}