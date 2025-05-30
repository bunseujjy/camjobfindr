"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bell, Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { UserButton } from "./UserButton";
import { UserType } from "@/features/users/types/type";

const translations = {
  en: {
    explore: "Explore",
    about: "About",
    contact: "Contact",
    signIn: "Sign In",
    postJob: "Post a Job",
    notifications: "Notifications",
    viewAll: "View All",
    noNotifications: "No notifications yet",
    navigationMenu: "Navigation Menu",
    accessLinks: "Access all links here",
    searchPlaceholder: "Search for jobs, companies...",
  },
};

interface NavbarProps {
  user: UserType | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [language, setLanguage] = React.useState<"en">("en");
  const isHomePage = pathname === "/";

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = translations[language];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "flex flex-col sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300"
      )}
    >
      <div
        className={cn(
          isScrolled || !isHomePage
            ? "!bg-[#191a20] from-transparent to-transparent"
            : "fixed top-0 w-full z-10"
        )}
      >
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6"
            >
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/favicon-96x96.png"
                  alt="CamJobFindr"
                  width={100}
                  height={100}
                  className="size-[40px] rounded-full object-cover"
                />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-md md:text-2xl font-bold text-white"
                >
                  CamJobFindr
                </motion.span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/job_listing" legacyBehavior passHref>
                        <NavigationMenuLink className="text-white hover:bg-white/10 focus:bg-white/10 px-4 py-2 rounded-md">
                          {t.explore}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/about" legacyBehavior passHref>
                        <NavigationMenuLink className="text-white hover:bg-white/10 focus:bg-white/10 px-4 py-2 rounded-md">
                          {t.about}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/contact" legacyBehavior passHref>
                        <NavigationMenuLink className="text-white hover:bg-white/10 focus:bg-white/10 px-4 py-2 rounded-md">
                          {t.contact}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </motion.div>

            {/* Auth Buttons and Language Selector */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex items-center gap-4"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-white/10"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="sr-only">{t.notifications}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-black/90 backdrop-blur-lg border-white/10"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                    <span className="text-sm font-medium text-white">
                      {t.notifications}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      <Link href="/notifications">{t.viewAll}</Link>
                    </Button>
                  </div>
                  <div className="py-2 px-4 text-sm text-gray-400">
                    {t.noNotifications}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <SignedIn>
                {user?.user?.role !== "jobSeeker" && (
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/new_listing">{t.postJob}</Link>
                  </Button>
                )}
                <div className="size-8 self-center overflow-hidden rounded-full cursor-pointer">
                  <UserButton user={user} />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <Button className="self-center">{t.signIn}</Button>
                </SignInButton>
              </SignedOut>
            </motion.div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-black/90 backdrop-blur-lg border-white/10"
                >
                  <SheetTitle className="text-white">
                    {t.navigationMenu}
                  </SheetTitle>
                  <SheetDescription className="text-gray-400">
                    {t.accessLinks}
                  </SheetDescription>
                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/job_listing"
                      className="text-lg font-medium text-white hover:text-primary"
                    >
                      {t.explore}
                    </Link>
                    <Link
                      href="/about"
                      className="text-lg font-medium text-white hover:text-primary"
                    >
                      {t.about}
                    </Link>
                    <Link
                      href="/contact"
                      className="text-lg font-medium text-white hover:text-primary"
                    >
                      {t.contact}
                    </Link>
                    <div className="flex flex-col gap-2 mt-4">
                      <SignedIn>
                        <Button
                          asChild
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Link href="/new_listing">{t.postJob}</Link>
                        </Button>
                      </SignedIn>
                      <SignedOut>
                        <SignInButton>
                          <Button className="w-full">{t.signIn}</Button>
                        </SignInButton>
                      </SignedOut>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant={language === "en" ? "default" : "ghost"}
                        onClick={() => setLanguage("en")}
                        className={
                          language === "en"
                            ? ""
                            : "text-white hover:bg-white/10"
                        }
                      >
                        🇺🇸 English
                      </Button>
                      <Button
                        variant={"ghost"}
                        onClick={() => setLanguage("en")}
                        className={"text-white hover:bg-white/10"}
                      >
                        🇰🇭 ខ្មែរ
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
              <SignedIn>
                <Button asChild className="bg-primary hover:bg-primary/90 ml-4">
                  <Link href="/new_listing">{t.postJob}</Link>
                </Button>
                <div className="size-8 self-center ml-4 overflow-hidden rounded-full">
                  <UserButton user={user} />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
