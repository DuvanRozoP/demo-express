import { renderToReadableStream } from 'react-dom/server';
import { TRequestFts } from './src/server/express';
import Fts from './src/server/express';

function Component(props: { message: string }) {
  return (
    <body>
      <h1>{props.message}</h1>
    </body>
  );
}

const app = new Fts();

// ! pendding
app.get('/fts/:id', (req: TRequestFts) => {
  return new Response('FTS!');
});

app.get('/fts2', (req: TRequestFts) => {
  console.log('🚀 ~ file: index.tsx:19 ~ app.get ~ req:', req);

  return new Response(
    `hola ${req.params.nombre}, tienes la edad de ${req.params.edad}`
  );
});

app.get('*', async (req: TRequestFts) => {
  const stream = await renderToReadableStream(
    <Component message="Hello from server!" />
  );

  return new Response(stream, {
    headers: { 'Content-Type': 'text/html' },
  });
});

app.post('/fts', async (req: TRequestFts) => {
  return new Response(`POST FTS!`);
});

app.listen(3000, () => {
  console.log('server started in port 3000');
});

/*
Bun.serve({
  port: 3000,
  async fetch(this, req: Request) {
    const url = new URL(req.url);
    const stream = await renderToReadableStream(
      <Component message="Hello from server!" />
    );

    const res = new Response(stream, {
      headers: { 'Content-Type': 'text/html' },
    });
    return res;
  },
});
console.log('server started in port 3000');
*/
