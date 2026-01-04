/**
 * Comprehensive Technology Logos Library
 * All official logos from DevIcons CDN
 * Use these throughout the application for consistent tech stack display
 */

export interface TechLogo {
  name: string;
  logo: string;
  category: string;
}

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

// ============================================
// PROGRAMMING LANGUAGES
// ============================================
export const LANGUAGES: TechLogo[] = [
  { name: 'JavaScript', logo: `${CDN_BASE}/javascript/javascript-original.svg`, category: 'Languages' },
  { name: 'TypeScript', logo: `${CDN_BASE}/typescript/typescript-original.svg`, category: 'Languages' },
  { name: 'Python', logo: `${CDN_BASE}/python/python-original.svg`, category: 'Languages' },
  { name: 'Java', logo: `${CDN_BASE}/java/java-original.svg`, category: 'Languages' },
  { name: 'C', logo: `${CDN_BASE}/c/c-original.svg`, category: 'Languages' },
  { name: 'C++', logo: `${CDN_BASE}/cplusplus/cplusplus-original.svg`, category: 'Languages' },
  { name: 'C#', logo: `${CDN_BASE}/csharp/csharp-original.svg`, category: 'Languages' },
  { name: 'Go', logo: `${CDN_BASE}/go/go-original-wordmark.svg`, category: 'Languages' },
  { name: 'Rust', logo: `${CDN_BASE}/rust/rust-original.svg`, category: 'Languages' },
  { name: 'Ruby', logo: `${CDN_BASE}/ruby/ruby-original.svg`, category: 'Languages' },
  { name: 'PHP', logo: `${CDN_BASE}/php/php-original.svg`, category: 'Languages' },
  { name: 'Swift', logo: `${CDN_BASE}/swift/swift-original.svg`, category: 'Languages' },
  { name: 'Kotlin', logo: `${CDN_BASE}/kotlin/kotlin-original.svg`, category: 'Languages' },
  { name: 'Scala', logo: `${CDN_BASE}/scala/scala-original.svg`, category: 'Languages' },
  { name: 'Dart', logo: `${CDN_BASE}/dart/dart-original.svg`, category: 'Languages' },
  { name: 'R', logo: `${CDN_BASE}/r/r-original.svg`, category: 'Languages' },
  { name: 'Perl', logo: `${CDN_BASE}/perl/perl-original.svg`, category: 'Languages' },
  { name: 'Haskell', logo: `${CDN_BASE}/haskell/haskell-original.svg`, category: 'Languages' },
  { name: 'Elixir', logo: `${CDN_BASE}/elixir/elixir-original.svg`, category: 'Languages' },
  { name: 'Clojure', logo: `${CDN_BASE}/clojure/clojure-original.svg`, category: 'Languages' },
  { name: 'F#', logo: `${CDN_BASE}/fsharp/fsharp-original.svg`, category: 'Languages' },
  { name: 'Lua', logo: `${CDN_BASE}/lua/lua-original.svg`, category: 'Languages' },
  { name: 'Groovy', logo: `${CDN_BASE}/groovy/groovy-original.svg`, category: 'Languages' },
  { name: 'Julia', logo: `${CDN_BASE}/julia/julia-original.svg`, category: 'Languages' },
  { name: 'Objective-C', logo: `${CDN_BASE}/objectivec/objectivec-plain.svg`, category: 'Languages' },
  { name: 'MATLAB', logo: `${CDN_BASE}/matlab/matlab-original.svg`, category: 'Languages' },
  { name: 'Solidity', logo: `${CDN_BASE}/solidity/solidity-original.svg`, category: 'Languages' },
  { name: 'Assembly', logo: `${CDN_BASE}/linux/linux-original.svg`, category: 'Languages' },
  { name: 'Bash', logo: `${CDN_BASE}/bash/bash-original.svg`, category: 'Languages' },
  { name: 'PowerShell', logo: `${CDN_BASE}/powershell/powershell-original.svg`, category: 'Languages' },
];

