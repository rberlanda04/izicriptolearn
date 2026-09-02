import { useEffect } from 'react';

const SITE_NAME = 'iziCripto';
const SITE_URL = 'https://izicriptolearn.web.app';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.svg`;

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Hook central de SEO: cada página chama isso com seus próprios dados (curso, aula, etc.)
// em vez de metadados fixos no index.html — assim título, descrição e OG crescem junto
// com o catálogo sem precisar tocar em código a cada curso novo.
export function useSeo(options) {
  const { title, description, path = '', image, noindex = false } = options || {};
  useEffect(() => {
    if (!options) return;
    const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Cursos de cripto e simulador de trade`;
    const url = `${SITE_URL}${path}`;
    const img = image || DEFAULT_IMAGE;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setLink('canonical', url);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);
  }, [title, description, path, image]);
}

// Injeta um bloco JSON-LD (dados estruturados) no <head> — usado nas páginas de curso pra
// que buscadores entendam "isto é um Course" e possam exibir resultado rico.
export function useJsonLd(data) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [data]);
}

export { SITE_URL, SITE_NAME };
