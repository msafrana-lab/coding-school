# 👨‍🚀 AstroCode — Guide du parent

Bienvenue ! Ce guide couvre les **3 réglages de départ** (une seule fois), puis l'utilisation au quotidien.

---

## 1. Mettre le site en ligne (30 secondes)

**Option express — glisser-déposer :**
1. Ouvre cette page : **https://app.netlify.com/projects/astrocode-galaxie/deploys**
2. Glisse le fichier **`astrocode-site.zip`** (fourni dans la conversation) sur la zone
   « *Need to update your site? Drag and drop your site output folder here* ».
3. C'est en ligne : **https://astrocode-galaxie.netlify.app** 🎉

**Option définitive — brancher GitHub (2 minutes, ensuite tout est automatique) :**
1. Ouvre **https://app.netlify.com/projects/astrocode-galaxie/configuration/deploys**
2. Clique « **Link repository** » (ou « Link site to Git »), choisis **GitHub**, autorise Netlify.
3. Choisis le dépôt **msafrana-lab/coding-school**, branche **`claude/kids-coding-platform-l45xhv`**.
4. Valide sans rien changer (Netlify lit la configuration tout seul). 
   → Désormais, chaque mise à jour du code se met en ligne automatiquement.

---

## 2. Brancher la connexion (5 minutes)

Ouvre le tableau de bord Supabase : **https://supabase.com/dashboard/project/jccxdwtekvamrpqkdepl**

### a) L'adresse du site (obligatoire, 1 minute)
1. Menu **Authentication** → **URL Configuration**
2. Dans **Site URL**, colle : `https://astrocode-galaxie.netlify.app`
3. Dans **Redirect URLs**, ajoute : `https://astrocode-galaxie.netlify.app/app`
4. **Save**. → La connexion par **email + mot de passe** fonctionne immédiatement.

### b) Le bouton « Continuer avec Google » (10 minutes, quand tu veux)
1. Va sur **https://console.cloud.google.com** → « APIs & Services » → « Credentials »
   → « Create credentials » → « OAuth client ID » → type **Web application**.
2. Dans « Authorized redirect URIs », colle :
   `https://jccxdwtekvamrpqkdepl.supabase.co/auth/v1/callback`
3. Google te donne un **Client ID** et un **Client Secret** → copie-les.
4. Retour dans Supabase : **Authentication** → **Sign In / Providers** → **Google** →
   active, colle les deux valeurs, **Save**.

### c) Conseillé (30 secondes)
**Authentication** → **Sign In / Providers** → options des mots de passe → active
« **Leaked password protection** » (refuse les mots de passe déjà piratés ailleurs).

---

## 3. Essayer tout de suite

Un compte de démonstration est prêt, avec un peu de progression :
- **Email** : `test.famille@astrocode.test`
- **Mot de passe** : `AstroTest!2026`

Pour ta fille : crée son compte (email d'un parent + mot de passe, ou Google une fois activé),
elle choisira son **prénom d'astronaute** et son **avatar** toute seule au premier lancement.

---

## 4. Au quotidien

- **Elle** : ouvre le site → la carte de la galaxie lui montre où continuer. 2-3 missions par séance
  de 30 min, c'est parfait. Le Studio libre (🎮) est ouvert pour créer sans consigne.
- **Toi** : touche son avatar (en haut à droite) → **coin parents** (protégé par une
  multiplication) : progression, étoiles, minutes par jour, série. C'est là aussi qu'on
  coupe les sons et qu'on se déconnecte.
- Chaque compte ne voit **que ses propres données** (règles de sécurité vérifiées en base).

## Le parcours pédagogique (pour info)

8 planètes, ~56 missions, méthode PRIMM (observer → prédire → tester → réparer → créer) :
1. **La Lune** — les ordres · 2. **Boucla** — les boucles · 3. **Choizix** — les choix
4. **Mémora** — les variables · 5. **Fabrika** — les fonctions · 6. **Station Studio** — créer des jeux
7. **Nébula** — le vrai JavaScript · 8. **Le Grand Voyage** — son propre jeu + diplôme à imprimer.
