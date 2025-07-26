// LinkedOut - Mock Data for React Application

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  title: string;
  unemploymentStart: string;
  avatar?: string;
  skills: Skill[];
  connections: string[];
  badges: UserBadge[];
  bio: string;
  failures: string[];
}

export interface Skill {
  name: string;
  endorsements: number;
}

export interface UserBadge {
  id: string;
  earned: boolean;
  earnedDate?: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  likedBy: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  tags: string[];
  posted: string;
  applications: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Sample users data
export const SAMPLE_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Jean Glandeur',
    email: 'test@linkedout.com',
    password: 'password123',
    title: 'Expert en procrastination avancée',
    unemploymentStart: '2023-01-15',
    avatar: '',
    skills: [
      { name: 'Netflix Expert', endorsements: 47 },
      { name: 'Maître du scroll infini', endorsements: 32 },
      { name: 'Champion de sieste', endorsements: 28 },
      { name: 'Procrastination professionnelle', endorsements: 41 },
      { name: 'Évitement d\'entretiens', endorsements: 19 }
    ],
    connections: ['user_2', 'user_3', 'user_4'],
    badges: [
      { id: 'unemployed_100', earned: true, earnedDate: '2023-04-25' },
      { id: 'netflix_master', earned: true, earnedDate: '2023-02-10' },
      { id: 'no_interview', earned: true, earnedDate: '2023-03-01' }
    ],
    bio: 'Passionné de l\'art de ne rien faire avec style. Spécialiste reconnu en optimisation du temps libre et en maximisation du confort domestique.',
    failures: [
      'Refusé chez McDo pour "surqualification"',
      'Endormi pendant un entretien Zoom',
      'Confondu "motivation" avec "procrastination" dans une lettre de motivation'
    ]
  },
  {
    id: 'user_2',
    name: 'Marie Flemmeuse',
    email: 'marie@linkedout.com',
    password: 'password123',
    title: 'Ambassadrice du manque de motivation',
    unemploymentStart: '2022-08-20',
    avatar: '',
    skills: [
      { name: 'Reine des séries TV', endorsements: 52 },
      { name: 'Experte en livraison à domicile', endorsements: 38 },
      { name: 'Maîtrise des réseaux sociaux', endorsements: 45 },
      { name: 'Optimisation de pyjama', endorsements: 29 }
    ],
    connections: ['user_1', 'user_3', 'user_5'],
    badges: [
      { id: 'unemployed_365', earned: true, earnedDate: '2023-08-20' },
      { id: 'couch_expert', earned: true, earnedDate: '2022-12-01' },
      { id: 'delivery_master', earned: true, earnedDate: '2023-01-15' }
    ],
    bio: 'Consultante freelance en optimisation de temps libre. Experte en transformation digitale du canapé en bureau.',
    failures: [
      'Arrivée en retard à un entretien... qui était la semaine précédente',
      'Démission par email le premier jour',
      'Créé un CV uniquement avec des émojis'
    ]
  },
  {
    id: 'user_3',
    name: 'Paul Branleur',
    email: 'paul@linkedout.com',
    password: 'password123',
    title: 'Directeur général de ma chambre',
    unemploymentStart: '2023-05-10',
    avatar: '',
    skills: [
      { name: 'Gaming professionnel', endorsements: 67 },
      { name: 'Évitement de responsabilités', endorsements: 34 },
      { name: 'Spécialiste du "j\'ai pas vu le temps passer"', endorsements: 23 },
      { name: 'Maître des excuses créatives', endorsements: 41 }
    ],
    connections: ['user_1', 'user_2', 'user_4', 'user_5'],
    badges: [
      { id: 'gamer_elite', earned: true, earnedDate: '2023-06-01' },
      { id: 'excuse_master', earned: true, earnedDate: '2023-07-15' }
    ],
    bio: 'CEO de ma propre entreprise de développement personnel (aka rester au lit). Innovation dans le domaine du nothing-as-a-service.',
    failures: [
      'Oublié que j\'avais un travail pendant 3 semaines',
      'Appelé mon patron "maman" en visio',
      'Vendu mon ordinateur de bureau... avant de démissionner'
    ]
  },
  {
    id: 'user_4',
    name: 'Sophie Cossarde',
    email: 'sophie@linkedout.com',
    password: 'password123',
    title: 'Influenceuse en paresse stratégique',
    unemploymentStart: '2022-11-30',
    avatar: '',
    skills: [
      { name: 'Content creation sur canapé', endorsements: 29 },
      { name: 'Maîtrise des filtres Instagram', endorsements: 44 },
      { name: 'Experte en brunch tardif', endorsements: 31 },
      { name: 'Yoga du lit', endorsements: 26 }
    ],
    connections: ['user_1', 'user_3', 'user_5'],
    badges: [
      { id: 'social_media_legend', earned: true, earnedDate: '2023-02-14' },
      { id: 'brunch_expert', earned: true, earnedDate: '2023-04-01' }
    ],
    bio: 'Lifestyle coach spécialisée dans l\'art de vivre sans contraintes. Fondatrice de la méthode "Productivity? Never heard of it!"',
    failures: [
      'Candidature refusée pour "manque d\'enthousiasme apparent"',
      'Créé un business plan pour une entreprise de rien',
      'Organisé une conférence sur la motivation... puis n\'y suis pas allée'
    ]
  },
  {
    id: 'user_5',
    name: 'Thomas Glandu',
    email: 'thomas@linkedout.com',
    password: 'password123',
    title: 'Consultant en optimisation de temps libre',
    unemploymentStart: '2023-03-01',
    avatar: '',
    skills: [
      { name: 'Philosophie du week-end permanent', endorsements: 35 },
      { name: 'Maître des pauses café prolongées', endorsements: 27 },
      { name: 'Expert en reports d\'échéances', endorsements: 39 },
      { name: 'Spécialiste en "je ferais ça demain"', endorsements: 42 }
    ],
    connections: ['user_2', 'user_3', 'user_4'],
    badges: [
      { id: 'procrastination_god', earned: true, earnedDate: '2023-05-20' },
      { id: 'coffee_break_champion', earned: true, earnedDate: '2023-04-10' }
    ],
    bio: 'Philosophe moderne spécialisé dans l\'étude approfondie du concept de "plus tard". Doctorat en Sciences de l\'Évitement.',
    failures: [
      'Raté un entretien car j\'ai oublié quelle entreprise c\'était',
      'Démissionné par accident en envoyant le mauvais email',
      'Créé un CV de 47 pages... sans informations pertinentes'
    ]
  }
];

