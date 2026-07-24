
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
};

export function StatsCard({title,value,description,className,icon,}: StatsCardProps) {
  return (
    <Card className={cn("border-none shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
         {icon && <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            {icon}
          </div>}
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && (
          <CardDescription className="mt-2">
            {description}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}