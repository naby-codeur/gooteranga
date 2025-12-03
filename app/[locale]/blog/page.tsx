'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  User, 
  ArrowRight,
  Clock
} from 'lucide-react'

export default function BlogPage() {
  // Articles de blog fictifs - à remplacer par des données réelles plus tard
  const blogPosts = [
    {
      id: 1,
      title: 'Les 10 meilleures plages du Sénégal à visiter en 2024',
      excerpt: 'Découvrez les plus belles plages du Sénégal, de la Petite Côte aux îles du Saloum, pour des vacances inoubliables.',
      author: 'GooTeranga Team',
      date: '15 Mars 2024',
      category: 'Destinations',
      image: '/images/ba1.png',
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Guide complet de la culture sénégalaise pour les voyageurs',
      excerpt: 'Plongez dans la richesse culturelle du Sénégal : traditions, musique, gastronomie et accueil légendaire des Sénégalais.',
      author: 'GooTeranga Team',
      date: '10 Mars 2024',
      category: 'Culture',
      image: '/images/ba2.png',
      readTime: '8 min'
    },
    {
      id: 3,
      title: 'Safari au Sénégal : Parcs nationaux et réserves à explorer',
      excerpt: 'Partez à la découverte de la faune et de la flore sénégalaise dans les plus beaux parcs nationaux du pays.',
      author: 'GooTeranga Team',
      date: '5 Mars 2024',
      category: 'Nature',
      image: '/images/ba3.png',
      readTime: '6 min'
    },
    {
      id: 4,
      title: 'Gastronomie sénégalaise : Les plats incontournables à goûter',
      excerpt: 'Découvrez les saveurs authentiques du Sénégal avec notre guide des plats traditionnels à ne pas manquer.',
      author: 'GooTeranga Team',
      date: '1 Mars 2024',
      category: 'Gastronomie',
      image: '/images/ba4.png',
      readTime: '7 min'
    },
    {
      id: 5,
      title: 'Festivals et événements au Sénégal : Calendrier 2024',
      excerpt: 'Ne manquez pas les plus grands festivals et événements culturels du Sénégal cette année.',
      author: 'GooTeranga Team',
      date: '25 Février 2024',
      category: 'Événements',
      image: '/images/ba5.png',
      readTime: '5 min'
    },
    {
      id: 6,
      title: 'Voyage responsable au Sénégal : Conseils pratiques',
      excerpt: 'Comment voyager de manière responsable et respectueuse au Sénégal tout en soutenant les communautés locales.',
      author: 'GooTeranga Team',
      date: '20 Février 2024',
      category: 'Conseils',
      image: '/images/ba6.png',
      readTime: '6 min'
    }
  ]

  const categories = ['Tous', 'Destinations', 'Culture', 'Nature', 'Gastronomie', 'Événements', 'Conseils']

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Blog GooTeranga
          </h1>
          <p className="text-xl sm:text-2xl text-orange-50 max-w-2xl mx-auto">
            Découvrez le Sénégal à travers nos articles, guides et conseils de voyage
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === 'Tous' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-orange-100 px-4 py-2 text-sm"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                <div className="relative h-48 bg-gradient-to-br from-orange-400 to-yellow-400">
                  <div className="absolute inset-0 bg-black/20" />
                  <Badge className="absolute top-4 left-4 bg-white text-orange-600">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl hover:text-orange-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-600">
                      Lire la suite
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-orange-800 mb-4">
            Restez informé
          </h2>
          <p className="text-muted-foreground mb-8">
            Recevez nos derniers articles et guides de voyage directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-2 rounded-md border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Button className="bg-teranga-orange hover:bg-[#FFD700] text-white">
              S&apos;abonner
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

