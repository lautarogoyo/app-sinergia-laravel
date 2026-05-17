import React from 'react';
import Icon from '../Icons/Icons';

export default function Finanzas() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon name="finance" className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Finanzas</h2>
      </div>

      <p className="text-sm text-gray-600">Sección de Finanzas - contenido pendiente.</p>
    </div>
  );
}
