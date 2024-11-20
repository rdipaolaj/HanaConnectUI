'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { ToastProvider } from "@/components/ui/toast"
import { getNodeInfoUrl } from '@/utils/api'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

const TransactionDocumentationPage = () => {
  const [serviceHealth, setServiceHealth] = useState<{ isHealthy: boolean, version: string, networkName: string } | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchServiceHealth = async () => {
      const health = await checkServiceHealth();
      setServiceHealth(health);
    };
    fetchServiceHealth();

    // Obtener el userId del localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const tangleUrl = 'http://3.92.78.140:8011/dashboard/';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tangleUrl).then(() => {
      alert('URL copiada al portapapeles');
    }, (err) => {
      console.error('Error al copiar: ', err);
    });
  }

  return (
    <AdminLayout>
      <ToastProvider>
        <Tabs defaultValue="documentation" className="w-full">
          <TabsList className="bg-gray-800 ">
            <TabsTrigger value="documentation" className="data-[state=active]:bg-gray-700">Documentación API</TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-gray-700">Estado del Servicio</TabsTrigger>
            <TabsTrigger value="tangle" className="data-[state=active]:bg-gray-700">Tangle Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="documentation">
            <Card className="bg-gray-800 text-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Documentación de la API de Transacciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">Introducción</h2>
                  <p className="text-gray-300">
                    Esta API permite crear nuevas transacciones en el sistema DLT.
                  </p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-200">Crear Transacción</h2>
                  <p className="text-gray-300 mb-2">
                    Para crear una nueva transacción, utiliza el siguiente endpoint:
                  </p>
                  <code className="block bg-gray-700 p-2 rounded text-gray-100 mb-2">
                    POST https://ssptb-pe-tdlt-transaction-service.fly.dev/ssptbpetdlt/transaction/api/v1/Transaction/create
                  </code>
                  <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">Cuerpo de la Solicitud</h3>
                  <pre className="bg-gray-700 p-2 rounded text-gray-100 mb-2 whitespace-pre-wrap">
                    {`{
  "userBankTransactionId": "${userId || '&lt;userId&gt;'}",
  "tag": "&lt;etiqueta_personalizada_del_banco&gt;",
  "transactionData": {
    // Objeto con datos específicos de la transacción definidos por el banco
    // Ejemplo:
    // "amount": 1000,
    // "currency": "PEN",
    // "description": "Pago de servicios"
  }
}`}
                  </pre>
                  <p className="text-gray-300 mt-2">
                    <strong>Nota:</strong> El <code>userBankTransactionId</code> es el ID del usuario que realiza la transacción.
                    El <code>tag</code> es una etiqueta personalizada asignada por el banco para identificar el tipo de transacción.
                    El objeto <code>transactionData</code> contiene los detalles específicos de la transacción, que pueden variar según las necesidades del banco.
                  </p>
                  <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-200">Respuesta</h3>
                  <pre className="bg-gray-700 p-2 rounded text-gray-100 mb-2 whitespace-pre-wrap">
                    {`{
  "success": true,
  "statusCode": 200,
  "message": "Transacción registrada exitosamente.",
  "data": {
    "transactionId": "&lt;id_de_transaccion_generado&gt;",
    "blockId": "&lt;id_del_bloque_en_la_cadena&gt;"
  },
  "transactionId": "&lt;id_de_transaccion_del_sistema&gt;",
  "timestamp": "&lt;fecha_y_hora_de_la_transaccion&gt;",
  "errors": [],
  "metadata": {}
}`}
                  </pre>
                  <p className="text-gray-300 mt-2">
                    <strong>Nota:</strong> Los valores específicos como <code>transactionId</code> y <code>blockId</code> serán generados por el sistema para cada transacción.
                  </p>
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
          <TabsContent value="tangle">
            <Card className="bg-gray-800 text-gray-100">
              <CardHeader>
                <CardTitle>Tangle Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Para visualizar el dashboard de Tangle en una ventana de incógnito de Google Chrome, siga estos pasos:
                </p>
                <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
                  <li>Copie la URL del dashboard de Tangle haciendo clic en el botón &quot;Copiar URL&quot;.</li>
                  <li>Abra una nueva ventana de incógnito en Google Chrome (Ctrl+Shift+N en Windows/Linux o Cmd+Shift+N en Mac).</li>
                  <li>Pegue la URL copiada en la barra de direcciones de la ventana de incógnito y presione Enter.</li>
                </ol>
                <div className="flex space-x-4">
                  <Button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Copiar URL
                  </Button>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Ver URL
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-gray-100">
                      <DialogHeader>
                        <DialogTitle>URL del Dashboard de Tangle</DialogTitle>
                      </DialogHeader>
                      <p className="mt-4 break-all">{tangleUrl}</p>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-gray-300 mt-4">
                  <strong>Nota:</strong> Asegúrese de tener Google Chrome instalado en su sistema para seguir estas instrucciones.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ToastProvider>
    </AdminLayout>
  )
}

export default TransactionDocumentationPage