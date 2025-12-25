import { Header } from "@/components/dashboard/header";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { GoalProgress } from "@/components/dashboard/goal-progress";
import { HabitTracker } from "@/components/dashboard/habit-tracker";
import { WeeklyPlanner } from "@/components/dashboard/weekly-planner";
import { MonthlyStrategy } from "@/components/dashboard/monthly-strategy";
import { AiAssistant } from "@/components/dashboard/ai-assistant";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 xl:grid-cols-4">
          <div className="grid gap-4 md:grid-cols-2 xl:col-span-2">
            <FinancialOverview />
            <GoalProgress />
          </div>
          <div className="xl:col-span-2">
            <HabitTracker />
          </div>
        </div>
        <div className="grid gap-4 md:gap-8 xl:grid-cols-4">
          <div className="grid gap-4 md:grid-cols-2 xl:col-span-2">
            <MonthlyStrategy />
            <AiAssistant />
          </div>
          <div className="xl:col-span-2">
            <WeeklyPlanner />
          </div>
        </div>
      </main>
    </div>
  );
}
