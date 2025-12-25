import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { weeklyPlannerData } from "@/lib/data";
import { ScrollArea } from "../ui/scroll-area";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WeeklyPlanner() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Weekly Planner
        </CardTitle>
        <CardDescription>Your schedule for this week.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-center text-primary">{day}</h3>
              <ScrollArea className="h-64 rounded-md border p-2">
                <div className="space-y-2">
                {weeklyPlannerData[day].length > 0 ? (
                    weeklyPlannerData[day].map((event) => (
                    <div key={event.id} className="rounded-lg bg-muted/50 p-3 text-sm">
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-xs text-muted-foreground">No events</p>
                    </div>
                )}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
