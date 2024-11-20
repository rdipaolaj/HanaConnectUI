'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import axios from 'axios'
import { BarChart4, CheckCircle, XCircle, CalendarDays } from 'lucide-react'
import { getTotalTransactionsUrl, getSuccessErrorRatioUrl, getMonthlyComparisonUrl } from '@/utils/api'

interface DashboardStats {
    totalTransactions: number
    totalTransactionsPercentage: number
    successCount: number
    errorCount: number
    successPercentage: number
    currentMonthTransactions: number
    monthlyPercentageChange: number
}

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const { toast } = useToast()

    const fetchDashboardStats = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userId')
            const rolId = localStorage.getItem('rolId')
            const jwtToken = localStorage.getItem('jwtToken')

            if (!userId || !rolId || !jwtToken) {
                throw new Error('Información de usuario no encontrada')
            }

            const [totalTransactions, successErrorRatio, monthlyComparison] = await Promise.all([
                axios.get(getTotalTransactionsUrl(userId, rolId), {
                    headers: { 'Authorization': `Bearer ${jwtToken}` }
                }),
                axios.get(getSuccessErrorRatioUrl(userId, rolId), {
                    headers: { 'Authorization': `Bearer ${jwtToken}` }
                }),
                axios.get(getMonthlyComparisonUrl(userId, rolId), {
                    headers: { 'Authorization': `Bearer ${jwtToken}` }
                })
            ])

            setStats({
                totalTransactions: totalTransactions.data.data.total,
                totalTransactionsPercentage: totalTransactions.data.data.percentage,
                successCount: successErrorRatio.data.data.successCount,
                errorCount: successErrorRatio.data.data.errorCount,
                successPercentage: successErrorRatio.data.data.successPercentage,
                currentMonthTransactions: monthlyComparison.data.data.currentMonthTransactionCount,
                monthlyPercentageChange: monthlyComparison.data.data.percentageChange
            })
        } catch (error) {
            console.error('Error al obtener las estadísticas del dashboard:', error)
            toast({
                title: "Error",
                description: "No se pudieron cargar las estadísticas del dashboard.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchDashboardStats()
    }, [fetchDashboardStats])

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
    }

    return (
        <AdminLayout>
            <ToastProvider>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
                            <BarChart4 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalTransactions ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.totalTransactionsPercentage && stats.totalTransactionsPercentage > 0 ? '+' : ''}
                                {stats?.totalTransactionsPercentage?.toFixed(2) ?? '0.00'}% desde el último mes
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transacciones Exitosas</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.successCount ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.successPercentage?.toFixed(2) ?? '0.00'}% del total
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transacciones Fallidas</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.errorCount ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {((100 - (stats?.successPercentage ?? 0))).toFixed(2)}% del total
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transacciones Este Mes</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.currentMonthTransactions ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.monthlyPercentageChange && stats.monthlyPercentageChange > 0 ? '+' : ''}
                                {stats?.monthlyPercentageChange?.toFixed(2) ?? '0.00'}% desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </ToastProvider>
        </AdminLayout>
    )
}