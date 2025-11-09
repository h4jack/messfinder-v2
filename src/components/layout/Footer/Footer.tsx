import Link from 'next/link';
import Logo from '@/components/logo/Logo';
import { allPageLinks } from '@/data/ui/pageLinks';
import { PageLinkType } from '@/types/PageLink';
import brandInfo from '@/data/content/brandInfo';

const FooterLink = ({ name, href }: PageLinkType) => (
    <Link href={href} className="hover:underline text-gray-300 text-sm">
        {name}
    </Link>
);

const FooterSection = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <div className="flex flex-col justify-between w-64 items-start gap-4">
        {title && <span className="text-lg font-semibold text-gray-100">{title}</span>}
        {children}
    </div>
);

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="container mx-auto flex flex-wrap justify-center items-start gap-8 p-8">
                {/* Logo and Description */}
                <FooterSection>
                    <Logo />
                    <p className="text-left text-sm">
                        {brandInfo.details}
                    </p>
                </FooterSection>

                {/* Quick Links */}
                <FooterSection title="Quick Links">
                    <div className="grid grid-cols-2 gap-2">
                        {pageLinks.map((link, index) => (
                            <FooterLink key={index} href={link.href} name={link.name} />
                        ))}
                    </div>
                </FooterSection>

                {/* Contact Us */}
                <FooterSection title="Contact Us">
                    <div className='flex flex-col gap-2'>
                        <span className="text-left text-sm">
                            {brandInfo.address || "Address Not Found"}
                        </span>
                        {brandInfo.email && (
                            <span className="text-left text-sm">
                                Email: <a href={"mailto:" + brandInfo.email} className="hover:underline">{brandInfo.email}</a>
                            </span>

                        )}
                        {brandInfo.phone && (
                            <span className="text-left text-sm">
                                Phone: <a href={"tel:" + brandInfo.phone} className="hover:underline">{brandInfo.phone}</a>
                            </span>

                        )}
                    </div>
                </FooterSection>
            </div>

            {/* Bottom Section */}
            <div className="bg-gray-900 text-gray-400 text-center py-4">
                <span>© {brandInfo.name} All Rights Reserved, 2025</span>
            </div>
        </footer>
    );
}

export default Footer;