'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastProvider, ToastViewport, Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { getTransactionsPerHourUrl, getTransactionTrendUrl } from '@/utils/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

interface HourlyTransaction {
  hour: number
  transactionCount: number
  hourlyChange: number
}

interface TrendData {
  key: string
  value: number
}

interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  transactionId: string
  timestamp: string
  errors: string[]
  metadata: Record<string, unknown>
}

export default function Security() {
  const [loading, setLoading] = useState(true)
  const [hourlyData, setHourlyData] = useState<HourlyTransaction[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const rolId = localStorage.getItem('rolId')
    const jwtToken = localStorage.getItem('jwtToken')

    console.log("userId:", userId, "rolId:", rolId, "jwtToken:", jwtToken);

    if (userId && rolId && jwtToken) {
      fetchSecurityData(userId, rolId, jwtToken)
    } else {
      toast({
        title: "Error",
        description: "Información de usuario no encontrada. Por favor, inicie sesión nuevamente.",
        variant: "destructive",
      })
    }
  }, [])

  const fetchSecurityData = async (userId: string, rolId: string, jwtToken: string) => {
    console.log("Fetching security data...");
    try {
      const [hourlyResponse, trendResponse] = await Promise.all([
        axios.get<ApiResponse<{ hourlyTransactions: HourlyTransaction[], dailyPercentageChange: number }>>(getTransactionsPerHourUrl(userId, rolId), {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        }),
        axios.get<ApiResponse<{ trendData: TrendData[], percentage: number }>>(getTransactionTrendUrl(userId, rolId), {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        })
      ])
      console.log("Hourly Response:", hourlyResponse.data);
      console.log("Trend Response:", trendResponse.data);

      const processedHourlyData = hourlyResponse.data.data.hourlyTransactions.map(item => ({
        ...item,
        hour: item.hour,
        transactionCount: Number(item.transactionCount)
      }))
      setHourlyData(processedHourlyData)

      const processedTrendData = trendResponse.data.data.trendData.map(item => ({
        ...item,
        key: new Date(item.key).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit'
        }),
        value: Number(item.value)
      }))
      setTrendData(processedTrendData)

      const anomalies = detectAnomalies(processedHourlyData, processedTrendData)
      if (anomalies.length > 0) {
        toast({
          title: "Alerta de Seguridad",
          description: `Se detectaron ${anomalies.length} anomalías en las transacciones recientes.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching security data:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de seguridad.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const detectAnomalies = (hourlyData: HourlyTransaction[], trendData: TrendData[]): string[] => {
    const anomalies: string[] = []

    console.log("Hourly Data:", hourlyData);
    console.log("Trend Data:", trendData);

    const avgTransactions = hourlyData.reduce((sum, hour) => sum + hour.transactionCount, 0) / hourlyData.length
    hourlyData.forEach(hour => {
      if (hour.transactionCount > avgTransactions * 2) {
        anomalies.push(`Pico inusual de transacciones a las ${hour.hour}`)
      }
    })

    for (let i = 1; i < trendData.length; i++) {
      const change = (trendData[i].value - trendData[i - 1].value) / trendData[i - 1].value
      if (Math.abs(change) > 0.5) {
        anomalies.push(`Cambio brusco en la tendencia de transacciones el ${trendData[i].key}`)
      }
    }

    return anomalies
  }

  const runSecurityAudit = async () => {
    try {
      setLoading(true)
      toast({
        title: "Auditoría de Seguridad",
        description: "La auditoría de seguridad se ha iniciado correctamente.",
      })
      const userId = localStorage.getItem('userId')
      const rolId = localStorage.getItem('rolId')
      const jwtToken = localStorage.getItem('jwtToken')
      if (userId && rolId && jwtToken) {
        await fetchSecurityData(userId, rolId, jwtToken)
      }
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
      <Toaster />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="bg-[#020817]">
          <CardHeader>
            <CardTitle className="text-white">Transacciones por Hora</CardTitle>
            <CardDescription className="text-gray-400">
              Distribución de transacciones en las últimas 24 horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: '#fff' }}
                    tickFormatter={(value) => `${value}:00`}
                    stroke="#fff"
                  />
                  <YAxis
                    tick={{ fill: '#fff' }}
                    stroke="#fff"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#fff' }}
                  />
                  <Bar
                    dataKey="transactionCount"
                    fill="#3b82f6"
                    name="Transacciones"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#020817]">
          <CardHeader>
            <CardTitle className="text-white">Tendencia de Transacciones</CardTitle>
            <CardDescription className="text-gray-400">
              Tendencia de transacciones en los últimos días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="key"
                    tick={{ fill: '#fff' }}
                    stroke="#fff"
                  />
                  <YAxis
                    tick={{ fill: '#fff' }}
                    stroke="#fff"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    name="Transacciones"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
    </AdminLayout>
  )
}