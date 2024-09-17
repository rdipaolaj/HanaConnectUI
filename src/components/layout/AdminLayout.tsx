import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

// Función para generar una URL única por usuario
const generateUniqueUrl = (userId: string) => {
  return `https://api.hanaconnect.com/user/${userId}`
}

const Logo = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Link href="/" className="flex items-center">
    <Icons.network className="h-8 w-8 text-white" />
    {!isCollapsed && <span className="ml-2 text-xl font-bold text-white">Hana Connect</span>}
  </Link>
)

const Sidebar = ({ isCollapsed, toggleSidebar, userUrl }: { isCollapsed: boolean; toggleSidebar: () => void; userUrl: string }) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('tokenExpiry')
        localStorage.removeItem('userId')
        router.push('/login')
    }

    const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
        <Link 
            href={href} 
            className={`flex items-center py-2 px-4 hover:bg-gray-800 rounded ${
                isCollapsed ? 'justify-center' : ''
            } ${pathname === href ? 'bg-gray-800' : ''}`}
            title={isCollapsed ? label : ''}
        >
            <div className="flex items-center justify-center w-5 h-5">
                {icon}
            </div>
            {!isCollapsed && <span className="ml-3">{label}</span>}
        </Link>
    )

    return (
        <div className={`flex flex-col h-full bg-gray-900 text-white ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
            <div className="p-4 flex justify-between items-center">
                <Logo isCollapsed={isCollapsed} />
                <Button onClick={toggleSidebar} variant="ghost" size="icon" className="text-white">
                    {isCollapsed ? <Icons.chevronsRight className="h-4 w-4" /> : <Icons.chevronsLeft className="h-4 w-4" />}
                </Button>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2 p-4">
                    <li>
                        <NavItem href="/dashboard" icon={<Icons.home className="h-5 w-5" />} label="Dashboard" />
                    </li>
                    <li>
                        <NavItem href="/transactions" icon={<Icons.creditCard className="h-5 w-5" />} label="Transacciones" />
                    </li>
                    <li>
                        <NavItem href="/security" icon={<Icons.shield className="h-5 w-5" />} label="Seguridad" />
                    </li>
                    <li>
                        <NavItem href="/users" icon={<Icons.users className="h-5 w-5" />} label="Usuarios" />
                    </li>
                    <li>
                        <NavItem href="/profile" icon={<Icons.user className="h-5 w-5" />} label="Perfil" />
                    </li>
                    <li>
                        <NavItem href="/tests" icon={<Icons.testTube className="h-5 w-5" />} label="Pruebas" />
                    </li>
                    <li>
                        <NavItem href="/url-generator" icon={<Icons.link className="h-5 w-5" />} label="Generador URL" />
                    </li>
                </ul>
            </nav>
            {!isCollapsed && (
                <div className="p-4 text-xs">
                    <p className="truncate">URL única: {userUrl}</p>
                </div>
            )}
            <div className="p-4">
                <Button onClick={handleLogout} variant="outline" className={`w-full ${isCollapsed ? 'p-2 justify-center' : ''}`}>
                    {isCollapsed ? <Icons.logOut className="h-5 w-5" /> : 'Cerrar sesión'}
                </Button>
            </div>
        </div>
    )
}

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [userUrl, setUserUrl] = useState('')

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed')
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState))
        }

        // Generar o recuperar la URL única del usuario
        const userId = localStorage.getItem('userId')
        if (userId) {
            const generatedUrl = generateUniqueUrl(userId)
            setUserUrl(generatedUrl)
        }
    }, [])

    const toggleSidebar = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} userUrl={userUrl} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Sistema de Seguridad Bancaria DLT
                        </h1>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout