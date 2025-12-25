
export type Habit = {
  id: string;
  name: string;
  completed: boolean;
};

export const habits: Habit[] = [
  { id: 'h1', name: 'Morning Meditation', completed: true },
  { id: 'h2', name: 'Workout for 30 minutes', completed: true },
  { id: 'h3', name: 'Read 10 pages of a book', completed: false },
  { id: 'h4', name: 'Plan tomorrow\'s tasks', completed: true },
  { id: 'h5', name: 'No social media after 9 PM', completed: false },
];

export type Goal = {
  id: string;
  name: string;
  progress: number;
};

export const weeklyGoals: Goal[] = [
  { id: 'wg1', name: 'Complete 5 workouts', progress: 60 },
  { id: 'wg2', name: 'Finish reading "The Atomic Habit"', progress: 40 },
  { id: 'wg3', name: 'Save $100', progress: 80 },
];

export const annualGoals: Goal[] = [
    { id: 'ag1', name: 'Run a half-marathon', progress: 25 },
    { id: 'ag2', name: 'Save $5,000 for vacation', progress: 50 },
    { id: 'ag3', name: 'Learn a new programming language', progress: 15 },
];

export type WeeklyTask = {
    name: string;
    category: 'PESSOAL' | 'PROFISSIONAL' | 'MATINAL';
};

export type WeeklyDay = {
    day: string;
    tasks: WeeklyTask[];
}

export const weeklyPlan: WeeklyDay[] = [
    {
        day: 'Segunda',
        tasks: [
            { name: 'Treino matinal', category: 'PESSOAL' },
            { name: 'Reunião de alinhamento', category: 'PROFISSIONAL' },
        ]
    },
    {
        day: 'Terça',
        tasks: [
            { name: 'Estudos React', category: 'PROFISSIONAL' },
        ]
    },
    { day: 'Quarta', tasks: [] },
    { day: 'Quinta', tasks: [] },
    { day: 'Sexta', tasks: [] },
    { day: 'Sábado', tasks: [] },
    { day: 'Domingo', tasks: [] },
]
