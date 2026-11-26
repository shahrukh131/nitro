import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true,
  focusable: false,
} as const;

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        fill="currentColor"
        d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.1 15.94 2 14.64 2 11.93 2 10 3.66 10 6.7v2.8H7v4h3V22h4v-8.5Z"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(2 2)" stroke="currentColor" strokeWidth={2}>
        <path d="M1 9c0-3.77 0-5.66 1.17-6.83C3.34 1 5.23 1 9 1h2c3.77 0 5.66 0 6.83 1.17C19 3.34 19 5.23 19 9v2c0 3.77 0 5.66-1.17 6.83C16.66 19 14.77 19 11 19H9c-3.77 0-5.66 0-6.83-1.17C1 16.66 1 14.77 1 11V9Z" />
        <circle cx={10} cy={10} r={3} />
      </g>
      <circle cx={16.5} cy={7.5} r={1.5} fill="currentColor" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(2.9 2.25)" stroke="currentColor" strokeWidth={1.5}>
        <path d="M13.94 18.52.88 1.72a.6.6 0 0 1 .47-.97h2.48c.09 0 .18.02.26.06.09.04.16.1.22.17l13.06 16.8a.6.6 0 0 1-.47.97h-2.48a.6.6 0 0 1-.48-.23Z" />
        <path d="M17.12.75 1.12 18.75" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        fill="currentColor"
        d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z"
      />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M3 7h18M3 12h18M9 17h12"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
