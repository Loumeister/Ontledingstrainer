
import React, { useState } from 'react';
import { SENTENCES, ROLES } from './constants';
import { Sentence, PlacementMap, RoleKey, Token, PredicateType, RoleDefinition } from './types';
import { DraggableRole } from './components/WordChip';
import { SentenceChunk } from './components/DropZone';

type AppStep = 'split' | 'label';

interface ChunkData {
  tokens: Token[];
  originalIndices: number[]; // Global indices
}

export default function App() {
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [step, setStep] = useState<AppStep>('split');
  
  // Splitting State: Set of indices where split occurs AFTER token[index]
  const [splitIndices, setSplitIndices] = useState<Set<number>>(new Set());

  // Labeling State
  const [chunkLabels, setChunkLabels] = useState<PlacementMap>({}); // Main Role (Chunk)
  const [subLabels, setSubLabels] = useState<PlacementMap>({}); // Sub Role (Word)
  
  // Predicate Type State
  const [predicateType, setPredicateType] = useState<PredicateType | null>(null);

  const [validationResult, setValidationResult] = useState<{
    score: number;
    total: number;
    chunkStatus: Record<number, 'correct' | 'incorrect-role' | 'incorrect-split'>;
    predicateStatus: 'correct' | 'incorrect' | null;
  } | null>(null);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const handleSentenceSelect = (sentenceId: number) => {
    const selected = SENTENCES.find(s => s.id === sentenceId);
    if (selected) {
      setCurrentSentence(selected);
      setStep('split');
      setSplitIndices(new Set());
      setChunkLabels({});
      setSubLabels({});
      setPredicateType(null);
      setValidationResult(null);
      setShowAnswerMode(false);
    } else {
      setCurrentSentence(null);
    }
  };

  const toggleSplit = (tokenIndex: number) => {
    if (showAnswerMode) return;
    if (validationResult) setValidationResult(null);
    
    const newSplits = new Set(splitIndices);
    if (newSplits.has(tokenIndex)) {
      newSplits.delete(tokenIndex);
    } else {
      newSplits.add(tokenIndex);
    }
    setSplitIndices(newSplits);
  };

  const handleNextStep = () => {
    setStep('label');
    setValidationResult(null);
  };

  const handleBackStep = () => {
    setStep('split');
    setValidationResult(null);
  };

  const getUserChunks = (): ChunkData[] => {
    if (!currentSentence) return [];
    const chunks: ChunkData[] = [];
    let currentChunkTokens: Token[] = [];
    let currentChunkIndices: number[] = [];

    currentSentence.tokens.forEach((token, index) => {
      currentChunkTokens.push(token);
      currentChunkIndices.push(index);

      if (splitIndices.has(index) || index === currentSentence.tokens.length - 1) {
        chunks.push({
          tokens: currentChunkTokens,
          originalIndices: currentChunkIndices
        });
        currentChunkTokens = [];
        currentChunkIndices = [];
      }
    });
    return chunks;
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, roleKey: string) => {
    e.dataTransfer.setData("text/role", roleKey);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDropChunk = (e: React.DragEvent<HTMLDivElement>, chunkId: string) => {
    e.preventDefault();
    if (showAnswerMode) return;
    const roleKey = e.dataTransfer.getData("text/role") as RoleKey;
    if (roleKey) {
      setChunkLabels(prev => ({ ...prev, [chunkId]: roleKey }));
      setValidationResult(null);
    }
  };

  const handleDropWord = (e: React.DragEvent<HTMLSpanElement>, tokenId: string) => {
    e.preventDefault();
    if (showAnswerMode) return;
    const roleKey = e.dataTransfer.getData("text/role") as RoleKey;
    if (roleKey) {
      setSubLabels(prev => ({ ...prev, [tokenId]: roleKey }));
      setValidationResult(null);
    }
  };

  const removeLabel = (chunkId: string) => {
    if (showAnswerMode) return;
    const newLabels = { ...chunkLabels };
    delete newLabels[chunkId];
    setChunkLabels(newLabels);
    setValidationResult(null);
  };

  const removeSubLabel = (tokenId: string) => {
    if (showAnswerMode) return;
    const newLabels = { ...subLabels };
    delete newLabels[tokenId];
    setSubLabels(newLabels);
    setValidationResult(null);
  };

  const handleCheck = () => {
    if (!currentSentence) return;

    const userChunks = getUserChunks();
    const chunkStatus: Record<number, 'correct' | 'incorrect-role' | 'incorrect-split'> = {};
    let correctChunksCount = 0;

    userChunks.forEach((chunk, idx) => {
      const chunkTokens = chunk.tokens;
      const firstTokenId = chunkTokens[0].id;
      
      // 1. Structure Logic (Splitting)
      const firstTokenRole = chunkTokens[0].role;
      const isConsistentRole = chunkTokens.every(t => t.role === firstTokenRole);
      
      const lastTokenId = chunkTokens[chunkTokens.length - 1].id;
      const lastTokenIndex = currentSentence.tokens.findIndex(t => t.id === lastTokenId);
      const nextToken = currentSentence.tokens[lastTokenIndex + 1];
      const splitTooEarly = nextToken && nextToken.role === firstTokenRole;

      const firstTokenIndexInSent = currentSentence.tokens.findIndex(t => t.id === firstTokenId);
      const prevToken = currentSentence.tokens[firstTokenIndexInSent - 1];
      const startedTooLate = prevToken && prevToken.role === firstTokenRole;

      const isValidSplit = isConsistentRole && !splitTooEarly && !startedTooLate;

      if (!isValidSplit) {
        chunkStatus[idx] = 'incorrect-split';
      } else {
        // 2. Main Role Logic
        const userLabel = chunkLabels[firstTokenId];
        const isMainRoleCorrect = userLabel === firstTokenRole;
        
        if (isMainRoleCorrect) {
          chunkStatus[idx] = 'correct';
          correctChunksCount++;
        } else {
          chunkStatus[idx] = 'incorrect-role';
        }
      }
    });

    const isPredicateCorrect = predicateType === currentSentence.predicateType;

    setValidationResult({
      score: correctChunksCount,
      total: userChunks.length,
      chunkStatus,
      predicateStatus: isPredicateCorrect ? 'correct' : 'incorrect'
    });
  };

  const handleShowAnswer = () => {
    if (!currentSentence) return;
    
    // 1. Set Splits
    const correctSplits = new Set<number>();
    currentSentence.tokens.forEach((t, i) => {
      const next = currentSentence.tokens[i + 1];
      if (next && t.role !== next.role) {
        correctSplits.add(i);
      }
    });
    setSplitIndices(correctSplits);
    setStep('label');

    // 2. Set Labels & SubLabels
    const correctChunkLabels: PlacementMap = {};
    const correctSubLabels: PlacementMap = {};
    
    let currentChunkStartId = currentSentence.tokens[0].id;
    correctChunkLabels[currentChunkStartId] = currentSentence.tokens[0].role;

    currentSentence.tokens.forEach((t, i) => {
      if (t.subRole) {
        correctSubLabels[t.id] = t.subRole;
      }
      if (correctSplits.has(i - 1)) {
         currentChunkStartId = t.id;
         correctChunkLabels[currentChunkStartId] = t.role;
      }
    });

    setChunkLabels(correctChunkLabels);
    setSubLabels(correctSubLabels);
    setPredicateType(currentSentence.predicateType);
    setShowAnswerMode(true);
    setValidationResult(null);
  };

  const handleReset = () => {
    setSplitIndices(new Set());
    setChunkLabels({});
    setSubLabels({});
    setPredicateType(null);
    setStep('split');
    setValidationResult(null);
    setShowAnswerMode(false);
  };

  const userChunks = getUserChunks();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <main className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Zinsontleding
            </span> Trainer
          </h1>
          <div className="flex justify-center gap-4 text-sm font-medium text-slate-500">
             <div 
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${step === 'split' ? 'bg-blue-100 text-blue-700' : 'text-slate-400'}`}
                role="button"
                onClick={() => !showAnswerMode && setStep('split')}
             >
               <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">1</span>
               Verdelen
             </div>
             <span className="text-slate-300 self-center">→</span>
             <div 
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${step === 'label' ? 'bg-blue-100 text-blue-700' : 'text-slate-400'}`}
             >
               <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">2</span>
               Benoemen
             </div>
          </div>
        </header>

        {/* Selection Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <select
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 disabled:opacity-50"
            onChange={(e) => handleSentenceSelect(Number(e.target.value))}
            value={currentSentence?.id || ""}
            disabled={showAnswerMode}
          >
            <option value="" disabled>-- Kies een zin om te starten --</option>
            {SENTENCES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {currentSentence && (
            <div className="flex gap-3">
              {!showAnswerMode && (
                 <button onClick={handleShowAnswer} className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                   Toon antwoord
                 </button>
              )}
              <button onClick={handleReset} className="text-sm text-slate-500 hover:text-red-500 underline decoration-red-200">
                Opnieuw beginnen
              </button>
            </div>
          )}
        </div>

        {currentSentence ? (
          <div className="space-y-6">
            
            {/* Feedback Block */}
            {validationResult && (
               <div className={`p-4 rounded-xl text-center font-bold text-lg animate-in slide-in-from-top-2 duration-300
                 ${validationResult.score === validationResult.total && validationResult.predicateStatus === 'correct' 
                   ? 'bg-green-100 text-green-800 border border-green-200' 
                   : 'bg-orange-50 text-orange-800 border border-orange-200'}
               `}>
                 {validationResult.score === validationResult.total && validationResult.predicateStatus === 'correct'
                   ? "🎉 Perfect! Alles goed verdeeld en benoemd." 
                   : `Je hebt ${validationResult.score} van de ${validationResult.total} zinsdelen goed.`}
                 
                 {validationResult.predicateStatus === 'incorrect' && (
                   <div className="text-sm font-normal mt-1 text-orange-700">Let op: Het type gezegde klopt niet.</div>
                 )}
               </div>
            )}
            
            {showAnswerMode && (
               <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-center font-bold">
                 Dit is de juiste oplossing. Klik op 'Opnieuw beginnen' om zelf te oefenen.
               </div>
            )}

            {/* STEP 1: SPLITTING VIEW */}
            {step === 'split' && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-700 mb-2">
                  Stap 1: Verdelen
                </h2>
                <p className="text-slate-500 mb-8">Klik tussen de woorden om de zin in zinsdelen te knippen.</p>
                
                <div className="flex flex-wrap items-center justify-center gap-y-6 text-xl md:text-2xl leading-loose select-none py-4">
                  {currentSentence.tokens.map((token, idx) => (
                    <React.Fragment key={token.id}>
                      <span className="px-2 py-2 hover:bg-slate-50 rounded text-slate-800 font-medium transition-colors">
                        {token.text}
                      </span>
                      
                      {idx < currentSentence.tokens.length - 1 && (
                        <div 
                          onClick={() => toggleSplit(idx)}
                          className={`
                             group relative w-10 h-12 mx-0 cursor-pointer flex items-center justify-center transition-all
                          `}
                        >
                          <div className={`
                            w-1 h-8 rounded-full transition-all duration-200
                            ${splitIndices.has(idx) ? 'bg-blue-500 h-10 shadow-[0_0_12px_rgba(59,130,246,0.6)]' : 'bg-slate-200 group-hover:bg-slate-300'}
                          `}></div>
                          
                          <div className={`
                             absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                             w-7 h-7 bg-white rounded-full shadow-md border flex items-center justify-center text-sm
                             transition-all duration-200 pointer-events-none z-10
                             ${splitIndices.has(idx) ? 'opacity-100 border-blue-500 text-blue-500 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 text-slate-400'}
                          `}>
                            ✂️
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={handleNextStep}
                    className="group px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center gap-3"
                  >
                    Naar benoemen
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LABELING VIEW */}
            {step === 'label' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 
                 {/* Predicate Type Selector */}
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 uppercase">Wat voor soort gezegde is dit?</span>
                    <div className="flex gap-4">
                      <label className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all
                        ${predicateType === 'WG' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 hover:border-slate-300'}
                      `}>
                        <input 
                          type="radio" 
                          name="predicate" 
                          checked={predicateType === 'WG'} 
                          onChange={() => !showAnswerMode && setPredicateType('WG')}
                          className="hidden"
                          disabled={showAnswerMode}
                        />
                        <span>Werkwoordelijk Gezegde (WG)</span>
                      </label>
                      <label className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all
                        ${predicateType === 'NG' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 hover:border-slate-300'}
                      `}>
                        <input 
                          type="radio" 
                          name="predicate" 
                          checked={predicateType === 'NG'} 
                          onChange={() => !showAnswerMode && setPredicateType('NG')}
                          className="hidden"
                          disabled={showAnswerMode}
                        />
                        <span>Naamwoordelijk Gezegde (NG)</span>
                      </label>
                    </div>
                 </div>

                 {/* Toolbar with Roles */}
                 {!showAnswerMode && (
                   <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-2 z-20">
                      <div className="flex flex-col gap-4">
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Zinsdelen & Gezegde delen:</p>
                           <div className="flex flex-wrap gap-2">
                            {ROLES.filter(r => !r.isSubOnly).map(role => (
                              <DraggableRole key={role.key} role={role} onDragStart={handleDragStart} />
                            ))}
                           </div>
                        </div>
                        <div className="border-t pt-3">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sleep op specifieke woorden:</p>
                           <div className="flex flex-wrap gap-2">
                            {ROLES.filter(r => r.isSubOnly).map(role => (
                              <DraggableRole key={role.key} role={role} onDragStart={handleDragStart} />
                            ))}
                           </div>
                        </div>
                      </div>
                   </div>
                 )}

                 {/* The Sentence Chunks Drop Targets */}
                 <div className="flex flex-wrap gap-y-6 gap-x-2 justify-center items-start pt-4 px-2">
                    {userChunks.map((chunk, idx) => {
                      const startTokenId = chunk.tokens[0].id;
                      const assignedRoleKey = chunkLabels[startTokenId];
                      const roleDef = assignedRoleKey ? ROLES.find(r => r.key === assignedRoleKey) || null : null;
                      
                      // Map sub labels for this chunk's tokens
                      const chunkSubRoles: Record<string, RoleDefinition> = {};
                      chunk.tokens.forEach(t => {
                        if (subLabels[t.id]) {
                          const found = ROLES.find(r => r.key === subLabels[t.id]);
                          if (found) chunkSubRoles[t.id] = found;
                        }
                      });

                      const mergeIndex = chunk.originalIndices[chunk.originalIndices.length - 1];

                      return (
                        <React.Fragment key={startTokenId}>
                          <SentenceChunk
                            chunkIndex={idx}
                            tokens={chunk.tokens}
                            startIndex={chunk.originalIndices[0]}
                            assignedRole={roleDef}
                            subRoles={chunkSubRoles}
                            onDropChunk={handleDropChunk}
                            onDropWord={handleDropWord}
                            onRemoveRole={removeLabel}
                            onRemoveSubRole={removeSubLabel}
                            onToggleSplit={toggleSplit}
                            validationState={validationResult?.chunkStatus[idx]}
                          />
                          
                          {idx < userChunks.length - 1 && (
                            <div className="flex items-center self-center px-1">
                              <button 
                                onClick={() => toggleSplit(mergeIndex)}
                                disabled={showAnswerMode}
                                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-300 hover:text-blue-500 border border-slate-200 hover:border-blue-300 flex items-center justify-center transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Samenvoegen"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                              </button>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                 </div>

                 {/* Action Bar */}
                 <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-200 mt-8">
                    <button 
                      onClick={handleBackStep}
                      className="text-slate-500 font-medium hover:text-slate-800 flex items-center gap-2 px-4 py-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path></svg>
                      Terug
                    </button>

                    {!showAnswerMode && (
                      <button 
                        onClick={handleCheck}
                        disabled={Object.keys(chunkLabels).length === 0}
                        className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-green-200 hover:-translate-y-0.5 transition-all"
                      >
                        Controleren
                      </button>
                    )}
                 </div>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 opacity-60 animate-pulse">
             <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-inner">
                ✍️
             </div>
             <p className="text-xl text-slate-600 font-medium">Selecteer bovenaan een zin.</p>
          </div>
        )}
      </main>
    </div>
  );
}
