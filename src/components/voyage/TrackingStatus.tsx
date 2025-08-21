import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Ship, CheckCircle, Anchor, CircleDot } from 'lucide-react';
import { ROUTE } from '@/lib/voyage';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

type TrackingStatusProps = {
  trackingId: string;
  statusText: string;
  nextDestination: string;
  progress: number;
};

// Create a unique list of stops from the route
const voyagePlan = [ROUTE[0].start.name];
ROUTE.forEach(segment => {
  if (!voyagePlan.includes(segment.end.name)) {
    voyagePlan.push(segment.end.name);
  }
});


export default function TrackingStatus({ trackingId, statusText, nextDestination, progress }: TrackingStatusProps) {
  const isComplete = nextDestination === 'Journey complete';
  
  const currentStopName = isComplete 
    ? voyagePlan[voyagePlan.length - 1] 
    : statusText.replace('In transit to ', '');

  const currentStopIndex = voyagePlan.findIndex(stop => stop === currentStopName);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isComplete ? <CheckCircle className="text-green-500" /> : <Ship className="text-primary" />}
          Shipment Status
        </CardTitle>
        <CardDescription>Tracking ID: {trackingId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div>
          <p className="text-lg font-medium">{statusText}</p>
          <p className="text-sm text-muted-foreground">{nextDestination}</p>
        </div>
        {!isComplete && (
          <div className="space-y-2">
            <Label htmlFor="progress">Progress to next stop</Label>
            <Progress id="progress" value={progress} className="w-full [&>div]:bg-accent" />
          </div>
        )}
        <Separator />
        <div>
          <h4 className="font-medium mb-3">Voyage Plan</h4>
          <ul className="space-y-4">
            {voyagePlan.map((stop, index) => {
              const isStopCompleted = index < currentStopIndex;
              const isStopCurrent = index === currentStopIndex;
              const isStopUpcoming = index > currentStopIndex;

              return (
                <li key={stop} className="flex items-center gap-4">
                  <div>
                    {isStopCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {isStopCurrent && <CircleDot className="w-6 h-6 text-accent animate-pulse" />}
                    {isStopUpcoming && <Anchor className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      isStopCompleted && "text-muted-foreground line-through",
                      isStopCurrent && "text-accent",
                      isStopUpcoming && "text-muted-foreground"
                    )}>{stop}</p>
                     {isStopCurrent && !isComplete && (
                      <p className="text-xs text-muted-foreground">In transit...</p>
                     )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
