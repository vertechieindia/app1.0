import React from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useBlogSearch } from '../../contexts/BlogSearchContext';

const segmentDivider = {
  borderRight: '1px solid rgba(0, 0, 0, 0.1)',
};

const selectSx = {
  height: '100%',
  minWidth: 0,
  fontSize: '0.8125rem',
  color: '#1a237e',
  '& .MuiSelect-select': {
    py: 0,
    px: 1.25,
    display: 'flex',
    alignItems: 'center',
    minHeight: 'unset !important',
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiSelect-icon': { color: '#0d47a1', right: 4 },
};

const BlogHeaderSearchBar: React.FC = () => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterCategories,
  } = useBlogSearch();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
  };

  const categoryLabel =
    filterCategories.find((c) => c.id === selectedCategory)?.name || 'All Posts';

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        flex: '1 1 0%',
        minWidth: 0,
        maxWidth: { xs: '100%', lg: 880 },
        mx: { xs: 0.5, sm: 1.5 },
        bgcolor: 'white',
        borderRadius: 1.5,
        overflow: 'hidden',
        height: { xs: 38, md: 42 },
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
      }}
    >
      <Box
        sx={{
          flex: isCompact ? '1 1 55%' : '2 1 220px',
          display: 'flex',
          alignItems: 'center',
          px: 1.25,
          minWidth: 0,
          ...segmentDivider,
        }}
      >
        <SearchIcon sx={{ color: '#64748b', fontSize: 20, mr: 0.75, flexShrink: 0 }} />
        <Box
          component="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isCompact ? 'Search articles...' : 'Search articles, topics, or authors...'}
          sx={{
            border: 'none',
            outline: 'none',
            width: '100%',
            minWidth: 0,
            bgcolor: 'transparent',
            fontSize: '0.8125rem',
            color: '#1a237e',
            '&::placeholder': { color: '#94a3b8' },
          }}
        />
      </Box>

      <Box
        sx={{
          flex: isCompact ? '1 1 45%' : '1 1 160px',
          minWidth: isCompact ? 100 : 140,
          maxWidth: isCompact ? 160 : 220,
        }}
      >
        <Select
          fullWidth
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          renderValue={() => (
            <Typography sx={{ fontSize: '0.8125rem', color: '#1a237e' }} noWrap>
              {isCompact ? categoryLabel : `Category: ${categoryLabel}`}
            </Typography>
          )}
          sx={selectSx}
        >
          {filterCategories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Button
        type="submit"
        sx={{
          flexShrink: 0,
          minWidth: { xs: 72, md: 96 },
          borderRadius: 0,
          px: { xs: 1.5, md: 2.5 },
          fontWeight: 700,
          fontSize: '0.8125rem',
          textTransform: 'none',
          color: 'white',
          background: 'linear-gradient(135deg, #5AC8FA 0%, #0d47a1 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7dd3fc 0%, #1565c0 100%)',
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default BlogHeaderSearchBar;
