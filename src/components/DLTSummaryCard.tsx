import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'

export function DLTSummaryCard() {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Resumen del Sistema de Seguridad DLT</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">
                    Nuestro sistema de seguridad basado en Tecnologías de Ledger Distribuido (DLT)
                    proporciona una protección avanzada para las transacciones bancarias en Perú,
                    combatiendo eficazmente el fraude y los ataques cibernéticos.
                </p>
                <ul className="space-y-2">
                    <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Arquitectura descentralizada que garantiza integridad y transparencia</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Validación rigurosa mediante escenarios de prueba y métricas específicas</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Plan de continuidad para asegurar la viabilidad técnica a largo plazo</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Diseñado y aprobado por expertos en ciberseguridad y tecnologías DLT</span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    )
}