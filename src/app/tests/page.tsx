'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

const TestPage = () => {
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testUrl, setTestUrl] = useState('https://api-dev.hanaconnect.com/test')
  const { toast } = useToast()

  const runTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Resultado aleatorio de la prueba
      const success = Math.random() > 0.5
      const result = success ? "La prueba fue exitosa" : "La prueba falló"
      setTestResult(result)

      toast({
        title: "Resultado de la prueba",
        description: result,
        variant: success ? "default" : "destructive",
        className: success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
      })
    } catch (error) {
      setTestResult("Error al ejecutar la prueba")
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
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Prueba de API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="testUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  URL de prueba
                </label>
                <Input
                  id="testUrl"
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="Ingrese la URL de prueba"
                  className="w-full"
                />
              </div>
              <Button onClick={runTest} disabled={isLoading}>
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
          <Card className={`${testResult.includes('exitosa') ? 'bg-green-100' : 'bg-red-100'} text-gray-800`}>
            <CardContent className="p-4">
              <p className="font-semibold">{testResult}</p>
              <p className="mt-2">URL probada: {testUrl}</p>
            </CardContent>
          </Card>
        )}
      </ToastProvider>
    </AdminLayout>
  )
}

export default TestPage