'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [transactionStats, setTransactionStats] = useState({ total: 0, secure: 0 })
  const [securityMetrics, setSecurityMetrics] = useState({ fraudAttempts: 0, successRate: 0 })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    const jwtToken = localStorage.getItem('jwtToken')

    if (!storedUsername || !jwtToken) {
      router.push('/login')
    } else {
      setUsername(storedUsername)
      setApiUrl(`https://api.bancoseguro.pe/users/${storedUsername}`)
      fetchDashboardData()
    }
  }, [router])

  const fetchDashboardData = async () => {
    try {
      // Simulated API calls
      const transactionResponse = await axios.get(`${apiUrl}/transactions/stats`)
      const securityResponse = await axios.get(`${apiUrl}/security/metrics`)

      setTransactionStats(transactionResponse.data)
      setSecurityMetrics(securityResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "No se pudo cargar los datos del dashboard.",
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
              <CardTitle className="text-sm font-medium">
                Total Transacciones
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactionStats.total}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transacciones Seguras
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactionStats.secure}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Intentos de Fraude</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityMetrics.fraudAttempts}</div>
              <p className="text-xs text-muted-foreground">
                -19% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Éxito de Seguridad
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityMetrics.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                +201 puntos base desde el último mes
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