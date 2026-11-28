/** Single place where GSAP plugins are registered. Import gsap from here. */
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };
