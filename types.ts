
export type RoleKey = 'pv' | 'ow' | 'lv' | 'mv' | 'bwb' | 'bijv_bep' | 'vv' | 'wg' | 'nwd' | 'bijst';

export type PredicateType = 'WG' | 'NG';

export interface Token {
  id: string;
  text: string;
  role: RoleKey; // The main constituent role this word belongs to
  subRole?: RoleKey; // The internal role (e.g. bijv_bep inside an OW)
}

export interface Sentence {
  id: number;
  label: string;
  tokens: Token[];
  predicateType: PredicateType;
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
