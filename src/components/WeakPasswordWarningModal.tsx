import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WeakPasswordWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WeakPasswordWarningModal: React.FC<WeakPasswordWarningModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Advertencia: Contraseña Débil</DialogTitle>
          <DialogDescription className="text-gray-600">
            La contraseña que has elegido es considerada débil. Te recomendamos usar una contraseña más fuerte para mayor seguridad.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button onClick={onClose} variant="outline">
            Cambiar contraseña
          </Button>
          <Button onClick={onConfirm} className="bg-black hover:bg-gray-800 text-white">
            Continuar con registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WeakPasswordWarningModal