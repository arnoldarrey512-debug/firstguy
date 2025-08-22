import Link from 'next/link';
import { ArrowRight, Briefcase, Globe, Plane, Warehouse, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/voyage/Logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Footer from '@/components/voyage/Footer';

const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">
      <div className="mr-4 flex items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-10 w-10" />
          <span className="hidden font-bold md:inline">UN Air Cargo</span>
        </Link>
        <nav className="hidden space-x-6 text-sm font-medium md:flex">
          <Link href="/login">Services</Link>
          <Link href="/login">Schedules</Link>
          <Link href="/tracking">Tracking</Link>
          <Link href="/login">Manage</Link>
          <Link href="/login">Company</Link>
        </nav>
      </div>
      <div className="flex flex-1 items-center justify-end space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <Logo className="h-10 w-10" />
                <span className="sr-only">UN Air Cargo</span>
              </Link>
              <Link href="/login">Services</Link>
              <Link href="/login">Schedules</Link>
              <Link href="/tracking">Tracking</Link>
              <Link href="/login">Manage</Link>
              <Link href="/login">Company</Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="hidden md:flex items-center space-x-2">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  </header>
);

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-cover bg-center" style={{backgroundImage: "url('https://placehold.co/1920x600.png')"}} data-ai-hint="cargo plane sunset">
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold md:text-6xl">Air Freight</h1>
            <p className="mt-4 max-w-2xl text-lg">
              As one of the world's largest air cargo companies, we move vital goods every day and deliver to every corner of the globe.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild><Link href="/login">Find a Price</Link></Button>
              <Button size="lg" variant="secondary" asChild><Link href="/login">Find Schedules</Link></Button>
            </div>
          </div>
        </section>

        <div className="container px-4 md:px-6">
            {/* What is Air Freight Section */}
            <section className="py-16 md:py-24">
                <div className="grid gap-12 md:grid-cols-2 md:items-center">
                  <div className="text-left">
                    <h2 className="text-3xl font-bold tracking-tight">What is Air Freight?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                      Air freight is the method of transporting goods quickly by aircraft. It is the fastest shipping method and ideal for time-sensitive shipments. Over 52 million metric tons of goods are transported by air each year.
                    </p>
                    <p className="mt-4 text-lg text-muted-foreground">
                      As a general rule, smaller, high-value, or time-critical shipments are sent by air. Cargo is loaded into specialized containers called Unit Load Devices (ULDs), which are designed to fit securely in the aircraft's hold, ensuring the safety and integrity of the goods during transport.
                    </p>
                    <Button variant="link" className="mt-6 px-0 text-base" asChild><Link href="/login">View our services <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <img src="https://placehold.co/720x405.png" alt="Cargo being loaded onto a plane" className="rounded-lg shadow-2xl" data-ai-hint="airport cargo loading" />
                  </div>
                </div>
            </section>
        </div>

        {/* Benefits Section */}
        <section className="bg-muted">
            <div className="container px-4 py-16 md:px-6 md:py-24">
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">Benefits of Air Freight Shipping</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">The fastest shipping method, ideal for time-sensitive goods and just-in-time supply chains.</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Reliability & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Air freight offers highly reliable arrival and departure times, with enhanced security measures.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
             <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Anything you need, we’re here to help</h2>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Find Prices</CardTitle>
                  <CardDescription>Ready to ship? Look up rates for new shipments and tariffs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild><Link href="/login">Find a price</Link></Button>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Sales Enquiries</CardTitle>
                  <CardDescription>Contact us and we will respond within the next two working days.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild><Link href="/login">Enquire</Link></Button>
                </CardContent>
              </Card>
            </div>
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
