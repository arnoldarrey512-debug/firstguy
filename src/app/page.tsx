
import Link from 'next/link';
import { ArrowRight, Briefcase, Globe, Plane, Warehouse, Menu, Search, Star, Truck, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/voyage/Logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Footer from '@/components/voyage/Footer';
import { Input } from '@/components/ui/input';

const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">
      <div className="mr-4 flex items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-10 w-10" />
          <span className="hidden font-bold md:inline">UN Air Cargo</span>
        </Link>
        <nav className="hidden space-x-6 text-sm font-medium md:flex">
          <Link href="/tracking">Track</Link>
          <Link href="/login">Ship</Link>
          <Link href="/login">Customer Service</Link>
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
              <Link href="/tracking">Track</Link>
              <Link href="/login">Ship</Link>
              <Link href="/login">Customer Service</Link>
              <Link href="/login">Customer Portal Logins</Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="hidden md:flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/login">Customer Portal Logins</Link>
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
        
        <section 
          className="relative h-[60vh] bg-cover bg-center text-white flex items-center justify-center"
          style={{backgroundImage: "url('https://airfreight.emexexpress.de/Background-contact%20section.webp')"}}
          data-ai-hint="cargo plane sky"
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Your Partner in Global Air Freight</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80">Fast, reliable, and secure cargo solutions to every corner of the globe.</p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/tracking">Track Your Shipment</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Ship Now</CardTitle>
                        <CardDescription>Find the right service for your shipping needs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/login">Explore Services</Link></Button>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Get a Quote</CardTitle>
                        <CardDescription>Estimate cost to share and compare options.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/login">Get a Quote</Link></Button>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>UN Air Cargo for Business</CardTitle>
                        <CardDescription>Request a business account for exclusive benefits.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/login">Request an Account</Link></Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        </section>
      
        <section className="py-16 md:py-24">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold">Navigating Latest Tariff Developments</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                        Global trade is becoming increasingly complex as new U.S. tariffs and varying reciprocal measures emerge across countries and industries. At UN Air Cargo, we are committed to helping you navigate these changes.
                        </p>
                        <Button variant="link" className="mt-4 px-0" asChild><Link href="/login">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                    </div>
                    <div className="flex justify-center">
                        <img src="https://placehold.co/600x400.png" alt="Global Trade" className="rounded-lg shadow-2xl" data-ai-hint="global trade map" />
                    </div>
                </div>
            </div>
        </section>
      
        <section className="py-16 md:py-24">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-12">Explore Our Solutions</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="shadow-lg">
                        <CardHeader>
                           <CardTitle>Document and Parcel Shipping</CardTitle>
                           <CardDescription>For All Shippers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Learn about UN Air Cargo Express – the undisputed global leader in international express shipping.</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li>Next Possible Business Day</li>
                                <li>Flexible Import/Export Options</li>
                                <li>Tailored Business Solutions</li>
                                <li>Wide Variety of Optional Services</li>
                            </ul>
                            <Button variant="secondary" className="w-full mt-2" asChild><Link href="/login">Explore UN Air Cargo Express</Link></Button>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Cargo Shipping</CardTitle>
                            <CardDescription>Business Only</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Discover shipping and logistics service options from UN Air Cargo Global Forwarding.</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li>Air Freight</li>
                                <li>Road Freight</li>
                                <li>Ocean Freight</li>
                                <li>Rail Freight</li>
                            </ul>
                            <Button variant="secondary" className="w-full mt-2" asChild><Link href="/login">Explore UN Air Cargo Global Forwarding</Link></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
        
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
            <div className="container text-center">
                <h2 className="text-3xl font-bold">Sustainability</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg">
                Sustainable business begins with sustainable supply chains. We proudly provide a comprehensive portfolio of emission reduced logistics solutions. Find out what we have to offer, why we’re committed to sustainability, and how our industry is helping deliver an even better world.
                </p>
                <Button variant="secondary" className="mt-6" asChild><Link href="/login">Learn About Our Mission</Link></Button>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
