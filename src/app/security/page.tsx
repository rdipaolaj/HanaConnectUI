'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'

interface SecurityMetrics {
  fraudAttempts: number
  successRate: number
  averageResponseTime: number
  activeSecurityAlerts: number
}

export default function Security() {
  const [loading, setLoading] = useState(true)
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [apiUrl, setApiUrl] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setApiUrl(`https://api.bancoseguro.pe/users/${storedUsername}`)
      fetchSecurityMetrics()
    }
  }, [])

  const fetchSecurityMetrics = async () => {
    try {
      // Simulated API call
      // In a real scenario, this would be fetched from your DLT backend
      const response = await axios.get(`${apiUrl}/security/metrics`)
      setSecurityMetrics(response.data)
    } catch (error) {
      console.error('Error fetching security metrics:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las métricas de seguridad.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const runSecurityAudit = async () => {
    try {
      setLoading(true)
      // Simulated API call
      await axios.post(`${apiUrl}/security/audit`)
      toast({
        title: "Auditoría de Seguridad",
        description: "La auditoría de seguridad se ha iniciado correctamente.",
      })
      await fetchSecurityMetrics()
    } catch (error) {
      console.error('Error running security audit:', error)
      toast({
        title: "Error",
        description: "No se pudo iniciar la auditoría de seguridad.",
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
                Intentos de Fraude
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
              <div className="text-2xl font-bold">{securityMetrics?.fraudAttempts}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Éxito
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
              <div className="text-2xl font-bold">{securityMetrics?.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                +1.2% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Respuesta Promedio</CardTitle>
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
              <div className="text-2xl font-bold">{securityMetrics?.averageResponseTime} ms</div>
              <p className="text-xs text-muted-foreground">
                -15ms desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alertas de Seguridad Activas
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
              <div className="text-2xl font-bold">{securityMetrics?.activeSecurityAlerts}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde el último mes
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Auditoría de Seguridad DLT</CardTitle>
              <CardDescription>
                Ejecute una auditoría completa del sistema de seguridad DLT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runSecurityAudit} disabled={loading}>
                {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                Iniciar Auditoría de Seguridad
              </Button>
            </CardContent>
          </Card>
        </div>
      </ToastProvider>
    </AdminLayout>
  )
}