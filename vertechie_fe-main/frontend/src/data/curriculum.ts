/**
 * Comprehensive Curriculum Data
 * Enterprise-level learning content inspired by W3Schools and freeCodeCamp
 */

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  hasQuiz: boolean;
  hasExercise: boolean;
  hasTryIt: boolean;
  isCompleted?: boolean;
  content?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isExpanded?: boolean;
}

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  chapters: Chapter[];
  totalLessons: number;
  totalHours: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  prerequisites?: string[];
  learners: number;
  rating: number;
  isCertified: boolean;
  isFree: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tutorials: Tutorial[];
}

// ============================================
// WEB DEVELOPMENT TUTORIALS
// ============================================

export const htmlTutorial: Tutorial = {
  id: 'html',
  slug: 'html',
  title: 'HTML Tutorial',
  shortTitle: 'HTML',
  description: 'Learn HTML, the standard markup language for creating web pages.',
  icon: '🌐',
  color: '#E44D26',
  bgColor: '#FFF4F2',
  difficulty: 'beginner',
  category: 'web',
  tags: ['HTML', 'Web Development', 'Frontend'],
  totalLessons: 85,
  totalHours: '12',
  learners: 2500000,
  rating: 4.9,
  isCertified: true,
  isFree: true,
  chapters: [
    {
      id: 'html-intro',
      title: 'HTML Introduction',
      description: 'Get started with HTML basics',
      lessons: [
        { id: 'html-home', title: 'HTML HOME', slug: 'home', description: 'Introduction to HTML', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'html-intro', title: 'HTML Introduction', slug: 'intro', description: 'What is HTML?', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-editors', title: 'HTML Editors', slug: 'editors', description: 'Choose your HTML editor', duration: '8 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'html-basic', title: 'HTML Basic Examples', slug: 'basic', description: 'Basic HTML examples', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-elements', title: 'HTML Elements', slug: 'elements', description: 'Understanding HTML elements', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-attributes', title: 'HTML Attributes', slug: 'attributes', description: 'Using HTML attributes', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'html-text',
      title: 'HTML Text Formatting',
      description: 'Format text in HTML',
      lessons: [
        { id: 'html-headings', title: 'HTML Headings', slug: 'headings', description: 'h1 to h6 headings', duration: '8 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-paragraphs', title: 'HTML Paragraphs', slug: 'paragraphs', description: 'Creating paragraphs', duration: '8 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-styles', title: 'HTML Styles', slug: 'styles', description: 'Inline CSS styles', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-formatting', title: 'HTML Formatting', slug: 'formatting', description: 'Text formatting elements', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-quotations', title: 'HTML Quotations', slug: 'quotations', description: 'Quotation elements', duration: '8 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-comments', title: 'HTML Comments', slug: 'comments', description: 'Adding comments', duration: '5 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-colors', title: 'HTML Colors', slug: 'colors', description: 'Using colors in HTML', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'html-links-images',
      title: 'HTML Links & Images',
      description: 'Add links and images to your pages',
      lessons: [
        { id: 'html-links', title: 'HTML Links', slug: 'links', description: 'Creating hyperlinks', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-images', title: 'HTML Images', slug: 'images', description: 'Adding images', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-favicon', title: 'HTML Favicon', slug: 'favicon', description: 'Adding a favicon', duration: '8 min', hasQuiz: false, hasExercise: true, hasTryIt: true },
        { id: 'html-tables', title: 'HTML Tables', slug: 'tables', description: 'Creating tables', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-lists', title: 'HTML Lists', slug: 'lists', description: 'Ordered and unordered lists', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'html-forms',
      title: 'HTML Forms',
      description: 'Create interactive forms',
      lessons: [
        { id: 'html-forms-intro', title: 'HTML Forms', slug: 'forms', description: 'Form introduction', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-form-elements', title: 'HTML Form Elements', slug: 'form-elements', description: 'Form elements', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-input-types', title: 'HTML Input Types', slug: 'input-types', description: 'Input type attributes', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-input-attrs', title: 'HTML Input Attributes', slug: 'input-attributes', description: 'Input attributes', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'html-semantic',
      title: 'HTML Semantic Elements',
      description: 'Modern semantic HTML5',
      lessons: [
        { id: 'html-semantic-intro', title: 'HTML Semantics', slug: 'semantics', description: 'Semantic elements', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-layout', title: 'HTML Layout', slug: 'layout', description: 'Page layout', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-responsive', title: 'HTML Responsive', slug: 'responsive', description: 'Responsive design', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'html-head', title: 'HTML Head', slug: 'head', description: 'The head element', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

export const cssTutorial: Tutorial = {
  id: 'css',
  slug: 'css',
  title: 'CSS Tutorial',
  shortTitle: 'CSS',
  description: 'Master CSS - the language for styling web pages. Learn everything from basics to advanced techniques.',
  icon: '🎨',
  color: '#264DE4',
  bgColor: '#F0F4FF',
  difficulty: 'beginner',
  category: 'web',
  tags: ['CSS', 'Web Development', 'Frontend', 'Styling', 'Flexbox', 'Grid', 'Responsive'],
  prerequisites: ['html'],
  totalLessons: 150,
  totalHours: '25',
  learners: 2500000,
  rating: 4.9,
  isCertified: true,
  isFree: true,
  chapters: [
    // ========== CSS TUTORIAL (Basics) ==========
    {
      id: 'css-intro',
      title: 'CSS Introduction',
      description: 'Get started with CSS fundamentals',
      lessons: [
        { id: 'css-home', title: 'CSS HOME', slug: 'home', description: 'Introduction to CSS', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'css-introduction', title: 'CSS Introduction', slug: 'introduction', description: 'What is CSS?', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-syntax', title: 'CSS Syntax', slug: 'syntax', description: 'CSS syntax rules', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-selectors', title: 'CSS Selectors', slug: 'selectors', description: 'Select HTML elements', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-howto', title: 'CSS How To', slug: 'howto', description: 'Ways to add CSS', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-comments', title: 'CSS Comments', slug: 'comments', description: 'Adding comments', duration: '5 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'css-errors', title: 'CSS Errors', slug: 'errors', description: 'Common CSS errors', duration: '8 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-colors-backgrounds',
      title: 'CSS Colors & Backgrounds',
      description: 'Work with colors and backgrounds',
      lessons: [
        { id: 'css-colors', title: 'CSS Colors', slug: 'colors', description: 'Color values & formats', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-backgrounds', title: 'CSS Backgrounds', slug: 'backgrounds', description: 'Background properties', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-box-model',
      title: 'CSS Box Model',
      description: 'Understanding the CSS Box Model',
      lessons: [
        { id: 'css-borders', title: 'CSS Borders', slug: 'borders', description: 'Border properties', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-margins', title: 'CSS Margins', slug: 'margins', description: 'Margin spacing', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-padding', title: 'CSS Padding', slug: 'padding', description: 'Padding spacing', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-height-width', title: 'CSS Height/Width', slug: 'height-width', description: 'Sizing elements', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-boxmodel', title: 'CSS Box Model', slug: 'boxmodel', description: 'The box model concept', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-outline', title: 'CSS Outline', slug: 'outline', description: 'Outline property', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-text-fonts',
      title: 'CSS Text & Fonts',
      description: 'Typography and text styling',
      lessons: [
        { id: 'css-text', title: 'CSS Text', slug: 'text', description: 'Text formatting', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-fonts', title: 'CSS Fonts', slug: 'fonts', description: 'Font properties', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-icons', title: 'CSS Icons', slug: 'icons', description: 'Using icon fonts', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-links-lists',
      title: 'CSS Links, Lists & Tables',
      description: 'Styling links, lists and tables',
      lessons: [
        { id: 'css-links', title: 'CSS Links', slug: 'links', description: 'Styling hyperlinks', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-lists', title: 'CSS Lists', slug: 'lists', description: 'List styling', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-tables', title: 'CSS Tables', slug: 'tables', description: 'Table styling', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-layout-basics',
      title: 'CSS Layout Basics',
      description: 'Fundamental layout techniques',
      lessons: [
        { id: 'css-display', title: 'CSS Display', slug: 'display', description: 'Display property', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-max-width', title: 'CSS Max-width', slug: 'max-width', description: 'Max-width property', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-position', title: 'CSS Position', slug: 'position', description: 'Positioning elements', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-z-index', title: 'CSS Z-index', slug: 'z-index', description: 'Stacking order', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-overflow', title: 'CSS Overflow', slug: 'overflow', description: 'Content overflow', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-float', title: 'CSS Float', slug: 'float', description: 'Float property', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-inline-block', title: 'CSS Inline-block', slug: 'inline-block', description: 'Inline-block display', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-align', title: 'CSS Align', slug: 'align', description: 'Alignment techniques', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-selectors-advanced',
      title: 'CSS Advanced Selectors',
      description: 'Master advanced selectors',
      lessons: [
        { id: 'css-combinators', title: 'CSS Combinators', slug: 'combinators', description: 'Combinator selectors', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-pseudo-classes', title: 'CSS Pseudo-classes', slug: 'pseudo-classes', description: 'Pseudo-class selectors', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-pseudo-elements', title: 'CSS Pseudo-elements', slug: 'pseudo-elements', description: 'Pseudo-element selectors', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-attr-selectors', title: 'CSS Attr Selectors', slug: 'attr-selectors', description: 'Attribute selectors', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-forms-ui',
      title: 'CSS Forms & UI',
      description: 'Styling forms and UI elements',
      lessons: [
        { id: 'css-opacity', title: 'CSS Opacity', slug: 'opacity', description: 'Transparency effects', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-navigation-bars', title: 'CSS Navigation Bars', slug: 'navigation-bars', description: 'Navbar styling', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-dropdowns', title: 'CSS Dropdowns', slug: 'dropdowns', description: 'Dropdown menus', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-image-gallery', title: 'CSS Image Gallery', slug: 'image-gallery', description: 'Image galleries', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-image-sprites', title: 'CSS Image Sprites', slug: 'image-sprites', description: 'Sprite techniques', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-forms', title: 'CSS Forms', slug: 'forms', description: 'Form styling', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-counters', title: 'CSS Counters', slug: 'counters', description: 'CSS counters', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-concepts',
      title: 'CSS Core Concepts',
      description: 'Important CSS concepts',
      lessons: [
        { id: 'css-units', title: 'CSS Units', slug: 'units', description: 'CSS measurement units', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-inheritance', title: 'CSS Inheritance', slug: 'inheritance', description: 'Property inheritance', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-specificity', title: 'CSS Specificity', slug: 'specificity', description: 'Specificity rules', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-important', title: 'CSS !important', slug: 'important', description: 'The !important rule', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-math-functions', title: 'CSS Math Functions', slug: 'math-functions', description: 'calc(), min(), max()', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-optimization', title: 'CSS Optimization', slug: 'optimization', description: 'Performance tips', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-accessibility', title: 'CSS Accessibility', slug: 'accessibility', description: 'Accessible styling', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-website-layout', title: 'CSS Website Layout', slug: 'website-layout', description: 'Complete layouts', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // ========== CSS ADVANCED ==========
    {
      id: 'css-advanced',
      title: 'CSS Advanced Styling',
      description: 'Advanced CSS techniques',
      lessons: [
        { id: 'css-rounded-corners', title: 'CSS Rounded Corners', slug: 'rounded-corners', description: 'Border-radius', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-border-images', title: 'CSS Border Images', slug: 'border-images', description: 'Border images', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-multiple-backgrounds', title: 'CSS Multiple Backgrounds', slug: 'multiple-backgrounds', description: 'Multiple backgrounds', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-color-keywords', title: 'CSS Color Keywords', slug: 'color-keywords', description: 'Named colors', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-gradients', title: 'CSS Gradients', slug: 'gradients', description: 'Linear & radial gradients', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-shadows', title: 'CSS Shadows', slug: 'shadows', description: 'Box & text shadows', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-text-effects', title: 'CSS Text Effects', slug: 'text-effects', description: 'Advanced text styling', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-custom-fonts', title: 'CSS Custom Fonts', slug: 'custom-fonts', description: '@font-face', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-transforms',
      title: 'CSS Transforms & Animations',
      description: 'Movement and animation',
      lessons: [
        { id: 'css-2d-transforms', title: 'CSS 2D Transforms', slug: '2d-transforms', description: '2D transformations', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-3d-transforms', title: 'CSS 3D Transforms', slug: '3d-transforms', description: '3D transformations', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-transitions', title: 'CSS Transitions', slug: 'transitions', description: 'Smooth transitions', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-animations', title: 'CSS Animations', slug: 'animations', description: 'Keyframe animations', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-images',
      title: 'CSS Image Styling',
      description: 'Advanced image techniques',
      lessons: [
        { id: 'css-tooltips', title: 'CSS Tooltips', slug: 'tooltips', description: 'Creating tooltips', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-image-styling', title: 'CSS Image Styling', slug: 'image-styling', description: 'Image effects', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-image-modal', title: 'CSS Image Modal', slug: 'image-modal', description: 'Lightbox modals', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-image-centering', title: 'CSS Image Centering', slug: 'image-centering', description: 'Centering images', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-image-filters', title: 'CSS Image Filters', slug: 'image-filters', description: 'Filter effects', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-image-shapes', title: 'CSS Image Shapes', slug: 'image-shapes', description: 'Shape effects', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-object-fit', title: 'CSS object-fit', slug: 'object-fit', description: 'Object-fit property', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-object-position', title: 'CSS object-position', slug: 'object-position', description: 'Object-position', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-masking', title: 'CSS Masking', slug: 'masking', description: 'Masking techniques', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'css-ui-components',
      title: 'CSS UI Components',
      description: 'Building UI components',
      lessons: [
        { id: 'css-buttons', title: 'CSS Buttons', slug: 'buttons', description: 'Button styling', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-pagination', title: 'CSS Pagination', slug: 'pagination', description: 'Pagination styles', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-multiple-columns', title: 'CSS Multiple Columns', slug: 'multiple-columns', description: 'Multi-column layout', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-user-interface', title: 'CSS User Interface', slug: 'user-interface', description: 'UI properties', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-variables', title: 'CSS Variables', slug: 'variables', description: 'Custom properties', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-property', title: 'CSS @property', slug: 'property', description: '@property rule', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-box-sizing', title: 'CSS Box Sizing', slug: 'box-sizing', description: 'Box-sizing property', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-media-queries', title: 'CSS Media Queries', slug: 'media-queries', description: 'Responsive media', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-mq-examples', title: 'CSS MQ Examples', slug: 'mq-examples', description: 'Media query examples', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // ========== CSS FLEXBOX ==========
    {
      id: 'css-flexbox',
      title: 'CSS Flexbox',
      description: 'Master Flexbox layout',
      lessons: [
        { id: 'css-flexbox-intro', title: 'Flexbox Intro', slug: 'flexbox-intro', description: 'Introduction to Flexbox', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-flex-container', title: 'Flex Container', slug: 'flex-container', description: 'Container properties', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-flex-items', title: 'Flex Items', slug: 'flex-items', description: 'Item properties', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-flex-responsive', title: 'Flex Responsive', slug: 'flex-responsive', description: 'Responsive with Flexbox', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // ========== CSS GRID ==========
    {
      id: 'css-grid',
      title: 'CSS Grid',
      description: 'Master Grid layout',
      lessons: [
        { id: 'css-grid-intro', title: 'Grid Intro', slug: 'grid-intro', description: 'Introduction to Grid', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-grid-container', title: 'Grid Container', slug: 'grid-container', description: 'Container properties', duration: '30 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-grid-items', title: 'Grid Items', slug: 'grid-items', description: 'Item properties', duration: '30 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-grid-12-column', title: 'Grid 12-column Layout', slug: 'grid-12-column', description: '12-column system', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-supports', title: 'CSS @supports', slug: 'supports', description: 'Feature queries', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // ========== CSS RESPONSIVE ==========
    {
      id: 'css-responsive',
      title: 'CSS Responsive Web Design',
      description: 'Build responsive websites',
      lessons: [
        { id: 'css-rwd-intro', title: 'RWD Intro', slug: 'rwd-intro', description: 'Responsive design basics', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-rwd-viewport', title: 'RWD Viewport', slug: 'rwd-viewport', description: 'Viewport meta tag', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-rwd-grid-view', title: 'RWD Grid View', slug: 'rwd-grid-view', description: 'Responsive grid', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-rwd-media-queries', title: 'RWD Media Queries', slug: 'rwd-media-queries', description: 'Responsive breakpoints', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-rwd-images', title: 'RWD Images', slug: 'rwd-images', description: 'Responsive images', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-rwd-videos', title: 'RWD Videos', slug: 'rwd-videos', description: 'Responsive videos', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-rwd-frameworks', title: 'RWD Frameworks', slug: 'rwd-frameworks', description: 'CSS frameworks', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-rwd-templates', title: 'RWD Templates', slug: 'rwd-templates', description: 'Template examples', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // ========== CSS SASS ==========
    {
      id: 'css-sass',
      title: 'CSS SASS',
      description: 'Learn SASS preprocessor',
      lessons: [
        { id: 'css-sass-intro', title: 'SASS Tutorial', slug: 'sass-intro', description: 'Introduction to SASS', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-sass-variables', title: 'SASS Variables', slug: 'sass-variables', description: 'SASS variables', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-sass-nesting', title: 'SASS Nesting', slug: 'sass-nesting', description: 'Nested rules', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'css-sass-mixins', title: 'SASS Mixins', slug: 'sass-mixins', description: 'Creating mixins', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

export const jsTutorial: Tutorial = {
  id: 'javascript',
  slug: 'javascript',
  title: 'JavaScript Tutorial',
  shortTitle: 'JavaScript',
  description: 'Learn JavaScript from 0 to Hero - the complete programming language of the web.',
  icon: '⚡',
  color: '#F7DF1E',
  bgColor: '#FFFEF0',
  difficulty: 'beginner',
  category: 'web',
  tags: ['JavaScript', 'Web Development', 'Frontend', 'Programming'],
  prerequisites: ['html', 'css'],
  totalLessons: 45,
  totalHours: '40',
  learners: 3100000,
  rating: 4.9,
  isCertified: true,
  isFree: true,
  chapters: [
    {
      id: 'js-intro',
      title: 'JavaScript Introduction',
      description: 'Get started with JavaScript fundamentals',
      lessons: [
        { id: 'js-home', title: 'JS HOME', slug: 'home', description: 'Introduction to JavaScript', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'js-intro', title: 'JS Introduction', slug: 'intro', description: 'What is JavaScript?', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-where-to', title: 'JS Where To', slug: 'whereto', description: 'Where to put JS', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-output', title: 'JS Output', slug: 'output', description: 'Displaying output', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-statements', title: 'JS Statements', slug: 'statements', description: 'JavaScript statements', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-syntax', title: 'JS Syntax', slug: 'syntax', description: 'JavaScript syntax', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-comments', title: 'JS Comments', slug: 'comments', description: 'Adding comments', duration: '5 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-variables',
      title: 'JS Variables & Data Types',
      description: 'Variables, data types, and operators',
      lessons: [
        { id: 'js-variables', title: 'JS Variables', slug: 'variables', description: 'Declaring variables', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-let', title: 'JS Let', slug: 'let', description: 'The let keyword', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-const', title: 'JS Const', slug: 'const', description: 'The const keyword', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-operators', title: 'JS Operators', slug: 'operators', description: 'JavaScript operators', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-data-types', title: 'JS Data Types', slug: 'datatypes', description: 'Data types in JS', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-hoisting', title: 'JS Hoisting', slug: 'hoisting', description: 'Variable hoisting', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-strict', title: 'JS Strict Mode', slug: 'strict', description: 'Use strict mode', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-control',
      title: 'JS Control Flow',
      description: 'Conditions and loops',
      lessons: [
        { id: 'js-conditions', title: 'JS If Conditions', slug: 'conditions', description: 'Conditional statements', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-loops', title: 'JS Loops', slug: 'loops', description: 'For, while, do-while loops', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-errors', title: 'JS Error Handling', slug: 'errors', description: 'Try, catch, finally', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-data',
      title: 'JS Data Handling',
      description: 'Strings, numbers, arrays, and objects',
      lessons: [
        { id: 'js-strings', title: 'JS Strings', slug: 'strings', description: 'Working with strings', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-numbers', title: 'JS Numbers', slug: 'numbers', description: 'Working with numbers', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-arrays', title: 'JS Arrays', slug: 'arrays', description: 'Working with arrays', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-array-methods', title: 'JS Array Methods', slug: 'array-methods', description: 'Map, filter, reduce', duration: '30 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-objects', title: 'JS Objects', slug: 'objects', description: 'Creating objects', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-sets', title: 'JS Sets', slug: 'sets', description: 'Set collections', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-maps', title: 'JS Maps', slug: 'maps', description: 'Map collections', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-destructuring', title: 'JS Destructuring', slug: 'destructuring', description: 'Destructuring assignment', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-json', title: 'JS JSON', slug: 'json', description: 'JSON parse and stringify', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-functions',
      title: 'JS Functions & Scope',
      description: 'Functions, scope, and closures',
      lessons: [
        { id: 'js-functions', title: 'JS Functions', slug: 'functions', description: 'Defining functions', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-arrow', title: 'JS Arrow Functions', slug: 'arrow', description: 'Arrow function syntax', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-scope', title: 'JS Scope', slug: 'scope', description: 'Variable scope', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-closures', title: 'JS Closures', slug: 'closures', description: 'Understanding closures', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-callbacks', title: 'JS Callbacks', slug: 'callbacks', description: 'Callback functions', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-this', title: 'JS this Keyword', slug: 'this', description: 'The this keyword', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-time',
      title: 'JS Dates & RegExp',
      description: 'Working with dates and regular expressions',
      lessons: [
        { id: 'js-dates', title: 'JS Dates', slug: 'dates', description: 'Date objects', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-regexp', title: 'JS RegExp', slug: 'regexp', description: 'Regular expressions', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-oop',
      title: 'JS Object-Oriented',
      description: 'Classes and OOP concepts',
      lessons: [
        { id: 'js-classes', title: 'JS Classes', slug: 'classes', description: 'Creating classes', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-dom',
      title: 'JS DOM & Events',
      description: 'DOM manipulation and event handling',
      lessons: [
        { id: 'js-dom-intro', title: 'JS HTML DOM', slug: 'dom', description: 'DOM introduction', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-dom-methods', title: 'DOM Methods', slug: 'dom-methods', description: 'DOM methods', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-events', title: 'JS Events', slug: 'events', description: 'Handling events', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-event-listener', title: 'JS Event Listener', slug: 'event-listener', description: 'addEventListener', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-async',
      title: 'JS Async Programming',
      description: 'Asynchronous JavaScript',
      lessons: [
        { id: 'js-promises', title: 'JS Promises', slug: 'promises', description: 'Promise objects', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-async-await', title: 'JS Async/Await', slug: 'async-await', description: 'Async/await syntax', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'js-fetch', title: 'JS Fetch API', slug: 'fetch', description: 'Fetching data', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'js-modules',
      title: 'JS Modules & Ecosystem',
      description: 'Modules and modern JavaScript',
      lessons: [
        { id: 'js-modules', title: 'JS Modules', slug: 'modules', description: 'Import and export', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

// ============================================
// PYTHON TUTORIALS
// ============================================

export const pythonTutorial: Tutorial = {
  id: 'python',
  slug: 'python',
  title: 'Python 0 → Hero → SME Mastery',
  shortTitle: 'Python',
  description: 'Think in Python, design systems with it, and run it in production. From Entry Engineer to Architect/ML Lead.',
  icon: '🐍',
  color: '#3776AB',
  bgColor: '#F0F6FF',
  difficulty: 'beginner',
  category: 'programming',
  tags: ['Python', 'Programming', 'Backend', 'Data Science', 'ML', 'Django', 'FastAPI'],
  totalLessons: 120,
  totalHours: '60',
  learners: 2800000,
  rating: 4.9,
  isCertified: true,
  isFree: true,
  chapters: [
    // TRACK 0 — STRATEGIC FOUNDATION
    {
      id: 'py-foundation',
      title: 'Strategic Foundation',
      description: 'Python in the real world - why it dominates',
      lessons: [
        { id: 'py-home', title: 'Python HOME', slug: 'home', description: 'Welcome to Python mastery', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'py-intro', title: 'Python Intro', slug: 'intro', description: 'Why Python wins in enterprises', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'py-vs-others', title: 'Python vs Others', slug: 'vs-others', description: 'Python vs Java vs C++ vs JS', duration: '20 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'py-execution', title: 'Execution Model', slug: 'execution', description: 'CPython, bytecode, interpreted vs compiled', duration: '18 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
      ]
    },
    // TRACK 1 — CORE PYTHON (0 → Productive)
    {
      id: 'py-setup',
      title: 'Environment & Setup',
      description: 'Professional Python setup',
      lessons: [
        { id: 'py-install', title: 'Python Get Started', slug: 'get-started', description: 'Installing Python properly', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
        { id: 'py-syntax', title: 'Python Syntax', slug: 'syntax', description: 'Python syntax rules', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-output', title: 'Python Output', slug: 'output', description: 'print() and output formatting', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-comments', title: 'Python Comments', slug: 'comments', description: 'Documentation and comments', duration: '8 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-input', title: 'Python User Input', slug: 'input', description: 'Getting user input', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-venv', title: 'Python VirtualEnv', slug: 'venv', description: 'Virtual environments (non-negotiable)', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
      ]
    },
    {
      id: 'py-variables',
      title: 'Variables & Data Types',
      description: 'Core building blocks of Python',
      lessons: [
        { id: 'py-variables', title: 'Python Variables', slug: 'variables', description: 'Creating and using variables', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-datatypes', title: 'Python Data Types', slug: 'datatypes', description: 'All data types explained', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-numbers', title: 'Python Numbers', slug: 'numbers', description: 'int, float, complex', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-casting', title: 'Python Casting', slug: 'casting', description: 'Type conversion', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-strings', title: 'Python Strings', slug: 'strings', description: 'String manipulation mastery', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-booleans', title: 'Python Booleans', slug: 'booleans', description: 'True/False logic', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-none', title: 'Python None', slug: 'none', description: 'The None type', duration: '8 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-operators', title: 'Python Operators', slug: 'operators', description: 'All operators explained', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-datastructures',
      title: 'Data Structures (Core)',
      description: 'Lists, tuples, sets, dictionaries - with trade-offs',
      lessons: [
        { id: 'py-lists', title: 'Python Lists', slug: 'lists', description: 'Dynamic arrays in Python', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-tuples', title: 'Python Tuples', slug: 'tuples', description: 'Immutable sequences', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-sets', title: 'Python Sets', slug: 'sets', description: 'Unique collections', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dictionaries', title: 'Python Dictionaries', slug: 'dictionaries', description: 'Key-value stores', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-arrays', title: 'Python Arrays', slug: 'arrays', description: 'Arrays vs Lists', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-iterators', title: 'Python Iterators', slug: 'iterators', description: 'Iteration protocol', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-range', title: 'Python Range', slug: 'range', description: 'Range function deep dive', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-controlflow',
      title: 'Control Flow',
      description: 'Conditionals, loops, and error handling',
      lessons: [
        { id: 'py-if', title: 'Python If...Else', slug: 'if-else', description: 'Conditional statements', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-match', title: 'Python Match', slug: 'match', description: 'Modern pattern matching', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-while', title: 'Python While Loops', slug: 'while', description: 'While loop mastery', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-for', title: 'Python For Loops', slug: 'for', description: 'For loop patterns', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-try', title: 'Python Try...Except', slug: 'try-except', description: 'Error handling basics', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-functions',
      title: 'Functions & Modules',
      description: 'Building reusable code',
      lessons: [
        { id: 'py-functions', title: 'Python Functions', slug: 'functions', description: 'Defining functions', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-args', title: 'Arguments & Returns', slug: 'arguments', description: '*args, **kwargs, returns', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-lambda', title: 'Python Lambda', slug: 'lambda', description: 'Anonymous functions', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-modules', title: 'Python Modules', slug: 'modules', description: 'Creating modules', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-pip', title: 'Python PIP', slug: 'pip', description: 'Package management', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
        { id: 'py-json', title: 'Python JSON', slug: 'json', description: 'JSON handling', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-regex', title: 'Python RegEx', slug: 'regex', description: 'Regular expressions', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dates', title: 'Python Dates & Math', slug: 'dates', description: 'Date/time and math', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-format', title: 'String Formatting', slug: 'formatting', description: 'f-strings and formatting', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // TRACK 2 — OOP & FILE SYSTEMS
    {
      id: 'py-oop',
      title: 'Python OOP (Mandatory)',
      description: 'Object-Oriented Programming mastery',
      lessons: [
        { id: 'py-classes', title: 'Classes & Objects', slug: 'classes', description: 'Creating classes', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-init', title: 'Python __init__', slug: 'init', description: 'Constructor method', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-self', title: 'Python self', slug: 'self', description: 'Instance reference', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-properties', title: 'Class Properties', slug: 'properties', description: 'Class and instance attributes', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-inheritance', title: 'Python Inheritance', slug: 'inheritance', description: 'Extending classes', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-polymorphism', title: 'Python Polymorphism', slug: 'polymorphism', description: 'Many forms pattern', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-encapsulation', title: 'Python Encapsulation', slug: 'encapsulation', description: 'Private/protected members', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-decorators', title: 'Python Decorators', slug: 'decorators', description: 'Function decorators', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-files',
      title: 'File Handling',
      description: 'Read, write, and manage files safely',
      lessons: [
        { id: 'py-file-read', title: 'Read Files', slug: 'file-read', description: 'Reading file content', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-file-write', title: 'Write Files', slug: 'file-write', description: 'Writing to files', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-file-create', title: 'Create/Delete Files', slug: 'file-create', description: 'File operations', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-context', title: 'Context Managers', slug: 'context-managers', description: 'with statement', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // TRACK 3 — DATA ENGINEERING & LIBRARIES
    {
      id: 'py-libs',
      title: 'Python Libraries (Core)',
      description: 'Essential built-in and external modules',
      lessons: [
        { id: 'py-builtin', title: 'Built-in Modules', slug: 'builtin-modules', description: 'Standard library tour', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-random', title: 'Python Random', slug: 'random', description: 'Random number generation', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-math', title: 'Python Math', slug: 'math', description: 'Math and cMath modules', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-statistics', title: 'Python Statistics', slug: 'statistics', description: 'Statistics module', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-requests', title: 'Python Requests', slug: 'requests', description: 'HTTP requests (API backbone)', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-numpy',
      title: 'NumPy (Numerical Core)',
      description: 'High-performance numerical computing',
      lessons: [
        { id: 'py-numpy-intro', title: 'NumPy Introduction', slug: 'numpy-intro', description: 'Why NumPy matters', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-numpy-arrays', title: 'NumPy Arrays', slug: 'numpy-arrays', description: 'Creating and using arrays', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-numpy-vectorization', title: 'Vectorization', slug: 'vectorization', description: 'Eliminating loops', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-numpy-broadcasting', title: 'Broadcasting', slug: 'broadcasting', description: 'Shape compatibility', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-pandas',
      title: 'Pandas (Data Backbone)',
      description: 'Data analysis and manipulation',
      lessons: [
        { id: 'py-pandas-intro', title: 'Pandas Introduction', slug: 'pandas-intro', description: 'DataFrames explained', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-pandas-indexing', title: 'Pandas Indexing', slug: 'pandas-indexing', description: 'loc, iloc, selection', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-pandas-filtering', title: 'Pandas Filtering', slug: 'pandas-filtering', description: 'Data filtering', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-pandas-groupby', title: 'Pandas GroupBy', slug: 'pandas-groupby', description: 'Aggregations', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-pandas-joins', title: 'Pandas Joins', slug: 'pandas-joins', description: 'Merging data', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-pandas-cleaning', title: 'Data Cleaning', slug: 'pandas-cleaning', description: 'Data cleaning pipelines', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-visualization',
      title: 'Data Visualization',
      description: 'Matplotlib and plotting',
      lessons: [
        { id: 'py-matplotlib-intro', title: 'Matplotlib Intro', slug: 'matplotlib-intro', description: 'Getting started', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-matplotlib-types', title: 'Chart Types', slug: 'chart-types', description: 'Line, scatter, bar, histogram', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-matplotlib-subplots', title: 'Subplots & Layouts', slug: 'subplots', description: 'Multiple plots', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-enterprise-visuals', title: 'Enterprise Reporting', slug: 'enterprise-visuals', description: 'Production-ready charts', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // TRACK 4 — DATABASE & BACKEND
    {
      id: 'py-mysql',
      title: 'Python + MySQL',
      description: 'Relational database integration',
      lessons: [
        { id: 'py-mysql-intro', title: 'MySQL Introduction', slug: 'mysql-intro', description: 'Connecting to MySQL', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-mysql-crud', title: 'MySQL CRUD', slug: 'mysql-crud', description: 'Create, Read, Update, Delete', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-mysql-joins', title: 'MySQL Joins', slug: 'mysql-joins', description: 'SQL joins in Python', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-mysql-transactions', title: 'Transactions', slug: 'mysql-transactions', description: 'ACID transactions', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-mongodb',
      title: 'Python + MongoDB',
      description: 'NoSQL database integration',
      lessons: [
        { id: 'py-mongo-intro', title: 'MongoDB Introduction', slug: 'mongo-intro', description: 'Document databases', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-mongo-crud', title: 'MongoDB CRUD', slug: 'mongo-crud', description: 'Collections and documents', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-mongo-queries', title: 'MongoDB Queries', slug: 'mongo-queries', description: 'Query patterns', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-mongo-indexing', title: 'MongoDB Indexing', slug: 'mongo-indexing', description: 'Performance optimization', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-django',
      title: 'Django Framework',
      description: 'Full-stack web development',
      lessons: [
        { id: 'py-django-intro', title: 'Django Introduction', slug: 'django-intro', description: 'MVT architecture', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
        { id: 'py-django-models', title: 'Django Models', slug: 'django-models', description: 'ORM and database', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
        { id: 'py-django-views', title: 'Django Views', slug: 'django-views', description: 'Request handling', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
        { id: 'py-django-api', title: 'Django APIs', slug: 'django-api', description: 'REST API development', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
        { id: 'py-django-admin', title: 'Django Admin', slug: 'django-admin', description: 'Admin interface', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
      ]
    },
    // TRACK 5 — DSA
    {
      id: 'py-dsa-core',
      title: 'Python DSA Core',
      description: 'Data structures implementation',
      lessons: [
        { id: 'py-dsa-lists', title: 'Lists & Arrays', slug: 'dsa-lists', description: 'Array operations', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dsa-stacks', title: 'Stacks', slug: 'dsa-stacks', description: 'LIFO structure', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dsa-queues', title: 'Queues', slug: 'dsa-queues', description: 'FIFO structure', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dsa-linked', title: 'Linked Lists', slug: 'dsa-linked', description: 'Node-based lists', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dsa-hash', title: 'Hash Tables', slug: 'dsa-hash', description: 'Hash maps implementation', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-dsa-trees',
      title: 'Trees & Graphs',
      description: 'Advanced data structures',
      lessons: [
        { id: 'py-dsa-trees', title: 'Binary Trees', slug: 'dsa-trees', description: 'Tree fundamentals', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dsa-bst', title: 'Binary Search Trees', slug: 'dsa-bst', description: 'BST operations', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dsa-avl', title: 'AVL Trees', slug: 'dsa-avl', description: 'Self-balancing trees', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-dsa-graphs', title: 'Graph Traversal', slug: 'dsa-graphs', description: 'BFS and DFS', duration: '28 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-dsa-sorting',
      title: 'Searching & Sorting',
      description: 'Algorithm implementations',
      lessons: [
        { id: 'py-search', title: 'Search Algorithms', slug: 'search-algorithms', description: 'Linear and binary search', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-sort-basic', title: 'Basic Sorting', slug: 'sort-basic', description: 'Bubble, selection, insertion', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-sort-advanced', title: 'Advanced Sorting', slug: 'sort-advanced', description: 'Merge, quick, heap', duration: '28 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-sort-special', title: 'Special Sorting', slug: 'sort-special', description: 'Counting, radix, bucket', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // TRACK 6 — MACHINE LEARNING
    {
      id: 'py-ml-stats',
      title: 'Statistics Foundations',
      description: 'ML prerequisites',
      lessons: [
        { id: 'py-ml-mean', title: 'Mean, Median, Mode', slug: 'ml-mean', description: 'Central tendency', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-std', title: 'Standard Deviation', slug: 'ml-std', description: 'Dispersion measures', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-percentiles', title: 'Percentiles', slug: 'ml-percentiles', description: 'Data distribution', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-distribution', title: 'Data Distribution', slug: 'ml-distribution', description: 'Normal distribution', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-ml-regression',
      title: 'Regression & Classification',
      description: 'Core ML algorithms',
      lessons: [
        { id: 'py-ml-linear', title: 'Linear Regression', slug: 'ml-linear', description: 'Predicting continuous values', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-poly', title: 'Polynomial Regression', slug: 'ml-poly', description: 'Non-linear relationships', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-multiple', title: 'Multiple Regression', slug: 'ml-multiple', description: 'Multiple features', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-logistic', title: 'Logistic Regression', slug: 'ml-logistic', description: 'Classification', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-knn', title: 'KNN', slug: 'ml-knn', description: 'K-Nearest Neighbors', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-trees', title: 'Decision Trees', slug: 'ml-trees', description: 'Tree-based models', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-ml-quality',
      title: 'Model Quality',
      description: 'Evaluation and optimization',
      lessons: [
        { id: 'py-ml-split', title: 'Train/Test Split', slug: 'ml-split', description: 'Data partitioning', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-cv', title: 'Cross Validation', slug: 'ml-cv', description: 'Model validation', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-confusion', title: 'Confusion Matrix', slug: 'ml-confusion', description: 'Classification metrics', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-roc', title: 'AUC-ROC Curve', slug: 'ml-roc', description: 'ROC analysis', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-grid', title: 'Grid Search', slug: 'ml-grid', description: 'Hyperparameter tuning', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'py-ml-advanced',
      title: 'Clustering & Ensembles',
      description: 'Advanced ML techniques',
      lessons: [
        { id: 'py-ml-kmeans', title: 'K-Means', slug: 'ml-kmeans', description: 'Clustering algorithm', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-hierarchical', title: 'Hierarchical Clustering', slug: 'ml-hierarchical', description: 'Dendrograms', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-bagging', title: 'Bagging', slug: 'ml-bagging', description: 'Bootstrap aggregation', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-ml-ensemble', title: 'Ensemble Methods', slug: 'ml-ensemble', description: 'Random forests, boosting', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // TRACK 7 — ENTERPRISE ENGINEERING
    {
      id: 'py-enterprise',
      title: 'Enterprise Engineering',
      description: 'Production-ready Python',
      lessons: [
        { id: 'py-exceptions', title: 'Exception Handling', slug: 'exceptions', description: 'Error handling patterns', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-defensive', title: 'Defensive Programming', slug: 'defensive', description: 'Fail-fast patterns', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-performance', title: 'Performance & Memory', slug: 'performance', description: 'Profiling and optimization', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-logging', title: 'Python Logging', slug: 'logging', description: 'Production logging', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-config', title: 'Configuration', slug: 'config', description: 'Config management', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'py-packaging', title: 'Packaging', slug: 'packaging', description: 'Distribution and deployment', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
      ]
    },
    // TRACK 8 — REFERENCE
    {
      id: 'py-reference',
      title: 'Python Reference',
      description: 'Quick reference guide',
      lessons: [
        { id: 'py-ref-builtins', title: 'Built-in Functions', slug: 'ref-builtins', description: 'All built-in functions', duration: '25 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'py-ref-string', title: 'String Methods', slug: 'ref-string', description: 'String method reference', duration: '20 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'py-ref-list', title: 'List Methods', slug: 'ref-list', description: 'List method reference', duration: '18 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'py-ref-dict', title: 'Dict Methods', slug: 'ref-dict', description: 'Dictionary method reference', duration: '18 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'py-ref-keywords', title: 'Python Keywords', slug: 'ref-keywords', description: 'All Python keywords', duration: '15 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
      ]
    },
    // TRACK 9 — PRACTICE & CERTIFICATION
    {
      id: 'py-practice',
      title: 'Practice & Certification',
      description: 'Assessment and validation',
      lessons: [
        { id: 'py-examples', title: 'Python Examples', slug: 'examples', description: 'Real-world code examples', duration: '30 min', hasQuiz: false, hasExercise: true, hasTryIt: true },
        { id: 'py-exercises', title: 'Python Exercises', slug: 'exercises', description: 'Hands-on practice', duration: '45 min', hasQuiz: false, hasExercise: true, hasTryIt: true },
        { id: 'py-quiz', title: 'Python Quiz', slug: 'quiz', description: 'Test your knowledge', duration: '30 min', hasQuiz: true, hasExercise: false, hasTryIt: false },
        { id: 'py-interview', title: 'Python Interview Q&A', slug: 'interview', description: 'Interview preparation', duration: '40 min', hasQuiz: true, hasExercise: false, hasTryIt: false },
        { id: 'py-bootcamp', title: 'Python Bootcamp', slug: 'bootcamp', description: 'End-to-end capstone', duration: '120 min', hasQuiz: false, hasExercise: true, hasTryIt: true },
        { id: 'py-certificate', title: 'Python Certificate', slug: 'certificate', description: 'Earn your certificate', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: false },
      ]
    },
  ]
};

// ============================================
// REACT TUTORIAL
// ============================================

export const reactTutorial: Tutorial = {
  id: 'react',
  slug: 'react',
  title: 'React Tutorial',
  shortTitle: 'React',
  description: 'Master React - architect scalable applications, not just write components. From beginner to Subject Matter Expert.',
  icon: '⚛️',
  color: '#61DAFB',
  bgColor: '#F0FCFF',
  difficulty: 'intermediate',
  category: 'web',
  tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Components'],
  prerequisites: ['javascript', 'html', 'css'],
  totalLessons: 65,
  totalHours: '35',
  learners: 2100000,
  rating: 4.9,
  isCertified: true,
  isFree: true,
  chapters: [
    // PHASE 0-1 — FOUNDATION & FIRST CONTACT
    {
      id: 'react-intro',
      title: 'React Foundation',
      description: 'Understanding React and getting started',
      lessons: [
        { id: 'react-home', title: 'React HOME', slug: 'home', description: 'Welcome to React', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'react-intro', title: 'React Intro', slug: 'intro', description: 'Why React exists', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'react-get-started', title: 'React Get Started', slug: 'get-started', description: 'Tooling and project setup', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-first-app', title: 'React First App', slug: 'first-app', description: 'Your first React application', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-render-html', title: 'React Render HTML', slug: 'render-html', description: 'Rendering JSX to DOM', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-es6', title: 'React ES6', slug: 'es6', description: 'Essential ES6 for React', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 2 — JSX & COMPONENT CORE
    {
      id: 'react-jsx',
      title: 'JSX & Components',
      description: 'JSX syntax and component fundamentals',
      lessons: [
        { id: 'react-jsx-intro', title: 'React JSX Intro', slug: 'jsx-intro', description: 'JSX as syntax sugar', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-jsx-expressions', title: 'JSX Expressions', slug: 'jsx-expressions', description: 'Dynamic expressions in JSX', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-jsx-attributes', title: 'JSX Attributes', slug: 'jsx-attributes', description: 'Props and attributes', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-jsx-conditionals', title: 'JSX Conditionals', slug: 'jsx-conditionals', description: 'Conditional rendering patterns', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-components', title: 'React Components', slug: 'components', description: 'Functional components', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-class', title: 'React Class', slug: 'class', description: 'Class components (legacy)', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
      ]
    },
    // PHASE 3 — PROPS, DATA FLOW & EVENTS
    {
      id: 'react-props-events',
      title: 'Props & Events',
      description: 'Data flow and event handling',
      lessons: [
        { id: 'react-props', title: 'React Props', slug: 'props', description: 'One-way data flow', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-props-destructuring', title: 'Props Destructuring', slug: 'props-destructuring', description: 'Clean component APIs', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-props-children', title: 'Props Children', slug: 'props-children', description: 'Composition patterns', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-events', title: 'React Events', slug: 'events', description: 'Synthetic events', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-conditionals', title: 'React Conditionals', slug: 'conditionals', description: 'Conditional rendering', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-lists', title: 'React Lists', slug: 'lists', description: 'Rendering collections', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 4 — FORMS
    {
      id: 'react-forms',
      title: 'React Forms',
      description: 'Handling forms and user input',
      lessons: [
        { id: 'react-forms', title: 'React Forms', slug: 'forms', description: 'Controlled vs uncontrolled', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-forms-submit', title: 'Forms Submit', slug: 'forms-submit', description: 'Form submission handling', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-textarea', title: 'React Textarea', slug: 'textarea', description: 'Textarea inputs', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-select', title: 'React Select', slug: 'select', description: 'Select dropdowns', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-multiple-inputs', title: 'Multiple Inputs', slug: 'multiple-inputs', description: 'Handling multiple inputs', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-checkbox-radio', title: 'Checkbox & Radio', slug: 'checkbox-radio', description: 'Checkbox and radio inputs', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 5 — STYLING
    {
      id: 'react-styling',
      title: 'React Styling',
      description: 'Styling strategies for React',
      lessons: [
        { id: 'react-css-styling', title: 'CSS Styling', slug: 'css-styling', description: 'Basic CSS in React', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-css-modules', title: 'CSS Modules', slug: 'css-modules', description: 'Scoped styles', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-css-in-js', title: 'CSS-in-JS', slug: 'css-in-js', description: 'Styled-components concept', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-sass', title: 'React Sass', slug: 'sass', description: 'Using Sass with React', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 6 — ROUTING & UI FLOW
    {
      id: 'react-routing',
      title: 'Routing & UI Flow',
      description: 'Navigation and advanced UI patterns',
      lessons: [
        { id: 'react-router', title: 'React Router', slug: 'router', description: 'SPA routing fundamentals', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-portals', title: 'React Portals', slug: 'portals', description: 'Modals and layered UI', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-suspense', title: 'React Suspense', slug: 'suspense', description: 'Lazy loading and streaming', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-transitions', title: 'React Transitions', slug: 'transitions', description: 'UI animations', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 7 — HOOKS
    {
      id: 'react-hooks',
      title: 'React Hooks',
      description: 'Core modern React patterns',
      lessons: [
        { id: 'react-hooks-intro', title: 'What is Hooks?', slug: 'hooks-intro', description: 'Why hooks exist', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'react-usestate', title: 'React useState', slug: 'usestate', description: 'State modeling', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-useeffect', title: 'React useEffect', slug: 'useeffect', description: 'Side effects done right', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-usecontext', title: 'React useContext', slug: 'usecontext', description: 'Dependency injection', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-useref', title: 'React useRef', slug: 'useref', description: 'DOM and mutable refs', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-usereducer', title: 'React useReducer', slug: 'usereducer', description: 'Complex state', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-usecallback', title: 'React useCallback', slug: 'usecallback', description: 'Function identity', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-usememo', title: 'React useMemo', slug: 'usememo', description: 'Expensive computation', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-custom-hooks', title: 'Custom Hooks', slug: 'custom-hooks', description: 'Reusable hook patterns', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 8 — PERFORMANCE & ADVANCED
    {
      id: 'react-advanced',
      title: 'Advanced Patterns',
      description: 'Performance and advanced techniques',
      lessons: [
        { id: 'react-forward-ref', title: 'Forward Ref', slug: 'forward-ref', description: 'Component interoperability', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-hoc', title: 'React HOC', slug: 'hoc', description: 'Higher-Order Components', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'react-best-practices', title: 'Best Practices', slug: 'best-practices', description: 'Architecture and patterns', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

// ============================================
// SQL TUTORIAL
// ============================================

export const sqlTutorial: Tutorial = {
  id: 'sql',
  slug: 'sql',
  title: 'SQL Tutorial',
  shortTitle: 'SQL',
  description: 'Learn SQL to manage and query databases.',
  icon: '🗄️',
  color: '#336791',
  bgColor: '#F0F4F8',
  difficulty: 'beginner',
  category: 'database',
  tags: ['SQL', 'Database', 'Backend', 'Data'],
  totalLessons: 70,
  totalHours: '12',
  learners: 1500000,
  rating: 4.8,
  isCertified: true,
  isFree: true,
  chapters: [
    {
      id: 'sql-intro',
      title: 'SQL Introduction',
      description: 'Getting started with SQL',
      lessons: [
        { id: 'sql-home', title: 'SQL HOME', slug: 'home', description: 'Introduction to SQL', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'sql-intro', title: 'SQL Intro', slug: 'intro', description: 'What is SQL?', duration: '10 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'sql-syntax', title: 'SQL Syntax', slug: 'syntax', description: 'SQL syntax rules', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'sql-select', title: 'SQL SELECT', slug: 'select', description: 'Selecting data', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'sql-where', title: 'SQL WHERE', slug: 'where', description: 'Filtering data', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'sql-modify',
      title: 'SQL Data Modification',
      description: 'Inserting, updating, deleting data',
      lessons: [
        { id: 'sql-insert', title: 'SQL INSERT', slug: 'insert', description: 'Inserting data', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'sql-update', title: 'SQL UPDATE', slug: 'update', description: 'Updating data', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'sql-delete', title: 'SQL DELETE', slug: 'delete', description: 'Deleting data', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'sql-joins',
      title: 'SQL Joins',
      description: 'Combining tables',
      lessons: [
        { id: 'sql-joins', title: 'SQL JOIN', slug: 'join', description: 'Join introduction', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'sql-inner', title: 'SQL INNER JOIN', slug: 'inner-join', description: 'Inner join', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'sql-left', title: 'SQL LEFT JOIN', slug: 'left-join', description: 'Left join', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'sql-right', title: 'SQL RIGHT JOIN', slug: 'right-join', description: 'Right join', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'sql-full', title: 'SQL FULL JOIN', slug: 'full-join', description: 'Full outer join', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

// ============================================
// MORE TUTORIALS
// ============================================

export const typescriptTutorial: Tutorial = {
  id: 'typescript',
  slug: 'typescript',
  title: 'TypeScript Tutorial',
  shortTitle: 'TypeScript',
  description: 'Master TypeScript - the typed superset of JavaScript. Design systems with types, enforce contracts, and refactor fearlessly.',
  icon: '📘',
  color: '#3178C6',
  bgColor: '#F0F4FF',
  difficulty: 'intermediate',
  category: 'web',
  tags: ['TypeScript', 'JavaScript', 'Frontend', 'Backend', 'Type Safety'],
  prerequisites: ['javascript'],
  totalLessons: 55,
  totalHours: '30',
  learners: 1250000,
  rating: 4.9,
  isCertified: true,
  isFree: true,
  chapters: [
    // PHASE 0 — STRATEGIC CONTEXT
    {
      id: 'ts-intro',
      title: 'TypeScript Introduction',
      description: 'Understanding why TypeScript exists and its strategic value',
      lessons: [
        { id: 'ts-home', title: 'TS HOME', slug: 'home', description: 'Welcome to TypeScript', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'ts-introduction', title: 'TS Introduction', slug: 'introduction', description: 'What TypeScript actually is', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'ts-get-started', title: 'TS Get Started', slug: 'get-started', description: 'Installing and setting up TypeScript', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-configuration', title: 'TS Configuration', slug: 'configuration', description: 'tsconfig.json anatomy and strict mode', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 1-2 — TYPE SYSTEM FOUNDATIONS
    {
      id: 'ts-types',
      title: 'Type System Foundations',
      description: 'Core type system concepts',
      lessons: [
        { id: 'ts-simple-types', title: 'TS Simple Types', slug: 'simple-types', description: 'string, number, boolean basics', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-explicit-inference', title: 'TS Explicit & Inference', slug: 'explicit-inference', description: 'When to type explicitly vs trust inference', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-special-types', title: 'TS Special Types', slug: 'special-types', description: 'any, unknown, never, void', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-null', title: 'TS Null & Undefined', slug: 'null', description: 'strictNullChecks and defensive programming', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 3 — DATA STRUCTURES WITH TYPES
    {
      id: 'ts-data-structures',
      title: 'Data Structures with Types',
      description: 'Arrays, tuples, objects, and enums',
      lessons: [
        { id: 'ts-arrays', title: 'TS Arrays', slug: 'arrays', description: 'Typed arrays and array generics', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-tuples', title: 'TS Tuples', slug: 'tuples', description: 'Fixed-length typed arrays', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-object-types', title: 'TS Object Types', slug: 'object-types', description: 'Structural typing and object shapes', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-enums', title: 'TS Enums', slug: 'enums', description: 'Numeric, string, and const enums', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 4 — ALIASES, INTERFACES & COMPOSITION
    {
      id: 'ts-composition',
      title: 'Type Aliases & Interfaces',
      description: 'Composing and extending types',
      lessons: [
        { id: 'ts-aliases-interfaces', title: 'TS Aliases & Interfaces', slug: 'aliases-interfaces', description: 'type vs interface decision rules', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-union-types', title: 'TS Union Types', slug: 'union-types', description: 'Union modeling and discriminated unions', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-keyof', title: 'TS Keyof', slug: 'keyof', description: 'keyof operator for safe property access', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-index-signatures', title: 'TS Index Signatures', slug: 'index-signatures', description: 'Dynamic keys and dictionary objects', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 5 — FUNCTIONS & CLASSES
    {
      id: 'ts-functions-classes',
      title: 'Functions & Classes',
      description: 'Typed functions and object-oriented TypeScript',
      lessons: [
        { id: 'ts-functions', title: 'TS Functions', slug: 'functions', description: 'Parameter types, overloads, and return types', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-casting', title: 'TS Casting', slug: 'casting', description: 'Type assertions and when casting lies', duration: '12 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-classes', title: 'TS Classes', slug: 'classes', description: 'Access modifiers, abstract classes, implements', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 6 — GENERICS
    {
      id: 'ts-generics',
      title: 'Generics (Career-Making Skill)',
      description: 'Generic functions, interfaces, and utility types',
      lessons: [
        { id: 'ts-basic-generics', title: 'TS Basic Generics', slug: 'basic-generics', description: 'Generic functions, interfaces, and classes', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-utility-types', title: 'TS Utility Types', slug: 'utility-types', description: 'Partial, Required, Pick, Omit, Record', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 7 — ADVANCED TYPE SYSTEM
    {
      id: 'ts-advanced-types',
      title: 'Advanced Type System',
      description: 'Elite-level type manipulation',
      lessons: [
        { id: 'ts-advanced-types', title: 'TS Advanced Types', slug: 'advanced-types', description: 'Intersection, union narrowing, recursive types', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-type-guards', title: 'TS Type Guards', slug: 'type-guards', description: 'typeof, instanceof, custom guards', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-conditional-types', title: 'TS Conditional Types', slug: 'conditional-types', description: 'extends, infer, compile-time logic', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-mapped-types', title: 'TS Mapped Types', slug: 'mapped-types', description: 'Transforming types programmatically', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-type-inference', title: 'TS Type Inference', slug: 'type-inference', description: 'Deep contextual typing and inference control', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-literal-types', title: 'TS Literal Types', slug: 'literal-types', description: 'String, numeric, and template literals', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 8 — ARCHITECTURE & COMPILER MAGIC
    {
      id: 'ts-architecture',
      title: 'Architecture & Compiler Magic',
      description: 'Namespaces, declarations, and decorators',
      lessons: [
        { id: 'ts-namespaces', title: 'TS Namespaces', slug: 'namespaces', description: 'Legacy pattern and when not to use', duration: '12 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'ts-declaration-merging', title: 'TS Declaration Merging', slug: 'declaration-merging', description: 'Interface merging and module augmentation', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-definitely-typed', title: 'TS Definitely Typed', slug: 'definitely-typed', description: '@types/* and ambient declarations', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
        { id: 'ts-decorators', title: 'TS Decorators', slug: 'decorators', description: 'Class and method decorators', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 9 — ASYNC, ERRORS & RUNTIME SAFETY
    {
      id: 'ts-async-errors',
      title: 'Async Programming & Errors',
      description: 'Typed async code and error handling',
      lessons: [
        { id: 'ts-async-programming', title: 'TS Async Programming', slug: 'async-programming', description: 'Typed promises and async/await', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-error-handling', title: 'TS Error Handling', slug: 'error-handling', description: 'Typed errors and Result patterns', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 10 — REAL-WORLD INTEGRATION
    {
      id: 'ts-integration',
      title: 'Real-World Integration',
      description: 'TypeScript with Node.js, React, and more',
      lessons: [
        { id: 'ts-with-nodejs', title: 'TS with Node.js', slug: 'with-nodejs', description: 'TS + Express, typed middleware', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-with-react', title: 'TS with React', slug: 'with-react', description: 'Typed props, state, and hooks', duration: '28 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-tooling', title: 'TS Tooling', slug: 'tooling', description: 'ESLint, Prettier, ts-node, builds', duration: '18 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
        { id: 'ts-in-js-projects', title: 'TS in JS Projects', slug: 'in-js-projects', description: 'allowJs, JSDoc, incremental adoption', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ts-migration', title: 'TS Migration', slug: 'migration', description: 'JS → TS step-by-step strategy', duration: '22 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
      ]
    },
    // PHASE 11 — MODERN & FUTURE-PROOFING
    {
      id: 'ts-modern',
      title: 'Modern TypeScript & Best Practices',
      description: 'Latest features and professional patterns',
      lessons: [
        { id: 'ts-5-updates', title: 'TS 5 Updates', slug: '5-updates', description: 'New syntax and breaking changes', duration: '18 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'ts-best-practices', title: 'TS Best Practices', slug: 'best-practices', description: 'Type-first design and API boundaries', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

// ============================================
// ANGULAR TUTORIAL - Enterprise SME Program
// ============================================

export const angularTutorial: Tutorial = {
  id: 'angular',
  slug: 'angular',
  title: 'Angular Tutorial',
  shortTitle: 'Angular',
  description: 'Master Angular - design, scale, secure, and operate enterprise Angular platforms. From beginner to Subject Matter Expert.',
  icon: '🅰️',
  color: '#DD0031',
  bgColor: '#FFF0F3',
  difficulty: 'advanced',
  category: 'web',
  tags: ['Angular', 'TypeScript', 'Frontend', 'Enterprise', 'Framework'],
  prerequisites: ['typescript', 'html', 'css'],
  totalLessons: 85,
  totalHours: '45',
  learners: 1100000,
  rating: 4.8,
  isCertified: true,
  isFree: true,
  chapters: [
    // PHASE 0 — STRATEGIC CONTEXT
    {
      id: 'angular-foundation',
      title: 'Angular Foundation',
      description: 'Strategic context and getting started',
      lessons: [
        { id: 'angular-home', title: 'Angular HOME', slug: 'home', description: 'Welcome to Angular', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'angular-intro', title: 'Angular Intro', slug: 'intro', description: 'Why Angular exists and where it dominates', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'angular-get-started', title: 'Angular Get Started', slug: 'get-started', description: 'Node, CLI, workspace structure', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-first-app', title: 'Angular First App', slug: 'first-app', description: 'Bootstrapping flow and compilation', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 2 — CORE BUILDING BLOCKS
    {
      id: 'angular-core',
      title: 'Core Building Blocks',
      description: 'Templates, components, and data binding',
      lessons: [
        { id: 'angular-templates', title: 'Angular Templates', slug: 'templates', description: 'Template syntax, interpolation, binding', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-components', title: 'Angular Components', slug: 'components', description: 'Component anatomy and metadata', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-data-binding', title: 'Angular Data Binding', slug: 'data-binding', description: 'One-way vs two-way binding', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-directives', title: 'Angular Directives', slug: 'directives', description: 'Structural and attribute directives', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-events', title: 'Angular Events', slug: 'events', description: 'DOM events and custom events', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-conditionals', title: 'Angular Conditionals & Lists', slug: 'conditionals', description: 'ngIf, ngFor, TrackBy', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 3 — FORMS
    {
      id: 'angular-forms',
      title: 'Angular Forms',
      description: 'Enterprise form patterns',
      lessons: [
        { id: 'angular-forms-intro', title: 'Angular Forms Intro', slug: 'forms-intro', description: 'Template-driven vs Reactive forms', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-forms-reactive', title: 'Angular Reactive Forms', slug: 'reactive-forms', description: 'FormGroup, FormControl, FormArray', duration: '30 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-forms-validation', title: 'Angular Form Validation', slug: 'form-validation', description: 'Cross-field and async validation', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-forms-dynamic', title: 'Angular Dynamic Forms', slug: 'dynamic-forms', description: 'Building forms dynamically', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 4 — ROUTING & NAVIGATION
    {
      id: 'angular-routing',
      title: 'Routing & Navigation',
      description: 'Enterprise routing patterns',
      lessons: [
        { id: 'angular-router-core', title: 'Angular Router Core', slug: 'router-core', description: 'Route configuration and navigation', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-router-params', title: 'Route Parameters', slug: 'route-params', description: 'Route and query parameters', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-lazy-loading', title: 'Angular Lazy Loading', slug: 'lazy-loading', description: 'Lazy loading modules', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-guards', title: 'Angular Guards', slug: 'guards', description: 'Auth and role-based guards', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-resolvers', title: 'Angular Resolvers', slug: 'resolvers', description: 'Pre-fetching data', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 5 — SERVICES & DATA FLOW
    {
      id: 'angular-services',
      title: 'Services & Data Flow',
      description: 'Dependency injection and HTTP',
      lessons: [
        { id: 'angular-services-di', title: 'Angular Services & DI', slug: 'services-di', description: 'Dependency injection model', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-http-client', title: 'Angular HTTP Client', slug: 'http-client', description: 'HTTP methods and observables', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-interceptors', title: 'Angular Interceptors', slug: 'interceptors', description: 'Auth tokens and logging', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-error-handling', title: 'Error Handling', slug: 'error-handling', description: 'Retry, timeout, and error strategies', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 6 — COMPONENT LIFECYCLE & UI
    {
      id: 'angular-lifecycle',
      title: 'Lifecycle & UI',
      description: 'Lifecycle hooks, pipes, and styling',
      lessons: [
        { id: 'angular-lifecycle-hooks', title: 'Angular Lifecycle Hooks', slug: 'lifecycle-hooks', description: 'ngOnInit, ngOnChanges, cleanup', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-pipes', title: 'Angular Pipes', slug: 'pipes', description: 'Built-in and custom pipes', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-styling', title: 'Angular Styling', slug: 'styling', description: 'Component styles and encapsulation', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 7 — APP BOOTSTRAP & PHASE 8 — CHANGE DETECTION
    {
      id: 'angular-performance',
      title: 'Performance & Change Detection',
      description: 'Bootstrap, change detection, and signals',
      lessons: [
        { id: 'angular-bootstrap', title: 'Angular Bootstrap', slug: 'bootstrap', description: 'AppModule vs Standalone', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-control-flow', title: 'Angular Control Flow', slug: 'control-flow', description: 'Modern template control flow', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-change-detection', title: 'Change Detection', slug: 'change-detection', description: 'Zone.js and OnPush strategy', duration: '30 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-signals', title: 'Angular Signals', slug: 'signals', description: 'Modern reactive primitives', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 9 — DYNAMIC & ADVANCED DI
    {
      id: 'angular-advanced-di',
      title: 'Advanced Architecture',
      description: 'Dynamic components and advanced DI',
      lessons: [
        { id: 'angular-dynamic-components', title: 'Dynamic Components', slug: 'dynamic-components', description: 'ComponentFactory and plugins', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-advanced-di', title: 'Advanced DI', slug: 'advanced-di', description: 'Multi-providers and injection tokens', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-state-management', title: 'State Management', slug: 'state-management', description: 'Service-based and NgRx patterns', duration: '30 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 11 — ANIMATIONS & PHASE 12 — TESTING
    {
      id: 'angular-quality',
      title: 'Animations, Testing & Quality',
      description: 'Animations, testing, and compiler',
      lessons: [
        { id: 'angular-animations', title: 'Angular Animations', slug: 'animations', description: 'Animation triggers and transitions', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-testing', title: 'Angular Testing', slug: 'testing', description: 'Unit and integration testing', duration: '30 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-compiler', title: 'Angular Compiler', slug: 'compiler', description: 'AOT, JIT, and build optimization', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 13 — SECURITY & PHASE 14 — SERVER
    {
      id: 'angular-enterprise',
      title: 'Security & Server',
      description: 'Security hardening and SSR',
      lessons: [
        { id: 'angular-security', title: 'Angular Security', slug: 'security', description: 'XSS, sanitization, CSRF', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-ssr', title: 'Angular SSR', slug: 'ssr', description: 'Server-side rendering', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'angular-hydration', title: 'Angular Hydration', slug: 'hydration', description: 'SSR hydration and pitfalls', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    // PHASE 16 — PRACTICE & CASE STUDIES
    {
      id: 'angular-mastery',
      title: 'Mastery & Case Studies',
      description: 'Practice, interviews, and enterprise cases',
      lessons: [
        { id: 'angular-exercises', title: 'Angular Exercises', slug: 'exercises', description: 'Beginner to advanced labs', duration: '45 min', hasQuiz: false, hasExercise: true, hasTryIt: true },
        { id: 'angular-quiz', title: 'Angular Quiz', slug: 'quiz', description: 'DI edge cases and traps', duration: '20 min', hasQuiz: true, hasExercise: false, hasTryIt: false },
        { id: 'angular-interview', title: 'Angular Interview Prep', slug: 'interview-prep', description: 'Architecture and system design', duration: '30 min', hasQuiz: true, hasExercise: false, hasTryIt: false },
        { id: 'angular-case-studies', title: 'Enterprise Case Studies', slug: 'case-studies', description: 'Real-world enterprise examples', duration: '45 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'angular-certificate', title: 'Angular Certificate', slug: 'certificate', description: 'SME readiness validation', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: false },
      ]
    },
  ]
};

export const nodeTutorial: Tutorial = {
  id: 'nodejs',
  slug: 'nodejs',
  title: 'Node.js Tutorial',
  shortTitle: 'Node.js',
  description: 'Learn Node.js for server-side JavaScript development.',
  icon: '🟢',
  color: '#339933',
  bgColor: '#F0FFF0',
  difficulty: 'intermediate',
  category: 'backend',
  tags: ['Node.js', 'JavaScript', 'Backend', 'API'],
  prerequisites: ['javascript'],
  totalLessons: 75,
  totalHours: '14',
  learners: 1200000,
  rating: 4.7,
  isCertified: true,
  isFree: true,
  chapters: [
    {
      id: 'node-intro',
      title: 'Node.js Introduction',
      description: 'Getting started with Node.js',
      lessons: [
        { id: 'node-home', title: 'Node.js HOME', slug: 'home', description: 'Introduction to Node.js', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'node-intro', title: 'Node.js Intro', slug: 'intro', description: 'What is Node.js?', duration: '10 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'node-install', title: 'Node.js Install', slug: 'install', description: 'Installing Node.js', duration: '10 min', hasQuiz: false, hasExercise: true, hasTryIt: false },
        { id: 'node-npm', title: 'Node.js NPM', slug: 'npm', description: 'Using NPM', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'node-modules',
      title: 'Node.js Modules',
      description: 'Working with modules',
      lessons: [
        { id: 'node-modules', title: 'Node.js Modules', slug: 'modules', description: 'Creating modules', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'node-http', title: 'Node.js HTTP', slug: 'http', description: 'HTTP module', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'node-fs', title: 'Node.js File System', slug: 'fs', description: 'File system module', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'node-express',
      title: 'Express.js',
      description: 'Building APIs with Express',
      lessons: [
        { id: 'node-express', title: 'Express Introduction', slug: 'express', description: 'Getting started', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'node-routing', title: 'Express Routing', slug: 'routing', description: 'Route handling', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'node-middleware', title: 'Express Middleware', slug: 'middleware', description: 'Using middleware', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'node-rest', title: 'REST API', slug: 'rest-api', description: 'Building REST APIs', duration: '30 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

export const gitTutorial: Tutorial = {
  id: 'git',
  slug: 'git',
  title: 'Git Tutorial',
  shortTitle: 'Git',
  description: 'Learn Git version control for tracking code changes.',
  icon: '📦',
  color: '#F05032',
  bgColor: '#FFF5F0',
  difficulty: 'beginner',
  category: 'devops',
  tags: ['Git', 'Version Control', 'DevOps', 'GitHub'],
  totalLessons: 45,
  totalHours: '8',
  learners: 1400000,
  rating: 4.8,
  isCertified: true,
  isFree: true,
  chapters: [
    {
      id: 'git-intro',
      title: 'Git Introduction',
      description: 'Getting started with Git',
      lessons: [
        { id: 'git-home', title: 'Git HOME', slug: 'home', description: 'Introduction to Git', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'git-intro', title: 'Git Intro', slug: 'intro', description: 'What is Git?', duration: '10 min', hasQuiz: true, hasExercise: false, hasTryIt: false },
        { id: 'git-install', title: 'Git Install', slug: 'install', description: 'Installing Git', duration: '10 min', hasQuiz: false, hasExercise: true, hasTryIt: false },
        { id: 'git-config', title: 'Git Config', slug: 'config', description: 'Configuring Git', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: false },
      ]
    },
    {
      id: 'git-basics',
      title: 'Git Basics',
      description: 'Core Git commands',
      lessons: [
        { id: 'git-init', title: 'Git Init', slug: 'init', description: 'Initializing repos', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'git-add', title: 'Git Add', slug: 'add', description: 'Staging changes', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'git-commit', title: 'Git Commit', slug: 'commit', description: 'Committing changes', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'git-push', title: 'Git Push', slug: 'push', description: 'Pushing to remote', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'git-pull', title: 'Git Pull', slug: 'pull', description: 'Pulling changes', duration: '10 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'git-branching',
      title: 'Git Branching',
      description: 'Working with branches',
      lessons: [
        { id: 'git-branch', title: 'Git Branch', slug: 'branch', description: 'Creating branches', duration: '15 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'git-merge', title: 'Git Merge', slug: 'merge', description: 'Merging branches', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'git-conflicts', title: 'Git Conflicts', slug: 'conflicts', description: 'Resolving conflicts', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

// ============================================
// AI/ML TUTORIALS
// ============================================

export const mlTutorial: Tutorial = {
  id: 'machine-learning',
  slug: 'machine-learning',
  title: 'Machine Learning Tutorial',
  shortTitle: 'ML',
  description: 'Learn Machine Learning fundamentals and algorithms.',
  icon: '🤖',
  color: '#7C3AED',
  bgColor: '#FAF5FF',
  difficulty: 'intermediate',
  category: 'ai',
  tags: ['Machine Learning', 'AI', 'Python', 'Data Science'],
  prerequisites: ['python'],
  totalLessons: 65,
  totalHours: '16',
  learners: 850000,
  rating: 4.7,
  isCertified: true,
  isFree: true,
  chapters: [
    {
      id: 'ml-intro',
      title: 'ML Introduction',
      description: 'Getting started with ML',
      lessons: [
        { id: 'ml-home', title: 'ML HOME', slug: 'home', description: 'Introduction to ML', duration: '5 min', hasQuiz: false, hasExercise: false, hasTryIt: true },
        { id: 'ml-what', title: 'What is ML?', slug: 'what-is-ml', description: 'Understanding ML', duration: '15 min', hasQuiz: true, hasExercise: false, hasTryIt: true },
        { id: 'ml-types', title: 'Types of ML', slug: 'types', description: 'Supervised vs Unsupervised', duration: '20 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
    {
      id: 'ml-algorithms',
      title: 'ML Algorithms',
      description: 'Common ML algorithms',
      lessons: [
        { id: 'ml-regression', title: 'Linear Regression', slug: 'regression', description: 'Regression models', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ml-classification', title: 'Classification', slug: 'classification', description: 'Classification models', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ml-clustering', title: 'Clustering', slug: 'clustering', description: 'Clustering algorithms', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
        { id: 'ml-decision-trees', title: 'Decision Trees', slug: 'decision-trees', description: 'Tree-based models', duration: '25 min', hasQuiz: true, hasExercise: true, hasTryIt: true },
      ]
    },
  ]
};

// ============================================
// ALL TUTORIALS EXPORT
// ============================================

export const allTutorials: Tutorial[] = [
  htmlTutorial,
  cssTutorial,
  jsTutorial,
  pythonTutorial,
  reactTutorial,
  angularTutorial,
  sqlTutorial,
  typescriptTutorial,
  nodeTutorial,
  gitTutorial,
  mlTutorial,
];

// ============================================
// CATEGORIES
// ============================================

export const categories: Category[] = [
  {
    id: 'web',
    name: 'Web Development',
    description: 'HTML, CSS, JavaScript, and modern frameworks',
    icon: '🌐',
    color: '#059669',
    tutorials: [htmlTutorial, cssTutorial, jsTutorial, reactTutorial, angularTutorial, typescriptTutorial],
  },
  {
    id: 'programming',
    name: 'Programming Languages',
    description: 'Python, Java, C++, and more',
    icon: '💻',
    color: '#3776AB',
    tutorials: [pythonTutorial],
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description: 'Node.js, Django, APIs, and server-side',
    icon: '⚙️',
    color: '#339933',
    tutorials: [nodeTutorial],
  },
  {
    id: 'database',
    name: 'Database',
    description: 'SQL, MongoDB, PostgreSQL, and data management',
    icon: '🗄️',
    color: '#336791',
    tutorials: [sqlTutorial],
  },
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    description: 'ML, Deep Learning, and AI fundamentals',
    icon: '🤖',
    color: '#7C3AED',
    tutorials: [mlTutorial],
  },
  {
    id: 'devops',
    name: 'DevOps & Tools',
    description: 'Git, Docker, CI/CD, and deployment',
    icon: '🔧',
    color: '#F05032',
    tutorials: [gitTutorial],
  },
];

// Helper function to get tutorial by slug
export const getTutorialBySlug = (slug: string): Tutorial | undefined => {
  return allTutorials.find(t => t.slug === slug);
};

// Helper function to get lesson by id
export const getLessonById = (tutorialSlug: string, lessonId: string): Lesson | undefined => {
  const tutorial = getTutorialBySlug(tutorialSlug);
  if (!tutorial) return undefined;
  
  for (const chapter of tutorial.chapters) {
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
};
