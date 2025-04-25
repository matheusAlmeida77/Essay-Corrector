import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ThemeFieldProps {
  theme: string;
  setTheme: (theme: string) => void;
  required?: boolean;
}

const ThemeField: React.FC<ThemeFieldProps> = ({ theme, setTheme, required = true }) => {
  return (
    <div className="space-y-2 mb-6">
      <Label htmlFor="theme" className="flex items-center">
        Tema da Redação {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id="theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Digite o tema da redação dissertativa-argumentativa"
        className="w-full"
        required={required}
      />
      <p className="text-xs text-gray-500">
        Digite o tema oficial da redação. Ex: "Os desafios da educação inclusiva no Brasil"
      </p>
    </div>
  );
};

export default ThemeField;