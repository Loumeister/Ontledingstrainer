
import { RoleDefinition, Sentence } from './types';

export const ROLES: RoleDefinition[] = [
  // Core Constituents
  { key: 'pv', label: 'Persoonsvorm', shortLabel: 'PV', colorClass: 'bg-red-50 text-red-700', borderColorClass: 'border-red-200' },
  { key: 'ow', label: 'Onderwerp', shortLabel: 'OW', colorClass: 'bg-blue-50 text-blue-700', borderColorClass: 'border-blue-200' },
  { key: 'lv', label: 'Lijdend Voorwerp', shortLabel: 'LV', colorClass: 'bg-green-50 text-green-700', borderColorClass: 'border-green-200' },
  { key: 'mv', label: 'Meewerkend Voorwerp', shortLabel: 'MV', colorClass: 'bg-purple-50 text-purple-700', borderColorClass: 'border-purple-200' },
  { key: 'bwb', label: 'Bijwoordelijke Bepaling', shortLabel: 'BWB', colorClass: 'bg-orange-50 text-orange-700', borderColorClass: 'border-orange-200' },
  { key: 'vv', label: 'Voorzetselvoorwerp', shortLabel: 'VV', colorClass: 'bg-pink-50 text-pink-700', borderColorClass: 'border-pink-200' },
  { key: 'bijst', label: 'Bijstelling', shortLabel: 'BIJST', colorClass: 'bg-indigo-50 text-indigo-700', borderColorClass: 'border-indigo-200' },
  
  // Predicate Parts (WG/NG)
  { key: 'wg', label: 'Werkwoordelijk Gezegde', shortLabel: 'WG', colorClass: 'bg-rose-100 text-rose-800', borderColorClass: 'border-rose-300' },
  { key: 'nwd', label: 'Naamwoordelijk Deel', shortLabel: 'NWD', colorClass: 'bg-yellow-50 text-yellow-700', borderColorClass: 'border-yellow-200' },

  // Internal Structure
  { key: 'bijv_bep', label: 'Bijvoeglijke Bepaling', shortLabel: 'BB', colorClass: 'bg-teal-50 text-teal-700', borderColorClass: 'border-teal-200', isSubOnly: true },
];

