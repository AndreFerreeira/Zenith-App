import type { SVGProps } from "react";

export const ZenithMasteryLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 12l6 6L20 6" />
    <path d="M4 6l6 6 1.5-1.5" />
  </svg>
);
