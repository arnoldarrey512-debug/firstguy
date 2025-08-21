import Link from 'next/link';
import { ArrowRight, Briefcase, Globe, Ship, Warehouse, Anchor, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/voyage/Logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">
      <div className="mr-4 flex items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-10 w-10" />
          <span className="hidden font-bold md:inline">UN shipping line</span>
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
                <span className="sr-only">UN shipping line</span>
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

const Footer = () => (
  <footer className="w-full border-t bg-background">
    <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
      <div>
        <h3 className="mb-2 font-bold">Services</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/login" className="hover:underline">Ocean Transport</Link></li>
          <li><Link href="/login" className="hover:underline">Customs Services</Link></li>
          <li><Link href="/login" className="hover:underline">Inland Transport</Link></li>
          <li><Link href="/login" className="hover:underline">Warehousing</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="mb-2 font-bold">Resources</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/login" className="hover:underline">News & Advisories</Link></li>
          <li><Link href="/login" className="hover:underline">Insights</Link></li>
          <li><Link href="/login" className="hover:underline">Logistics Explained</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="mb-2 font-bold">About</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/login" className="hover:underline">About Us</Link></li>
          <li><Link href="/login" className="hover:underline">Careers</Link></li>
          <li><Link href="/login" className="hover:underline">Press</Link></li>
          <li><Link href="/login" className="hover:underline">Sustainability</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="mb-2 font-bold">Follow Us</h3>
        <div className="flex space-x-4">
          <Link href="#" aria-label="LinkedIn"><Briefcase className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
          <Link href="#" aria-label="Facebook"><Globe className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
          <Link href="#" aria-label="YouTube"><Ship className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
          <Link href="#" aria-label="Twitter"><Anchor className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
        </div>
      </div>
    </div>
    <div className="container border-t py-4 text-center text-sm text-muted-foreground">
      © A.P. Moller - Maersk
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-cover bg-center" style={{backgroundImage: "url('https://www.maersk.com/~/media_sc9/maersk/solutions/transportation-services/ocean-transport/images/ocean-transport_1920x600.jpg?h=600&w=1920&hash=7E26315CEEB3474480E2C1000597DD3A')"}} data-ai-hint="ocean container ship">
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold md:text-6xl">Ocean Transport</h1>
            <p className="mt-4 max-w-2xl text-lg">
              As one of the world's largest container shipping companies, we move 12 million containers every year and deliver to every corner of the globe.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild><Link href="/login">Find a Price</Link></Button>
              <Button size="lg" variant="secondary" asChild><Link href="/login">Find Schedules</Link></Button>
            </div>
          </div>
        </section>

        <div className="container">
          {/* What is Ocean Freight Section */}
          <section className="py-16 md:py-24">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="text-left">
                <h2 className="text-3xl font-bold tracking-tight">What is Ocean Freight?</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Ocean freight shipping is the method of transporting containerised cargo loaded onto vessels by ocean. Over 90% of all the world’s trade is carried by ocean transportation. If you want to ship your freight around the world, ocean transport is the most convenient option.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  As a general rule, shipments weighing more than 100kg – or consisting of multiple cartons – will be sent by ocean transport. The containers are designed and built for intermodal freight transport. That means they can be used across various transportation modes – from ship to rail to truck – without unloading and reloading the cargo.
                </p>
                <Button variant="link" className="mt-6 px-0 text-base" asChild><Link href="/login">View our services <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
              <div className="flex items-center justify-center">
                <img src="https://www.maersk.com/~/media_sc9/maersk/solutions/transportation-services/ocean-transport/images/ocean-freight-ship-containers_720x405.jpg?w=1325&hash=464BB5C5D85515F125C16BA8705AADC0" alt="Ocean freight ship containers" className="rounded-lg shadow-2xl" data-ai-hint="container ship" />
              </div>
            </div>
          </section>
        </div>

        {/* Benefits Section */}
        <section className="bg-muted py-16 md:py-24">
            <div className="container">
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">Benefits of Ocean Freight Shipping</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Cost-Effective</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">A cost-effective transport method compared to other modes (e.g. air freight) over long distances.</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Eco-Friendly</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Produces lower greenhouse gas emissions than other shipping modes, making it a greener choice.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
            <div className="container">
             <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Anything you need, we’re here to help</h2>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Find Prices</CardTitle>
                  <CardDescription>Ready to ship? Look up rates for new shipments and inland tariffs.</CardDescription>
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
