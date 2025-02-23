import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function BoardSkeleton() {
  return (
    <Card className="w-[20vw] h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-full h-12" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}
