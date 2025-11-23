
import React from 'react';
import { RoleDefinition } from '../types';

interface DraggableRoleProps {
  role: RoleDefinition;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, roleKey: string) => void;
}

export const DraggableRole: React.FC<DraggableRoleProps> = ({ 
  role, 
  onDragStart
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, role.key)}
      className={`
        relative px-3 py-1.5 border-2 rounded-lg cursor-move select-none transition-all duration-200
        text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5
        flex items-center justify-center whitespace-nowrap
        ${role.colorClass} ${role.borderColorClass}
      `}
    >
      <span className="mr-1.5 opacity-60 text-[10px] uppercase tracking-wide hidden md:inline-block">{role.shortLabel}</span>
      {role.label}
    </div>
  );
};
