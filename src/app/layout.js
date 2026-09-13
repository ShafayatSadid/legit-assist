import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
});

export const metadata = {
  title: "LegalEase — Find & Hire Expert Legal Counsel",
  description:
    "LegalEase connects clients with expert lawyers. Browse, hire, and consult legal professionals online.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster />
        <NavBar />

        <main className="flex-1 my-10 md:my-17">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}