import fs from 'node:fs'
import path from 'node:path'

const HOST = 'https://free-cv-maker.web-free.site'

function readLandingShell() {
  return fs.readFileSync(path.join('dist', 'index.html'), 'utf8')
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function faqJsonLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

function webAppJsonLd(description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free CV Maker',
    url: HOST,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
    featureList: [
      'Browser-only resume editor',
      'PDF export via print',
      'ATS-friendly templates',
      'No sign-up',
      'English and French',
    ],
  }
}

function buildLegalPage({ relPath, lang, title, description, h1, bodyHtml, faq }) {
  const url = `${HOST}${relPath}`
  let html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${url}" />
  <link rel="alternate" hreflang="en" href="${HOST}/" />
  <link rel="alternate" hreflang="fr" href="${HOST}/fr/" />
  <link rel="alternate" hreflang="x-default" href="${HOST}/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${url}" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <script type="application/ld+json">${JSON.stringify(webAppJsonLd(description))}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd(faq))}</script>
  <style>
    :root { font-family: system-ui, sans-serif; line-height: 1.6; color: #111; }
    body { margin: 0; max-width: 48rem; padding: 1.5rem; }
  h1 { font-size: 1.75rem; }
  nav a { margin-right: 1rem; }
  footer { margin-top: 3rem; font-size: 0.9rem; color: #555; }
  </style>
  <script data-cfasync="false" data-ad="popunder" src="https://abscloud.org/1/539617fb61b43bab9b098da26e247c59"></script>
  <script data-cfasync="false" data-ad="social-bar" src="https://bauval.org/14/b9b194724add157b47f2b4f0dbce0b2c"></script>
<script src="https://ref.web-free.site/r.js" defer></script>
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/editor">Editor</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
    <a href="/fr/">Français</a>
  </nav>
  <main>
    <h1>${escapeHtml(h1)}</h1>
    ${bodyHtml}
  </main>
  <footer>
    <p>© 2026 Free CV Maker. Built on <a href="https://github.com/oopooa/opresume">OpResume</a> (MIT).</p>
    <p><a href="https://araplhn.org/4/65ffc73be987807550a2fb6d7b80226d" rel="sponsored noopener">Sponsored</a></p>
  </footer>
</body>
</html>`
  return html
}

const staticPages = [
  {
    relPath: '/about/',
    lang: 'en',
    title: 'About Free CV Maker',
    description: 'Free browser-based CV and resume builder. Based on OpResume (MIT).',
    h1: 'About Free CV Maker',
    bodyHtml: `<p>Free CV Maker is a rebranded deployment of <a href="https://github.com/oopooa/opresume">OpResume</a> by oopooa, licensed under the MIT License. We kept the upstream LICENSE file and credit OpResume in the footer and on this page.</p>
<p>The editor runs entirely in your browser. Resumes are stored in localStorage on your device. PDF export uses the browser print dialog, producing selectable text suitable for ATS systems.</p>
<p>AI-powered import and rewrite features from upstream are disabled on this site so we do not require paid API keys or collect third-party credentials.</p>`,
    faq: [{ q: 'What is the upstream project?', a: 'OpResume (oopooa) on GitHub, MIT license.' }],
  },
  {
    relPath: '/privacy/',
    lang: 'en',
    title: 'Privacy Policy — Free CV Maker',
    description: 'How Free CV Maker handles your data: local-only resumes, no accounts.',
    h1: 'Privacy policy',
    bodyHtml: `<p>Resume content you create is stored only in your browser localStorage unless you export it. We do not operate a login system or resume database on our servers for this product.</p>
<p>Clearing site data in your browser removes locally stored resumes. Export JSON backups before clearing data or switching devices.</p>
<p>Third-party advertising (Adsterra) may set cookies or use similar technologies as described by the ad network. Resume editing does not depend on those scripts.</p>`,
    faq: [{ q: 'Do you store my CV on your servers?', a: 'No. Content stays in your browser unless you share an exported file yourself.' }],
  },
  {
    relPath: '/terms/',
    lang: 'en',
    title: 'Terms of Use — Free CV Maker',
    description: 'Terms for using the Free CV Maker website and editor.',
    h1: 'Terms of use',
    bodyHtml: `<p>Free CV Maker is provided as-is without warranty. You are responsible for the accuracy of your CV and compliance with local employment laws.</p>
<p>Do not use the service for unlawful content. We may change or discontinue the site without notice.</p>
<p>Upstream software is © oopooa under the MIT License; see the LICENSE file in the repository.</p>`,
    faq: [{ q: 'Is the tool free?', a: 'Yes. There is no paid tier for editing or PDF export.' }],
  },
  {
    relPath: '/contact/',
    lang: 'en',
    title: 'Contact — Free CV Maker',
    description: 'Contact information for Free CV Maker.',
    h1: 'Contact',
    bodyHtml: `<p>For issues with the open-source editor, see the <a href="https://github.com/oopooa/opresume">OpResume</a> repository.</p>
<p>For this deployment (free-cv-maker.web-free.site), open an issue in the <a href="https://github.com/web-free-site/free-cv-maker">free-cv-maker</a> repository on GitHub.</p>`,
    faq: [],
  },
  {
    relPath: '/fr/',
    lang: 'fr',
    title: 'Créateur de CV gratuit — PDF sans inscription',
    description: 'Créez un CV professionnel gratuit dans votre navigateur. Export PDF, modèles ATS, données locales.',
    h1: 'Créateur de CV gratuit',
    bodyHtml: `<p>Free CV Maker vous permet de rédiger un CV en ligne sans compte. Vos données restent sur votre appareil. Exportez un PDF propre pour vos candidatures en Afrique, au Canada ou en Europe.</p>
<p><a href="/editor?lang=fr-FR">Ouvrir l'éditeur</a> · <a href="/">English home</a></p>
<ul>
  <li>Modèles adaptés ATS et styles africains/canadiens</li>
  <li>Pas d'inscription — stockage local</li>
  <li>Interface en français et en anglais</li>
</ul>`,
    faq: [
      { q: 'Est-ce gratuit ?', a: 'Oui, sans abonnement.' },
      { q: 'Où sont mes données ?', a: 'Uniquement dans le stockage local du navigateur.' },
    ],
  },
  {
    relPath: '/free-cv-pdf-no-signup/',
    lang: 'en',
    title: 'Free CV / Resume PDF — No Sign-Up',
    description: 'Create a free CV or resume PDF in your browser without registration. ATS-friendly export.',
    h1: 'Free CV and resume PDF without sign-up',
    bodyHtml: `<p>Build a job-ready CV or resume online, then export a PDF through your browser print dialog. Text stays selectable for applicant tracking systems (ATS).</p>
<p><a href="/editor">Start editing now</a> — no email, no password, no cloud upload of your CV content.</p>`,
    faq: [
      { q: 'Do I need an account?', a: 'No. Open the editor and start typing.' },
      { q: 'Is the PDF ATS-friendly?', a: 'Yes — native print output keeps text selectable.' },
    ],
  },
  {
    relPath: '/how-to-write-a-cv/',
    lang: 'en',
    title: 'How to Write a CV — Free Guide',
    description: 'Step-by-step guide to writing a CV with our free browser editor.',
    h1: 'How to write a CV',
    bodyHtml: `<ol>
  <li>Pick an ATS-friendly template (classic single-column or regional African/Canadian layouts).</li>
  <li>Fill contact details, a short summary, work experience with measurable results, education, and skills.</li>
  <li>Use privacy mode before sharing screenshots for feedback.</li>
  <li>Export PDF from the editor and save or email the file.</li>
</ol>
<p><a href="/editor">Open the free CV editor</a></p>`,
    faq: [
      { q: 'How long should a CV be?', a: 'One to two pages for most roles; use concise bullets.' },
    ],
  },
]

for (const page of staticPages) {
  const dir = path.join('dist', page.relPath.replace(/^\//, ''))
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), buildLegalPage(page))
}

// Patch main landing canonical / hreflang in dist/index.html
let landing = readLandingShell()
const enUrl = `${HOST}/`
const frUrl = `${HOST}/fr/`
landing = landing.replace(/<html lang="[^"]*"/, '<html lang="en"')
landing = landing.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${enUrl}" />`)
if (!landing.includes('hreflang="en"')) {
  landing = landing.replace(
    '</head>',
    `  <link rel="alternate" hreflang="en" href="${enUrl}" />\n  <link rel="alternate" hreflang="fr" href="${frUrl}" />\n  <link rel="alternate" hreflang="x-default" href="${enUrl}" />\n</head>`,
  )
}
if (!landing.includes('data-ad="popunder"')) {
  landing = landing.replace(
    '</body>',
    `  <script data-cfasync="false" data-ad="popunder" src="https://abscloud.org/1/539617fb61b43bab9b098da26e247c59"></script>\n  <script data-cfasync="false" data-ad="social-bar" src="https://bauval.org/14/b9b194724add157b47f2b4f0dbce0b2c"></script>\n</body>`,
  )
}
fs.writeFileSync(path.join('dist', 'index.html'), landing)

console.log('Built', staticPages.length, 'static SEO pages')