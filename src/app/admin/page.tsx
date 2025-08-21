"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/voyage/Logo";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [stops, setStops] = useState<string[]>([""]);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const handleAddStop = () => {
    setStops([...stops, ""]);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const start = formData.get("start-destination");
    const end = formData.get("end-destination");
    const current = formData.get("current-position");

    // Simple tracking ID generation logic
    const generatedId = `${(start as string)?.substring(0, 2).toUpperCase()}-${(end as string)
      ?.substring(0, 2)
      .toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    setTrackingId(generatedId);
  };

  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link href="/" className="flex items-center space-x-2 text-primary">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-bold">UN shipping line</span>
        </Link>
      </div>
      <div className="flex min-h-screen items-center justify-center p-4 pt-24 md:pt-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>
              Generate a new tracking ID for a shipment.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="start-destination">Start Destination</Label>
                  <Input
                    id="start-destination"
                    name="start-destination"
                    placeholder="e.g., Seattle, USA"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-destination">End Destination</Label>
                  <Input
                    id="end-destination"
                    name="end-destination"
                    placeholder="e.g., Busan, South Korea"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Intermediate Stops</Label>
                {stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      name={`stop-${index}`}
                      placeholder={`Stop ${index + 1}`}
                      value={stop}
                      onChange={(e) => handleStopChange(index, e.target.value)}
                    />
                    {stops.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStop(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleAddStop}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stop
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="current-position">Current Position</Label>
                <Input
                  id="current-position"
                  name="current-position"
                  placeholder="e.g., In transit to Dubai"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button type="submit" className="w-full md:w-auto">
                Generate Tracking ID
              </Button>
              {trackingId && (
                <div className="mt-4 w-full rounded-lg border bg-muted p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Generated Tracking ID:
                  </p>
                  <p className="text-lg font-mono font-bold text-primary">
                    {trackingId}
                  </p>
                </div>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
