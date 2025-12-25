import { Header } from "@/components/layout/header";

export default function AnnualGoalsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <h1 className="text-5xl font-bold tracking-tighter font-archivio">
        Annual Goals
      </h1>
      <p className="text-muted-foreground">Define and track your long-term objectives for the year.</p>
    </div>
  );
}
