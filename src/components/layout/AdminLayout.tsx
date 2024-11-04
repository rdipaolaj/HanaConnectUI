import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Permission {
    permissionId: string;
    permissionName: string;
    description: string;
}

// URL única actualizada
const UNIQUE_URL = "https://ssptb-pe-tdlt-transaction-service.fly.dev/ssptbpetdlt/transaction/api/v1/Transaction/create"

// Función para generar un color basado en el nombre de usuario
const getColorFromUsername = (username: string) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

const Logo = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <Link href="/" className="flex items-center">
        <Icons.network className="h-8 w-8 text-white" />
        {!isCollapsed && <span className="ml-2 text-xl font-bold text-white">Hana Connect</span>}
    </Link>
)

const NavItem = ({ href, icon, label, permissionName, isCollapsed, pathname, permissions }: { href: string; icon: React.ReactNode; label: string; permissionName: string; isCollapsed: boolean; pathname: string; permissions: Permission[] }) => {
    const hasPermission = permissions.some(p => p.permissionName === permissionName)

    if (!hasPermission) return null

    return (
        <Link
            href={href}
            className={`flex items-center py-2 px-4 hover:bg-gray-800 rounded ${isCollapsed ? 'justify-center' : ''
                } ${pathname === href ? 'bg-gray-800' : ''}`}
            title={isCollapsed ? label : ''}
        >
            <div className="flex items-center justify-center w-5 h-5">
                {icon}
            </div>
            {!isCollapsed && <span className="ml-3">{label}</span>}
        </Link>
    )
}

const UserMenu = ({ username }: { username: string }) => {
    const router = useRouter()
    const initials = username.split(' ').map(n => n[0]).join('').toUpperCase()
    const avatarColor = useMemo(() => getColorFromUsername(username), [username])

    const handleLogout = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('tokenExpiry')
        localStorage.removeItem('permissions')
        router.push('/login')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback style={{backgroundColor: avatarColor}}>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {UNIQUE_URL}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <Icons.logOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const Sidebar = ({ isCollapsed, toggleSidebar, permissions, username }: { isCollapsed: boolean; toggleSidebar: () => void; permissions: Permission[]; username: string }) => {
    const pathname = usePathname()

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
                        <NavItem href="/dashboard" icon={<Icons.home className="h-5 w-5" />} label="Dashboard" permissionName="Access Dashboard" isCollapsed={isCollapsed} pathname={pathname} permissions={permissions} />
                    </li>
                    <li>
                        <NavItem href="/transactions" icon={<Icons.creditCard className="h-5 w-5" />} label="Transacciones" permissionName="Access Transactions" isCollapsed={isCollapsed} pathname={pathname} permissions={permissions} />
                    </li>
                    <li>
                        <NavItem href="/security" icon={<Icons.shield className="h-5 w-5" />} label="Seguridad" permissionName="Access Security" isCollapsed={isCollapsed} pathname={pathname} permissions={permissions} />
                    </li>
                    <li>
                        <NavItem href="/users" icon={<Icons.users className="h-5 w-5" />} label="Usuarios" permissionName="Access Users" isCollapsed={isCollapsed} pathname={pathname} permissions={permissions} />
                    </li>
                    <li>
                        <NavItem href="/profile" icon={<Icons.user className="h-5 w-5" />} label="Perfil" permissionName="Access Profile" isCollapsed={isCollapsed} pathname={pathname} permissions={permissions} />
                    </li>
                    <li>
                        <NavItem href="/tests" icon={<Icons.testTube className="h-5 w-5" />} label="Pruebas" permissionName="Access Tests" isCollapsed={isCollapsed} pathname={pathname} permissions={permissions} />
                    </li>
                    <li>
                        <NavItem href="/documentation" icon={<Icons.fileText className="h-5 w-5" />} label="Documentación" permissionName="Access URL Generator" isCollapsed={isCollapsed} pathname={pathname} permissions={permissions} />
                    </li>
                </ul>
            </nav>
            <div className="p-4">
                <UserMenu username={username} />
            </div>
        </div>
    )
}

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [username, setUsername] = useState('')
    const router = useRouter()

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed')
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState))
        }

        const storedPermissions = localStorage.getItem('permissions')
        if (storedPermissions) {
            setPermissions(JSON.parse(storedPermissions))
        }

        const jwtToken = localStorage.getItem('jwtToken')
        const tokenExpiry = localStorage.getItem('tokenExpiry')
        const storedUsername = localStorage.getItem('username')

        if (!jwtToken || !tokenExpiry || !storedUsername) {
            router.push('/login')
            return
        }

        if (new Date(tokenExpiry) < new Date()) {
            handleLogout()
            return
        }

        setUsername(storedUsername)
    }, [router])

    const toggleSidebar = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
    }

    const handleLogout = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('tokenExpiry')
        localStorage.removeItem('permissions')
        router.push('/login')
    }

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-gray-100">
                <Sidebar 
                    isCollapsed={isCollapsed} 
                    toggleSidebar={toggleSidebar} 
                    permissions={permissions}
                    username={username}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Sistema de Seguridad Bancaria DLT
                            </h1>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">Bienvenido, {username}</span>
                                        <UserMenu username={username} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>URL única: {UNIQUE_URL}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </header>
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                        <div className="container mx-auto px-6 py-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    )
}

export default AdminLayout