// Sample posts for the feed
export const SAMPLE_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_1',
    content: 'Jour 412 sans emploi ! Nouveau record personnel 🏆 Je commence à maîtriser l\'art de regarder Netflix sans culpabiliser. Prochaine étape : devenir consultant en binge-watching !',
    timestamp: '2024-01-25T10:30:00Z',
    likes: 23,
    comments: 8,
    likedBy: ['user_2', 'user_3', 'user_5']
  },
  {
    id: 'post_2',
    userId: 'user_2',
    content: 'Mes parents : "Tu fais quoi de tes journées ?" \nMoi : "Je travaille sur mes projets personnels" \n*Regarde 8h de TikTok* \n\nC\'est techniquement vrai, non ? 🤷‍♀️',
    timestamp: '2024-01-24T15:45:00Z',
    likes: 34,
    comments: 12,
    likedBy: ['user_1', 'user_3', 'user_4', 'user_5']
  },
  {
    id: 'post_3',
    userId: 'user_3',
    content: 'Update sur ma recherche d\'emploi : j\'ai enfin mis à jour mon CV ! \n\nPar "mis à jour", j\'entends que j\'ai changé l\'année de 2022 à 2024. Progress is progress ! 💪',
    timestamp: '2024-01-24T09:15:00Z',
    likes: 19,
    comments: 6,
    likedBy: ['user_1', 'user_2', 'user_4']
  },
  {
    id: 'post_4',
    userId: 'user_4',
    content: 'J\'ai découvert que se lever après 14h permet d\'éviter les appels des recruteurs ! Life hack level : expert 😎 \n\n#UnemploymentLife #Optimization #Genius',
    timestamp: '2024-01-23T16:20:00Z',
    likes: 28,
    comments: 15,
    likedBy: ['user_2', 'user_3', 'user_5']
  },
  {
    id: 'post_5',
    userId: 'user_5',
    content: 'Philosophie du jour : Pourquoi chercher un emploi quand on peut chercher le sens de la vie ? \n\nSpoiler alert : je l\'ai trouvé, c\'est dans le frigo 🍕',
    timestamp: '2024-01-23T11:00:00Z',
    likes: 41,
    comments: 20,
    likedBy: ['user_1', 'user_2', 'user_3', 'user_4']
  },
  {
    id: 'post_6',
    userId: 'user_1',
    content: 'Ma mère : "Et ton entretien d\'hier ?" \nMoi : "Quel entretien ?" \nMa mère : "Celui que tu avais prévu" \nMoi : "Ah oui... j\'ai oublié" \n\nClassic me ! 😅',
    timestamp: '2024-01-22T20:30:00Z',
    likes: 16,
    comments: 9,
    likedBy: ['user_2', 'user_5']
  },
  {
    id: 'post_7',
    userId: 'user_2',
    content: 'Nouveau skill débloqué : Commander 3 repas différents sur Uber Eats pour "comparer les qualités" 🍔🍕🍜 \n\nC\'est de la recherche culinaire, merci.',
    timestamp: '2024-01-22T13:45:00Z',
    likes: 25,
    comments: 7,
    likedBy: ['user_1', 'user_3', 'user_4']
  },
  {
    id: 'post_8',
    userId: 'user_3',
    content: 'Aujourd\'hui j\'ai appliqué à 0 emplois mais j\'ai battu mon record au solitaire ! Priorities ✨ \n\nQui a dit que les compétences gaming n\'étaient pas transférables ?',
    timestamp: '2024-01-21T14:20:00Z',
    likes: 22,
    comments: 11,
    likedBy: ['user_1', 'user_4', 'user_5']
  }
];

