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

export const financialData = {
    balance: 10250.75,
    summary: "Your spending is on track this month.",
    chartData: [
        { name: 'Jan', income: 4000, expenses: 2400 },
        { name: 'Feb', income: 3000, expenses: 1398 },
        { name: 'Mar', income: 5000, expenses: 3800 },
        { name: 'Apr', income: 2780, expenses: 1908 },
        { name: 'May', income: 1890, expenses: 1800 },
        { name: 'Jun', income: 3490, expenses: 2100 },
    ]
};

export type PlannerEvent = {
    id: string;
    time: string;
    title: string;
    description: string;
}

export const weeklyPlannerData: Record<string, PlannerEvent[]> = {
    "Monday": [
        { id: "mon1", time: "9:00 AM", title: "Team Stand-up", description: "Project Phoenix" },
        { id: "mon2", time: "1:00 PM", title: "Design Review", description: "New dashboard UI" },
    ],
    "Tuesday": [
        { id: "tue1", time: "11:00 AM", title: "1:1 with Manager", description: "Performance review" },
    ],
    "Wednesday": [
        { id: "wed1", time: "10:00 AM", title: "Focus Block", description: "Code new feature" },
        { id: "wed2", time: "3:00 PM", title: "Dentist Appointment", description: "Annual check-up" },
    ],
    "Thursday": [
        { id: "thu1", time: "9:00 AM", title: "All-hands Meeting", description: "Company updates" },
    ],
    "Friday": [
        { id: "fri1", time: "4:00 PM", title: "Weekly Retro", description: "Sprint review" },
    ],
    "Saturday": [],
    "Sunday": [],
}

export const monthlyStrategy = {
    title: "Focus for this Month",
    strategy: "This month, the primary focus is on solidifying morning routines and increasing savings. Key actions include consistent workouts, meal prepping to reduce food expenses, and allocating a fixed amount to savings on the 1st. Review progress weekly to stay on track."
};
