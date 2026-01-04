import React, { useEffect, useRef, useState } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

// Google Maps API Key - Add to your .env file as VITE_GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  sx?: object;
}

// Load Google Maps script
const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured. Address autocomplete disabled.');
      reject(new Error('No API key'));
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
};

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  label = 'Address',
  placeholder = 'Start typing your address...',
  required = false,
  error = false,
  helperText = '',
  disabled = false,
  sx = {},
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        setIsGoogleLoaded(true);
      })
      .catch(() => {
        setIsGoogleLoaded(false);
      });
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchPredictions = (input: string) => {
    if (!autocompleteService.current || !input || input.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);

    autocompleteService.current.getPlacePredictions(
      {
        input,
        types: ['address'],
      },
      (predictions, status) => {
        setLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setOptions(predictions as PlacePrediction[]);
        } else {
          setOptions([]);
        }
      }
    );
  };

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);

    // Debounce API calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchPredictions(newInputValue);
    }, 300);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: PlacePrediction | string | null) => {
    if (typeof newValue === 'string') {
      onChange(newValue);
    } else if (newValue) {
      onChange(newValue.description);
      setInputValue(newValue.description);
    }
  };

  // If Google Maps is not loaded, show a regular text field
  if (!isGoogleLoaded) {
    return (
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        error={error}
        helperText={helperText || 'Address autocomplete unavailable'}
        disabled={disabled}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, ...sx }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOn sx={{ color: '#94a3b8' }} />
            </InputAdornment>
          ),
        }}
      />
    );
  }

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => 
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x}
      value={value}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, ...sx }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <LocationOn sx={{ color: '#94a3b8' }} />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.place_id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            py: 1.5,
          }}
        >
          <LocationOn sx={{ color: '#6366f1', mt: 0.5 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {option.structured_formatting.main_text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.structured_formatting.secondary_text}
            </Typography>
          </Box>
        </Box>
      )}
      noOptionsText="Start typing to search for addresses"
      loadingText="Searching..."
    />
  );
};

export default AddressAutocomplete;