// Sample job offers (parody)
export const SAMPLE_JOBS: Job[] = [
  {
    id: 'job_1',
    title: 'Testeur de Canapé Professionnel',
    company: 'Ikea (pas vraiment)',
    location: 'Domicile',
    salary: '0€/h + confort maximal',
    type: 'CDI',
    description: 'Nous recherchons un expert en confort pour tester nos canapés pendant 8h/jour minimum. Expérience en Netflix obligatoire.',
    requirements: [
      '5+ années d\'expérience en position allongée',
      'Maîtrise des télécommandes multiples',
      'Capacité à rester immobile pendant des heures',
      'Formation en critique de séries TV'
    ],
    tags: ['Confort', 'Télétravail', 'Passion', 'Innovation'],
    posted: '2024-01-20T10:00:00Z',
    applications: 127
  },
  {
    id: 'job_2',
    title: 'Ambassadeur du Manque de Motivation',
    company: 'Centre Pôle Emploi Imaginaire',
    location: 'Partout et nulle part',
    salary: 'Négociable (vers le bas)',
    type: 'Mission',
    description: 'Représenter officiellement tous ceux qui n\'ont pas envie. Être l\'exemple parfait de ce qu\'il ne faut pas faire.',
    requirements: [
      'Expertise en procrastination',
      'Capacité à trouver des excuses créatives',
      'Maîtrise de l\'art de reporter',
      'Allergique au réveil matinal'
    ],
    tags: ['Représentation', 'Créativité', 'Flexible', 'Innovation'],
    posted: '2024-01-19T15:30:00Z',
    applications: 89
  },
  {
    id: 'job_3',
    title: 'Consultant en Optimisation de Siestes',
    company: 'Sleep & Co',
    location: 'Lit',
    salary: 'En rêves',
    type: 'Freelance',
    description: 'Développer des stratégies avancées pour maximiser la qualité et la durée des siestes. Innovation dans le domaine du sommeil.',
    requirements: [
      'Doctorat en Sciences du Sommeil (auto-proclamé)',
      '10+ ans d\'expérience en siestes',
      'Capacité à dormir n\'importe où',
      'Expertise en oreillers'
    ],
    tags: ['Bien-être', 'Innovation', 'Recherche', 'Expertise'],
    posted: '2024-01-18T09:45:00Z',
    applications: 203
  },
  {
    id: 'job_4',
    title: 'Chief Procrastination Officer',
    company: 'StartUp du Futur (peut-être)',
    location: 'Remote (très remote)',
    salary: 'On verra plus tard',
    type: 'CDI',
    description: 'Diriger les opérations de procrastination de l\'entreprise. Repousser toutes les deadlines avec style.',
    requirements: [
      'MBA en Procrastination',
      'Leadership en évitement',
      'Expertise en "je ferai ça demain"',
      'Vision stratégique à très long terme'
    ],
    tags: ['Leadership', 'Stratégie', 'Innovation', 'Management'],
    posted: '2024-01-17T14:20:00Z',
    applications: 156
  },
  {
    id: 'job_5',
    title: 'Développeur de Excuses Créatives',
    company: 'Excuse.js',
    location: 'Imagination Land',
    salary: 'En créativité pure',
    type: 'Stage',
    description: 'Créer des excuses innovantes pour toutes les situations. Développer l\'API de l\'évitement.',
    requirements: [
      'Créativité débordante',
      'Maîtrise de l\'art du mensonge bienveillant',
      'Expérience en storytelling',
      'Connaissance des grands classiques'
    ],
    tags: ['Créativité', 'Innovation', 'Storytelling', 'API'],
    posted: '2024-01-16T11:15:00Z',
    applications: 78
  }
];

