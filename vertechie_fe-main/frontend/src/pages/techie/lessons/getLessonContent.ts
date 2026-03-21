/**
 * Async lesson resolution: one dynamic import per tutorial track (smaller initial Tutorial chunk).
 */
import type { LessonContentPayload } from './lessonContentTypes';

const FALLBACK: LessonContentPayload = {
  title: 'Lesson',
  content: '# Coming Soon\n\nThis lesson content is being prepared.',
  tryItCode: '<!-- Code example coming soon -->',
};

type StaticModule = { lessons: Record<string, LessonContentPayload> };

const staticLoaders: Record<string, () => Promise<StaticModule>> = {
  html: () => import('./static/html'),
  css: () => import('./static/css'),
  javascript: () => import('./static/javascript'),
  python: () => import('./static/python'),
};

async function tryStaticLesson(
  tutorialSlug: string,
  lessonSlug: string
): Promise<LessonContentPayload | null> {
  const load = staticLoaders[tutorialSlug];
  if (!load) return null;
  const mod = await load();
  return mod.lessons[lessonSlug] ?? null;
}

export async function getLessonContentAsync(
  tutorialSlug: string,
  lessonSlug: string
): Promise<LessonContentPayload> {
  try {
    const staticHit = await tryStaticLesson(tutorialSlug, lessonSlug);
    if (staticHit) return staticHit;

    switch (tutorialSlug) {
      case 'html': {
        const { generateHTMLLessonContent } = await import('./html');
        return generateHTMLLessonContent(lessonSlug);
      }
      case 'css': {
        const { generateCSSLessonContent } = await import('./css');
        return generateCSSLessonContent(lessonSlug);
      }
      case 'javascript': {
        const { generateJSLessonContent } = await import('./javascript');
        return generateJSLessonContent(lessonSlug);
      }
      case 'typescript': {
        const { generateTSLessonContent } = await import('./typescript');
        return generateTSLessonContent(lessonSlug);
      }
      case 'react': {
        const { generateReactLessonContent } = await import('./react');
        return generateReactLessonContent(lessonSlug);
      }
      case 'angular': {
        const { generateAngularLessonContent } = await import('./angular');
        return generateAngularLessonContent(lessonSlug);
      }
      case 'python': {
        const { generatePythonLessonContent } = await import('./python');
        return generatePythonLessonContent(lessonSlug);
      }
      case 'sql': {
        const { generateSQLLessonContent } = await import('./sql');
        return generateSQLLessonContent(lessonSlug);
      }
      case 'nodejs': {
        const { generateNodeLessonContent } = await import('./node');
        return generateNodeLessonContent(lessonSlug);
      }
      case 'git': {
        const { generateGitLessonContent } = await import('./git');
        return generateGitLessonContent(lessonSlug);
      }
      case 'machine-learning': {
        const { generateMLLessonContent } = await import('./ml');
        return generateMLLessonContent(lessonSlug);
      }
      default:
        return FALLBACK;
    }
  } catch {
    return FALLBACK;
  }
}

export type { LessonContentPayload } from './lessonContentTypes';