// ============================================
// FRONTEND FRAMEWORKS & LIBRARIES
// ============================================
export const FRONTEND: TechLogo[] = [
  { name: 'React', logo: `${CDN_BASE}/react/react-original.svg`, category: 'Frontend' },
  { name: 'Angular', logo: `${CDN_BASE}/angularjs/angularjs-original.svg`, category: 'Frontend' },
  { name: 'Vue.js', logo: `${CDN_BASE}/vuejs/vuejs-original.svg`, category: 'Frontend' },
  { name: 'Svelte', logo: `${CDN_BASE}/svelte/svelte-original.svg`, category: 'Frontend' },
  { name: 'Next.js', logo: `${CDN_BASE}/nextjs/nextjs-original.svg`, category: 'Frontend' },
  { name: 'Nuxt.js', logo: `${CDN_BASE}/nuxtjs/nuxtjs-original.svg`, category: 'Frontend' },
  { name: 'Gatsby', logo: `${CDN_BASE}/gatsby/gatsby-original.svg`, category: 'Frontend' },
  { name: 'Ember.js', logo: `${CDN_BASE}/ember/ember-original-wordmark.svg`, category: 'Frontend' },
  { name: 'Backbone.js', logo: `${CDN_BASE}/backbonejs/backbonejs-original.svg`, category: 'Frontend' },
  { name: 'jQuery', logo: `${CDN_BASE}/jquery/jquery-original.svg`, category: 'Frontend' },
  { name: 'Redux', logo: `${CDN_BASE}/redux/redux-original.svg`, category: 'Frontend' },
  { name: 'MobX', logo: `${CDN_BASE}/mobx/mobx-original.svg`, category: 'Frontend' },
  { name: 'Webpack', logo: `${CDN_BASE}/webpack/webpack-original.svg`, category: 'Frontend' },
  { name: 'Vite', logo: `${CDN_BASE}/vitejs/vitejs-original.svg`, category: 'Frontend' },
  { name: 'Babel', logo: `${CDN_BASE}/babel/babel-original.svg`, category: 'Frontend' },
  { name: 'ESLint', logo: `${CDN_BASE}/eslint/eslint-original.svg`, category: 'Frontend' },
  { name: 'Storybook', logo: `${CDN_BASE}/storybook/storybook-original.svg`, category: 'Frontend' },
  { name: 'Three.js', logo: `${CDN_BASE}/threejs/threejs-original.svg`, category: 'Frontend' },
  { name: 'D3.js', logo: `${CDN_BASE}/d3js/d3js-original.svg`, category: 'Frontend' },
  { name: 'Chart.js', logo: `${CDN_BASE}/javascript/javascript-original.svg`, category: 'Frontend' },
  { name: 'Electron', logo: `${CDN_BASE}/electron/electron-original.svg`, category: 'Frontend' },
  { name: 'Tauri', logo: `${CDN_BASE}/tauri/tauri-original.svg`, category: 'Frontend' },
];

// ============================================
// CSS FRAMEWORKS & STYLING
// ============================================
export const CSS_FRAMEWORKS: TechLogo[] = [
  { name: 'HTML5', logo: `${CDN_BASE}/html5/html5-original.svg`, category: 'CSS' },
  { name: 'CSS3', logo: `${CDN_BASE}/css3/css3-original.svg`, category: 'CSS' },
  { name: 'Sass', logo: `${CDN_BASE}/sass/sass-original.svg`, category: 'CSS' },
  { name: 'Less', logo: `${CDN_BASE}/less/less-plain-wordmark.svg`, category: 'CSS' },
  { name: 'Tailwind CSS', logo: `${CDN_BASE}/tailwindcss/tailwindcss-original.svg`, category: 'CSS' },
  { name: 'Bootstrap', logo: `${CDN_BASE}/bootstrap/bootstrap-original.svg`, category: 'CSS' },
  { name: 'Material UI', logo: `${CDN_BASE}/materialui/materialui-original.svg`, category: 'CSS' },
  { name: 'Bulma', logo: `${CDN_BASE}/bulma/bulma-plain.svg`, category: 'CSS' },
  { name: 'Foundation', logo: `${CDN_BASE}/foundation/foundation-original.svg`, category: 'CSS' },
  { name: 'Styled Components', logo: `${CDN_BASE}/css3/css3-original.svg`, category: 'CSS' },
  { name: 'Ant Design', logo: `${CDN_BASE}/antdesign/antdesign-original.svg`, category: 'CSS' },
];

