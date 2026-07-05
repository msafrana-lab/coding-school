import { Link } from 'react-router-dom'
import StarField from '../ui/StarField'
import Cosmo from '../ui/Cosmo'
import Logo from '../ui/Logo'
import Planet from '../ui/Planet'
import { Button, Card, Pill, SpeechBubble } from '../ui/kit'

const steps = [
  {
    emoji: '🗺️',
    title: 'Explore la galaxie',
    text: '8 planètes, chacune t’apprend une grande idée du code : les ordres, les boucles, les choix…',
  },
  {
    emoji: '🧩',
    title: 'Résous des missions',
    text: 'Assemble des blocs en français pour piloter ta fusée, ramasser des cristaux et éviter les astéroïdes.',
  },
  {
    emoji: '🎮',
    title: 'Crée ton propre jeu',
    text: 'À la fin du voyage, tu sais écrire du vrai code et tu fabriques ton jeu de A à Z. Diplôme à la clé !',
  },
]

const planets = [
  { color: '#B79CFF', name: 'La Lune', idea: 'Les ordres' },
  { color: '#3EDDF2', name: 'Boucla', idea: 'Les boucles' },
  { color: '#FFD23F', name: 'Choizix', idea: 'Les choix' },
  { color: '#FF8A9B', name: 'Mémora', idea: 'La mémoire' },
  { color: '#5CE8A4', name: 'Fabrika', idea: 'Les ateliers' },
  { color: '#A88BFF', name: 'Studio', idea: 'Tes jeux', ring: true },
  { color: '#17C3DE', name: 'Nébula', idea: 'Le vrai code' },
  { color: '#F7B910', name: 'Grand Final', idea: 'Ton projet', ring: true },
]

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />

      {/* Barre du haut */}
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <Link to="/connexion">
          <Button variant="ghost" size="sm">Se connecter</Button>
        </Link>
      </header>

      {/* Héros */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <section className="flex flex-col items-center gap-8 pb-16 pt-8 text-center sm:pt-14">
          <Pill className="bg-nebula-500/25 text-nebula-300 border border-nebula-500/40">
            ✨ Pour les explorateurs de 8 à 12 ans
          </Pill>

          <h1 className="max-w-2xl text-balance text-4xl font-bold leading-tight sm:text-6xl">
            Apprends à coder en explorant{' '}
            <span className="bg-gradient-to-r from-nebula-400 via-comet-400 to-star-400 bg-clip-text text-transparent">
              la galaxie
            </span>
          </h1>

          <p className="max-w-xl text-balance text-lg text-white/80">
            Des blocs faciles au vrai code : pilote ta fusée, résous des missions
            et deviens capable de créer ton propre jeu vidéo.
          </p>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="animate-pop-in">
              <SpeechBubble tail="bottom" className="mb-2">
                Prête pour le décollage&nbsp;? 🚀
              </SpeechBubble>
              <Cosmo pose="hello" float className="mx-auto h-40 w-40 sm:h-48 sm:w-48" />
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/connexion">
                <Button size="lg" className="w-64">🚀 Commencer l’aventure</Button>
              </Link>
              <Link to="/demo">
                <Button variant="ghost" size="lg" className="w-64">Essayer une mission</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="pb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Comment ça marche ?</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={i} className="p-6 text-center animate-slide-up" >
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-space-700 text-4xl">
                  {s.emoji}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-white/70">{s.text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Le voyage */}
        <section className="pb-16">
          <h2 className="mb-2 text-center text-3xl font-bold">Le voyage</h2>
          <p className="mb-8 text-center text-white/70">
            Une planète après l’autre, du tout premier « avance ! » jusqu’à ton propre jeu.
          </p>
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-8">
            {planets.map((p, i) => (
              <div key={p.name} className="flex min-w-[110px] snap-center flex-col items-center gap-1">
                <Planet color={p.color} ring={p.ring} className="h-20 w-20" />
                <span className="text-xs font-bold text-white/50">Étape {i + 1}</span>
                <span className="font-display font-semibold">{p.name}</span>
                <span className="text-sm text-white/60">{p.idea}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pour les parents */}
        <section className="pb-20">
          <Card className="flex flex-col items-center gap-6 p-8 sm:flex-row">
            <div className="text-5xl">🔭</div>
            <div>
              <h2 className="mb-2 text-2xl font-bold">Le coin des parents</h2>
              <ul className="grid gap-1.5 text-white/75 sm:grid-cols-2">
                <li>✅ Méthode inspirée des écoles reconnues : observer, tester, réparer, créer</li>
                <li>✅ Passage progressif des blocs visuels au vrai code (JavaScript)</li>
                <li>✅ Suivi simple de la progression, protégé par une porte adulte</li>
                <li>✅ Sans publicité — chaque enfant ne voit que ses propres données</li>
              </ul>
            </div>
          </Card>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-sm text-white/50">
        Fait avec 💜 pour les astronautes en herbe — AstroCode
      </footer>
    </div>
  )
}
