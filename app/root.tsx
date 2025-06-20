import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type {LinksFunction} from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  {rel: "preconnect", href: "https://fonts.googleapis.com"},
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Special+Gothic+Condensed+One&display=swap",
  },
];

export function Layout({children}: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <title>DDR Score Challenge</title>
        <meta property="og:title" content="DDR Score Challenge" />
        <meta property="og:description" content="DDR Score Challenge" />
        <meta property="og:image" content="https://ddr-score-challenge.gaftalk.com/logo.png" />
        <meta property="og:url" content="https://ddr-score-challenge.gaftalk.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="DDR Score Challenge" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DDR Score Challenge" />
        <meta name="twitter:description" content="DDR Score Challenge" />
        <meta name="twitter:image" content="https://ddr-score-challenge.gaftalk.com/logo.png" />
        <meta name="twitter:site" content="@takas_kzn" />
        <meta name="twitter:creator" content="@takas_kzn" />
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <Meta/>
        <Links/>
      </head>
      <body>
      {children}
      <ScrollRestoration/>
      <Scripts/>
      </body>
      </html>
  );
}

export function HydrateFallback() {
    return null;
}

export default function App() {
  return <Outlet/>;
}