// ============================================
// BACKEND FRAMEWORKS
// ============================================
export const BACKEND: TechLogo[] = [
  { name: 'Node.js', logo: `${CDN_BASE}/nodejs/nodejs-original.svg`, category: 'Backend' },
  { name: 'Express.js', logo: `${CDN_BASE}/express/express-original.svg`, category: 'Backend' },
  { name: 'NestJS', logo: `${CDN_BASE}/nestjs/nestjs-original.svg`, category: 'Backend' },
  { name: 'Fastify', logo: `${CDN_BASE}/fastify/fastify-original.svg`, category: 'Backend' },
  { name: 'Django', logo: `${CDN_BASE}/django/django-plain.svg`, category: 'Backend' },
  { name: 'Flask', logo: `${CDN_BASE}/flask/flask-original.svg`, category: 'Backend' },
  { name: 'FastAPI', logo: `${CDN_BASE}/fastapi/fastapi-original.svg`, category: 'Backend' },
  { name: 'Spring', logo: `${CDN_BASE}/spring/spring-original.svg`, category: 'Backend' },
  { name: 'Spring Boot', logo: `${CDN_BASE}/spring/spring-original.svg`, category: 'Backend' },
  { name: 'Rails', logo: `${CDN_BASE}/rails/rails-plain.svg`, category: 'Backend' },
  { name: 'Laravel', logo: `${CDN_BASE}/laravel/laravel-original.svg`, category: 'Backend' },
  { name: 'Symfony', logo: `${CDN_BASE}/symfony/symfony-original.svg`, category: 'Backend' },
  { name: 'ASP.NET', logo: `${CDN_BASE}/dot-net/dot-net-original.svg`, category: 'Backend' },
  { name: '.NET Core', logo: `${CDN_BASE}/dotnetcore/dotnetcore-original.svg`, category: 'Backend' },
  { name: 'Phoenix', logo: `${CDN_BASE}/phoenix/phoenix-original.svg`, category: 'Backend' },
  { name: 'Gin', logo: `${CDN_BASE}/go/go-original.svg`, category: 'Backend' },
  { name: 'Fiber', logo: `${CDN_BASE}/go/go-original.svg`, category: 'Backend' },
  { name: 'Actix', logo: `${CDN_BASE}/rust/rust-original.svg`, category: 'Backend' },
  { name: 'Rocket', logo: `${CDN_BASE}/rust/rust-original.svg`, category: 'Backend' },
  { name: 'Ktor', logo: `${CDN_BASE}/kotlin/kotlin-original.svg`, category: 'Backend' },
];

// ============================================
// DATABASES
// ============================================
export const DATABASES: TechLogo[] = [
  { name: 'PostgreSQL', logo: `${CDN_BASE}/postgresql/postgresql-original.svg`, category: 'Database' },
  { name: 'MySQL', logo: `${CDN_BASE}/mysql/mysql-original.svg`, category: 'Database' },
  { name: 'MariaDB', logo: `${CDN_BASE}/mariadb/mariadb-original.svg`, category: 'Database' },
  { name: 'MongoDB', logo: `${CDN_BASE}/mongodb/mongodb-original.svg`, category: 'Database' },
  { name: 'Redis', logo: `${CDN_BASE}/redis/redis-original.svg`, category: 'Database' },
  { name: 'SQLite', logo: `${CDN_BASE}/sqlite/sqlite-original.svg`, category: 'Database' },
  { name: 'Oracle', logo: `${CDN_BASE}/oracle/oracle-original.svg`, category: 'Database' },
  { name: 'Microsoft SQL Server', logo: `${CDN_BASE}/microsoftsqlserver/microsoftsqlserver-plain.svg`, category: 'Database' },
  { name: 'Cassandra', logo: `${CDN_BASE}/cassandra/cassandra-original.svg`, category: 'Database' },
  { name: 'CouchDB', logo: `${CDN_BASE}/couchdb/couchdb-original.svg`, category: 'Database' },
  { name: 'DynamoDB', logo: `${CDN_BASE}/dynamodb/dynamodb-original.svg`, category: 'Database' },
  { name: 'Firebase', logo: `${CDN_BASE}/firebase/firebase-plain.svg`, category: 'Database' },
  { name: 'Supabase', logo: `${CDN_BASE}/supabase/supabase-original.svg`, category: 'Database' },
  { name: 'Neo4j', logo: `${CDN_BASE}/neo4j/neo4j-original.svg`, category: 'Database' },
  { name: 'Elasticsearch', logo: `${CDN_BASE}/elasticsearch/elasticsearch-original.svg`, category: 'Database' },
  { name: 'InfluxDB', logo: `${CDN_BASE}/influxdb/influxdb-original.svg`, category: 'Database' },
  { name: 'Couchbase', logo: `${CDN_BASE}/couchbase/couchbase-original.svg`, category: 'Database' },
];

