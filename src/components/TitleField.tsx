import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TitleFieldProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleField: React.FC<TitleFieldProps> = ({ title, setTitle }) => {
  return (
    <div className="space-y-2 mb-6">
      <Label htmlFor="title" className="flex items-center">
        Título da Redação <span className="text-gray-500 text-xs ml-1">(opcional)</span>
      </Label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Digite o título da redação (se houver)"
        className="w-full"
      />
      <p className="text-xs text-gray-500">
        O título é opcional na redação do ENEM.
      </p>
    </div>
  );
};

export default TitleField;