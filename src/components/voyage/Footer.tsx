import Link from 'next/link';
import { Youtube, Facebook, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container">
                <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 font-bold">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/login" className="hover:underline">Customer Service</Link></li>
                            <li><Link href="/login" className="hover:underline">Customer Portal Logins</Link></li>
                            <li><Link href="/login" className="hover:underline">Digital Partners and Integrations</Link></li>
                            <li><Link href="/login" className="hover:underline">Developer Portal</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 font-bold">Our Divisions</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/login" className="hover:underline">UN Air Cargo Express</Link></li>
                            <li><Link href="/login" className="hover:underline">UN Air Cargo Global Forwarding</Link></li>
                            <li><Link href="/login" className="hover:underline">Other Global Divisions</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 font-bold">Company Information</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/login" className="hover:underline">About UN Air Cargo</Link></li>
                            <li><Link href="/login" className="hover:underline">Careers</Link></li>
                            <li><Link href="/login" className="hover:underline">Press Center</Link></li>
                            <li><Link href="/login" className="hover:underline">Sustainability</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 font-bold">Follow Us</h3>
                        <div className="flex space-x-4">
                            <Link href="#" aria-label="YouTube"><Youtube className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
                            <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
                            <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
                            <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
                        </div>
                    </div>
                </div>
                <div className="container border-t py-4 text-center text-sm text-muted-foreground">
                    © UN Air Cargo
                </div>
            </div>
        </footer>
    );
}