// ============================================
// CLOUD PLATFORMS
// ============================================
export const CLOUD: TechLogo[] = [
  { name: 'AWS', logo: `${CDN_BASE}/amazonwebservices/amazonwebservices-plain-wordmark.svg`, category: 'Cloud' },
  { name: 'Google Cloud', logo: `${CDN_BASE}/googlecloud/googlecloud-original.svg`, category: 'Cloud' },
  { name: 'Azure', logo: `${CDN_BASE}/azure/azure-original.svg`, category: 'Cloud' },
  { name: 'DigitalOcean', logo: `${CDN_BASE}/digitalocean/digitalocean-original.svg`, category: 'Cloud' },
  { name: 'Heroku', logo: `${CDN_BASE}/heroku/heroku-original.svg`, category: 'Cloud' },
  { name: 'Vercel', logo: `${CDN_BASE}/vercel/vercel-original.svg`, category: 'Cloud' },
  { name: 'Netlify', logo: `${CDN_BASE}/netlify/netlify-original.svg`, category: 'Cloud' },
  { name: 'Cloudflare', logo: `${CDN_BASE}/cloudflare/cloudflare-original.svg`, category: 'Cloud' },
  { name: 'Oracle Cloud', logo: `${CDN_BASE}/oracle/oracle-original.svg`, category: 'Cloud' },
  { name: 'IBM Cloud', logo: `${CDN_BASE}/ibm/ibm-original.svg`, category: 'Cloud' },
  { name: 'Linode', logo: `${CDN_BASE}/linux/linux-original.svg`, category: 'Cloud' },
  { name: 'Railway', logo: `${CDN_BASE}/railway/railway-original.svg`, category: 'Cloud' },
  { name: 'Render', logo: `${CDN_BASE}/linux/linux-original.svg`, category: 'Cloud' },
  { name: 'Fly.io', logo: `${CDN_BASE}/linux/linux-original.svg`, category: 'Cloud' },
];