// Badge definitions
export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'unemployed_100',
    title: 'Centenaire du Chômage',
    description: '100 jours sans emploi',
    icon: '🏆',
    requirement: 'unemployment_days >= 100'
  },
  {
    id: 'unemployed_365',
    title: 'Anniversaire de l\'Inactivité',
    description: 'Une année complète sans emploi',
    icon: '🎂',
    requirement: 'unemployment_days >= 365'
  },
  {
    id: 'netflix_master',
    title: 'Maître Netflix',
    description: 'Expert reconnu en binge-watching',
    icon: '📺',
    requirement: 'skill_netflix >= 30'
  },
  {
    id: 'couch_expert',
    title: 'Expert Canapé',
    description: 'Spécialiste du confort domestique',
    icon: '🛋️',
    requirement: 'skill_couch >= 25'
  },
  {
    id: 'no_interview',
    title: 'Jamais Convoqué',
    description: 'Aucun entretien en 6 mois',
    icon: '🚫',
    requirement: 'no_interviews_6_months'
  },
  {
    id: 'delivery_master',
    title: 'Roi de la Livraison',
    description: 'Expert en commandes à domicile',
    icon: '🍕',
    requirement: 'delivery_orders >= 50'
  },
  {
    id: 'gamer_elite',
    title: 'Élite Gaming',
    description: 'Professionnel du jeu vidéo',
    icon: '🎮',
    requirement: 'gaming_hours >= 500'
  },
  {
    id: 'social_media_legend',
    title: 'Légende des Réseaux',
    description: 'Influenceur de l\'inactivité',
    icon: '📱',
    requirement: 'social_media_posts >= 100'
  },
  {
    id: 'excuse_master',
    title: 'Maître des Excuses',
    description: 'Créateur d\'excuses légendaires',
    icon: '🎭',
    requirement: 'creative_excuses >= 20'
  },
  {
    id: 'brunch_expert',
    title: 'Expert Brunch',
    description: 'Spécialiste des réveils tardifs',
    icon: '🥐',
    requirement: 'late_wake_ups >= 100'
  },
  {
    id: 'procrastination_god',
    title: 'Dieu de la Procrastination',
    description: 'Niveau suprême atteint',
    icon: '⏰',
    requirement: 'procrastination_level >= 1000'
  },
  {
    id: 'coffee_break_champion',
    title: 'Champion Pause Café',
    description: 'Records de pauses prolongées',
    icon: '☕',
    requirement: 'coffee_breaks >= 365'
  }
];