// Renders an animated 3D character (GLB, assets/raw/, local only) into isometric frames, 8 directions.
// Usage: node scripts/render-sprites.mjs <model.glb under assets/raw/> <output folder under assets/raw/>
// then open the printed address in a browser (the Browser pane): the page renders and sends every frame back,
// saved as <output>/<direction>-<frame>.png. Assemble them with npm run walk. Method: docs/gdd/animation.md.
import { createReadStream, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const [model, outDir] = process.argv.slice(2);
if (!model || !outDir) {
  console.error('Usage : node scripts/render-sprites.mjs <modèle.glb> <dossier de sortie>  (chemins sous assets/raw/)');
  process.exit(1);
}
const RAW = new URL('../assets/raw/', import.meta.url);
const out = new URL(`${outDir.replace(/\/?$/, '/')}`, RAW);
mkdirSync(out, { recursive: true });

const server = await createServer({
  root: fileURLToPath(new URL('../tools/sprite-render/', import.meta.url)),
  server: { port: 5180, strictPort: true },
  plugins: [
    {
      name: 'sprite-render-io',
      configureServer(vite) {
        vite.middlewares.use('/model.glb', (_req, res) => {
          res.setHeader('Content-Type', 'model/gltf-binary');
          createReadStream(new URL(model, RAW)).pipe(res);
        });
        vite.middlewares.use('/save', (req, res) => {
          const name = new URL(req.url, 'http://x').searchParams.get('name') ?? '';
          if (!/^[a-z]+-\d+\.png$/.test(name)) {
            res.statusCode = 400;
            return res.end();
          }
          const chunks = [];
          req.on('data', (c) => chunks.push(c));
          req.on('end', () => {
            writeFileSync(new URL(name, out), Buffer.concat(chunks));
            res.end('ok');
          });
        });
      },
    },
  ],
});
await server.listen();
console.log(`Rendu prêt : http://localhost:5180/  →  assets/raw/${outDir}`);
