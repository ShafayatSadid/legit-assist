// components/shared/NavBar.jsx
"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import {
  FiSearch,
  FiLogOut,
  FiLayout,
  FiUser,
} from "react-icons/fi";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Lawyers", href: "/lawyers" },
];

const NavBar = () => {
  const sideMenuRef = useRef(null);
  const [burger, setBurger] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const openMenu = () => {
    if (sideMenuRef.current) {
      setBurger(false);
      sideMenuRef.current.style.transform = "translateX(0)";
    }
  };

  const closeMenu = () => {
    if (sideMenuRef.current) {
      sideMenuRef.current.style.transform = "translateX(-100%)";
      setBurger(true);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    router.push(`/lawyers?search=${encodeURIComponent(q)}`);
    setSearchValue("");
    closeMenu();
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="w-full fixed top-0 left-0 px-5 lg:px-8 py-4 flex justify-between items-center z-40 border-b border-border bg-background/80 backdrop-blur-md shadow-sm transition-colors duration-300">

      {/* ─────────── Mobile Menu Icon ─────────── */}
      <div className="md:hidden">
        {burger && (
          <HiMenuAlt1
            className="w-6 h-6 text-foreground cursor-pointer hover:text-primary transition"
            onClick={openMenu}
          />
        )}
      </div>

      {/* ─────────── Mobile Side Menu ─────────── */}
      <ul
        ref={sideMenuRef}
        style={{ transform: "translateX(-100%)" }}
        className="flex md:hidden flex-col gap-6 py-20 px-8 fixed left-0 top-0 bottom-0 w-72 z-50 h-screen bg-card shadow-2xl transition-transform duration-300 text-foreground border-r border-border"
      >
        <button
          onClick={closeMenu}
          aria-label="Close menu"
          className="absolute left-6 top-6"
        >
          <IoClose className="w-6 h-6 cursor-pointer hover:text-primary transition" />
        </button>

        {/* Mobile Search */}
        <form
          onSubmit={handleSearch}
          className="mt-2 flex items-center h-10 bg-background border border-border rounded-lg px-3 focus-within:border-primary transition"
        >
          <FiSearch className="text-secondary-text shrink-0" size={14} />
          <input
            type="text"
            placeholder="Search lawyers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm ml-2 min-w-0 placeholder:text-secondary-text font-sans text-foreground"
          />
        </form>

        {/* Mobile Links */}
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              onClick={closeMenu}
              href={link.href}
              className={`font-sans text-lg font-semibold transition ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}

        {user && (
          <li>
            <Link
              onClick={closeMenu}
              href="/dashboard"
              className={`font-sans text-lg font-semibold transition ${
                isActive("/dashboard")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Dashboard
            </Link>
          </li>
        )}

        {/* Mobile Auth CTA */}
        <li className="mt-4">
          {user ? (
            <Button
              onClick={() => {
                closeMenu();
                handleSignOut();
              }}
              className="w-full bg-error text-white font-sans font-semibold px-5 py-2.5 rounded-lg"
            >
              Logout
            </Button>
          ) : (
            <Link href="/login" onClick={closeMenu}>
              <Button className="w-full bg-primary hover:bg-primary-hover text-white font-sans font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-200">
                Login
              </Button>
            </Link>
          )}
        </li>
      </ul>

      {/* ─────────── Logo ─────────── */}
      <div className="flex-1 md:flex-none text-center md:text-left">
        <Link href="/">
          <h1 className="font-heading text-2xl font-bold tracking-tight leading-none">
            <span className="text-primary">Legal</span>
            <span className="text-secondary">Ease</span>
          </h1>
        </Link>
      </div>

      {/* ─────────── Desktop Menu ─────────── */}
      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <li key={link.href} className="relative">
            <Link
              href={link.href}
              className={`font-sans text-sm font-semibold transition ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-secondary-text hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
            {isActive(link.href) && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary rounded-full" />
            )}
          </li>
        ))}

        {user && (
          <li className="relative">
            <Link
              href="/dashboard"
              className={`font-sans text-sm font-semibold transition ${
                pathname.startsWith("/dashboard")
                  ? "text-primary"
                  : "text-secondary-text hover:text-primary"
              }`}
            >
              Dashboard
            </Link>
            {pathname.startsWith("/dashboard") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary rounded-full" />
            )}
          </li>
        )}
      </ul>

      {/* ─────────── Right Side ─────────── */}
      <div className="flex items-center gap-3 lg:gap-4">

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex items-center w-64 h-10 bg-card border border-border hover:border-primary focus-within:border-primary rounded-lg px-3 transition"
        >
          <FiSearch className="text-secondary-text shrink-0" size={14} />
          <input
            type="text"
            placeholder="Search lawyers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm ml-2 min-w-0 placeholder:text-secondary-text font-sans text-foreground"
          />
        </form>

        {/* Login CTA (no user) */}
        {!user && (
          <div className="hidden md:block">
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-200">
                Login
              </Button>
            </Link>
          </div>
        )}

        {/* User Dropdown */}
        {user && (
          <Dropdown>
            <Dropdown.Trigger className="rounded-full cursor-pointer">
              <Avatar size="md">
                <Avatar.Image alt={user?.name} src={user?.image} />
                <Avatar.Fallback delayMs={600}>
                  {user?.name?.slice(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar>
            </Dropdown.Trigger>

            <Dropdown.Popover className="bg-card border border-border shadow-2xl rounded-2xl p-0 min-w-[240px]">
              <div className="px-4 pt-4 pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <Avatar.Image alt={user?.name} src={user?.image} />
                    <Avatar.Fallback delayMs={600}>
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-sans text-sm font-semibold text-foreground leading-5">
                      {user?.name}
                    </p>
                    <p className="font-sans text-xs text-secondary-text leading-4 truncate max-w-[150px]">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <Dropdown.Menu>
                <Dropdown.Item
                  id="profile"
                  textValue="Profile"
                  href="/dashboard"
                >
                  <div className="flex items-center gap-3">
                    <FiUser className="size-4 text-secondary-text" />
                    <Label className="text-secondary-text">My Profile</Label>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  id="dashboard"
                  textValue="Dashboard"
                  href="/dashboard"
                >
                  <div className="flex items-center gap-3">
                    <FiLayout className="size-4 text-secondary-text" />
                    <Label className="text-secondary-text">Dashboard</Label>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  id="logout"
                  textValue="Logout"
                  variant="danger"
                  className="mt-1 border-t border-border pt-2"
                >
                  <div
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3"
                  >
                    <FiLogOut className="size-4 text-error" />
                    <Label className="text-error">Logout</Label>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        )}
      </div>
    </nav>
  );
};

export default NavBar;