// ============================================
// DEVOPS & INFRASTRUCTURE
// ============================================
export const DEVOPS: TechLogo[] = [
  { name: 'Docker', logo: `${CDN_BASE}/docker/docker-original.svg`, category: 'DevOps' },
  { name: 'Kubernetes', logo: `${CDN_BASE}/kubernetes/kubernetes-plain.svg`, category: 'DevOps' },
  { name: 'Terraform', logo: `${CDN_BASE}/terraform/terraform-original.svg`, category: 'DevOps' },
  { name: 'Ansible', logo: `${CDN_BASE}/ansible/ansible-original.svg`, category: 'DevOps' },
  { name: 'Jenkins', logo: `${CDN_BASE}/jenkins/jenkins-original.svg`, category: 'DevOps' },
  { name: 'GitHub Actions', logo: `${CDN_BASE}/github/github-original.svg`, category: 'DevOps' },
  { name: 'GitLab CI', logo: `${CDN_BASE}/gitlab/gitlab-original.svg`, category: 'DevOps' },
  { name: 'CircleCI', logo: `${CDN_BASE}/circleci/circleci-plain.svg`, category: 'DevOps' },
  { name: 'Travis CI', logo: `${CDN_BASE}/travis/travis-plain.svg`, category: 'DevOps' },
  { name: 'ArgoCD', logo: `${CDN_BASE}/argocd/argocd-original.svg`, category: 'DevOps' },
  { name: 'Helm', logo: `${CDN_BASE}/helm/helm-original.svg`, category: 'DevOps' },
  { name: 'Vagrant', logo: `${CDN_BASE}/vagrant/vagrant-original.svg`, category: 'DevOps' },
  { name: 'Puppet', logo: `${CDN_BASE}/puppet/puppet-original.svg`, category: 'DevOps' },
  { name: 'Chef', logo: `${CDN_BASE}/chef/chef-original.svg`, category: 'DevOps' },
  { name: 'Prometheus', logo: `${CDN_BASE}/prometheus/prometheus-original.svg`, category: 'DevOps' },
  { name: 'Grafana', logo: `${CDN_BASE}/grafana/grafana-original.svg`, category: 'DevOps' },
  { name: 'Nginx', logo: `${CDN_BASE}/nginx/nginx-original.svg`, category: 'DevOps' },
  { name: 'Apache', logo: `${CDN_BASE}/apache/apache-original.svg`, category: 'DevOps' },
  { name: 'Pulumi', logo: `${CDN_BASE}/pulumi/pulumi-original.svg`, category: 'DevOps' },
  { name: 'Podman', logo: `${CDN_BASE}/podman/podman-original.svg`, category: 'DevOps' },
];

// ============================================
// MOBILE DEVELOPMENT
// ============================================
export const MOBILE: TechLogo[] = [
  { name: 'React Native', logo: `${CDN_BASE}/react/react-original.svg`, category: 'Mobile' },
  { name: 'Flutter', logo: `${CDN_BASE}/flutter/flutter-original.svg`, category: 'Mobile' },
  { name: 'Swift', logo: `${CDN_BASE}/swift/swift-original.svg`, category: 'Mobile' },
  { name: 'Kotlin', logo: `${CDN_BASE}/kotlin/kotlin-original.svg`, category: 'Mobile' },
  { name: 'Android', logo: `${CDN_BASE}/android/android-original.svg`, category: 'Mobile' },
  { name: 'iOS', logo: `${CDN_BASE}/apple/apple-original.svg`, category: 'Mobile' },
  { name: 'Ionic', logo: `${CDN_BASE}/ionic/ionic-original.svg`, category: 'Mobile' },
  { name: 'Xamarin', logo: `${CDN_BASE}/xamarin/xamarin-original.svg`, category: 'Mobile' },
  { name: 'NativeScript', logo: `${CDN_BASE}/nativescript/nativescript-original.svg`, category: 'Mobile' },
  { name: 'Capacitor', logo: `${CDN_BASE}/capacitor/capacitor-original.svg`, category: 'Mobile' },
  { name: 'Expo', logo: `${CDN_BASE}/react/react-original.svg`, category: 'Mobile' },
];

// ============================================
// TESTING
// ============================================
export const TESTING: TechLogo[] = [
  { name: 'Jest', logo: `${CDN_BASE}/jest/jest-plain.svg`, category: 'Testing' },
  { name: 'Mocha', logo: `${CDN_BASE}/mocha/mocha-plain.svg`, category: 'Testing' },
  { name: 'Cypress', logo: `${CDN_BASE}/cypressio/cypressio-original.svg`, category: 'Testing' },
  { name: 'Playwright', logo: `${CDN_BASE}/playwright/playwright-original.svg`, category: 'Testing' },
  { name: 'Selenium', logo: `${CDN_BASE}/selenium/selenium-original.svg`, category: 'Testing' },
  { name: 'Pytest', logo: `${CDN_BASE}/pytest/pytest-original.svg`, category: 'Testing' },
  { name: 'JUnit', logo: `${CDN_BASE}/junit/junit-original.svg`, category: 'Testing' },
  { name: 'Karma', logo: `${CDN_BASE}/karma/karma-original.svg`, category: 'Testing' },
  { name: 'Jasmine', logo: `${CDN_BASE}/jasmine/jasmine-original.svg`, category: 'Testing' },
  { name: 'Vitest', logo: `${CDN_BASE}/vitest/vitest-original.svg`, category: 'Testing' },
  { name: 'Testing Library', logo: `${CDN_BASE}/react/react-original.svg`, category: 'Testing' },
  { name: 'Postman', logo: `${CDN_BASE}/postman/postman-original.svg`, category: 'Testing' },
  { name: 'Insomnia', logo: `${CDN_BASE}/insomnia/insomnia-original.svg`, category: 'Testing' },
];

