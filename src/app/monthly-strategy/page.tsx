import { Header } from "@/components/layout/header";

export default function MonthlyStrategyPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <h1 className="text-5xl font-bold tracking-tighter font-archivio">
        Monthly Strategy
      </h1>
      <p className="text-muted-foreground">Plan your month, set priorities, and stay focused on what matters most.</p>
    </div>
  );
}
