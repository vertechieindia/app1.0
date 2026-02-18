/**
 * CMSMedia - Company Media Library
 * Manage images, videos, and documents for the company
 */

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from '@mui/material';
import {
    Search as SearchIcon,
    CloudUpload as UploadIcon,
    MoreVert as MoreIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Link as LinkIcon,
    FilterList as FilterIcon,
    InsertDriveFile as FileIcon,
    VideoLibrary as VideoIcon,
    Image as ImageIcon,
    Folder as FolderIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const MediaCard = styled(Card)(({ theme }) => ({
    borderRadius: 12,
    transition: 'all 0.3s ease',
    boxShadow: 'none',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.1)}`,
        borderColor: theme.palette.primary.main,
    },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    borderRadius: 8,
    fontWeight: 600,
}));

// Mock Data
const MOCK_MEDIA = [
    { id: '1', name: 'Company Logo Main', type: 'image', url: 'https://picsum.photos/seed/company1/400/300', size: '1.2 MB', date: '2024-03-10' },
    { id: '2', name: 'Product Demo 2024', type: 'video', url: 'https://picsum.photos/seed/demo1/400/300', size: '45.8 MB', date: '2024-03-12' },
    { id: '3', name: 'Annual Report PDF', type: 'document', url: '', size: '5.4 MB', date: '2024-03-15' },
    { id: '4', name: 'Office Background 1', type: 'image', url: 'https://picsum.photos/seed/office1/400/300', size: '2.8 MB', date: '2024-03-08' },
    { id: '5', name: 'Social Media Banner', type: 'image', url: 'https://picsum.photos/seed/banner1/400/300', size: '1.5 MB', date: '2024-03-18' },
    { id: '6', name: 'Hiring Post Creative', type: 'image', url: 'https://picsum.photos/seed/hiring1/400/300', size: '890 KB', date: '2024-03-20' },
];

const CMSMedia: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMedia, setSelectedMedia] = useState<any>(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, media: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedMedia(media);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMedia(null);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image': return <ImageIcon color="primary" />;
            case 'video': return <VideoIcon color="secondary" />;
            case 'document': return <FileIcon color="action" />;
            default: return <FileIcon />;
        }
    };

    const filteredMedia = MOCK_MEDIA.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>Media Library</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your company's digital assets in one place
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={() => setUploadDialogOpen(true)}
                    sx={{ borderRadius: 2, px: 3, py: 1.2, fontWeight: 700 }}
                >
                    Upload Asset
                </Button>
            </Box>

            {/* Filters & Search */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search assets..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                    }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <StyledChip
                        label="All"
                        onClick={() => setFilterType('all')}
                        color={filterType === 'all' ? 'primary' : 'default'}
                        variant={filterType === 'all' ? 'filled' : 'outlined'}
                    />
                    <StyledChip
                        label="Images"
                        icon={<ImageIcon sx={{ fontSize: '1rem' }} />}
                        onClick={() => setFilterType('image')}
                        color={filterType === 'image' ? 'primary' : 'default'}
                        variant={filterType === 'image' ? 'filled' : 'outlined'}
                    />
                    <StyledChip
                        label="Videos"
                        icon={<VideoIcon sx={{ fontSize: '1rem' }} />}
                        onClick={() => setFilterType('video')}
                        color={filterType === 'video' ? 'primary' : 'default'}
                        variant={filterType === 'video' ? 'filled' : 'outlined'}
                    />
                    <StyledChip
                        label="Docs"
                        icon={<FileIcon sx={{ fontSize: '1rem' }} />}
                        onClick={() => setFilterType('document')}
                        color={filterType === 'document' ? 'primary' : 'default'}
                        variant={filterType === 'document' ? 'filled' : 'outlined'}
                    />
                </Box>
            </Box>

            {/* Media Grid */}
            <Grid container spacing={3}>
                {filteredMedia.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <MediaCard>
                            <CardActionArea>
                                {item.type === 'image' ? (
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={item.url}
                                        alt={item.name}
                                    />
                                ) : (
                                    <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(alpha(item.type === 'video' ? '#f50057' : '#9e9e9e', 1), 0.1) }}>
                                        {item.type === 'video' ? <VideoIcon sx={{ fontSize: 48, color: '#f50057' }} /> : <FileIcon sx={{ fontSize: 48, color: '#9e9e9e' }} />}
                                    </Box>
                                )}
                            </CardActionArea>
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box sx={{ overflow: 'hidden' }}>
                                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {item.size} • {item.date}
                                        </Typography>
                                    </Box>
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, item)}>
                                        <MoreIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </MediaCard>
                    </Grid>
                ))}
                {filteredMedia.length === 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <FolderIcon sx={{ fontSize: 64, color: 'divider', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">No assets found</Typography>
                            <Typography variant="body2" color="text.secondary">Try adjusting your search or filters</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleMenuClose}><LinkIcon sx={{ mr: 1, fontSize: 18 }} /> Copy Link</MenuItem>
                <MenuItem onClick={handleMenuClose}><DownloadIcon sx={{ mr: 1, fontSize: 18 }} /> Download</MenuItem>
                <MenuItem onClick={handleMenuClose}><ShareIcon sx={{ mr: 1, fontSize: 18 }} /> Share</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}><DeleteIcon sx={{ mr: 1, fontSize: 18 }} /> Delete</MenuItem>
            </Menu>

            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Company Asset</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        mt: 2,
                        p: 4,
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#0d47a1', 0.02) }
                    }}>
                        <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6">Drag & drop files here</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Support for JPG, PNG, MP4, and PDF (Max 100MB)
                        </Typography>
                        <Button variant="outlined" sx={{ mt: 3 }}>Choose Files</Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" disabled>Upload</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CMSMedia;
