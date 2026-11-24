import { writeFile } from 'node:fs/promises';
const revision = 'f6a7ee330ff6575b16366098af27c767ca878db5';
const url = `https://raw.githubusercontent.com/davidarranz7/tarjeteros/${revision}/src/styles/figma-original.css`;
try {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const content = await response.text();
  if (!content.includes('--blue: #2364d7') || !content.includes('.bottom-nav')) throw new Error('Estilos originales no reconocidos');
  await writeFile(new URL('../src/styles/figma-original.css', import.meta.url), content);
  console.log('Estilos originales de Tarjeteros sincronizados:', revision.slice(0, 8));
} catch (error) {
  console.warn('No se pudo guardar el CSS localmente. Se conserva la importación de respaldo al CDN.', error.message);
}
