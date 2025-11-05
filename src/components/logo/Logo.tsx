import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import brandInfo from "@/data/content/brandInfo";

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-1">
            <Image src={logo} alt="Logo" />
            <span className="hidden sm:block gradient-text font-bold text-xl sm:text-2xl">
                {brandInfo.name}
            </span>
        </Link>
    )
}

export default Logo;