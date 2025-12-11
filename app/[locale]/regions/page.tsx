'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Star, 
  Waves,
  UtensilsCrossed,
  Mountain,
  Compass,
  Heart,
  Sparkles,
  ArrowRight,
  X,
  Camera,
  Music,
  Palette
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Region {
  id: number
  name: string
  emoji: string
  color: string
  departments: string[]
  tourism: string
  culture: string
  artisanat: string
  images: string[]
  highlights: string[]
  activites?: string[]
  specialites?: string[]
  histoire?: string
  subtitle?: string
}

const regions: Region[] = [
  {
    id: 1,
    name: 'Dakar',
    emoji: '🟦',
    color: 'from-blue-500 to-blue-700',
    subtitle: 'Capitale Vibrante & Cœur du Sénégal Moderne',
    departments: ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque'],
    tourism: 'Une destination internationale : Île de Gorée (UNESCO) - lieu de mémoire mondial, architecture colorée, ruelles historiques. Monument de la Renaissance Africaine - plus haute statue d\'Afrique. Musée des Civilisations Noires - 15 000 ans d\'histoire africaine. Plages : Ngor, Yoff, Almadies, Virage. Corniche ouest - le plus beau coucher de soleil urbain du Sénégal. Vie nocturne : clubs, lounges, rooftops.',
    culture: 'Le centre artistique du pays : Capitale du mbalax, du hip-hop et du jazz. Berceau de la mode sénégalaise (Dakar Fashion Week). Festivals : Partcours Art, Foire Internationale du Livre. Quartiers créatifs : Ouakam, Plateau, Médina.',
    artisanat: 'Entre tradition & modernité : Tableaux de sable, bogolan, bijoux touareg, sculptures. Marchés mythiques : Kermel, Sandaga, Soumbédioune. Haut lieu de la couture africaine (stylisme, broderie, boubou haut de gamme).',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Dakar_-_Panorama_urbain.jpg/330px-Dakar_-_Panorama_urbain.jpg',
      'https://www.sitesofconscience.org/wp-content/uploads/2016/12/img-12-1.jpg',
      'https://www.slate.com/content/dam/slate/blogs/atlas_obscura/2014/08/04/the_african_renaissance_monument_in_dakar_senegal/le_monument_de_la_renaissance_africaine.jpg.CROP.promo-large2.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/89/Dakar_plage_vue_du_ciel.jpg'
    ],
    highlights: ['Île de Gorée (UNESCO)', 'Monument de la Renaissance', 'Musée des Civilisations Noires', 'Plages de Ngor & Yoff', 'Marché Sandaga'],
    activites: ['Visite de l\'Île de Gorée', 'Coucher de soleil sur la Corniche', 'Vie nocturne à Ouakam', 'Shopping au marché Sandaga', 'Découverte du Plateau'],
    specialites: ['Thiébou dieune', 'Yassa', 'Mafé', 'Pastels', 'Bissap']
  },
  {
    id: 2,
    name: 'Thiès',
    emoji: '🟩',
    color: 'from-green-500 to-green-700',
    subtitle: 'Plages, Écotourisme & Luxe Balnéaire',
    departments: ['Thiès', 'Mbour', 'Tivaouane'],
    tourism: 'La Petite Côte : paradis des vacanciers. Stations balnéaires : Saly, Somone, Ngaparou, La Pointe Sarène. Réserve de Bandia : girafes, rhinocéros, zèbres. Accrobaobab : parc aventure unique dans un baobab géant. Sanctuaire de Popenguine : randonnées, panoramas. Croisières dans la lagune de la Somone.',
    culture: 'Tivaouane : cœur spirituel de la Tidianiya. Peuple Sérère : traditions, chants, rites. Fêtes populaires et luttes traditionnelles.',
    artisanat: 'Tissage traditionnel sérère. Coquillages sculptés, vannerie locale. Objets en bois et décorations balnéaires.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/8/81/Plage-Saly.jpg',
      'https://ranchdebandia.com/wp-content/uploads/2024/07/Ranch-de-Bandia-7-856x1024.jpg',
      'https://terroubi.com/media/cache/jadro_resize/rc/7wm3mXKr1763544517/jadroRoot/medias/654a458fb4b81/lagune-de-somone.jpg',
      'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/13/49/dc/99/grande-plage-a-3mn.jpg'
    ],
    highlights: ['Saly', 'Somone', 'Réserve de Bandia', 'Accrobaobab', 'Tivaouane'],
    activites: ['Safari à Bandia', 'Plages de Saly', 'Lagune de Somone', 'Parc Accrobaobab', 'Randonnées à Popenguine'],
    specialites: ['Poissons grillés', 'Fruits de mer', 'Thiébou dieune', 'Couscous de mil']
  },
  {
    id: 3,
    name: 'Saint-Louis',
    emoji: '🟧',
    color: 'from-orange-500 to-orange-700',
    subtitle: 'Élégance Coloniale & Nature Exceptionnelle',
    departments: ['Saint-Louis', 'Dagana', 'Podor'],
    tourism: 'La ville la plus poétique du pays : Île de Saint-Louis (UNESCO) - architecture unique d\'inspiration coloniale. Parc du Djoudj - 3e réserve ornithologique mondiale. Jazz Festival international. Balades en calèche, pêche au filet dans le fleuve.',
    culture: 'Culture Toucouleur et Peule. Ville de poésie, musique, théâtre. Maison des esclaves du Nord.',
    artisanat: 'Cuir artisanal, broderies fines, costumes traditionnels. Art recyclé et matériaux naturels.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/b/b6/Saintlouis_ile_pecheur.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/55/Saintlouis_pont_Faidherbe.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e3/Djoudj_ile_pelican.jpg',
      'https://archiqoo.com/images/gallery/podor.jpg'
    ],
    highlights: ['Île de Saint-Louis (UNESCO)', 'Parc du Djoudj', 'Pont Faidherbe', 'Festival de Jazz', 'Balades en calèche'],
    activites: ['Festival de Jazz', 'Observation d\'oiseaux au Djoudj', 'Balades en calèche', 'Pêche traditionnelle', 'Visite de l\'île historique'],
    specialites: ['Poissons du fleuve', 'Thiébou dieune', 'Yassa de poisson', 'Bissap']
  },
  {
    id: 4,
    name: 'Ziguinchor (Casamance)',
    emoji: '🟥',
    color: 'from-red-500 to-red-700',
    subtitle: 'Le Jardin du Sénégal',
    departments: ['Ziguinchor', 'Oussouye', 'Bignona'],
    tourism: 'Cap Skirring : la plus belle plage d\'Afrique de l\'Ouest. Île de Karabane, vestiges coloniaux. Rivières, bolongs, mangroves. Séjours éco-touristiques (campements, pirogues).',
    culture: 'Peuple Diola : traditions sacrées, danses masquées, bois sacrés. Monarchie d\'Oussouye (roi traditionnel).',
    artisanat: 'Masques, statues, sculptures en bois dur. Paniers tressés, tissus traditionnels.',
    images: [
      'https://i0.wp.com/www.senegal-shuttle.com/wp-content/uploads/2024/03/Noir-Lune-Blog-Banniere-3.png?fit=2240%2C1260&ssl=1',
      'https://discover-senegal.com/wp-content/uploads/2019/05/La-plage-de-Kap-Sparring1.jpg',
      'https://cdn.tripinafrica.com/places/ile-de-carabane.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Roi_d%27Oussouye.jpg'
    ],
    highlights: ['Cap Skirring', 'Île de Karabane', 'Roi d\'Oussouye', 'Mangroves', 'Campements éco-touristiques'],
    activites: ['Plages de Cap Skirring', 'Visite de l\'île Karabane', 'Navigation en pirogue', 'Découverte des bois sacrés', 'Séjours en campements'],
    specialites: ['Riz au poisson', 'Sauce de palme', 'Fruits tropicaux', 'Palmier à huile']
  },
  {
    id: 5,
    name: 'Fatick (Sine-Saloum)',
    emoji: '🟪',
    color: 'from-purple-500 to-purple-700',
    subtitle: 'Royaume du Sine & Magie du Saloum',
    departments: ['Fatick', 'Foundiougne', 'Gossas'],
    tourism: 'Delta du Saloum (UNESCO) : îles, mangroves, dauphins. Île Mar Lodj : village mystique à 3 religions. Birdwatching, pêche traditionnelle.',
    culture: 'Terre des Sérères : légendes, ancêtres, cérémonies initiatiques. Musiques traditionnelles (Njuup).',
    artisanat: 'Objets en coquillages. Vannerie, calebasses gravées.',
    images: [
      'https://www.iisd.org/savi/wp-content/uploads/2020/11/DJI_0040.jpeg',
      'https://upload.wikimedia.org/wikipedia/commons/a/ab/MarLodjCampement.JPG',
      'https://www.visoterra.com/images/original/traversee-a-foundiougne-visoterra-74367.jpg',
      'https://destinationafrique.io/wp-content/uploads/2021/01/Tourisme-Senegal-Mangrove-Sine-Saloum.jpg'
    ],
    highlights: ['Delta du Saloum (UNESCO)', 'Île Mar Lodj', 'Mangroves', 'Birdwatching', 'Pêche traditionnelle'],
    activites: ['Croisière dans le delta', 'Observation des dauphins', 'Visite de Mar Lodj', 'Birdwatching', 'Pêche traditionnelle'],
    specialites: ['Poissons du delta', 'Huîtres', 'Fruits de mer', 'Riz du Sine']
  },
  {
    id: 6,
    name: 'Kédougou',
    emoji: '🟦',
    color: 'from-blue-600 to-indigo-800',
    subtitle: 'La Montagne, l\'Or & les Peuples Ancestraux',
    departments: ['Kédougou', 'Saraya', 'Salémata'],
    tourism: 'Chutes de Dindéfelo : 100 m de chute, eau glacée. Parc du Niokolo Koba : lions, éléphants, buffles. Villages Bedik et Bassari : architecture unique.',
    culture: 'Rites initiatiques Bassari (UNESCO). Danses guerrières, masques, peintures rituelles.',
    artisanat: 'Bijoux en bronze, armes symboliques, masques tribaux.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/6/69/Dindefelo.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/BedikVillage.jpg/1200px-BedikVillage.jpg',
      'https://discover-senegal.com/wp-content/uploads/2019/10/Parc-national-du-niokolo-Koba_Slider1.jpg',
      'https://www.senegal-shuttle.com/wp-content/uploads/2022/02/the-waterfall-of-dindefelo.jpg'
    ],
    highlights: ['Chutes de Dindéfelo', 'Parc du Niokolo Koba', 'Villages Bedik & Bassari', 'Rites initiatiques (UNESCO)', 'Montagnes du Fouta'],
    activites: ['Randonnée aux chutes', 'Safari au Niokolo Koba', 'Visite des villages Bedik', 'Observation des rites', 'Trekking en montagne'],
    specialites: ['Miel de montagne', 'Fruits sauvages', 'Cuisine traditionnelle bassari']
  },
  {
    id: 7,
    name: 'Kaolack',
    emoji: '🟫',
    color: 'from-amber-600 to-amber-800',
    subtitle: 'Carrefour commercial & Spirituel du Centre-Sud',
    departments: ['Kaolack', 'Nioro', 'Guinguinéo'],
    tourism: 'Grand Marché de Kaolack : l\'un des plus grands d\'Afrique. Mosquée de Medina Baye : capitale de la Tijaniyya Niassène. Bord du Saloum & marais salants.',
    culture: 'Ville religieuse & carrefour des cultures (wolof, sérère, peule).',
    artisanat: 'Encens, parfums, cuir, tissage local. Objets sculptés et teintures artisanales.',
    images: [
      'https://media.routard.com/image/36/1/kaolack-senegal-marche.1514361.w430.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/d/d6/Saloum.gif',
      'https://pbs.twimg.com/media/Ec5Wyg3X0AUcciC.jpg'
    ],
    highlights: ['Grand Marché', 'Mosquée Medina Baye', 'Fleuve Saloum', 'Marais salants'],
    activites: ['Shopping au grand marché', 'Visite de la mosquée', 'Découverte des marais salants', 'Navigation sur le Saloum'],
    specialites: ['Arachides', 'Sel', 'Poissons du Saloum', 'Encens']
  },
  {
    id: 8,
    name: 'Kaffrine',
    emoji: '🟫',
    color: 'from-amber-600 to-amber-800',
    subtitle: 'Terre des Sérères et Authenticité Rurale',
    departments: ['Kaffrine', 'Koungheul', 'Birkilane', 'Malem-Hodar'],
    tourism: 'Villages sérères authentiques. Champs d\'arachide, paysages agricoles. Marchés ruraux typiques.',
    culture: 'Chants, danses, contes sérères.',
    artisanat: 'Poterie, ustensiles en bois, paniers tressés.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/1/1b/Map_of_the_departments_of_the_Kaffrine_region_of_Senegal.png',
      'https://upload.wikimedia.org/wikipedia/commons/4/4a/VillageS%C3%A9r%C3%A8re.jpg',
      'https://cdn.shopify.com/s/files/1/2341/3995/articles/VfC0U8jQ-scaled.jpg'
    ],
    highlights: ['Villages traditionnels', 'Paysages agricoles', 'Luttes traditionnelles', 'Culture sérère'],
    activites: ['Visite de villages', 'Découverte de l\'agriculture', 'Marchés ruraux', 'Luttes traditionnelles'],
    specialites: ['Arachides', 'Mil', 'Sesame', 'Miel']
  },
  {
    id: 9,
    name: 'Louga',
    emoji: '🟫',
    color: 'from-amber-600 to-amber-800',
    subtitle: 'Désert, Pastoral & Traditions',
    departments: ['Louga', 'Linguère', 'Kébémer'],
    tourism: 'Désert de Lompoul : dunes orangées, bivouac saharien. Musique, danse pastorale peule.',
    culture: 'Festivals de folklore, fanfares. Traditions peules et wolof.',
    artisanat: 'Cuir, tissage pastoral, bijoux berbères.',
    images: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/95/40/ea/caption.jpg',
      'https://africalia.be/wp-content/uploads/2022/06/arton784-jpg.webp',
      'https://upload.wikimedia.org/wikipedia/commons/9/93/Linguere_arrondissements.png',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/f6/f7/f4/visiter-le-desert-de.jpg'
    ],
    highlights: ['Désert de Lompoul', 'Dunes orangées', 'Bivouac saharien', 'Festivals de folklore'],
    activites: ['Bivouac dans le désert', 'Festivals de musique', 'Découverte du pastoralisme', 'Randonnées dans les dunes'],
    specialites: ['Lait de chamelle', 'Viande de mouton', 'Couscous', 'Thé à la menthe']
  },
  {
    id: 10,
    name: 'Diourbel',
    emoji: '🟫',
    color: 'from-amber-600 to-amber-800',
    subtitle: 'Terre du Mouridisme & Patrimoine Spirituel',
    departments: ['Diourbel', 'Bambey', 'Mbacké'],
    tourism: 'Touba : ville sainte, grande mosquée. Architecture unique, marbre, minarets.',
    culture: 'Héritage de Cheikh Ahmadou Bamba. Magal de Touba : millions de pèlerins.',
    artisanat: 'Chapelets, calligraphies arabes, caftans, broderies.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/7/79/Ville_touba_mosquee.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/d/d5/Grande_mosqu%C3%A9e_de_Touba.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/18/AhmaduBamba.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b6/Diourbel_in_Senegal.svg'
    ],
    highlights: ['Touba', 'Grande Mosquée', 'Magal de Touba', 'Mausolée de Cheikh Ahmadou Bamba'],
    activites: ['Pèlerinage à Touba', 'Visite de la grande mosquée', 'Magal de Touba', 'Découverte du patrimoine mouride'],
    specialites: ['Café Touba', 'Dates', 'Miel', 'Couscous']
  },
  {
    id: 11,
    name: 'Matam',
    emoji: '🟫',
    color: 'from-amber-600 to-amber-800',
    subtitle: 'La Vallée du Fleuve & Culture Peule',
    departments: ['Matam', 'Ranérou', 'Kanel'],
    tourism: 'Fleuve Sénégal : pêche, pirogues. Déserts et oasis.',
    culture: 'Culture peule : musique, danses, tenues traditionnelles. Hospitalité légendaire.',
    artisanat: 'Bijoux en argent, cuir, tissus peuls.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/S%C3%A9n%C3%A9gal_-_D%C3%A9partements_de_Matam_2018.svg/330px-S%C3%A9n%C3%A9gal_-_D%C3%A9partements_de_Matam_2018.svg.png',
      'https://s.france24.com/media/display/7b45ac62-7db6-11f0-871e-005056bfb2b6/w%3A1280/p%3A16x9/capture-5935941768a5ad7b228760-28267986.jpg',
      'https://www.au-senegal.com/IMG/jpg/carte-vallee-senegal.jpg'
    ],
    highlights: ['Fleuve Sénégal', 'Villages peuls', 'Oasis', 'Traditions pastorales'],
    activites: ['Navigation sur le fleuve', 'Pêche traditionnelle', 'Découverte des villages peuls', 'Oasis du désert'],
    specialites: ['Poissons du fleuve', 'Lait de chamelle', 'Viande de mouton', 'Dattes']
  },
  {
    id: 12,
    name: 'Sédhiou',
    emoji: '🟫',
    color: 'from-amber-600 to-amber-800',
    subtitle: 'Casamance Verte & Héritage Mandingue',
    departments: ['Sédhiou', 'Goudomp', 'Bounkiling'],
    tourism: 'Rizières, fleuves, forêts luxuriantes. Villages mandingues.',
    culture: 'Musique au balafon, contes mandingues.',
    artisanat: 'Sculptures, instruments de musique, poterie.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/5/5c/Map_of_the_departments_of_the_S%C3%A9dhiou_region_of_Senegal.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fleuve_casamance.jpg/1200px-Fleuve_casamance.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e4/Tendaba_de_Goudomp.jpg'
    ],
    highlights: ['Rizières', 'Fleuve Casamance', 'Forêts luxuriantes', 'Culture mandingue'],
    activites: ['Découverte des rizières', 'Navigation sur le fleuve', 'Musique au balafon', 'Visite de villages mandingues'],
    specialites: ['Riz de Casamance', 'Poissons', 'Fruits tropicaux', 'Palmier à huile']
  },
  {
    id: 13,
    name: 'Kolda',
    emoji: '🟫',
    color: 'from-amber-600 to-amber-800',
    subtitle: 'Nature, Pastoralisme & Diversité',
    departments: ['Kolda', 'Médina Yoro Foula', 'Vélingara'],
    tourism: 'Régions vertes, rivières, forêts. Observation d\'oiseaux et pastoralisme.',
    culture: 'Cultures peule, mandingue & balante.',
    artisanat: 'Couvertures tissées, cuir, percussions.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/c/c6/Kolda-bradybd.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/f/f2/Map_of_the_departments_of_the_Kolda_region_of_Senegal.png',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/74/fb/79/parc-national-du-niokolo.jpg'
    ],
    highlights: ['Parc du Niokolo Koba', 'Rivières', 'Forêts', 'Pastoralisme'],
    activites: ['Observation d\'oiseaux', 'Découverte du pastoralisme', 'Randonnées en forêt', 'Navigation sur les rivières'],
    specialites: ['Riz', 'Arachides', 'Miel', 'Fruits']
  },
  {
    id: 14,
    name: 'Tambacounda',
    emoji: '🟫',
    color: 'from-amber-600 to-amber-800',
    subtitle: 'Le Géant de l\'Est',
    departments: ['Tamba', 'Goudiry', 'Koumpentoum', 'Bakel'],
    tourism: 'Parc du Niokolo Koba (UNESCO). Falaises de Dindéférlo. Gastronomie épicée.',
    culture: 'Influences soninké et mandingues.',
    artisanat: 'Tambours, masques, perles traditionnelles.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Map_of_the_departments_of_the_Tambacounda_region_of_Senegal.png/250px-Map_of_the_departments_of_the_Tambacounda_region_of_Senegal.png',
      'https://upload.wikimedia.org/wikipedia/commons/d/d5/River_gambia_Niokolokoba_National_Park.gif',
      'https://discover-senegal.com/wp-content/uploads/2019/10/Parc-national-du-niokolo-Koba_Slider1.jpg'
    ],
    highlights: ['Parc du Niokolo Koba (UNESCO)', 'Falaises', 'Paysages sauvages', 'Culture soninké'],
    activites: ['Safari au Niokolo Koba', 'Randonnées aux falaises', 'Observation de la faune', 'Découverte culturelle'],
    specialites: ['Viande grillée', 'Riz', 'Épices', 'Miel']
  },
]

