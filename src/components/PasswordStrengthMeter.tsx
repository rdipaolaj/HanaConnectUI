import React from 'react'
import { cn } from "@/lib/utils"

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length > 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return strength;
  }

  const strength = getPasswordStrength(password);

  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
      case 3:
        return 'bg-yellow-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  }

  const getMessage = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'Débil';
      case 2:
      case 3:
        return 'Moderada';
      case 4:
      case 5:
        return 'Fuerte';
      default:
        return '';
    }
  }

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-300 rounded-full">
        <div
          className={cn("h-full rounded-full transition-all duration-300", getColor())}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1 text-gray-600">{getMessage()}</p>
    </div>
  )
}

export default PasswordStrengthMeter