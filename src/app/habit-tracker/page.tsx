import { Header } from "@/components/layout/header";

export default function HabitTrackerPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <h1 className="text-5xl font-bold tracking-tighter font-archivio">
        Habit Tracker
      </h1>
      <p className="text-muted-foreground">Build good habits and break bad ones. Track your progress daily.</p>
    </div>
  );
}
