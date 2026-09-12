import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/shared/NavBar";


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
      
          <NavBar /> 

          <main className="flex-1">
            {children}
          </main>

          {/* <Footer /> ← পরে যোগ করবা */}
       
      </body>
    </html>
  );
}