'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Copy,
  Users,
  Gift,
  Zap,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  CreditCard,
  Package,
  Crown,
  Loader2,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface ReferralStats {
  codeParrain: string
  lienParrainage: string
  totalFilleuls: number
  totalPoints: number
  pointsRestants: number
  boostsDisponibles: number
  pointsParEvenement: {
    inscription: number
    premiereOffre: number
    reservation: number
    abonnementPremium: number
  }
  filleuls: Array<{
    id: string
    filleul: {
      id: string
      nomEntreprise: string
      dateInscription: string
    }
    pointsGagnes: number
    evenements: Array<{
      type: string
      points: number
      date: string
    }>
    dateParrainage: string
  }>
}

export function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)
  const [pointsToConvert, setPointsToConvert] = useState(100)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/referrals')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error loading referral stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConvertPoints = async () => {
    if (!stats || pointsToConvert < 100 || pointsToConvert > stats.pointsRestants) {
      return
    }

    setConverting(true)
    try {
      const response = await fetch('/api/referrals/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointsAConvertir: pointsToConvert }),
      })

      const data = await response.json()
      if (data.success) {
        await loadStats() // Recharger les stats
        setPointsToConvert(100)
        alert(`✅ ${data.data.boostsGagnes} boost(s) ajouté(s) avec succès!`)
      } else {
        alert(`❌ Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error('Error converting points:', error)
      alert('❌ Erreur lors de la conversion')
    } finally {
      setConverting(false)
    }
  }

  const copyReferralLink = () => {
    if (stats) {
      navigator.clipboard.writeText(stats.lienParrainage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'INSCRIPTION_VALIDEE':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'PREMIERE_OFFRE_PUBLIEE':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'RESERVATION_EFFECTUEE':
        return <CreditCard className="h-4 w-4 text-orange-500" />
      case 'ABONNEMENT_PREMIUM':
        return <Crown className="h-4 w-4 text-yellow-500" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'INSCRIPTION_VALIDEE':
        return 'Inscription validée'
      case 'PREMIERE_OFFRE_PUBLIEE':
        return 'Première offre publiée'
      case 'RESERVATION_EFFECTUEE':
        return 'Réservation effectuée'
      case 'ABONNEMENT_PREMIUM':
        return 'Abonnement Premium'
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Erreur lors du chargement des statistiques</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec code et lien */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-orange-600" />
            Mon Parrainage
          </CardTitle>
          <CardDescription>Partagez votre code et gagnez des points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Votre code parrain</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={stats.codeParrain}
                  readOnly
                  className="font-mono font-bold text-lg bg-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyReferralLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Label>Lien de parrainage</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={stats.lienParrainage}
                readOnly
                className="text-sm bg-white"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyReferralLink}
                className="shrink-0"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filleuls</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFilleuls}</div>
              <p className="text-xs text-muted-foreground">Prestataires parrainés</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPoints}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pointsRestants} points disponibles
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Boosts</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.boostsDisponibles}</div>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points convertibles</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(stats.pointsRestants / 100)}
              </div>
              <p className="text-xs text-muted-foreground">Boosts possibles</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Conversion points -> boosts */}
      {stats.pointsRestants >= 100 && (
        <Card>
          <CardHeader>
            <CardTitle>Convertir les points en boosts</CardTitle>
            <CardDescription>
              100 points = 1 boost • Vous avez {stats.pointsRestants} points disponibles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="points">Points à convertir (multiple de 100)</Label>
                <Input
                  id="points"
                  type="number"
                  min="100"
                  max={Math.floor(stats.pointsRestants / 100) * 100}
                  step="100"
                  value={pointsToConvert}
                  onChange={(e) => setPointsToConvert(Number(e.target.value))}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleConvertPoints}
                  disabled={converting || pointsToConvert < 100 || pointsToConvert % 100 !== 0}
                  className="w-full sm:w-auto"
                >
                  {converting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Conversion...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Convertir ({Math.floor(pointsToConvert / 100)} boost)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Détails des points par événement */}
      <Card>
        <CardHeader>
          <CardTitle>Points gagnés par événement</CardTitle>
          <CardDescription>Répartition de vos points selon les actions de vos filleuls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Inscriptions validées</p>
                  <p className="text-sm text-muted-foreground">+100 pts par filleul</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg">
                {stats.pointsParEvenement.inscription} pts
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Premières offres</p>
                  <p className="text-sm text-muted-foreground">+50 pts par offre</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg">
                {stats.pointsParEvenement.premiereOffre} pts
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Réservations</p>
                  <p className="text-sm text-muted-foreground">+150 pts par réservation</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg">
                {stats.pointsParEvenement.reservation} pts
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Abonnements Premium</p>
                  <p className="text-sm text-muted-foreground">+500 pts par abonnement</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg">
                {stats.pointsParEvenement.abonnementPremium} pts
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des filleuls */}
      {stats.filleuls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes filleuls</CardTitle>
            <CardDescription>Liste de tous les prestataires que vous avez parrainés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.filleuls.map((filleul, index) => (
                <motion.div
                  key={filleul.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{filleul.filleul.nomEntreprise}</h4>
                      <p className="text-sm text-muted-foreground">
                        Inscrit le {new Date(filleul.filleul.dateInscription).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      {filleul.pointsGagnes} pts
                    </Badge>
                  </div>
                  {filleul.evenements.length > 0 && (
                    <div className="space-y-2 mt-3 pt-3 border-t">
                      {filleul.evenements.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            <span>{getEventLabel(event.type)}</span>
                          </div>
                          <Badge variant="outline">+{event.points} pts</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