// ============================================
// VERSION CONTROL & COLLABORATION
// ============================================
export const VERSION_CONTROL: TechLogo[] = [
  { name: 'Git', logo: `${CDN_BASE}/git/git-original.svg`, category: 'Version Control' },
  { name: 'GitHub', logo: `${CDN_BASE}/github/github-original.svg`, category: 'Version Control' },
  { name: 'GitLab', logo: `${CDN_BASE}/gitlab/gitlab-original.svg`, category: 'Version Control' },
  { name: 'Bitbucket', logo: `${CDN_BASE}/bitbucket/bitbucket-original.svg`, category: 'Version Control' },
  { name: 'Jira', logo: `${CDN_BASE}/jira/jira-original.svg`, category: 'Version Control' },
  { name: 'Confluence', logo: `${CDN_BASE}/confluence/confluence-original.svg`, category: 'Version Control' },
  { name: 'Trello', logo: `${CDN_BASE}/trello/trello-plain.svg`, category: 'Version Control' },
  { name: 'Slack', logo: `${CDN_BASE}/slack/slack-original.svg`, category: 'Version Control' },
  { name: 'Figma', logo: `${CDN_BASE}/figma/figma-original.svg`, category: 'Version Control' },
  { name: 'Notion', logo: `${CDN_BASE}/notion/notion-original.svg`, category: 'Version Control' },
];

// ============================================
// API & MESSAGING
// ============================================
export const API_MESSAGING: TechLogo[] = [
  { name: 'GraphQL', logo: `${CDN_BASE}/graphql/graphql-plain.svg`, category: 'API' },
  { name: 'REST', logo: `${CDN_BASE}/nodejs/nodejs-original.svg`, category: 'API' },
  { name: 'gRPC', logo: `${CDN_BASE}/grpc/grpc-original.svg`, category: 'API' },
  { name: 'Apache Kafka', logo: `${CDN_BASE}/apachekafka/apachekafka-original.svg`, category: 'API' },
  { name: 'RabbitMQ', logo: `${CDN_BASE}/rabbitmq/rabbitmq-original.svg`, category: 'API' },
  { name: 'Socket.io', logo: `${CDN_BASE}/socketio/socketio-original.svg`, category: 'API' },
  { name: 'Apollo', logo: `${CDN_BASE}/graphql/graphql-plain.svg`, category: 'API' },
  { name: 'Swagger', logo: `${CDN_BASE}/swagger/swagger-original.svg`, category: 'API' },
  { name: 'OpenAPI', logo: `${CDN_BASE}/openapi/openapi-original.svg`, category: 'API' },
];

// ============================================
// AI / ML / DATA SCIENCE
// ============================================
export const AI_ML: TechLogo[] = [
  { name: 'TensorFlow', logo: `${CDN_BASE}/tensorflow/tensorflow-original.svg`, category: 'AI/ML' },
  { name: 'PyTorch', logo: `${CDN_BASE}/pytorch/pytorch-original.svg`, category: 'AI/ML' },
  { name: 'Keras', logo: `${CDN_BASE}/keras/keras-original.svg`, category: 'AI/ML' },
  { name: 'scikit-learn', logo: `${CDN_BASE}/scikitlearn/scikitlearn-original.svg`, category: 'AI/ML' },
  { name: 'Pandas', logo: `${CDN_BASE}/pandas/pandas-original.svg`, category: 'AI/ML' },
  { name: 'NumPy', logo: `${CDN_BASE}/numpy/numpy-original.svg`, category: 'AI/ML' },
  { name: 'Jupyter', logo: `${CDN_BASE}/jupyter/jupyter-original.svg`, category: 'AI/ML' },
  { name: 'Anaconda', logo: `${CDN_BASE}/anaconda/anaconda-original.svg`, category: 'AI/ML' },
  { name: 'OpenCV', logo: `${CDN_BASE}/opencv/opencv-original.svg`, category: 'AI/ML' },
  { name: 'Matplotlib', logo: `${CDN_BASE}/matplotlib/matplotlib-original.svg`, category: 'AI/ML' },
  { name: 'Spark', logo: `${CDN_BASE}/apachespark/apachespark-original.svg`, category: 'AI/ML' },
  { name: 'Hadoop', logo: `${CDN_BASE}/hadoop/hadoop-original.svg`, category: 'AI/ML' },
];

