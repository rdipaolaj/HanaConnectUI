'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import axios, { AxiosError } from 'axios'
import { getTransactionTestUrl } from '@/utils/api'

const TestPage = () => {
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userBankTransactionId, setUserBankTransactionId] = useState('')
  const [tag, setTag] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')
  const { toast } = useToast()

  const testUrl = getTransactionTestUrl()

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserBankTransactionId(storedUserId)
    }
  }, [])

  const runTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await axios.post(testUrl, {
        userBankTransactionId,
        tag,
        transactionData: {
          amount: parseFloat(amount),
          currency
        }
      })

      setTestResult(JSON.stringify(response.data, null, 2))

      toast({
        title: "Prueba completada",
        description: "La prueba se ejecutó correctamente",
        variant: "default",
        className: "bg-green-100 text-green-800",
      })
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      setTestResult(errorMessage)
      toast({
        title: "Error",
        description: "No se pudo completar la prueba",
        variant: "destructive",
        className: "bg-red-100 text-red-800",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <ToastProvider>
        <div className="p-6">
          <Card className="mb-4 bg-[#0F172A] border-[#1E293B]">
            <CardHeader>
              <CardTitle className="text-white">Prueba de API de Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    URL de prueba
                  </label>
                  <Input
                    type="text"
                    value={testUrl}
                    readOnly
                    className="w-full bg-[#1E293B] border-[#2D3B4E] text-white opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    ID de Transacción del Banco
                  </label>
                  <Input
                    type="text"
                    value={userBankTransactionId}
                    readOnly
                    className="w-full bg-[#1E293B] border-[#2D3B4E] text-white opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Etiqueta
                  </label>
                  <Input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Ej: bank-transacciones"
                    className="w-full bg-[#1E293B] border-[#2D3B4E] text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Monto
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ej: 4000"
                    className="w-full bg-[#1E293B] border-[#2D3B4E] text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Moneda
                  </label>
                  <Input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="Ej: USD"
                    className="w-full bg-[#1E293B] border-[#2D3B4E] text-white placeholder:text-gray-400"
                  />
                </div>
                <Button 
                  onClick={runTest} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2"
                >
                  {isLoading ? (
                    <>
                      <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando prueba...
                    </>
                  ) : (
                    'Ejecutar Prueba'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          {testResult && (
            <Card className="bg-[#0F172A] border-[#1E293B]">
              <CardHeader>
                <CardTitle className="text-white">Resultado de la Prueba</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={testResult}
                  readOnly
                  className="w-full h-64 font-mono text-sm bg-[#1E293B] border-[#2D3B4E] text-white"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </ToastProvider>
    </AdminLayout>
  )
}

export default TestPage