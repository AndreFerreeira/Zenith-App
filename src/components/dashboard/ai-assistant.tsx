"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAiSuggestions } from "@/app/actions";
import { habits, weeklyGoals, annualGoals, financialData } from "@/lib/data";
import { Skeleton } from "../ui/skeleton";

export function AiAssistant() {
  const [loading, setLoading] = useState(false);
  const [routines, setRoutines] = useState<{ dailyRoutine: string; weeklyRoutine: string } | null>(null);
  const { toast } = useToast();

  const handleSuggestRoutines = async () => {
    setLoading(true);
    setRoutines(null);

    const input = {
      habits: habits.map(h => `${h.name} (${h.completed ? 'done' : 'not done'})`),
      goals: [...weeklyGoals, ...annualGoals].map(g => g.name),
      financialData: `Balance: $${financialData.balance}. Summary: ${financialData.summary}`,
    };

    const result = await getAiSuggestions(input);

    if (result.success && result.data) {
      setRoutines(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }

    setLoading(false);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
        <CardDescription>
          Get personalized routines based on your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button onClick={handleSuggestRoutines} disabled={loading}>
          {loading ? "Generating..." : "Suggest Routines"}
        </Button>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {routines && (
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
                <h4 className="font-semibold text-foreground mb-2">Daily Routine</h4>
                <p>{routines.dailyRoutine}</p>
            </div>
            <div>
                <h4 className="font-semibold text-foreground mb-2">Weekly Routine</h4>
                <p>{routines.weeklyRoutine}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
