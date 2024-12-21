"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X, Crown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import { SelectProfile } from "@/db/schema/profiles-schema";

export default function Header() {
  const { userId, isLoaded } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<SelectProfile | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (isLoaded && userId) {
        const profile = await getProfileByUserIdAction(userId) as { data: SelectProfile };
        setProfile(profile.data);
      }
    };

    checkAdmin();
  }, [isLoaded, userId]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-zinc-950 text-secondary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Crown className="h-6 w-6" />
          <h1 className="text-xl font-bold">Oh, to be his Queen...</h1>
        </div>
        <nav className="hidden md:flex space-x-4">
          <SignedIn>
            <Link
              href="/admin"
              className="hover:underline"
              hidden={!profile?.isAdmin}
            >
              Admin
            </Link>
          </SignedIn>
        </nav>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-primary-foreground text-primary p-4">
          <ul className="space-y-2">
            <SignedIn>
              <li>
                <Link
                  href="/admin"
                  className="block hover:underline"
                  onClick={toggleMenu}
                  hidden={!profile?.isAdmin}
                >
                  Admin
                </Link>
              </li>
            </SignedIn>
          </ul>
        </nav>
      )}
    </header>
  );
}