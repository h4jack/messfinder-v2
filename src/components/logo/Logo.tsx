import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/icon.svg";
import brandInfo from "@/data/content/brandInfo";

const Logo = () => {
    return (
        <Link href="/" className="h-12 w-12 flex items-center gap-1">
            <Image src={logo} alt="Logo" />
            <span className="hidden sm:block logo-gradient font-bold text-xl sm:text-2xl">
                {brandInfo.name}
            </span>
        </Link>
    )
}

export default Logo;