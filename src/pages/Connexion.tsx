import { Link } from 'react-router-dom'
import StarField from '../ui/StarField'
import Logo from '../ui/Logo'
import { Card } from '../ui/kit'

/** Page de connexion — branchée sur Supabase à l'étape suivante. */
export default function Connexion() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <StarField />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Link to="/">
          <Logo className="h-10" />
        </Link>
        <Card className="w-full max-w-sm p-8 text-center">
          <p className="text-white/70">La connexion arrive à la prochaine étape 🛠️</p>
        </Card>
      </div>
    </div>
  )
}
