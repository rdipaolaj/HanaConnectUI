'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastProvider, ToastViewport, Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AdminLayout from '@/components/layout/AdminLayout'
import { getUserProfileUrl, updateUserProfileUrl } from '@/utils/api'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Creamos un componente Toaster personalizado
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

interface UserProfile {
  userId: string
  username: string
  email: string
  phoneNumber: string
  roleId: string
  roleName: string
  companyName: string
  department: string
  jobTitle: string
  createdAt: string
  accountStatus: string
}

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [editLoading, setEditLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const jwtToken = localStorage.getItem('jwtToken')

      if (!userId || !jwtToken) {
        throw new Error('Información de usuario no encontrada')
      }

      const response = await axios.get(getUserProfileUrl(userId), {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      })

      if (response.data.success && response.data.statusCode === 200) {
        setProfile(response.data.data)
        setEditedProfile(response.data.data)
      } else {
        throw new Error(response.data.message || 'Error al obtener el perfil')
      }
    } catch (error) {
      console.error('Error al obtener el perfil:', error)
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil del usuario.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProfile(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const jwtToken = localStorage.getItem('jwtToken')

      if (!editedProfile || !jwtToken) {
        throw new Error('Información de perfil o token no encontrados')
      }

      const response = await axios.put(
        updateUserProfileUrl(editedProfile.userId),
        {
          userId: editedProfile.userId,
          email: editedProfile.email,
          phoneNumber: editedProfile.phoneNumber,
          companyName: editedProfile.companyName,
          department: editedProfile.department,
          jobTitle: editedProfile.jobTitle
        },
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        }
      )

      if (response.data.success && response.data.statusCode === 200) {
        toast({
          title: "Éxito",
          description: "Perfil actualizado correctamente.",
        })
        setIsEditing(false)
        setProfile(editedProfile)
      } else {
        throw new Error(response.data.message || 'Error al actualizar el perfil')
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil del usuario.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = () => {
    setEditLoading(true)
    setTimeout(() => {
      setIsEditing(true)
      setEditLoading(false)
    }, 1000) // Simulamos una carga de 1 segundo
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedProfile(profile)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <Icons.spinner className="h-8 w-8 animate-spin" />
    </div>
  }

  return (
    <AdminLayout>
      <Toaster />
      <Card className="max-w-4xl mx-auto bg-card">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback>{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-foreground">Perfil de Usuario</CardTitle>
              <CardDescription className="text-muted-foreground">
                Información y configuración de su cuenta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {profile && editedProfile && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nombre de usuario</label>
                  <Input 
                    name="username" 
                    value={editedProfile.username} 
                    readOnly 
                    className="bg-muted text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Rol</label>
                  <Input 
                    value={editedProfile.roleName} 
                    readOnly 
                    className="bg-muted text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Correo electrónico</label>
                  <Input 
                    name="email" 
                    value={editedProfile.email} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted text-foreground" : "bg-background text-foreground"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Número de teléfono</label>
                  <Input 
                    name="phoneNumber" 
                    value={editedProfile.phoneNumber} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted text-foreground" : "bg-background text-foreground"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Empresa</label>
                  <Input 
                    name="companyName" 
                    value={editedProfile.companyName} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted text-foreground" : "bg-background text-foreground"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Departamento</label>
                  <Input 
                    name="department" 
                    value={editedProfile.department} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted text-foreground" : "bg-background text-foreground"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Cargo</label>
                  <Input 
                    name="jobTitle" 
                    value={editedProfile.jobTitle} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted text-foreground" : "bg-background text-foreground"}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Confirmar cambios
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      className="border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleEditClick}
                    disabled={editLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {editLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Editar perfil
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}