// ============================================
// GAME DEVELOPMENT
// ============================================
export const GAME_DEV: TechLogo[] = [
  { name: 'Unity', logo: `${CDN_BASE}/unity/unity-original.svg`, category: 'Game Dev' },
  { name: 'Unreal Engine', logo: `${CDN_BASE}/unrealengine/unrealengine-original.svg`, category: 'Game Dev' },
  { name: 'Godot', logo: `${CDN_BASE}/godot/godot-original.svg`, category: 'Game Dev' },
  { name: 'Blender', logo: `${CDN_BASE}/blender/blender-original.svg`, category: 'Game Dev' },
  { name: 'OpenGL', logo: `${CDN_BASE}/opengl/opengl-original.svg`, category: 'Game Dev' },
];

// ============================================
// OPERATING SYSTEMS
// ============================================
export const OPERATING_SYSTEMS: TechLogo[] = [
  { name: 'Linux', logo: `${CDN_BASE}/linux/linux-original.svg`, category: 'OS' },
  { name: 'Ubuntu', logo: `${CDN_BASE}/ubuntu/ubuntu-original.svg`, category: 'OS' },
  { name: 'Debian', logo: `${CDN_BASE}/debian/debian-original.svg`, category: 'OS' },
  { name: 'CentOS', logo: `${CDN_BASE}/centos/centos-original.svg`, category: 'OS' },
  { name: 'Red Hat', logo: `${CDN_BASE}/redhat/redhat-original.svg`, category: 'OS' },
  { name: 'Fedora', logo: `${CDN_BASE}/fedora/fedora-original.svg`, category: 'OS' },
  { name: 'Arch Linux', logo: `${CDN_BASE}/archlinux/archlinux-original.svg`, category: 'OS' },
  { name: 'Alpine', logo: `${CDN_BASE}/alpinelinux/alpinelinux-original.svg`, category: 'OS' },
  { name: 'Windows', logo: `${CDN_BASE}/windows11/windows11-original.svg`, category: 'OS' },
  { name: 'macOS', logo: `${CDN_BASE}/apple/apple-original.svg`, category: 'OS' },
];

// ============================================
// EDITORS & IDEs
// ============================================
export const EDITORS: TechLogo[] = [
  { name: 'VS Code', logo: `${CDN_BASE}/vscode/vscode-original.svg`, category: 'Editors' },
  { name: 'Visual Studio', logo: `${CDN_BASE}/visualstudio/visualstudio-plain.svg`, category: 'Editors' },
  { name: 'IntelliJ IDEA', logo: `${CDN_BASE}/intellij/intellij-original.svg`, category: 'Editors' },
  { name: 'PyCharm', logo: `${CDN_BASE}/pycharm/pycharm-original.svg`, category: 'Editors' },
  { name: 'WebStorm', logo: `${CDN_BASE}/webstorm/webstorm-original.svg`, category: 'Editors' },
  { name: 'Android Studio', logo: `${CDN_BASE}/androidstudio/androidstudio-original.svg`, category: 'Editors' },
  { name: 'Xcode', logo: `${CDN_BASE}/xcode/xcode-original.svg`, category: 'Editors' },
  { name: 'Eclipse', logo: `${CDN_BASE}/eclipse/eclipse-original.svg`, category: 'Editors' },
  { name: 'Atom', logo: `${CDN_BASE}/atom/atom-original.svg`, category: 'Editors' },
  { name: 'Sublime Text', logo: `${CDN_BASE}/sublimetext/sublimetext-original.svg`, category: 'Editors' },
  { name: 'Vim', logo: `${CDN_BASE}/vim/vim-original.svg`, category: 'Editors' },
  { name: 'Neovim', logo: `${CDN_BASE}/neovim/neovim-original.svg`, category: 'Editors' },
  { name: 'Emacs', logo: `${CDN_BASE}/emacs/emacs-original.svg`, category: 'Editors' },
];

