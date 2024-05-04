import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../globals.css";

import {ClerkProvider} from "@clerk/nextjs";
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Clothes - Admin Auth",
    description: "Admin dashboard to manage clothes",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={inter.className}>{children}</body>
            </html>
        </ClerkProvider>
    );
}