export default function RegionsPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  const backgroundImages = [
    '/images/ba1.jpg',
    '/images/ba2.jpg',
    '/images/ba3.webp',
    '/images/ba4.jpg',
    '/images/ba5.jpg',
    '/images/ba6.jpg',
    '/images/ba7.jpeg',
    '/images/ba8.jpg',
    '/images/ba9.jpg',
    '/images/ba10.jpg',
  ]

  // Carrousel automatique des images de fond
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center">
        {/* Carrousel d'images de fond */}
        <div className="absolute inset-0 w-full h-full">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentBgIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          ))}
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-yellow-500/30 to-red-500/30 z-10"></div>
          {/* Overlay gradient du bas vers le haut pour le texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-10"></div>
        </div>
        <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4 sm:mb-6"
            >
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-yellow-500" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent px-2">
              Les 14 Régions du Sénégal
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6 max-w-3xl mx-auto leading-relaxed px-2 drop-shadow-md">
              Le Sénégal est un pays où chaque région raconte une histoire différente
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 px-2">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 flex-shrink-0" />
                <span className="text-center sm:text-left">Des plages qui rivalisent avec celles des Caraïbes</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-300 flex-shrink-0" />
                <span className="text-center sm:text-left">Des traditions millénaires</span>
              </div>
              <div className="flex items-center gap-2">
                <Mountain className="h-4 w-4 sm:h-5 sm:w-5 text-green-300 flex-shrink-0" />
                <span className="text-center sm:text-left">Des paysages du désert aux montagnes</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2">
              <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base bg-orange-500 text-white">
                <Compass className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Tourisme
              </Badge>
              <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base bg-yellow-500 text-white">
                <Music className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Culture
              </Badge>
              <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base bg-green-500 text-white">
                <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Artisanat
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {regions.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className="h-full"
              >
                <Card 
                  className="overflow-hidden cursor-pointer h-full border-2 hover:border-orange-500 transition-all duration-300 group"
                  onClick={() => setSelectedRegion(region)}
                >
                  <div className={`relative h-40 sm:h-44 md:h-48 bg-gradient-to-br ${region.color} overflow-hidden`}>
                    {/* Image de fond pour la région */}
                    {region.images && region.images.length > 0 && (
                      <div 
                        className="absolute inset-0 w-full h-full"
                        style={{
                          backgroundImage: `url(${region.images[0]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    )}
                    {/* Overlay avec gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 group-hover:from-black/50 group-hover:via-black/30 group-hover:to-black/50 transition-colors"></div>
                    {/* Emoji par-dessus l'image */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-lg">{region.emoji}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-10">
                      <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">{region.name}</h3>
                      <p className="text-xs sm:text-sm text-white/90 drop-shadow-md">{region.departments.length} départements</p>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{region.departments.slice(0, 2).join(', ')}...</span>
                      </div>
                      <p className="text-xs sm:text-sm line-clamp-2 leading-relaxed">{region.tourism}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full mt-3 sm:mt-4 text-xs sm:text-sm group-hover:bg-orange-500 group-hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRegion(region)
                      }}
                    >
                      Découvrir
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal pour les détails de la région */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedRegion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-auto"
            >
              {/* Header avec image */}
              <div className={`relative h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br ${selectedRegion.color} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl">{selectedRegion.emoji}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 break-words">{selectedRegion.name}</h2>
                      {selectedRegion.subtitle && (
                        <p className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2 italic break-words">{selectedRegion.subtitle}</p>
                      )}
                      <p className="text-white/90 text-xs sm:text-sm break-words">Départements : {selectedRegion.departments.join(', ')}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                      onClick={() => setSelectedRegion(null)}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Highlights */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    Points d&apos;intérêt
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs sm:text-sm">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tourisme */}
                <div className="p-3 sm:p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-blue-700">
                    <Compass className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span>🌍 Tourisme</span>
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3 leading-relaxed">{selectedRegion.tourism}</p>
                  {selectedRegion.activites && selectedRegion.activites.length > 0 && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-blue-200">
                      <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1 sm:mb-2">Activités recommandées :</p>
                      <ul className="space-y-1">
                        {selectedRegion.activites.map((activite, index) => (
                          <li key={index} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                            <span>{activite}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Culture */}
                <div className="p-3 sm:p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-yellow-700">
                    <Music className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span>🎭 Culture</span>
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{selectedRegion.culture}</p>
                </div>

                {/* Artisanat */}
                <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-green-700">
                    <Palette className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span>🧵 Artisanat</span>
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{selectedRegion.artisanat}</p>
                </div>

                {/* Spécialités culinaires */}
                {selectedRegion.specialites && selectedRegion.specialites.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-orange-700">
                      <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span>🍽️ Spécialités Culinaires</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegion.specialites.map((specialite, index) => (
                        <Badge key={index} variant="outline" className="text-xs sm:text-sm bg-white">
                          {specialite}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images */}
                {selectedRegion.images.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      Galerie
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      {selectedRegion.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative h-24 sm:h-28 md:h-32 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={`${selectedRegion.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/ba1.png'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4">
                  <Button asChild size="sm" className="flex-1 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Link href={`/explorer?region=${selectedRegion.name.toLowerCase()}`}>
                      Explorer les offres
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() => setSelectedRegion(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

