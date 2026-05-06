import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import { LEARN_CATEGORY_ICON_URL, LEARN_COURSE_ICON_URL } from './learnTechIconUrls';
import './LearnTechIcon.css';

export type LearnTechIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type LearnTechIconProps = {
  /** One of `LEARN_COURSE_ICON_URL` keys (tutorial slug). */
  courseSlug?: string;
  /** One of `LEARN_CATEGORY_ICON_URL` keys (category id). */
  categoryId?: string;
  size: LearnTechIconSize;
  /** Accessible name; defaults from slug/id. */
  title?: string;
  className?: string;
  /** Fallback glyph contrast when no CDN URL exists. */
  tone?: 'onLight' | 'onDark';
};

/**
 * Renders the same markup for every course/category: span.learn-tech-icon > img[src=devicon SVG].
 * Unknown slugs fall back to a generic code glyph with identical wrapper classes.
 */
const LearnTechIcon: React.FC<LearnTechIconProps> = ({
  courseSlug,
  categoryId,
  size,
  title,
  className,
  tone = 'onLight',
}) => {
  const url = courseSlug
    ? LEARN_COURSE_ICON_URL[courseSlug]
    : categoryId
      ? LEARN_CATEGORY_ICON_URL[categoryId]
      : undefined;

  const label =
    title ||
    (courseSlug ? `${courseSlug} course` : categoryId ? `${categoryId} category` : 'Technology');

  const sizeClass = `learn-tech-icon--${size}`;
  const rootClass = ['learn-tech-icon', sizeClass, className].filter(Boolean).join(' ');

  const fallbackColor =
    tone === 'onDark' ? 'rgba(255,255,255,0.92)' : 'rgba(13, 71, 161, 0.55)';

  if (!url) {
    return (
      <span className={rootClass} title={label} aria-label={label} role="img">
        <CodeIcon sx={{ width: '75%', height: '75%', color: fallbackColor }} />
      </span>
    );
  }

  return (
    <span className={rootClass} title={label}>
      <img src={url} alt="" loading="lazy" decoding="async" draggable={false} />
    </span>
  );
};

export default LearnTechIcon;
