import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useJobSearch } from '../../contexts/JobSearchContext';
import {
  TECHIE_DATE_OPTIONS,
  TECHIE_EXPERIENCE_OPTIONS,
  TECHIE_JOB_TYPE_OPTIONS,
} from '../../pages/user/jobSearchUtils';

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

const JobHeaderSearchBar: React.FC = () => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const { filters, updateFilter } = useJobSearch();
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
  };

  const jobTypeLabel = TECHIE_JOB_TYPE_OPTIONS.find((o) => o.value === filters.jobType)?.label || 'All Types';
  const experienceLabel = TECHIE_EXPERIENCE_OPTIONS.find((o) => o.value === filters.experienceLevel)?.label || 'All Levels';
  const dateLabel = TECHIE_DATE_OPTIONS.find((o) => o.value === filters.dateRange)?.label || 'All Time';

  return (
    <Box
      component="form"
      onSubmit={handleSearchSubmit}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        flex: '1 1 0%',
        minWidth: 0,
        maxWidth: { xs: '100%', lg: 920 },
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
          flex: isCompact ? '1 1 40%' : '2 1 180px',
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
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder={isCompact ? 'Search jobs...' : 'Search jobs, skills, companies...'}
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

      {!isCompact && (
        <>
          <Box sx={{ flex: '1 1 100px', minWidth: 90, maxWidth: 130, ...segmentDivider }}>
            <Select
              fullWidth
              displayEmpty
              value={filters.jobType}
              onChange={(e) => updateFilter('jobType', e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: '#94a3b8', fontSize: '0.8125rem' }}>Job Type</Typography>;
                }
                const match = TECHIE_JOB_TYPE_OPTIONS.find((o) => o.value === selected);
                return match?.label || selected;
              }}
              sx={selectSx}
            >
              <MenuItem value="">All Types</MenuItem>
              {TECHIE_JOB_TYPE_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ flex: '1 1 110px', minWidth: 100, maxWidth: 140, ...segmentDivider }}>
            <Select
              fullWidth
              displayEmpty
              value={filters.experienceLevel}
              onChange={(e) => updateFilter('experienceLevel', e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: '#94a3b8', fontSize: '0.8125rem' }}>Experience</Typography>;
                }
                const match = TECHIE_EXPERIENCE_OPTIONS.find((o) => o.value === selected);
                return match?.label || selected;
              }}
              sx={selectSx}
            >
              <MenuItem value="">All Levels</MenuItem>
              {TECHIE_EXPERIENCE_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ flex: '1 1 90px', minWidth: 85, maxWidth: 120, ...segmentDivider }}>
            <Select
              fullWidth
              value={filters.dateRange || 'all'}
              onChange={(e) => updateFilter('dateRange', e.target.value)}
              sx={selectSx}
            >
              {TECHIE_DATE_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </Box>
        </>
      )}

      <Box
        sx={{
          flex: isCompact ? '1 1 35%' : '1 1 120px',
          display: 'flex',
          alignItems: 'center',
          px: 1.25,
          minWidth: 0,
          ...segmentDivider,
        }}
      >
        <LocationOnIcon sx={{ color: '#64748b', fontSize: 18, mr: 0.5, flexShrink: 0 }} />
        <Box
          component="input"
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          placeholder="Location"
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

      {isCompact && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5, ...segmentDivider }}>
            <IconButton
              size="small"
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              aria-label="Job filters"
              sx={{ color: '#0d47a1' }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Box>
          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={() => setFilterAnchor(null)}
            PaperProps={{ sx: { minWidth: 240, p: 1 } }}
          >
            <MenuItem disabled sx={{ opacity: 1, fontWeight: 700, fontSize: '0.75rem', color: '#64748b' }}>
              Job Type: {jobTypeLabel}
            </MenuItem>
            {TECHIE_JOB_TYPE_OPTIONS.map(({ value, label }) => (
              <MenuItem
                key={value}
                selected={filters.jobType === value}
                onClick={() => { updateFilter('jobType', value); setFilterAnchor(null); }}
              >
                {label}
              </MenuItem>
            ))}
            <MenuItem disabled sx={{ opacity: 1, fontWeight: 700, fontSize: '0.75rem', color: '#64748b', mt: 1 }}>
              Experience: {experienceLabel}
            </MenuItem>
            {TECHIE_EXPERIENCE_OPTIONS.map(({ value, label }) => (
              <MenuItem
                key={value}
                selected={filters.experienceLevel === value}
                onClick={() => { updateFilter('experienceLevel', value); setFilterAnchor(null); }}
              >
                {label}
              </MenuItem>
            ))}
            <MenuItem disabled sx={{ opacity: 1, fontWeight: 700, fontSize: '0.75rem', color: '#64748b', mt: 1 }}>
              Date: {dateLabel}
            </MenuItem>
            {TECHIE_DATE_OPTIONS.map(({ value, label }) => (
              <MenuItem
                key={value}
                selected={(filters.dateRange || 'all') === value}
                onClick={() => { updateFilter('dateRange', value); setFilterAnchor(null); }}
              >
                {label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

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

export default JobHeaderSearchBar;
