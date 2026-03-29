/**
 * GSAP plugin registration singleton.
 * Import this file (side-effect only) from any 'use client' component before
 * using ScrollTrigger / TextPlugin. Safe to import multiple times — GSAP
 * internally guards against double-registration.
 */
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"

gsap.registerPlugin(ScrollTrigger, TextPlugin)

export { gsap, ScrollTrigger }
