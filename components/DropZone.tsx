
import React, { useState } from 'react';
import { Token, RoleDefinition } from '../types';

interface SentenceChunkProps {
  chunkIndex: number;
  tokens: Token[];
  startIndex: number; // Global index of the first token in this chunk
  assignedRole: RoleDefinition | null;
  subRoles: Record<string, RoleDefinition>; // Map tokenId -> RoleDefinition
  onDropChunk: (e: React.DragEvent<HTMLDivElement>, chunkId: string) => void;
  onDropWord: (e: React.DragEvent<HTMLSpanElement>, tokenId: string) => void;
  onRemoveRole: (chunkId: string) => void;
  onRemoveSubRole: (tokenId: string) => void;
  onToggleSplit: (globalTokenIndex: number) => void;
  validationState?: 'correct' | 'incorrect-role' | 'incorrect-split' | null;
}

export const SentenceChunk: React.FC<SentenceChunkProps> = ({
  tokens,
  startIndex,
  assignedRole,
  subRoles,
  onDropChunk,
  onDropWord,
  onRemoveRole,
  onRemoveSubRole,
  onToggleSplit,
  validationState
}) => {
  const [isOverChunk, setIsOverChunk] = useState(false);
  const [hoveredWordId, setHoveredWordId] = useState<string | null>(null);

  // Styling based on validation/state
  let borderColor = "border-slate-300";
  let bgColor = "bg-white";
  let statusIcon = null;

  if (isOverChunk) {
    borderColor = "border-blue-400";
    bgColor = "bg-blue-50";
  } else if (validationState === 'correct') {
    borderColor = "border-green-500";
    bgColor = "bg-green-50";
    statusIcon = <span className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm z-20">✓</span>;
  } else if (validationState === 'incorrect-role') {
    borderColor = "border-orange-400";
    bgColor = "bg-orange-50";
    statusIcon = <span className="absolute -top-3 -right-3 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm z-20">?</span>;
  } else if (validationState === 'incorrect-split') {
    borderColor = "border-red-500";
    bgColor = "bg-red-50";
    statusIcon = <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm z-20">×</span>;
  } else if (assignedRole) {
    borderColor = assignedRole.borderColorClass;
    bgColor = "bg-white"; // Keep white background to make sub-roles pop
  }

  const chunkId = tokens[0].id;

  const handleDragOverChunk = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (hoveredWordId) return; // Don't highlight chunk if hovering a word
    setIsOverChunk(true);
  };

  const handleDragLeaveChunk = () => {
    setIsOverChunk(false);
  };

  const handleWordDragEnter = (tokenId: string) => {
    setHoveredWordId(tokenId);
    setIsOverChunk(false);
  };

  const handleWordDragLeave = () => {
    setHoveredWordId(null);
  };

  return (
    <div 
      className={`
        relative flex flex-col min-w-[140px] rounded-xl border-2 transition-all duration-300 group/chunk
        ${borderColor} ${bgColor}
        ${validationState === 'incorrect-split' ? 'opacity-80' : ''}
      `}
      onDragOver={handleDragOverChunk}
      onDrop={(e) => {
        if (hoveredWordId) return; // Let the word handler take it
        setIsOverChunk(false);
        onDropChunk(e, chunkId);
      }}
      onDragLeave={handleDragLeaveChunk}
    >
      {/* Main Role Header */}
      <div className={`
        h-9 border-b border-dashed border-slate-200 flex items-center justify-center text-xs rounded-t-lg
        ${assignedRole ? assignedRole.colorClass + ' font-bold' : 'text-slate-400 italic'}
      `}>
        {assignedRole ? (
          <div className="flex items-center gap-2 w-full justify-center px-2 relative group/header">
            <span>{assignedRole.label}</span>
            {!validationState && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRemoveRole(chunkId); }}
                className="hidden group-hover/header:flex absolute right-0 hover:bg-black/10 rounded-full w-5 h-5 items-center justify-center transition-colors"
                title="Verwijder benaming"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          "Sleep zinsdeel hier"
        )}
      </div>

      {/* Words Container */}
      <div className="p-3 flex flex-wrap gap-y-4 gap-x-0 justify-center items-end min-h-[60px]">
        {tokens.map((token, i) => {
           const subRole = subRoles[token.id];
           const isWordHovered = hoveredWordId === token.id;

           return (
             <React.Fragment key={token.id}>
               <div className="relative flex flex-col items-center group/word">
                  
                  {/* Sub Role Chip */}
                  {subRole && (
                    <div 
                      className={`
                        absolute -top-5 text-[9px] px-1.5 py-0.5 rounded-md border shadow-sm whitespace-nowrap z-10 cursor-pointer
                        ${subRole.colorClass || ''} ${subRole.borderColorClass || ''}
                      `}
                      onClick={(e) => { e.stopPropagation(); onRemoveSubRole(token.id); }}
                      title="Klik om te verwijderen"
                    >
                      {subRole.shortLabel}
                    </div>
                  )}

                  {/* The Word Target */}
                  <span 
                    className={`
                      text-slate-800 font-medium text-lg leading-tight px-1 py-1 rounded transition-all duration-200 border border-transparent
                      ${isWordHovered ? 'bg-yellow-100 border-yellow-300 scale-105 shadow-sm' : ''}
                      ${!isWordHovered && !subRole ? 'hover:bg-slate-100' : ''}
                    `}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); handleWordDragEnter(token.id); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); handleWordDragLeave(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDropWord(e, token.id);
                      setHoveredWordId(null);
                    }}
                  >
                    {token.text}
                  </span>
               </div>

               {/* Splitter */}
               {i < tokens.length - 1 && (
                 <div 
                   className="w-4 h-8 flex items-center justify-center cursor-pointer group/splitter mx-[-2px] z-10 hover:w-6 transition-all"
                   onClick={(e) => {
                     e.stopPropagation();
                     onToggleSplit(startIndex + i);
                   }}
                   title="Splits hier"
                 >
                   <div className="w-[1px] h-4 bg-slate-200 group-hover/splitter:bg-blue-400 transition-colors"></div>
                   <div className="absolute opacity-0 group-hover/splitter:opacity-100 text-[10px] transform -translate-y-4 bg-blue-600 text-white px-1 rounded">✂️</div>
                 </div>
               )}
             </React.Fragment>
           );
        })}
      </div>

      {/* Validation Status */}
      {statusIcon}
      {validationState === 'incorrect-split' && (
        <div className="absolute bottom-0 w-full text-[10px] text-center bg-red-100 text-red-800 rounded-b-lg py-0.5">
          Foutieve splitsing
        </div>
      )}
    </div>
  );
};
