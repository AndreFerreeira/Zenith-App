import { Header } from "@/components/layout/header";

export default function IaAssistantPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <h1 className="text-5xl font-bold tracking-tighter font-archivio">
        IA Assistant
      </h1>
      <p className="text-muted-foreground">Your AI-powered assistant for enhanced productivity.</p>
    </div>
  );
}
