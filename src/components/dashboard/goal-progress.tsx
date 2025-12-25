import { Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { weeklyGoals, annualGoals } from "@/lib/data";

export function GoalProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Goal Progress
        </CardTitle>
        <CardDescription>Your journey to success, one step at a time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="annual">Annual</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="mt-4 space-y-4">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{goal.name}</p>
                  <p className="text-sm font-medium text-primary">{goal.progress}%</p>
                </div>
                <Progress value={goal.progress} aria-label={`${goal.name} progress`} />
              </div>
            ))}
          </TabsContent>
          <TabsContent value="annual" className="mt-4 space-y-4">
            {annualGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{goal.name}</p>
                  <p className="text-sm font-medium text-primary">{goal.progress}%</p>
                </div>
                <Progress value={goal.progress} aria-label={`${goal.name} progress`} />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
