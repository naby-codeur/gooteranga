export interface Region {
  id: string
  nom: string
  code: string
  latitude: number
  longitude: number
  description?: string
}

export const regions: Region[] = [
  {
    id: 'dakar',
    nom: 'Dakar',
    code: 'DK',
    latitude: 14.7167,
    longitude: -17.4677,
    description: 'Capitale du Sénégal, ville dynamique et cosmopolite',
  },
  {
    id: 'saint-louis',
    nom: 'Saint-Louis',
    code: 'SL',
    latitude: 16.0333,
    longitude: -16.5,
    description: 'Ancienne capitale, patrimoine historique et culturel',
  },
  {
    id: 'thies',
    nom: 'Thiès',
    code: 'TH',
    latitude: 14.7833,
    longitude: -16.9167,
    description: 'Ville industrielle et culturelle',
  },
  {
    id: 'ziguinchor',
    nom: 'Ziguinchor',
    code: 'ZG',
    latitude: 12.5833,
    longitude: -16.2667,
    description: 'Porte d\'entrée de la Casamance',
  },
  {
    id: 'kaolack',
    nom: 'Kaolack',
    code: 'KL',
    latitude: 14.15,
    longitude: -16.0833,
    description: 'Carrefour commercial important',
  },
  {
    id: 'tambacounda',
    nom: 'Tambacounda',
    code: 'TC',
    latitude: 13.7667,
    longitude: -13.6667,
    description: 'Région de l\'est, riche en faune et flore',
  },
  {
    id: 'matam',
    nom: 'Matam',
    code: 'MT',
    latitude: 15.65,
    longitude: -13.25,
    description: 'Région du fleuve Sénégal',
  },
  {
    id: 'kolda',
    nom: 'Kolda',
    code: 'KD',
    latitude: 12.8833,
    longitude: -14.95,
    description: 'Région de la Haute Casamance',
  },
  {
    id: 'sedhiou',
    nom: 'Sédhiou',
    code: 'SD',
    latitude: 12.7,
    longitude: -15.55,
    description: 'Région de la Moyenne Casamance',
  },
  {
    id: 'kebemer',
    nom: 'Kébémer',
    code: 'KB',
    latitude: 15.3333,
    longitude: -16.4333,
    description: 'Région du nord',
  },
  {
    id: 'fatick',
    nom: 'Fatick',
    code: 'FK',
    latitude: 14.35,
    longitude: -16.4167,
    description: 'Région du Sine-Saloum',
  },
  {
    id: 'louga',
    nom: 'Louga',
    code: 'LG',
    latitude: 15.6167,
    longitude: -16.2167,
    description: 'Région du nord',
  },
  {
    id: 'kafrine',
    nom: 'Kaffrine',
    code: 'KF',
    latitude: 14.1,
    longitude: -15.55,
    description: 'Région du centre',
  },
  {
    id: 'kedougou',
    nom: 'Kédougou',
    code: 'KG',
    latitude: 12.55,
    longitude: -12.1833,
    description: 'Région du sud-est, riche en ressources naturelles',
  },
]

export function getRegionById(id: string): Region | undefined {
  return regions.find((r) => r.id === id)
}

export function getRegionByCode(code: string): Region | undefined {
  return regions.find((r) => r.code === code)
}


