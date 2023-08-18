import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ToastProvider>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <ToastViewport className="fixed top-10 right-0 flex flex-col p-5 gap-2 w-[400px] m-0 list-none outline-none z-50" />
        </ToastProvider>
      </body>
    </html>
  );
}
