"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/index";
import Link from "next/link";
import { Button } from "./button";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 10) {
        setVisible(false);
      } else {
        setVisible(current < lastScroll);
      }
      setLastScroll(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  return (
    <div
      className={cn(
        "flex max-w-fit fixed top-6 inset-x-0 mx-auto z-[5000] p-1.5 items-center justify-center space-x-2 glass rounded-full border-hairline transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0",
        className
      )}
    >
      <div className="flex items-center space-x-1 px-4">
        {navItems.map((navItem, idx: number) => (
          <div key={`link=${idx}`} className="transition-transform duration-200 hover:-translate-y-1 hover:scale-105">
            <Link
              href={navItem.link}
              className="relative p-2 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors group"
            >
              <span className="block">{navItem.icon}</span>
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 glass rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {navItem.name}
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="h-6 w-[1px] bg-foreground/10 mx-2" />

      <Button variant="shiny" size="sm" className="rounded-full px-5 font-bold h-8 text-[11px] uppercase tracking-wider">
        Login
      </Button>
    </div>
  );
};
