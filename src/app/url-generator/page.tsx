'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { getNodeInfoUrl } from '@/utils/api'

interface User {
  id: string;
  name: string;
  bank: string;
}

const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const generateUniqueUrl = (bank: string, uniqueId: string) => {
  return `https://api.${bank.toLowerCase().replace(/\s+/g, '')}.com/user/${uniqueId}`;
}

const mockUsers: User[] = [
  { id: '1', name: 'Juan Pérez', bank: 'Banco de Crédito' },
  { id: '2', name: 'María García', bank: 'BBVA' },
  { id: '3', name: 'Carlos López', bank: 'Interbank' },
];

async function checkServiceHealth() {
  try {
    const response = await fetch(getNodeInfoUrl());
    const data = await response.json();
    return {
      isHealthy: data.success && data.data.isHealthy,
      version: data.data.version,
      networkName: data.data.networkName,
    };
  } catch (error) {
    console.error('Error checking service health:', error);
    return { isHealthy: false, version: 'Unknown', networkName: 'Unknown' };
  }
}

const UrlGeneratorPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [serviceHealth, setServiceHealth] = useState<{ isHealthy: boolean, version: string, networkName: string } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchServiceHealth = async () => {
      const health = await checkServiceHealth();
      setServiceHealth(health);
    };
    fetchServiceHealth();
  }, []);

  const handleGenerateUrl = () => {
    if (selectedUser) {
      const uniqueId = generateUniqueId();
      const newUrl = generateUniqueUrl(selectedUser.bank, uniqueId);
      setGeneratedUrl(newUrl);
      toast({
        title: "URL Generada",
        description: "La URL única ha sido generada exitosamente.",
        className: "bg-green-900 text-green-100 border border-green-700",
      })
    } else {
      toast({
        title: "Error",
        description: "Por favor, seleccione un usuario.",
        variant: "destructive",
        className: "bg-red-900 text-red-100 border border-red-700",
      })
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl)
      .then(() => toast({
        title: "Copiado",
        description: "URL copiada al portapapeles",
        className: "bg-blue-900 text-blue-100 border border-blue-700",
      }))
      .catch(err => {
        console.error('Error al copiar: ', err)
        toast({
          title: "Error",
          description: "No se pudo copiar la URL",
          variant: "destructive",
          className: "bg-red-900 text-red-100 border border-red-700",
        })
      })
  }

  return (
    <AdminLayout>
      <ToastProvider>
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="generator" className="data-[state=active]:bg-gray-700">Generador de URL</TabsTrigger>
            <TabsTrigger value="documentation" className="data-[state=active]:bg-gray-700">Documentación API</TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-gray-700">Estado del Servicio</TabsTrigger>
          </TabsList>
          <TabsContent value="generator">
            <Card className="bg-gray-800 text-gray-100">
              <CardHeader>
                <CardTitle>Generador de URL Única</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select onValueChange={(value: string) => setSelectedUser(mockUsers.find(user => user.id === value) || null)}>
                    <SelectTrigger className="bg-gray-700 text-gray-100">
                      <SelectValue placeholder="Seleccione un usuario" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-gray-100">
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>{user.name} - {user.bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleGenerateUrl}>Generar URL</Button>
                  {generatedUrl && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">URL Generada:</p>
                      <div className="flex items-center space-x-2">
                        <Input value={generatedUrl} readOnly className="bg-gray-700 text-gray-100" />
                        <Button onClick={handleCopyUrl}>
                          <Icons.copy className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documentation">
            <Card className="bg-gray-800 text-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Documentación de la API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">Introducción</h2>
                  <p className="text-gray-300">
                    Esta API proporciona acceso a los datos de usuario y transacciones bancarias.
                    Cada usuario tiene una URL única generada basada en su banco y un identificador único.
                  </p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">Autenticación</h2>
                  <p className="text-gray-300">
                    Todas las solicitudes a la API deben incluir un token JWT en el encabezado de autorización.
                  </p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">Endpoints</h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">/user</code> - Obtener información del usuario</li>
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">/transactions</code> - Listar transacciones del usuario</li>
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">/balance</code> - Obtener saldo actual</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">Estado del Servicio</h2>
                  <p className="text-gray-300 mb-2">
                    Puedes verificar el estado del servicio utilizando el siguiente endpoint:
                  </p>
                  <code className="block bg-gray-700 p-2 rounded text-gray-100 mb-2">
                    GET /ssptbpetdlt/transaction/api/v1/Transaction/node-info
                  </code>
                  <p className="text-gray-300 mb-2">Este endpoint devuelve la siguiente información:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">success</code>: Indica si la solicitud fue exitosa</li>
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">statusCode</code>: Código de estado HTTP</li>
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">message</code>: Mensaje descriptivo</li>
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">data</code>: Objeto con información detallada:
                      <ul className="list-disc pl-5 mt-2">
                        <li><code className="bg-gray-700 p-1 rounded text-gray-100">isHealthy</code>: Estado de salud del nodo</li>
                        <li><code className="bg-gray-700 p-1 rounded text-gray-100">version</code>: Versión del servicio</li>
                        <li><code className="bg-gray-700 p-1 rounded text-gray-100">networkName</code>: Nombre de la red</li>
                      </ul>
                    </li>
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">transactionId</code>: ID único de la transacción</li>
                    <li><code className="bg-gray-700 p-1 rounded text-gray-100">timestamp</code>: Marca de tiempo de la respuesta</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="health">
            <Card className="bg-gray-800 text-gray-100">
              <CardHeader>
                <CardTitle>Estado del Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                {serviceHealth ? (
                  <div className="space-y-2">
                    <p>Estado: {serviceHealth.isHealthy ?
                      <span className="text-green-400">Saludable</span> :
                      <span className="text-red-400">No Saludable</span>}
                    </p>
                    <p>Versión: {serviceHealth.version}</p>
                    <p>Nombre de la Red: {serviceHealth.networkName}</p>
                  </div>
                ) : (
                  <p>Cargando información del servicio...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ToastProvider>
    </AdminLayout>
  )
}

export default UrlGeneratorPage