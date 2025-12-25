import { Bookmark } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { monthlyStrategy } from "@/lib/data";

export function MonthlyStrategy() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          Monthly Strategy
        </CardTitle>
        <CardDescription>{monthlyStrategy.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {monthlyStrategy.strategy}
        </p>
      </CardContent>
    </Card>
  );
}
