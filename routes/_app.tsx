import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html className="overflow-y-scroll">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Exploration Bingo</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="bg-neutral-900 text-white">
        <Component />
      </body>
    </html>
  );
}
