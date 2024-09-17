'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'

interface UserProfile {
  username: string
  email: string
  role: string
  lastLogin: string
  twoFactorEnabled: boolean
}

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [apiUrl, setApiUrl] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setApiUrl(`https://api.bancoseguro.pe/users/${storedUsername}`)
      fetchProfile()
    }
  }, [])

  const fetchProfile = async () => {
    try {
      // Simulated API call
      const response = await axios.get(`${apiUrl}/profile`)
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil del usuario.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleTwoFactor = async () => {
    try {
      setLoading(true)
      // Simulated API call
      await axios.post(`${apiUrl}/profile/toggle-2fa`)
      await fetchProfile()
      toast({
        title: "Autenticación de dos factores",
        description: `La autenticación de dos factores ha sido ${profile?.twoFactorEnabled ? 'desactivada' : 'activada'}.`,
      })
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error)
      toast({
        title: "Error",
        description: "No se pudo cambiar la configuración de autenticación de dos factores.",
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
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>
              Información y configuración de su cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre de usuario</label>
                  <Input value={profile.username} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Correo electrónico</label>
                  <Input value={profile.email} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Rol</label>
                  <Input value={profile.role} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Último inicio de sesión</label>
                  <Input value={new Date(profile.lastLogin).toLocaleString()} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Autenticación de dos factores</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <span>{profile.twoFactorEnabled ? 'Activada' : 'Desactivada'}</span>
                    <Button onClick={toggleTwoFactor} disabled={loading}>
                      {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {profile.twoFactorEnabled ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </ToastProvider>
    </AdminLayout>
  )
}