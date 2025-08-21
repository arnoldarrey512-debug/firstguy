import Link from 'next/link';
import { Briefcase, Globe, Ship, Anchor } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container">
                <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
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
                    © UN shipping line
                </div>
            </div>
        </footer>
    );
}
