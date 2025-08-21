
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
import { Plus, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function AdminPage() {
  const [stops, setStops] = useState<string[]>([""]);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
  const { toast } = useToast();

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
    const start = formData.get("start-destination") as string;
    const end = formData.get("end-destination") as string;
    const current = formData.get("current-position") as string;

    const intermediateStops = stops.filter(stop => stop.trim() !== '');

    // Simple tracking ID generation logic
    const trackingId = `${start
      ?.substring(0, 2)
      .toUpperCase()}-${end
      ?.substring(0, 2)
      .toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const params = new URLSearchParams();
    params.set('id', trackingId);
    params.set('start', start);
    intermediateStops.forEach(stop => params.append('stops', stop));
    params.set('end', end);
    params.set('current', current);
    
    const url = new URL(window.location.origin);
    url.pathname = '/tracking';
    url.search = params.toString();

    setTrackingUrl(url.toString());
  };

  const copyToClipboard = () => {
    if (trackingUrl) {
      navigator.clipboard.writeText(trackingUrl);
      toast({
        title: "Copied to clipboard!",
        description: "The tracking URL has been copied.",
      });
    }
  };

  return (
    <>
      <Toaster />
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
                  <Label>Intermediate Stops (optional)</Label>
                  {stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        name={`stop-${index}`}
                        placeholder={`Stop ${index + 1}`}
                        value={stop}
                        onChange={(e) => handleStopChange(index, e.target.value)}
                      />
                      
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStop(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      
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
                  Generate Tracking URL
                </Button>
                {trackingUrl && (
                  <div className="mt-4 w-full rounded-lg border bg-muted p-4 space-y-2">
                    <Label htmlFor="tracking-url">Shareable Tracking URL:</Label>
                    <div className="flex items-center gap-2">
                       <Input id="tracking-url" readOnly value={trackingUrl} className="flex-1 font-mono text-sm" />
                       <Button type="button" size="icon" variant="ghost" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4" />
                       </Button>
                    </div>
                    <Button asChild variant="secondary" className="w-full">
                        <Link href={trackingUrl} target="_blank">View Tracking Page</Link>
                    </Button>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