// ============================================
// BLOCKCHAIN & WEB3
// ============================================
export const BLOCKCHAIN: TechLogo[] = [
  { name: 'Ethereum', logo: `${CDN_BASE}/ethereum/ethereum-original.svg`, category: 'Blockchain' },
  { name: 'Solidity', logo: `${CDN_BASE}/solidity/solidity-original.svg`, category: 'Blockchain' },
  { name: 'Polygon', logo: `${CDN_BASE}/polygon/polygon-original.svg`, category: 'Blockchain' },
  { name: 'Web3.js', logo: `${CDN_BASE}/web3js/web3js-original.svg`, category: 'Blockchain' },
  { name: 'Hardhat', logo: `${CDN_BASE}/hardhat/hardhat-original.svg`, category: 'Blockchain' },
];

// ============================================
// CMS & E-COMMERCE
// ============================================
export const CMS: TechLogo[] = [
  { name: 'WordPress', logo: `${CDN_BASE}/wordpress/wordpress-plain.svg`, category: 'CMS' },
  { name: 'Drupal', logo: `${CDN_BASE}/drupal/drupal-original.svg`, category: 'CMS' },
  { name: 'Joomla', logo: `${CDN_BASE}/joomla/joomla-original.svg`, category: 'CMS' },
  { name: 'Magento', logo: `${CDN_BASE}/magento/magento-original.svg`, category: 'CMS' },
  { name: 'Shopify', logo: `${CDN_BASE}/shopify/shopify-original.svg`, category: 'CMS' },
  { name: 'WooCommerce', logo: `${CDN_BASE}/woocommerce/woocommerce-original.svg`, category: 'CMS' },
  { name: 'Contentful', logo: `${CDN_BASE}/contentful/contentful-original.svg`, category: 'CMS' },
  { name: 'Strapi', logo: `${CDN_BASE}/strapi/strapi-original.svg`, category: 'CMS' },
  { name: 'Sanity', logo: `${CDN_BASE}/sanity/sanity-original.svg`, category: 'CMS' },
  { name: 'Ghost', logo: `${CDN_BASE}/ghost/ghost-original.svg`, category: 'CMS' },
];

// ============================================
// ALL TECH LOGOS COMBINED
// ============================================
export const ALL_TECH_LOGOS: TechLogo[] = [
  ...LANGUAGES,
  ...FRONTEND,
  ...CSS_FRAMEWORKS,
  ...BACKEND,
  ...DATABASES,
  ...CLOUD,
  ...DEVOPS,
  ...MOBILE,
  ...TESTING,
  ...VERSION_CONTROL,
  ...API_MESSAGING,
  ...AI_ML,
  ...GAME_DEV,
  ...OPERATING_SYSTEMS,
  ...EDITORS,
  ...BLOCKCHAIN,
  ...CMS,
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getTechByName = (name: string): TechLogo | undefined => {
  return ALL_TECH_LOGOS.find(tech => tech.name.toLowerCase() === name.toLowerCase());
};

export const getTechsByCategory = (category: string): TechLogo[] => {
  return ALL_TECH_LOGOS.filter(tech => tech.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(ALL_TECH_LOGOS.map(tech => tech.category))];
};

export const searchTech = (query: string): TechLogo[] => {
  const lowerQuery = query.toLowerCase();
  return ALL_TECH_LOGOS.filter(tech => 
    tech.name.toLowerCase().includes(lowerQuery) ||
    tech.category.toLowerCase().includes(lowerQuery)
  );
};

export default ALL_TECH_LOGOS;

