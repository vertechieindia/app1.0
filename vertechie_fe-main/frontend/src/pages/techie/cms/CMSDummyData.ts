/**
 * Dummy Data for CMS Pages
 * Used to populate the UI when no backend data is available.
 */

export const DUMMY_COMPANY = {
    id: 'dummy-company-id',
    name: 'VerTechie Innovations',
    tagline: 'Building the Future of Tech Hiring',
    industry: 'Technology',
    company_size: '51-200',
    headquarters: 'San Francisco, CA',
    website: 'https://vertechie.com',
    description: 'We are a platform dedicated to verifying tech talent and connecting them with top companies. Our mission is to streamline the hiring process and ensure quality matches.',
    logo_url: null,
    is_verified: true,
};

export const DUMMY_STATS = {
    followers: 1250,
    team_members: 15,
    active_jobs: 4,
    page_views: 3420
};

export const DUMMY_POSTS = [
    {
        id: 'post-1',
        content: 'We are thrilled to announce our Series A funding round! 🚀 This milestone will help us accelerate our mission to transform tech hiring. A huge thank you to our team, investors, and community for your support. #Startup #Funding #Tech',
        media: [
            { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80', type: 'image' }
        ],
        author_id: 'user-1',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes_count: 124,
        comments_count: 18,
        shares_count: 45,
    },
    {
        id: 'post-2',
        content: 'Welcome to our newest team member, Sarah Chen! Sarah joins us as Head of Product Design. She brings over 10 years of experience in building user-centric interfaces. We can\'t wait to see what she builds with us! 👋',
        media: [],
        author_id: 'user-1',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        likes_count: 89,
        comments_count: 12,
        shares_count: 5,
    },
    {
        id: 'post-3',
        content: 'Our engineering team just released a major update to the candidate dashboard. Check out the new analytics features that help you track your application status in real-time. Link in bio! 💻',
        media: [
            { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80', type: 'image' }
        ],
        author_id: 'user-1',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        likes_count: 56,
        comments_count: 4,
        shares_count: 12,
    },
];

export const DUMMY_JOBS = [
    {
        id: 'job-1',
        title: 'Senior Frontend Engineer',
        department: 'Engineering',
        type: 'Full-time',
        location: 'Remote / US',
        status: 'active',
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        applications_count: 42,
    },
    {
        id: 'job-2',
        title: 'Product Designer',
        department: 'Design',
        type: 'Full-time',
        location: 'San Francisco, CA',
        status: 'active',
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        applications_count: 28,
    },
    {
        id: 'job-3',
        title: 'Marketing Manager',
        department: 'Marketing',
        type: 'Contract',
        location: 'Remote',
        status: 'closed',
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        applications_count: 156,
    },
    {
        id: 'job-4',
        title: 'Data Scientist Intern',
        department: 'Data',
        type: 'Internship',
        location: 'New York, NY',
        status: 'active',
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        applications_count: 12,
    },
];

export const DUMMY_EMPLOYEES = [
    {
        id: 'emp-1',
        name: 'Alex Rivera',
        title: 'Chief Technology Officer',
        bio: 'Technologist with a passion for scalable systems and AI.',
        photo_url: null,
        linkedin_url: 'https://linkedin.com',
        is_leadership: true,
    },
    {
        id: 'emp-2',
        name: 'Sarah Chen',
        title: 'Head of Product',
        bio: 'Product strategist focused on user experience and growth.',
        photo_url: null,
        linkedin_url: 'https://linkedin.com',
        is_leadership: true,
    },
    {
        id: 'emp-3',
        name: 'Michael Ross',
        title: 'Senior Developer',
        bio: 'Fullstack wizard. Loves TypeScript and Rust.',
        photo_url: null,
        linkedin_url: '',
        is_leadership: false,
    },
    {
        id: 'emp-4',
        name: 'Emily Weiss',
        title: 'HR Manager',
        bio: 'Building culture and finding great talent.',
        photo_url: null,
        linkedin_url: 'https://linkedin.com',
        is_leadership: false,
    },
];

export const DUMMY_ADMINS = [
    {
        id: 'admin-1',
        user_name: 'John Founder',
        user_email: 'john@vertechie.com',
        role: 'owner',
        can_manage_jobs: true,
        can_manage_team: true,
        can_manage_admins: true,
        added_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    },
    {
        id: 'admin-2',
        user_name: 'Emily Weiss',
        user_email: 'emily@vertechie.com',
        role: 'hr',
        can_manage_jobs: true,
        can_manage_team: true,
        can_manage_admins: false,
        added_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 100).toISOString(),
    },
    {
        id: 'admin-3',
        user_name: 'Tech Lead',
        user_email: 'lead@vertechie.com',
        role: 'admin',
        can_manage_jobs: true,
        can_manage_team: false,
        can_manage_admins: false,
        added_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    },
];
