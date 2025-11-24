
export type RoleKey = 'pv' | 'ow' | 'lv' | 'mv' | 'bwb' | 'bijv_bep' | 'vv' | 'wg' | 'nwd' | 'bijst';

export type PredicateType = 'WG' | 'NG';

export type DifficultyLevel = 1 | 2 | 3; // 1 = Basis, 2 = Gemiddeld, 3 = Gevorderd

/*
  TODO: ARCHITECTURE FOR COMPOUND SENTENCES (Samengestelde zinnen)
  
  In the future, to support compound sentences, the data structure should evolve from:
  Sentence -> Tokens[]
  
  To a hierarchical structure:
  Sentence -> Clause[] -> Tokens[]

  Proposed Interfaces:
  
  interface Clause {
    id: string;
    type: 'hoofdzin' | 'bijzin';
    tokens: Token[];
    // Each clause is analyzed independently for PV, OW, etc.
  }

  interface ComplexSentence extends Sentence {
    clauses: Clause[];
    conjunctions: Token[]; // Voegwoorden that connect clauses
  }

  UI Changes:
  1. Step 0: Split sentence into clauses (Drag separator between clauses).
  2. Step 1: Analyze per clause (Tabs or accordion for each clause).
*/

export interface Token {
  id: string;
  text: string;
  role: RoleKey; // The main constituent role this word belongs to
  subRole?: RoleKey; // The internal role (e.g. bijv_bep inside an OW)
  newChunk?: boolean; // Explicitly marks the start of a new constituent, even if the role is the same as previous
}

export interface Sentence {
  id: number;
  label: string;
  tokens: Token[];
  predicateType: PredicateType;
  level: DifficultyLevel; // New field for filtering
}

export interface RoleDefinition {
  key: RoleKey;
  label: string;
  shortLabel: string;
  colorClass: string;
  borderColorClass: string;
  isMainOnly?: boolean; // If true, usually applied to chunks
  isSubOnly?: boolean;  // If true, usually applied to words
}

export type PlacementMap = Record<string, RoleKey>; // key is the id of the first token in the chunk OR the specific token id
