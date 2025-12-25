import { Header } from "@/components/layout/header";

export default function FinancialManagementPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <h1 className="text-5xl font-bold tracking-tighter font-archivio">
        Financial Management
      </h1>
      <p className="text-muted-foreground">Manage your finances, track spending, and achieve your financial goals.</p>
    </div>
  );
}
