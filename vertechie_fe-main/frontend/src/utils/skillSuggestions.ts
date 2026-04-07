import { getApiUrl, API_ENDPOINTS } from '../config/api';

/** Kept in sync with vertechie_be/.../scripts/seed_skill_catalog.py (CATALOG_SKILLS). */
const SKILL_SUGGESTIONS = [
  '.NET',
  'ADO.NET',
  'ASP.NET',
  'AWS',
  'Agile',
  'Airflow',
  'Android',
  'Angular',
  'Ansible',
  'Apache Kafka',
  'Azure',
  'Azure DevOps',
  'Bash',
  'BigQuery',
  'Blockchain',
  'Bootstrap',
  'C#',
  'C++',
  'CI/CD',
  'CSS3',
  'Cassandra',
  'CircleCI',
  'CloudFormation',
  'Computer Vision',
  'Confluence',
  'Cypress',
  'D3.js',
  'Data Science',
  'Databricks',
  'Deep Learning',
  'Django',
  'Docker',
  'DynamoDB',
  'Elasticsearch',
  'Elixir',
  'Ember.js',
  'Express.js',
  'FastAPI',
  'Figma',
  'Firebase',
  'Flask',
  'Flutter',
  'GCP',
  'Git',
  'GitHub Actions',
  'GitLab CI',
  'Go',
  'Gradle',
  'Grafana',
  'GraphQL',
  'HTML5',
  'Hadoop',
  'Helm',
  'Hibernate',
  'Hugging Face',
  'Istio',
  'JWT',
  'Java',
  'JavaScript',
  'Jenkins',
  'Jest',
  'Jira',
  'Kafka',
  'Kanban',
  'Keras',
  'Keycloak',
  'Kotlin',
  'Kubernetes',
  'LLMs',
  'LangChain',
  'Laravel',
  'Linux',
  'MATLAB',
  'MLOps',
  'Machine Learning',
  'Maven',
  'Microservices',
  'MongoDB',
  'Mongoose',
  'MySQL',
  'NLP',
  'NestJS',
  'Next.js',
  'Node.js',
  'Notion',
  'NumPy',
  'Nuxt.js',
  'OAuth',
  'OWASP',
  'Objective-C',
  'OpenAPI',
  'OpenCV',
  'Oracle',
  'PHP',
  'Pandas',
  'Penetration Testing',
  'Perl',
  'Playwright',
  'PostgreSQL',
  'Postman',
  'Power BI',
  'PowerShell',
  'Prometheus',
  'PySpark',
  'PyTorch',
  'Python',
  'REST API',
  'RabbitMQ',
  'React',
  'React Native',
  'Redis',
  'Redux',
  'Remix',
  'Ruby',
  'Ruby on Rails',
  'Rust',
  'RxJS',
  'SAML',
  'SQL',
  'SQL Server',
  'SQLite',
  'Sass',
  'Scala',
  'Scrum',
  'Security',
  'Selenium',
  'Shell',
  'Shopify',
  'Slack',
  'Snowflake',
  'Solid.js',
  'Solidity',
  'Spark',
  'Spring Boot',
  'Storybook',
  'Supabase',
  'Svelte',
  'Swift',
  'Symfony',
  'TDD',
  'Tableau',
  'Tailwind CSS',
  'TensorFlow',
  'Terraform',
  'Three.js',
  'TypeORM',
  'TypeScript',
  'Unity',
  'Unix',
  'VS Code',
  'Vault',
  'Vercel',
  'Vim',
  'Visual Studio',
  'Vitest',
  'Vue.js',
  'WebSockets',
  'Webpack',
  'Xamarin',
  'YAML',
  'Zig',
  'Zustand',
  'dbt',
  'gRPC',
  'iOS',
  'jQuery',
  'pytest',
  'scikit-learn',
];

/** Quick-add chips on ATS forms (subset of common picks). */
export const SUGGESTED_SKILL_CHIPS = [
  'Python',
  'Java',
  'TypeScript',
  'AWS',
  'Docker',
  'Kubernetes',
  'SQL',
  'MongoDB',
  'GraphQL',
  'REST API',
  'CI/CD',
  'Git',
];

const normalize = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9+.#/\s-]/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Fetch skill suggestions from API (catalog + distinct skills from jobs), with local fallback.
 */
export async function fetchSkillSuggestions(query: string, limit = 24): Promise<string[]> {
  const q = query.trim();
  if (q.length < 1) return [];
  try {
    const url = `${getApiUrl(API_ENDPOINTS.SKILLS.AUTOCOMPLETE)}?q=${encodeURIComponent(q)}&limit=${limit}`;
    const token = localStorage.getItem('authToken');
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: unknown = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((x) => String(x)).filter(Boolean);
    }
  } catch {
    /* use local list below */
  }
  return getSkillSuggestions(q, limit);
}

/** Local-only suggestions (offline / API failure). */
export const getSkillSuggestions = (query: string, limit = 24): string[] => {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 1) {
    return [];
  }

  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  return SKILL_SUGGESTIONS.map((name) => {
      const normalizedTitle = normalize(name);
      const startsWithQuery = normalizedTitle.startsWith(normalizedQuery);
      const includesQuery = normalizedTitle.includes(normalizedQuery);
      const tokenMatches = queryTokens.every((token) => normalizedTitle.includes(token));

      let score = -1;
      if (startsWithQuery) score = 3;
      else if (includesQuery) score = 2;
      else if (tokenMatches) score = 1;

      return { name, score };
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((item) => item.name);
};

export default SKILL_SUGGESTIONS;
