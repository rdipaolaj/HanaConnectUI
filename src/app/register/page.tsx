'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { ToastProvider } from "@/components/ui/toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCustomRouter } from '@/utils/navigation'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import WeakPasswordWarningModal from '@/components/WeakPasswordWarningModal'
import { getUserCreateUrl } from '@/utils/api'

interface ServerResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        userId?: string;
    };
    transactionId: string;
    errors: Array<{
        code: string;
        description: string;
    }>;
}

interface FormErrors {
    [key: string]: string[];
}

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showWeakPasswordModal, setShowWeakPasswordModal] = useState(false)
    const [password, setPassword] = useState('')
    const [userRole, setUserRole] = useState('')
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const { toast } = useToast()
    const router = useCustomRouter()

    const getPasswordStrength = (password: string): number => {
        let strength = 0;
        if (password.length > 6) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        return strength;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        const passwordStrength = getPasswordStrength(password);
        if (passwordStrength <= 2) {
            setShowWeakPasswordModal(true)
            return
        }

        await submitForm()
    }

    const submitForm = async () => {
        setLoading(true)

        const formData = new FormData(document.querySelector('form') as HTMLFormElement)
        const userData = Object.fromEntries(formData.entries())

        const createUserCommand = {
            username: userData.username,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            hashedPassword: userData.password,
            userRole: userData.userRole,
            companyName: userData.companyOrFullName,
            department: userData.department,
            jobTitle: userData.jobTitle
        }

        try {
            const response = await axios.post<ServerResponse>(getUserCreateUrl(), createUserCommand)

            const { data } = response

            if (data.success && data.statusCode === 200) {
                console.log('Usuario creado:', data.data.userId)
                setShowSuccessModal(true)
            } else {
                handleErrors(data)
            }
        } catch (error) {
            console.error('Error:', error)
            if (axios.isAxiosError(error) && error.response) {
                const serverError = error.response.data as ServerResponse
                handleErrors(serverError)
            } else {
                toast({
                    title: "Error inesperado",
                    description: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.",
                    variant: "destructive",
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleErrors = (data: ServerResponse) => {
        if (data.errors && data.errors.length > 0) {
            const newFormErrors: FormErrors = {}
            data.errors.forEach(error => {
                const field = getFieldFromErrorCode(error.code)
                if (field) {
                    if (!newFormErrors[field]) {
                        newFormErrors[field] = []
                    }
                    newFormErrors[field].push(error.description)
                }
            })
            setFormErrors(newFormErrors)

            // Mostrar toast con el mensaje general de error
            toast({
                title: "Error en el registro",
                description: data.message,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Error en el registro",
                description: data.message || "Ha ocurrido un error inesperado.",
                variant: "destructive",
            })
        }
    }

    const getFieldFromErrorCode = (code: string): string | null => {
        const fieldMap: { [key: string]: string } = {
            'USER0001': 'username',
            'USER0002': 'email',
            'USER0003': 'phoneNumber',
            'USER0004': 'password',
            'USER0005': 'userRole',
            'USER0006': 'companyOrFullName',
            'USER0007': 'department',
            'USER0008': 'jobTitle',
            'USER0009': 'username',
            'USER0010': 'email',
            'USER0011': 'phoneNumber',
        }
        return fieldMap[code] || null
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false)
        router.push('/login')
    }

    const handleConfirmWeakPassword = () => {
        setShowWeakPasswordModal(false)
        submitForm()
    }

    const renderFieldError = (field: string) => {
        if (formErrors[field] && formErrors[field].length > 0) {
            return (
                <p className="text-red-500 text-sm mt-1">
                    {formErrors[field].join('. ')}
                </p>
            )
        }
        return null
    }

    return (
        <ToastProvider>
            <div className="grid min-h-screen lg:grid-cols-2">
                <div className="flex items-center justify-center px-8 py-12 bg-black text-white">
                    <div className="max-w-md">
                        <h1 className="text-4xl font-bold mb-6">Bienvenido a Hana Connect</h1>
                        <p className="text-lg mb-8 text-gray-300">
                            Únete a nuestra plataforma y comienza a crear proyectos increíbles hoy mismo.
                        </p>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg transform -rotate-3"></div>
                            <svg
                                className="relative w-full h-auto max-w-[400px] rounded-lg shadow-2xl"
                                viewBox="0 0 156 148"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g transform="translate(0.000000,148.000000) scale(0.100000,-0.100000)" fill="#FFFFFF" stroke="none">
                                    <path d="M203 1359 c-85 -54 -77 -187 14 -225 118 -50 223 56 174 174 -28 66 -124 92 -188 51z m118 -42 c30 -23 41 -56 30 -89 -14 -39 -38 -57 -77 -58 -40 0 -77 39 -77 82 0 57 79 100 124 65z" />
                                    <path d="M561 1362 c-37 -20 -71 -72 -71 -109 0 -12 5 -34 10 -49 10 -26 6 -32 -66 -105 l-77 -78 -61 5 c-73 6 -119 -16 -142 -71 -19 -46 -18 -73 4 -114 36 -67 121 -90 183 -48 51 34 70 81 57 141 l-10 48 77 78 76 77 40 -11 c27 -7 51 -7 78 0 l40 11 75 -76 76 -76 -6 -66 c-7 -65 -6 -67 28 -104 60 -66 162 -57 208 18 65 106 -45 232 -163 188 -22 -8 -32 -1 -105 72 -63 63 -79 85 -72 97 17 26 11 93 -10 128 -21 34 -72 62 -112 62 -13 0 -39 -8 -57 -18z m114 -57 c16 -15 25 -36 25 -55 0 -19 -9 -40 -25 -55 -48 -49 -135 -15 -135 53 0 70 86 107 135 57z m-348 -347 c29 -27 32 -87 6 -111 -45 -40 -112 -26 -133 29 -11 28 2 72 27 92 26 19 74 14 100 -10z m698 -3 c27 -26 31 -51 14 -88 -12 -26 -47 -47 -80 -47 -31 0 -69 44 -69 81 0 72 84 106 135 54z" />
                                    <path d="M903 1360 c-57 -34 -79 -112 -50 -170 28 -55 108 -84 170 -61 22 8 32 1 102 -69 l78 -78 -11 -42 c-6 -26 -7 -53 -1 -73 5 -18 9 -36 9 -42 0 -5 -36 -43 -79 -83 l-80 -72 -43 11 c-37 10 -49 9 -82 -6 -55 -26 -78 -68 -73 -133 5 -64 31 -96 93 -111 83 -21 159 35 159 117 0 26 -4 55 -9 65 -12 26 144 183 171 172 32 -14 62 -17 88 -11 39 10 94 64 100 99 9 49 -15 108 -55 135 -30 21 -43 23 -96 19 l-61 -6 -77 78 c-69 70 -77 81 -67 99 26 49 1 130 -51 162 -42 25 -94 26 -135 0z m108 -43 c43 -33 49 -83 14 -121 -50 -54 -135 -19 -135 56 0 58 76 99 121 65z m349 -347 c24 -13 41 -65 31 -93 -21 -53 -84 -71 -124 -35 -26 23 -30 34 -28 76 2 49 71 79 121 52z m-332 -366 c26 -30 28 -61 6 -92 -46 -66 -143 -36 -143 43 0 36 17 61 50 74 32 13 59 5 87 -25z" />
                                    <path d="M1264 1370 c-11 -4 -33 -22 -47 -40 -50 -59 -30 -162 39 -195 75 -36 157 -3 184 73 13 37 13 47 0 84 -25 71 -105 107 -176 78z m98 -54 c27 -20 39 -62 27 -93 -32 -84 -149 -63 -151 27 -2 60 77 102 124 66z" />
                                    <path d="M560 1017 c-33 -17 -70 -74 -70 -108 0 -15 5 -40 10 -55 10 -26 7 -32 -69 -108 l-80 -80 -38 12 c-101 30 -196 -64 -163 -161 22 -69 92 -105 164 -86 l40 11 78 -80 c77 -78 78 -80 67 -111 -46 -131 117 -232 215 -134 32 32 40 61 33 115 -10 75 -89 123 -165 100 l-37 -12 -78 79 c-78 78 -79 78 -69 114 7 24 7 49 0 77 l-11 42 79 79 79 79 37 -12 c51 -15 108 2 143 44 24 28 27 38 23 87 -4 47 -10 59 -41 88 -30 27 -45 33 -79 33 -24 0 -54 -6 -68 -13z m115 -62 c50 -49 15 -135 -55 -135 -39 0 -80 42 -80 82 0 39 40 78 80 78 19 0 40 -9 55 -25z m-366 -330 c16 -8 34 -27 40 -43 38 -92 -97 -152 -143 -63 -20 38 -5 85 33 106 33 18 36 18 70 0z m366 -360 c51 -50 18 -135 -52 -135 -36 0 -83 36 -83 63 0 81 83 125 135 72z" />
                                    <path d="M585 683 c-90 -23 -124 -146 -59 -214 38 -39 84 -54 129 -39 43 14 54 8 132 -73 l63 -65 -6 -60 c-11 -100 35 -152 132 -152 39 0 51 5 79 33 41 41 52 78 37 131 l-11 41 78 78 78 79 40 -12 c107 -32 205 78 157 176 -27 54 -64 77 -118 76 -87 -1 -134 -60 -123 -155 l7 -53 -79 -78 c-69 -69 -81 -77 -99 -67 -27 14 -77 14 -104 0 -18 -10 -29 -2 -99 67 l-78 77 5 61 c4 50 2 67 -16 94 -30 48 -87 69 -145 55z m74 -58 c41 -20 54 -71 31 -115 -13 -24 -65 -41 -93 -31 -69 26 -71 124 -4 151 31 12 34 12 66 -5z m715 -16 c13 -12 20 -31 19 -53 -1 -43 -7 -52 -44 -71 -25 -13 -33 -14 -63 -1 -65 27 -68 113 -4 141 37 16 64 11 92 -16z m-349 -346 c72 -72 -38 -181 -112 -111 -38 36 -27 109 20 128 39 15 64 11 92 -17z" />
                                    <path d="M230 333 c-8 -3 -29 -19 -47 -36 -84 -79 -26 -217 92 -217 46 0 98 28 116 62 18 33 15 102 -5 133 -33 51 -104 77 -156 58z m93 -63 c33 -26 41 -63 23 -99 -17 -32 -34 -41 -77 -41 -69 0 -97 89 -43 138 31 27 63 28 97 2z" />
                                    <path d="M1254 321 c-46 -28 -64 -59 -64 -111 0 -82 49 -129 134 -130 41 0 53 5 81 33 83 83 39 212 -76 224 -32 3 -52 -1 -75 -16z m104 -47 c32 -22 43 -57 31 -94 -13 -35 -35 -50 -76 -50 -71 0 -101 89 -47 138 30 26 61 28 92 6z" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center px-8 py-12 bg-white overflow-y-auto">
                    <div className="w-full max-w-2xl">
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Crear una cuenta</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-gray-700">Nombre de usuario</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="juanperez123"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
                                    />
                                    {renderFieldError('username')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="juan@ejemplo.com"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
                                    />
                                    {renderFieldError('email')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber" className="text-gray-700">Número de teléfono</Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="+1234567890"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
                                    />
                                    {renderFieldError('phoneNumber')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <PasswordStrengthMeter password={password} />
                                    {renderFieldError('password')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="userRole" className="text-gray-700">Rol de usuario</Label>
                                    <select
                                        id="userRole"
                                        name="userRole"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
                                        onChange={(e) => setUserRole(e.target.value)}
                                        value={userRole}
                                    >
                                        <option value="">Seleccione un rol</option>
                                        <option value="Company">Empresa</option>
                                        <option value="User">Usuario</option>
                                    </select>
                                    {renderFieldError('userRole')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyOrFullName" className="text-gray-700">
                                        {userRole === 'Company' ? 'Nombre de la empresa' : 'Nombre y Apellido Completo'}
                                    </Label>
                                    <Input
                                        id="companyOrFullName"
                                        name="companyOrFullName"
                                        placeholder={userRole === 'Company' ? "Hana Connect" : "Juan Pérez"}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
                                    />
                                    {renderFieldError('companyOrFullName')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-gray-700">Departamento</Label>
                                    <Input
                                        id="department"
                                        name="department"
                                        placeholder="Ventas"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
                                    />
                                    {renderFieldError('department')}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jobTitle" className="text-gray-700">Título del trabajo</Label>
                                    <Input
                                        id="jobTitle"
                                        name="jobTitle"
                                        placeholder="Gerente de Ventas"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
                                    />
                                    {renderFieldError('jobTitle')}
                                </div>
                            </div>
                            <Button
                                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                                type="submit"
                                disabled={loading}
                            >
                                {loading && <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />}
                                {loading ? "Registrando..." : "Registrarse"}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{" "}
                            <Link href="/login" className="text-black font-semibold hover:underline">
                                Iniciar sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">Registro Exitoso</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Tu cuenta ha sido creada correctamente. ¡Bienvenido a Hana Connect!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleCloseSuccessModal} className="w-full bg-black hover:bg-gray-800 text-white">
                            Ir al inicio de sesión
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <WeakPasswordWarningModal
                isOpen={showWeakPasswordModal}
                onClose={() => setShowWeakPasswordModal(false)}
                onConfirm={handleConfirmWeakPassword}
            />

        </ToastProvider>
    )
}