export const SENTENCES: Sentence[] = [
  {
    id: 1,
    label: "Zin 1: Spreeuwen",
    predicateType: 'WG',
    tokens: [
      { id: "s1t1", text: "Gisteravond", role: "bwb" },
      { id: "s1t2", text: "zag", role: "pv" },
      { id: "s1t3", text: "ik", role: "ow" },
      { id: "s1t4", text: "een", role: "lv" },
      { id: "s1t5", text: "zwerm", role: "lv" },
      { id: "s1t6", text: "spreeuwen", role: "lv", subRole: "bijv_bep" },
      { id: "s1t7", text: "overvliegen", role: "wg" }
    ]
  },
  {
    id: 2,
    label: "Zin 2: Kauwgomballen",
    predicateType: 'WG',
    tokens: [
      { id: "s2t1", text: "Op", role: "bwb" },
      { id: "s2t2", text: "de", role: "bwb" },
      { id: "s2t3", text: "hoek", role: "bwb" },
      { id: "s2t4", text: "van", role: "bwb" },
      { id: "s2t5", text: "de", role: "bwb" },
      { id: "s2t6", text: "straat", role: "bwb" },
      { id: "s2t7", text: "staat", role: "pv" },
      { id: "s2t8", text: "een", role: "ow" },
      { id: "s2t9", text: "kauwgomballenautomaat", role: "ow" }
    ]
  },
  {
    id: 3,
    label: "Zin 3: Kat van de buren",
    predicateType: 'WG',
    tokens: [
      { id: "s3t1", text: "Geven", role: "pv" },
      { id: "s3t2", text: "jullie", role: "ow" },
      { id: "s3t3", text: "de", role: "mv" },
      { id: "s3t4", text: "kat", role: "mv" },
      { id: "s3t5", text: "van", role: "mv", subRole: "bijv_bep" },
      { id: "s3t6", text: "de", role: "mv", subRole: "bijv_bep" },
      { id: "s3t7", text: "buren", role: "mv", subRole: "bijv_bep" },
      { id: "s3t8", text: "nu", role: "bwb" },
      { id: "s3t9", text: "een", role: "lv" },
      { id: "s3t10", text: "schoteltje", role: "lv" },
      { id: "s3t11", text: "melk", role: "lv" },
      { id: "s3t12", text: "te", role: "wg" },
      { id: "s3t13", text: "drinken", role: "wg" }
    ]
  },
  {
    id: 4,
    label: "Zin 4: Dokter Piet (NG)",
    predicateType: 'NG',
    tokens: [
      { id: "s4t1", text: "De", role: "ow" },
      { id: "s4t2", text: "jeugdarts", role: "ow" },
      { id: "s4t3", text: "uit", role: "ow", subRole: "bijv_bep" },
      { id: "s4t4", text: "onze", role: "ow", subRole: "bijv_bep" },
      { id: "s4t5", text: "wijk,", role: "ow", subRole: "bijv_bep" },
      { id: "s4t6", text: "dokter", role: "bijst" },
      { id: "s4t7", text: "Piet,", role: "bijst" },
      { id: "s4t8", text: "is", role: "pv" },
      { id: "s4t9", text: "een", role: "nwd" },
      { id: "s4t10", text: "vreselijk", role: "nwd" },
      { id: "s4t11", text: "aardige", role: "nwd" },
      { id: "s4t12", text: "vent", role: "nwd" }
    ]
  },
  {
    id: 5,
    label: "Zin 5: Medewerking",
    predicateType: 'WG',
    tokens: [
      { id: "s5t1", text: "Wij", role: "ow" },
      { id: "s5t2", text: "rekenen", role: "pv" },
      { id: "s5t3", text: "op", role: "vv" },
      { id: "s5t4", text: "uw", role: "vv" },
      { id: "s5t5", text: "medewerking", role: "vv" }
    ]
  },
  {
    id: 6,
    label: "Zin 6: Cor en Mo",
    predicateType: 'WG',
    tokens: [
      { id: "s6t1", text: "Mijn", role: "ow" },
      { id: "s6t2", text: "buurjongens,", role: "ow" },
      { id: "s6t3", text: "Cor", role: "bijst" },
      { id: "s6t4", text: "en", role: "bijst" },
      { id: "s6t5", text: "Mo,", role: "bijst" },
      { id: "s6t6", text: "verlangen", role: "pv" },
      { id: "s6t7", text: "naar", role: "vv" },
      { id: "s6t8", text: "de", role: "vv" },
      { id: "s6t9", text: "vakantie", role: "vv" }
    ]
  },
  {
    id: 7,
    label: "Zin 7: Betere wereld",
    predicateType: 'WG',
    tokens: [
      { id: "s7t1", text: "Geloven", role: "pv" },
      { id: "s7t2", text: "jullie", role: "ow" },
      { id: "s7t3", text: "in", role: "vv" },
      { id: "s7t4", text: "een", role: "vv" },
      { id: "s7t5", text: "betere", role: "vv" },
      { id: "s7t6", text: "wereld?", role: "vv" }
    ]
  },
  {
    id: 8,
    label: "Zin 8: Van slag (NG)",
    predicateType: 'NG',
    tokens: [
      { id: "s8t1", text: "Wij", role: "ow" },
      { id: "s8t2", text: "zijn", role: "pv" },
      { id: "s8t3", text: "totaal", role: "nwd" },
      { id: "s8t4", text: "van", role: "nwd" },
      { id: "s8t5", text: "slag", role: "nwd" }
    ]
  },
  {
    id: 9,
    label: "Zin 9: Beste vriend (NG)",
    predicateType: 'NG',
    tokens: [
      { id: "s9t1", text: "Ik", role: "ow" },
      { id: "s9t2", text: "blijf", role: "pv" },
      { id: "s9t3", text: "altijd", role: "bwb" },
      { id: "s9t4", text: "jouw", role: "nwd" },
      { id: "s9t5", text: "beste", role: "nwd" },
      { id: "s9t6", text: "vriend", role: "nwd" }
    ]
  },
  {
    id: 10,
    label: "Zin 10: Woeste figuur (NG)",
    predicateType: 'NG',
    tokens: [
      { id: "s10t1", text: "Hij", role: "ow" },
      { id: "s10t2", text: "schijnt", role: "pv" },
      { id: "s10t3", text: "een", role: "nwd" },
      { id: "s10t4", text: "nogal", role: "nwd", subRole: "bijv_bep" },
      { id: "s10t5", text: "woeste", role: "nwd" },
      { id: "s10t6", text: "figuur", role: "nwd" },
      { id: "s10t7", text: "te", role: "wg" },
      { id: "s10t8", text: "zijn", role: "wg" },
      { id: "s10t9", text: "geweest", role: "wg" }
    ]
  },
  {
    id: 11,
    label: "Zin 11: De dief",
    predicateType: 'WG',
    tokens: [
      { id: "s11t1", text: "De", role: "ow" },
      { id: "s11t2", text: "dief", role: "ow" },
      { id: "s11t3", text: "schijnt", role: "pv" },
      { id: "s11t4", text: "met", role: "bwb" },
      { id: "s11t5", text: "een", role: "bwb" },
      { id: "s11t6", text: "lamp", role: "bwb" },
      { id: "s11t7", text: "in", role: "bwb" },
      { id: "s11t8", text: "de", role: "bwb" },
      { id: "s11t9", text: "duisternis", role: "bwb" }
    ]
  },
  {
    id: 12,
    label: "Zin 12: Rockster (NG)",
    predicateType: 'NG',
    tokens: [
      { id: "s12t1", text: "Mijn", role: "ow" },
      { id: "s12t2", text: "favoriete", role: "ow", subRole: "bijv_bep" },
      { id: "s12t3", text: "docent", role: "ow" },
      { id: "s12t4", text: "was", role: "pv" },
      { id: "s12t5", text: "in", role: "bwb" },
      { id: "s12t6", text: "een", role: "bwb" },
      { id: "s12t7", text: "vorig", role: "bwb" },
      { id: "s12t8", text: "leven", role: "bwb" },
      { id: "s12t9", text: "rockster", role: "nwd" }
    ]
  },
  {
    id: 13,
    label: "Zin 13: Waverveen",
    predicateType: 'WG',
    tokens: [
      { id: "s13t1", text: "Komen", role: "pv" },
      { id: "s13t2", text: "jullie", role: "ow" },
      { id: "s13t3", text: "morgen", role: "bwb" },
      { id: "s13t4", text: "in", role: "bwb" },
      { id: "s13t5", text: "ons", role: "bwb", subRole: "bijv_bep" },
      { id: "s13t6", text: "tuinhuis", role: "bwb" },
      { id: "s13t7", text: "in", role: "bwb" },
      { id: "s13t8", text: "Waverveen", role: "bwb" },
      { id: "s13t9", text: "lunchen?", role: "wg" }
    ]
  },
  {
    id: 14,
    label: "Zin 14: Waverveense plassen (NG)",
    predicateType: 'NG',
    tokens: [
      { id: "s14t1", text: "Waverveen", role: "ow" },
      { id: "s14t2", text: "is", role: "pv" },
      { id: "s14t3", text: "een", role: "nwd" },
      { id: "s14t4", text: "klein", role: "nwd", subRole: "bijv_bep" },
      { id: "s14t5", text: "gezellig", role: "nwd", subRole: "bijv_bep" },
      { id: "s14t6", text: "dorp", role: "nwd" },
      { id: "s14t7", text: "aan", role: "bwb" },
      { id: "s14t8", text: "de", role: "bwb" },
      { id: "s14t9", text: "Waverveense", role: "bwb" },
      { id: "s14t10", text: "plassen", role: "bwb" }
    ]
  },
  {
    id: 15,
    label: "Zin 15: Trouwpak",
    predicateType: 'WG',
    tokens: [
      { id: "s15t1", text: "Geven", role: "pv" },
      { id: "s15t2", text: "jullie", role: "ow" },
      { id: "s15t3", text: "hem", role: "mv" },
      { id: "s15t4", text: "zijn", role: "lv", subRole: "bijv_bep" },
      { id: "s15t5", text: "trouwpak", role: "lv" },
      { id: "s15t6", text: "mee?", role: "wg" }
    ]
  }
];
