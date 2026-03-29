"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
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
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const prev = scrollYProgress.getPrevious() ?? 0;
      const direction = current - prev;

      if (current < 0.02) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.95 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto z-[5000] p-1.5 items-center justify-center space-x-2 glass rounded-full border-hairline",
          className
        )}
      >
        <div className="flex items-center space-x-1 px-4">
          {navItems.map((navItem, idx: number) => (
            <motion.div
              key={`link=${idx}`}
              whileHover={{ 
                scale: 1.15,
                y: -2,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10
              }}
            >
              <Link
                href={navItem.link}
                className="relative p-2 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors group"
              >
                <span className="block">{navItem.icon}</span>
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 glass rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {navItem.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="h-6 w-[1px] bg-foreground/10 mx-2" />

        <Button 
          variant="shiny" 
          size="sm" 
          className="rounded-full px-5 font-bold h-8 text-[11px] uppercase tracking-wider"
        >
          Login
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};
