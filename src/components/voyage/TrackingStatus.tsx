import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Ship, CheckCircle } from 'lucide-react';

type TrackingStatusProps = {
  trackingId: string;
  statusText: string;
  nextDestination: string;
  progress: number;
};

export default function TrackingStatus({ trackingId, statusText, nextDestination, progress }: TrackingStatusProps) {
  const isComplete = nextDestination === 'Journey complete';
  
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
      </CardContent>
    </Card>
  )
}
