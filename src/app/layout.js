import "./globals.css";
import { Providers } from "./providers";
import { fraunces, inter, jetbrains } from "@/lib/fonts";

export const metadata = {
  title: "LegalEase — Find & Hire Expert Legal Counsel",
  description:
    "LegalEase connects clients with expert lawyers. Browse, hire, and consult legal professionals online.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {/* <Navbar /> ← পরে যোগ করবা */}

          <main className="flex-1">
            {children}
          </main>

          {/* <Footer /> ← পরে যোগ করবা */}
        </Providers>
      </body>
    </html>
  );
}