import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  badgeColor?: string;
};

export function StatsCard({
  title,
  value,
  description,
  className,
  icon,
  badgeColor = "bg-primary/10",
}: StatsCardProps) {
  return (
    <Card className={cn("hover-lift cursor-pointer border border-border/60 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border", className)}>
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shadow-xs", badgeColor)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}