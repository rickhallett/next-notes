import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/utilities/providers";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { auth, getAuth } from "@clerk/nextjs/server";
import { createProfileAction, getProfileByUserIdAction } from "@/actions/profiles-actions";
import Header from "@/components/header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Game of Thrones",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { userId } = await auth();
  // const { user } = await getAuth();

  // if (userId) {
  //   const profile = await getProfileByUserIdAction(userId);
  //   if (!profile.data) {
  //     await createProfileAction({ userId, email: user?.emailAddresses[0]?.emailAddress || '' });
  //   }
  // }

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
