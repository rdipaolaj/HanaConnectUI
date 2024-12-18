'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastProvider, ToastViewport, Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { getTransactionsPerHourUrl, getTransactionTrendUrl, getSecurityAuditUrl } from '@/utils/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Componente Toaster personalizado
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
  const [auditLoading, setAuditLoading] = useState(false)
  const [anomalies, setAnomalies] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const rolId = localStorage.getItem('rolId')
    const jwtToken = localStorage.getItem('jwtToken')

    if (userId && rolId && jwtToken) {
      fetchSecurityData(userId, rolId, jwtToken)
    } else {
      console.error('Información de usuario no encontrada en localStorage')
      toast({
        title: "Error",
        description: "Información de usuario no encontrada. Por favor, inicie sesión nuevamente.",
        variant: "destructive",
      })
    }
  }, [])

  const fetchSecurityData = async (userId: string, rolId: string, jwtToken: string) => {
    try {
      console.log('Iniciando fetchSecurityData con userId:', userId, 'rolId:', rolId)
      const [hourlyResponse, trendResponse] = await Promise.all([
        axios.get<ApiResponse<{ hourlyTransactions: HourlyTransaction[], dailyPercentageChange: number }>>(getTransactionsPerHourUrl(userId, rolId), {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        }),
        axios.get<ApiResponse<{ trendData: TrendData[], percentage: number }>>(getTransactionTrendUrl(userId, rolId), {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        })
      ])

      console.log('Datos de transacciones por hora recibidos:', hourlyResponse.data)
      console.log('Datos de tendencia de transacciones recibidos:', trendResponse.data)

      const processedHourlyData = hourlyResponse.data.data.hourlyTransactions.map(item => ({
        ...item,
        hour: item.hour,
        transactionCount: Number(item.transactionCount)
      }))
      console.log('Datos de transacciones por hora procesados:', processedHourlyData)
      setHourlyData(processedHourlyData)

      const processedTrendData = trendResponse.data.data.trendData.map(item => ({
        ...item,
        key: new Date(item.key).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit'
        }),
        value: Number(item.value)
      }))
      console.log('Datos de tendencia de transacciones procesados:', processedTrendData)
      setTrendData(processedTrendData)

      const detectedAnomalies = detectAnomalies(processedHourlyData, processedTrendData)
      console.log('Anomalías detectadas:', detectedAnomalies)
      setAnomalies(detectedAnomalies)

      if (detectedAnomalies.length > 0) {
        toast({
          title: "Alerta de Seguridad",
          description: `Se detectaron ${detectedAnomalies.length} anomalía${detectedAnomalies.length > 1 ? 's' : ''} en las transacciones recientes.`,
          variant: "default",
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
    console.log('Iniciando detección de anomalías con datos:', { hourlyData, trendData })
    const anomalies: string[] = []

    if (hourlyData.length > 0) {
      const nonZeroTransactions = hourlyData.filter(hour => hour.transactionCount > 0)
      console.log('Transacciones no nulas:', nonZeroTransactions)
      if (nonZeroTransactions.length > 0) {
        const avgTransactions = nonZeroTransactions.reduce((sum, hour) => sum + hour.transactionCount, 0) / nonZeroTransactions.length
        const threshold = avgTransactions * 5 // Aumentamos significativamente el umbral
        console.log('Promedio de transacciones:', avgTransactions, 'Umbral:', threshold)

        hourlyData.forEach(hour => {
          if (hour.transactionCount > threshold && hour.transactionCount > 1000) { // Aumentamos el mínimo a 1000
            anomalies.push(`Pico inusual de transacciones a las ${hour.hour}:00 (${hour.transactionCount} transacciones)`)
          }
        })
      }
    }

    if (trendData.length > 1) {
      for (let i = 1; i < trendData.length; i++) {
        const prevValue = trendData[i - 1].value
        const currentValue = trendData[i].value
        if (prevValue > 0) {
          const change = (currentValue - prevValue) / prevValue
          console.log(`Cambio en tendencia: de ${prevValue} a ${currentValue}, cambio: ${change}`)
          if (Math.abs(change) > 1 && Math.abs(currentValue - prevValue) > 1000) { // Aumentamos los umbrales
            anomalies.push(`Cambio brusco en la tendencia de transacciones el ${trendData[i].key} (${(change * 100).toFixed(2)}%)`)
          }
        }
      }
    }

    console.log('Anomalías detectadas:', anomalies)
    return anomalies
  }

  const runSecurityAudit = async () => {
    try {
      setAuditLoading(true)
      const userId = localStorage.getItem('userId')
      const rolId = localStorage.getItem('rolId')
      const jwtToken = localStorage.getItem('jwtToken')
      
      if (userId && rolId && jwtToken) {
        console.log('Iniciando auditoría de seguridad para userId:', userId, 'rolId:', rolId)
        const auditUrl = getSecurityAuditUrl()
        const response = await axios.post<ApiResponse<{ excelFileData: string }>>(
          auditUrl,
          null,
          {
            headers: { 'Authorization': `Bearer ${jwtToken}` },
            params: { userId, roleId: rolId },
            responseType: 'json'
          }
        )

        console.log('Respuesta de auditoría recibida:', response.data)

        if (response.data.success && response.data.data.excelFileData) {
          const byteCharacters = atob(response.data.data.excelFileData)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'auditoria_seguridad.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          console.log('Archivo de auditoría generado y descargado')
          toast({
            title: "Auditoría de Seguridad",
            description: "La auditoría de seguridad se ha completado y descargado correctamente.",
            variant: "default",
          })
        } else {
          throw new Error("No se pudo generar el archivo de auditoría")
        }
      }
    } catch (error) {
      console.error('Error running security audit:', error)
      toast({
        title: "Error",
        description: "No se pudo completar la auditoría de seguridad.",
        variant: "destructive",
      })
    } finally {
      setAuditLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <Icons.spinner className="h-8 w-8 animate-spin" />
    </div>
  }

  // Asegurarse de que hourlyData tenga 24 entradas, una para cada hora
  const completeHourlyData = Array.from({ length: 24 }, (_, i) => {
    const existingData = hourlyData.find(item => item.hour === i)
    return existingData || { hour: i, transactionCount: 0, hourlyChange: 0 }
  })

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
                <BarChart data={completeHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: '#fff' }} 
                    tickFormatter={(value) => `${value}:00`} 
                    stroke="#fff"
                  />
                  <YAxis tick={{ fill: '#fff' }} stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                    formatter={(value, name, props) => [value, `${props.payload.hour}:00`]}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Bar dataKey="transactionCount" fill="#3b82f6" name="Transacciones" radius={[4, 4, 0, 0]} />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="key" tick={{ fill: '#fff' }} stroke="#fff" />
                  <YAxis tick={{ fill: '#fff' }} stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Transacciones" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      {anomalies.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Anomalías Detectadas</CardTitle>
              <CardDescription>
                Se han detectado las siguientes anomalías en las transacciones recientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {anomalies.map((anomaly, index) => (
                  <li key={index} className="text-yellow-500">{anomaly}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Auditoría de Seguridad DLT</CardTitle>
            <CardDescription>
              Ejecute una auditoría completa del sistema de seguridad DLT y descargue el informe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runSecurityAudit} disabled={auditLoading}>
              {auditLoading ? <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Generando auditoría...
                </>
                : "Iniciar Auditoría de Seguridad"
              }
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}