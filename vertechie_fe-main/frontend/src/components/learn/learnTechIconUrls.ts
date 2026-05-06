/**
 * Official-style technology logos via devicons (SVG on jsDelivr CDN).
 * Pinned version for stable URLs.
 */
/** Pinned release for stable CDN URLs (devicons/devicon). */
const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';

/** Course/tutorial slug -> devicon path under icons/ */
export const LEARN_COURSE_ICON_URL: Record<string, string> = {
  html: `${DEVICON_BASE}/html5/html5-original.svg`,
  css: `${DEVICON_BASE}/css3/css3-original.svg`,
  javascript: `${DEVICON_BASE}/javascript/javascript-original.svg`,
  python: `${DEVICON_BASE}/python/python-original.svg`,
  react: `${DEVICON_BASE}/react/react-original.svg`,
  angular: `${DEVICON_BASE}/angular/angular-original.svg`,
  sql: `${DEVICON_BASE}/mysql/mysql-original.svg`,
  typescript: `${DEVICON_BASE}/typescript/typescript-original.svg`,
  nodejs: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  git: `${DEVICON_BASE}/git/git-original.svg`,
  'machine-learning': `${DEVICON_BASE}/tensorflow/tensorflow-original.svg`,
};

/** Category id (curriculum.ts) -> devicon path */
export const LEARN_CATEGORY_ICON_URL: Record<string, string> = {
  web: `${DEVICON_BASE}/googlechrome/googlechrome-original.svg`,
  programming: `${DEVICON_BASE}/python/python-original.svg`,
  backend: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  database: `${DEVICON_BASE}/mysql/mysql-original.svg`,
  ai: `${DEVICON_BASE}/pytorch/pytorch-original.svg`,
  devops: `${DEVICON_BASE}/git/git-original.svg`,
};
