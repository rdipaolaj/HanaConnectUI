'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { BarChart4, CheckCircle, XCircle, CalendarDays } from 'lucide-react'
import { getTotalTransactionsUrl, getSuccessErrorRatioUrl, getMonthlyComparisonUrl } from '@/utils/api'

interface HomeStats {
    totalTransactions: number
    totalTransactionsPercentage: number
    successCount: number
    errorCount: number
    successPercentage: number
    currentMonthTransactions: number
    monthlyPercentageChange: number
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<HomeStats | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
      const userId = localStorage.getItem('userId')
      const rolId = localStorage.getItem('rolId')
      const jwtToken = localStorage.getItem('jwtToken')

      if (!userId || !rolId || !jwtToken) {
          router.push('/login')
      } else {
          fetchHomeStats(userId, rolId, jwtToken)
      }
  }, [router])

  const fetchHomeStats = async (userId: string, rolId: string, jwtToken: string) => {
      try {
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
          console.error('Error al obtener las estadísticas del home:', error)
          toast({
              title: "Error",
              description: "No se pudieron cargar las estadísticas del home.",
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
              <div className="mt-8">
                  <Card>
                      <CardHeader>
                          <CardTitle>Resumen del Sistema DLT</CardTitle>
                          <CardDescription>
                              Información general sobre la implementación de DLT en nuestro sistema bancario
                          </CardDescription>
                      </CardHeader>
                      <CardContent>
                          <p>
                              Nuestro sistema de seguridad basado en Tecnologías de Ledger Distribuido (DLT) 
                              ha demostrado una mejora significativa en la protección contra fraudes y ataques 
                              cibernéticos. La arquitectura descentralizada garantiza la integridad y 
                              transparencia de todas las transacciones bancarias.
                          </p>
                          <ul className="list-disc pl-5 mt-4 space-y-2">
                              <li>Transacciones verificadas por múltiples nodos en la red DLT</li>
                              <li>Registros inmutables que previenen la manipulación de datos</li>
                              <li>Encriptación de extremo a extremo para todas las transacciones</li>
                              <li>Auditoría en tiempo real de todas las actividades del sistema</li>
                          </ul>
                      </CardContent>
                  </Card>
              </div>
          </ToastProvider>
      </AdminLayout>
  )
}