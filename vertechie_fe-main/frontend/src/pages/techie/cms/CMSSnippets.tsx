/**
 * CMSSnippets - Company Code Snippets Library
 * Store and manage reusable code blocks across the organization
 */

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    Paper,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Code as CodeIcon,
    ContentCopy as CopyIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Tag as TagIcon,
    DataObject as JsonIcon,
    Html as HtmlIcon,
    Javascript as JsIcon,
    Css as CssIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const SnippetCard = styled(Card)(({ theme }) => ({
    borderRadius: 12,
    height: '100%',
    transition: 'all 0.3s ease',
    boxShadow: 'none',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    '&:hover': {
        boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.08)}`,
        borderColor: theme.palette.primary.main,
    },
}));

const CodeSection = styled(Box)(({ theme }) => ({
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    padding: theme.spacing(2),
    borderRadius: 8,
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '0.85rem',
    overflowX: 'auto',
    maxHeight: 150,
    position: 'relative',
    '&:hover .copy-btn': {
        opacity: 1,
    },
}));

const MOCK_SNIPPETS = [
    {
        id: '1',
        title: 'User Authentication Hook',
        language: 'typescript',
        category: 'Hooks',
        code: 'const useAuth = () => {\n  const [user, setUser] = useState(null);\n  useEffect(() => {\n    // Auth logic...\n  }, []);\n  return { user, login, logout };\n};',
        tags: ['auth', 'react', 'hooks'],
        creator: 'Sarah Chen'
    },
    {
        id: '2',
        title: 'Global Button Styles',
        language: 'css',
        category: 'Styling',
        code: '.btn-primary {\n  background: linear-gradient(135deg, #0d47a1, #1565c0);\n  color: white;\n  padding: 12px 24px;\n  border-radius: 8px;\n  transition: 0.3s;\n}',
        tags: ['ui', 'styles', 'css'],
        creator: 'Mike Ross'
    },
    {
        id: '3',
        title: 'API Client Helper',
        language: 'javascript',
        category: 'Utilities',
        code: 'export const fetchWrapper = async (url, options) => {\n  const res = await fetch(url, options);\n  if (!res.ok) throw new Error("API error");\n  return res.json();\n};',
        tags: ['api', 'utils', 'async'],
        creator: 'Alex Rivera'
    },
    {
        id: '4',
        title: 'Modal Component Template',
        language: 'typescript',
        category: 'Components',
        code: 'interface ModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  children: React.ReactNode;\n}\n\nconst Modal = ({ isOpen, onClose, children }) => {\n  if (!isOpen) return null;\n  return <div className="modal">...</div>;\n};',
        tags: ['react', 'ui', 'components'],
        creator: 'Sarah Chen'
    }
];

const CMSSnippets: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState(false);

    const getLanguageIcon = (lang: string) => {
        switch (lang) {
            case 'javascript': return <JsIcon sx={{ color: '#f7df1e' }} />;
            case 'typescript': return <JsIcon sx={{ color: '#007acc' }} />;
            case 'css': return <CssIcon sx={{ color: '#264de4' }} />;
            case 'html': return <HtmlIcon sx={{ color: '#e34c26' }} />;
            default: return <CodeIcon color="action" />;
        }
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setSnackbar(true);
        setTimeout(() => setSnackbar(false), 2000);
    };

    const filteredSnippets = MOCK_SNIPPETS.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>Code Snippets Library</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Shared repository for verified code snippets and templates
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                    sx={{ borderRadius: 2, px: 3, py: 1.2, fontWeight: 700 }}
                >
                    New Snippet
                </Button>
            </Box>

            {/* Search & Stats */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        placeholder="Search by title, tags or category..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1 }}>
                    <Paper elevation={0} sx={{ flex: 1, p: 1, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: alpha('#0d47a1', 0.02) }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>TOTAL SNIPPETS</Typography>
                        <Typography variant="h6" fontWeight={700}>{MOCK_SNIPPETS.length}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, p: 1, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: alpha('#34C759', 0.02) }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>CATEGORIES</Typography>
                        <Typography variant="h6" fontWeight={700}>4</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Snippets Grid */}
            <Grid container spacing={3}>
                {filteredSnippets.map((snippet) => (
                    <Grid item xs={12} md={6} key={snippet.id}>
                        <SnippetCard>
                            <CardContent sx={{ p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                        {getLanguageIcon(snippet.language)}
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={700}>{snippet.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {snippet.category} • Created by {snippet.creator}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Tooltip title="Edit">
                                            <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                <CodeSection>
                                    <pre style={{ margin: 0 }}><code>{snippet.code}</code></pre>
                                    <IconButton
                                        className="copy-btn"
                                        onClick={() => handleCopy(snippet.code)}
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                                        }}
                                    >
                                        <CopyIcon fontSize="small" />
                                    </IconButton>
                                </CodeSection>

                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {snippet.tags.map(tag => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            variant="outlined"
                                            icon={<TagIcon sx={{ fontSize: '0.8rem' }} />}
                                            sx={{ fontSize: '0.7rem', height: 24, borderRadius: 1 }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </SnippetCard>
                    </Grid>
                ))}
            </Grid>

            {/* Add Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Add Shared Snippet</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        <Grid item xs={12} md={8}>
                            <TextField fullWidth label="Snippet Title" placeholder="e.g. Navigation Component Template" sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Language</InputLabel>
                                <Select label="Language" defaultValue="typescript">
                                    <MenuItem value="javascript">JavaScript</MenuItem>
                                    <MenuItem value="typescript">TypeScript</MenuItem>
                                    <MenuItem value="html">HTML</MenuItem>
                                    <MenuItem value="css">CSS</MenuItem>
                                    <MenuItem value="json">JSON</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={10}
                                label="Code Content"
                                placeholder="Paste your code here..."
                                InputProps={{
                                    sx: { fontFamily: 'Consolas, monospace', fontSize: '0.9rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Tags (comma separated)" placeholder="react, hooks, auth" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" sx={{ px: 3 }}>Save Shared Snippet</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Copy */}
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: '50%',
                    transform: `translateX(-50%) translateY(${snackbar ? 0 : 100}px)`,
                    opacity: snackbar ? 1 : 0,
                    transition: 'all 0.3s ease',
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    borderRadius: 4,
                    boxShadow: 4,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <CopyIcon fontSize="small" />
                <Typography variant="body2" fontWeight={600}>Code copied to clipboard!</Typography>
            </Paper>
        </Box>
    );
};

export default CMSSnippets;
