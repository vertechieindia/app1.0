/**
 * SearchResults - Global Search Results Page
 * 
 * Displays search results across Jobs, Courses, People, and Companies
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    Card,
    CardContent,
    Avatar,
    Chip,
    Button,
    Grid,
    Skeleton,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getApiUrl } from '../../config/api';

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100%',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
}));

const SearchHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    padding: theme.spacing(3, 0),
    marginBottom: theme.spacing(3),
}));

const ResultCard = styled(Card)(({ theme }) => ({
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.08)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)',
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    minHeight: 48,
    '&.Mui-selected': {
        color: '#0d47a1',
    },
}));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

// Mock data for search results
const mockJobs = [
    { id: 1, title: 'Senior React Developer', company: 'TechCorp', location: 'San Francisco, CA', salary: '$150k - $200k', type: 'Full-time', posted: '2 days ago', logo: '', verified: true },
    { id: 2, title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Remote', salary: '$120k - $160k', type: 'Full-time', posted: '1 week ago', logo: '', verified: false },
    { id: 3, title: 'Frontend Developer', company: 'DesignStudio', location: 'New York, NY', salary: '$100k - $140k', type: 'Contract', posted: '3 days ago', logo: '', verified: true },
];

const mockCourses = [
    { id: 1, title: 'Complete React Masterclass', instructor: 'John Doe', level: 'Advanced', students: 15420, rating: 4.8, image: '' },
    { id: 2, title: 'JavaScript Fundamentals', instructor: 'Jane Smith', level: 'Beginner', students: 32100, rating: 4.9, image: '' },
    { id: 3, title: 'Node.js Backend Development', instructor: 'Mike Johnson', level: 'Intermediate', students: 8750, rating: 4.7, image: '' },
];

const mockPeople = [
    { id: 1, name: 'Sarah Connor', title: 'Senior Software Engineer', company: 'Google', connections: 500, avatar: '' },
    { id: 2, name: 'John Smith', title: 'Product Manager', company: 'Meta', connections: 350, avatar: '' },
    { id: 3, name: 'Emily Davis', title: 'UX Designer', company: 'Apple', connections: 280, avatar: '' },
];

const mockCompanies = [
    { id: 1, name: 'TechCorp Inc.', industry: 'Technology', employees: '10,000+', jobs: 45, logo: '', verified: true },
    { id: 2, name: 'StartupXYZ', industry: 'SaaS', employees: '50-200', jobs: 12, logo: '', verified: false },
    { id: 3, name: 'DesignStudio', industry: 'Design', employees: '200-500', jobs: 8, logo: '', verified: true },
];

const SearchResults: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(query);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    // API Results State
    const [results, setResults] = useState<{
        jobs: any[];
        courses: any[];
        people: any[];
        companies: any[];
        total: number;
    }>({
        jobs: [],
        courses: [],
        people: [],
        companies: [],
        total: 0
    });

    useEffect(() => {
        setSearchQuery(query);

        const fetchResults = async () => {
            if (!query.trim()) {
                setResults({ jobs: [], courses: [], people: [], companies: [], total: 0 });
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(
                    getApiUrl(`/unified-network/search?q=${encodeURIComponent(query)}&type=all`),
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setResults({
                        jobs: data.jobs || [],
                        courses: data.courses || [],
                        people: data.people || [],
                        companies: data.companies || [],
                        total: data.total || 0
                    });
                }
            } catch (err) {
                console.error('Error fetching search results:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery.trim() });
        }
    };

    const totalResults = results.total;
    const { jobs, courses, people, companies } = results;

    return (
        <PageContainer>
            {/* Search Header */}
            <SearchHeader>
                <Container maxWidth="lg">
                    <form onSubmit={handleSearch}>
                        <TextField
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search jobs, courses, people, companies..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                maxWidth: 800,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    borderRadius: 3,
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    '& fieldset': {
                                        borderColor: 'rgba(255,255,255,0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255,255,255,0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#5AC8FA',
                                    },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'rgba(255,255,255,0.5)',
                                    opacity: 1,
                                },
                            }}
                        />
                    </form>
                    {query && (
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', mt: 2 }}>
                            {loading ? 'Searching...' : `${totalResults} results for "${query}"`}
                        </Typography>
                    )}
                </Container>
            </SearchHeader>

            <Container maxWidth="lg">
                {/* Tabs */}
                <Box sx={{ bgcolor: 'white', borderRadius: 2, mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#0d47a1',
                                height: 3,
                            },
                        }}
                    >
                        <StyledTab icon={<TrendingUpIcon />} iconPosition="start" label={`All (${totalResults})`} />
                        <StyledTab icon={<WorkIcon />} iconPosition="start" label={`Jobs (${jobs.length})`} />
                        <StyledTab icon={<SchoolIcon />} iconPosition="start" label={`Courses (${courses.length})`} />
                        <StyledTab icon={<PeopleIcon />} iconPosition="start" label={`People (${people.length})`} />
                        <StyledTab icon={<BusinessIcon />} iconPosition="start" label={`Companies (${companies.length})`} />
                    </Tabs>
                </Box>

                {/* All Results */}
                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>
                        {/* Jobs Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WorkIcon color="primary" /> Jobs
                            </Typography>
                            {loading ? (
                                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                            ) : jobs.length > 0 ? (
                                jobs.slice(0, 2).map((job) => (
                                    <ResultCard key={job.id} sx={{ mb: 2 }}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Avatar sx={{ width: 56, height: 56, bgcolor: '#e3f2fd' }}>
                                                <WorkIcon color="primary" />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#0d47a1' } }}
                                                    onClick={() => navigate(`/techie/jobs/${job.id}`)}>
                                                    {job.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                                                    {job.verified && <VerifiedIcon sx={{ fontSize: 16, color: '#0d47a1' }} />}
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                    <Chip icon={<LocationOnIcon />} label={job.location || 'Remote'} size="small" variant="outlined" />
                                                    <Chip label={job.salary || 'Competitive'} size="small" sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#2e7d32' }} />
                                                    <Chip label={job.type || 'Full-time'} size="small" variant="outlined" />
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                                <IconButton size="small"><BookmarkBorderIcon /></IconButton>
                                                <Typography variant="caption" color="text.secondary">
                                                    <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5 }} />{job.posted || 'Recent'}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </ResultCard>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">No jobs found matching your search.</Typography>
                            )}
                            {jobs.length > 2 && (
                                <Button variant="text" onClick={() => setActiveTab(1)} sx={{ mt: 1 }}>
                                    View all {jobs.length} jobs →
                                </Button>
                            )}
                        </Grid>

                        {/* Courses Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon color="primary" /> Courses
                            </Typography>
                            {loading ? (
                                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                            ) : courses.length > 0 ? (
                                <Grid container spacing={2}>
                                    {courses.slice(0, 2).map((course) => (
                                        <Grid item xs={12} sm={6} key={course.id}>
                                            <ResultCard>
                                                <CardContent>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, cursor: 'pointer', '&:hover': { color: '#0d47a1' } }}
                                                        onClick={() => navigate('/techie/learn')}>
                                                        {course.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        by {course.instructor || 'VerTechie Academy'}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Chip label={course.level || 'Intermediate'} size="small" variant="outlined" />
                                                        <Chip label={`⭐ ${course.rating || '4.5'}`} size="small" sx={{ bgcolor: alpha('#ff9800', 0.1) }} />
                                                        <Chip label={`${(course.students || 0).toLocaleString()} students`} size="small" variant="outlined" />
                                                    </Box>
                                                </CardContent>
                                            </ResultCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body2" color="text.secondary">No courses found matching your search.</Typography>
                            )}
                            {courses.length > 2 && (
                                <Button variant="text" onClick={() => setActiveTab(2)} sx={{ mt: 2 }}>
                                    View all {courses.length} courses →
                                </Button>
                            )}
                        </Grid>

                        {/* People Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PeopleIcon color="primary" /> People
                            </Typography>
                            {loading ? (
                                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                            ) : people.length > 0 ? (
                                <Grid container spacing={2}>
                                    {people.slice(0, 3).map((person) => (
                                        <Grid item xs={12} sm={4} key={person.id}>
                                            <ResultCard>
                                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#0d47a1' }}>
                                                        {person.name.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{person.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{person.title || 'User'}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{person.company || ''}</Typography>
                                                    </Box>
                                                </CardContent>
                                            </ResultCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body2" color="text.secondary">No people found matching your search.</Typography>
                            )}
                            {people.length > 3 && (
                                <Button variant="text" onClick={() => setActiveTab(3)} sx={{ mt: 2 }}>
                                    View all {people.length} people →
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Jobs Tab */}
                <TabPanel value={activeTab} index={1}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                    ) : jobs.length > 0 ? (
                        jobs.map((job) => (
                            <ResultCard key={job.id} sx={{ mb: 2 }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#e3f2fd' }}>
                                        <WorkIcon color="primary" />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#0d47a1' } }}
                                            onClick={() => navigate(`/techie/jobs/${job.id}`)}>
                                            {job.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                                            {job.verified && <VerifiedIcon sx={{ fontSize: 16, color: '#0d47a1' }} />}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Chip icon={<LocationOnIcon />} label={job.location || 'Remote'} size="small" variant="outlined" />
                                            <Chip label={job.salary || 'Competitive'} size="small" sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#2e7d32' }} />
                                            <Chip label={job.type || 'Full-time'} size="small" variant="outlined" />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                        <Button variant="contained" size="small" sx={{ bgcolor: '#0d47a1' }}
                                            onClick={() => navigate(`/techie/jobs/${job.id}`)}>Apply</Button>
                                        <Typography variant="caption" color="text.secondary">
                                            <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5 }} />{job.posted || 'Recent'}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </ResultCard>
                        ))
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">No jobs found.</Typography>
                        </Box>
                    )}
                </TabPanel>

                {/* Courses Tab */}
                <TabPanel value={activeTab} index={2}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                    ) : courses.length > 0 ? (
                        <Grid container spacing={2}>
                            {courses.map((course) => (
                                <Grid item xs={12} sm={6} md={4} key={course.id}>
                                    <ResultCard sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ height: 100, bgcolor: '#e3f2fd', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <SchoolIcon sx={{ fontSize: 40, color: '#0d47a1' }} />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{course.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>by {course.instructor || 'VerTechie Academy'}</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip label={course.level || 'Intermediate'} size="small" variant="outlined" />
                                                <Chip label={`⭐ ${course.rating || '4.5'}`} size="small" />
                                            </Box>
                                            <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/techie/learn')}>
                                                Start Learning
                                            </Button>
                                        </CardContent>
                                    </ResultCard>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">No courses found.</Typography>
                        </Box>
                    )}
                </TabPanel>

                {/* People Tab */}
                <TabPanel value={activeTab} index={3}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                    ) : people.length > 0 ? (
                        <Grid container spacing={2}>
                            {people.map((person) => (
                                <Grid item xs={12} sm={6} md={4} key={person.id}>
                                    <ResultCard>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <Avatar sx={{ width: 72, height: 72, bgcolor: '#0d47a1', mx: 'auto', mb: 2, fontSize: '1.5rem' }}>
                                                {person.name.charAt(0)}
                                            </Avatar>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{person.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{person.title || 'User'}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{person.company || ''}</Typography>
                                            {person.connections && <Chip label={`${person.connections}+ connections`} size="small" variant="outlined" sx={{ mb: 2 }} />}
                                            <Button fullWidth variant="contained" sx={{ bgcolor: '#0d47a1' }}>Connect</Button>
                                        </CardContent>
                                    </ResultCard>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">No people found.</Typography>
                        </Box>
                    )}
                </TabPanel>

                {/* Companies Tab */}
                <TabPanel value={activeTab} index={4}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                    ) : companies.length > 0 ? (
                        <Grid container spacing={2}>
                            {companies.map((company) => (
                                <Grid item xs={12} sm={6} key={company.id}>
                                    <ResultCard>
                                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Avatar sx={{ width: 64, height: 64, bgcolor: '#e3f2fd' }}>
                                                <BusinessIcon sx={{ fontSize: 32, color: '#0d47a1' }} />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{company.name}</Typography>
                                                    {company.verified && <VerifiedIcon sx={{ fontSize: 18, color: '#0d47a1' }} />}
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">{company.industry || 'Technology'} • {company.employees || '0-50'} employees</Typography>
                                                {company.jobs_count !== undefined && <Chip label={`${company.jobs_count} open positions`} size="small" sx={{ mt: 1, bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }} />}
                                            </Box>
                                            <Button variant="outlined">Follow</Button>
                                        </CardContent>
                                    </ResultCard>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">No companies found.</Typography>
                        </Box>
                    )}
                </TabPanel>

                {/* No Results */}
                {!loading && query && totalResults === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>No results found</Typography>
                        <Typography color="text.secondary">
                            We couldn't find anything matching "{query}". Try different keywords.
                        </Typography>
                    </Box>
                )}
            </Container>
        </PageContainer>
    );
};

export default SearchResults;

