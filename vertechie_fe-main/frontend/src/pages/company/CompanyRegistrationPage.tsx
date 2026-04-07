/**
 * Company *page* registration (post–profile approval): 3-step wizard → submit to BDM.
 * Not the same as techie/HR signup company fields. Payload uses `invite_flow: 'registration'` so only
 * BDM Admin reviews it; after approval the company is provisioned and CMS access can apply.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Alert,
  Stack,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/api';
import { fetchWithAuth, isAuthenticated } from '../../utils/apiInterceptor';

const STEP_LABELS = ['Company identity', 'Locations & team', 'Review & submit'];

/** Indian GSTIN: 15 chars, e.g. 22AAAAA0000A1Z5 */
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_IDS = {
  legalName: 'company-legal-name',
  displayName: 'display-name',
  website: 'company-website',
  industry: 'company-industry',
  gst: 'company-gst',
  tagline: 'company-tagline',
  hqAddress: 'hq-address',
  primaryEmail: 'primary-email',
  about: 'about-company',
} as const;

const STEP0_SCROLL_ORDER = [
  FIELD_IDS.legalName,
  FIELD_IDS.displayName,
  FIELD_IDS.primaryEmail,
  FIELD_IDS.industry,
  FIELD_IDS.gst,
  FIELD_IDS.website,
  FIELD_IDS.tagline,
  FIELD_IDS.about,
];

/** Required on inputs so global paste blocking in main.tsx allows paste (Ctrl+V / right-click). */
const INPUT_PASTE_ALLOW = { 'data-allow-paste': 'true' as const };

function scrollToFieldId(id: string | null) {
  if (!id) return;
  window.requestAnimationFrame(() => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const focusable = el?.querySelector?.('input, textarea') ?? el;
    if (focusable instanceof HTMLElement && 'focus' in focusable) {
      (focusable as HTMLInputElement).focus();
    }
  });
}

function validateOptionalUrl(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  try {
    const u = v.startsWith('http://') || v.startsWith('https://') ? v : `https://${v}`;
    new URL(u);
    return null;
  } catch {
    return 'Enter a valid URL (e.g. https://example.com).';
  }
}

function validateOptionalEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (!EMAIL_REGEX.test(v)) return 'Enter a valid email address.';
  return null;
}

function validateRequiredEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Email is required.';
  return validateOptionalEmail(v);
}

/** 7–15 digits (matches backend) */
function validateOptionalPhone(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const digits = v.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return 'Phone must contain 7–15 digits.';
  return null;
}

function validateGstRequired(raw: string): string | null {
  const t = raw.trim().toUpperCase();
  if (!t) return 'GST number is required.';
  if (t.length !== 15) return 'GST must be exactly 15 characters (Indian GSTIN).';
  if (!GSTIN_REGEX.test(t)) return 'Invalid GSTIN format. Example: 22AAAAA0000A1Z5';
  return null;
}

type BranchRow = {
  label: string;
  address_line1: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

type FounderRow = {
  name: string;
  role: string;
  email: string;
  phone: string;
};

const emptyBranch = (): BranchRow => ({
  label: '',
  address_line1: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
});

const emptyFounder = (): FounderRow => ({
  name: '',
  role: '',
  email: '',
  phone: '',
});

const isFounderRowActive = (f: FounderRow): boolean =>
  Boolean(f.name.trim() || f.role.trim() || f.email.trim() || f.phone.trim());

const CompanyRegistrationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  /** Same full form as legacy /signup/company; Business nav uses /techie/create-company */
  const fromSignup = location.pathname.includes('/signup/company') || location.pathname.includes('/create-company');

  const [activeStep, setActiveStep] = useState(0);

  const [legalName, setLegalName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [hqAddress, setHqAddress] = useState('');
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [website, setWebsite] = useState('');
  const [gst, setGst] = useState('');
  const [industry, setIndustry] = useState('');
  const [tagline, setTagline] = useState('');
  const [about, setAbout] = useState('');
  const [founders, setFounders] = useState<FounderRow[]>([emptyFounder()]);
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitPending, setSubmitPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = useCallback((key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const title = useMemo(
    () => (fromSignup ? 'Register your company' : 'Create company page'),
    [fromSignup],
  );

  const buildStep0Errors = useCallback((): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!legalName.trim()) e[FIELD_IDS.legalName] = 'Company legal name is required.';
    const dn = displayName.trim();
    if (dn.length > 200) e[FIELD_IDS.displayName] = 'Brand name must be 200 characters or less.';
    const pe = validateRequiredEmail(primaryEmail);
    if (pe) e[FIELD_IDS.primaryEmail] = pe;
    const ge = validateGstRequired(gst);
    if (ge) e[FIELD_IDS.gst] = ge;
    if (!industry.trim()) e[FIELD_IDS.industry] = 'Industry is required.';
    else if (industry.trim().length < 2) e[FIELD_IDS.industry] = 'Enter at least 2 characters.';
    const wErr = validateOptionalUrl(website);
    if (wErr) e[FIELD_IDS.website] = wErr;
    if (tagline.trim().length > 200) e[FIELD_IDS.tagline] = 'Tagline must be 200 characters or less.';
    const aboutTrim = about.trim();
    if (!aboutTrim) e[FIELD_IDS.about] = 'About the company is required.';
    else if (aboutTrim.length < 20) e[FIELD_IDS.about] = 'Enter at least 20 characters.';
    else if (about.length > 20000) e[FIELD_IDS.about] = 'About text is too long (max 20,000 characters).';
    return e;
  }, [legalName, displayName, primaryEmail, gst, industry, website, tagline, about]);

  const buildStep1Errors = useCallback((): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!hqAddress.trim()) e[FIELD_IDS.hqAddress] = 'Head office address is required.';
    else if (hqAddress.trim().length < 5) e[FIELD_IDS.hqAddress] = 'Enter a complete address (at least 5 characters).';

    let hasCompleteFounder = false;
    founders.forEach((f, i) => {
      if (!isFounderRowActive(f)) return;

      const n = f.name.trim();
      const r = f.role.trim();
      const hasEm = f.email.trim();
      const hasPh = f.phone.trim();

      if (n.length < 2) {
        e[`founder-${i}-name`] =
          n.length === 0 ? 'Name is required.' : 'Enter at least 2 characters.';
      }
      if (r.length > 0 && r.length < 2) {
        e[`founder-${i}-role`] = 'Enter at least 2 characters or leave blank.';
      }
      if ((hasEm || hasPh) && n.length < 2) {
        e[`founder-${i}-name`] = 'Name is required when email or phone is provided.';
      }

      if (!hasEm) {
        e[`founder-${i}-email`] = 'Email is required.';
      } else {
        const fe = validateOptionalEmail(f.email);
        if (fe) e[`founder-${i}-email`] = fe;
      }
      if (!hasPh) {
        e[`founder-${i}-phone`] = 'Phone is required.';
      } else {
        const fp = validateOptionalPhone(f.phone);
        if (fp) e[`founder-${i}-phone`] = fp;
      }

      if (n.length >= 2 && hasEm && hasPh) {
        const fe = validateOptionalEmail(f.email);
        const fp = validateOptionalPhone(f.phone);
        if (!fe && !fp) hasCompleteFounder = true;
      }
    });
    if (!hasCompleteFounder) {
      const anyFounderFieldError = founders.some(
        (_, i) =>
          e[`founder-${i}-name`] ||
          e[`founder-${i}-role`] ||
          e[`founder-${i}-email`] ||
          e[`founder-${i}-phone`],
      );
      if (!anyFounderFieldError) {
        e['founder-0-name'] = 'Add at least one founder with name, email, and phone.';
      }
    }

    return e;
  }, [hqAddress, founders]);

  const firstErrorId = (order: string[], errs: Record<string, string>): string | null => {
    for (const id of order) {
      if (errs[id]) return id;
    }
    const keys = Object.keys(errs);
    return keys.length ? keys[0] : null;
  };

  const step1ScrollOrder = useMemo((): string[] => {
    const founderIds = founders.flatMap((_, i) => [
      `founder-${i}-name`,
      `founder-${i}-role`,
      `founder-${i}-email`,
      `founder-${i}-phone`,
    ]);
    return [FIELD_IDS.hqAddress, ...founderIds];
  }, [founders]);

  const handleNext = () => {
    setError(null);
    if (activeStep === 0) {
      const errs = buildStep0Errors();
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        setError('Please fix the highlighted fields.');
        scrollToFieldId(firstErrorId(STEP0_SCROLL_ORDER, errs));
        return;
      }
      setFieldErrors({});
      setActiveStep(1);
    } else if (activeStep === 1) {
      const errs = buildStep1Errors();
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        setError('Please fix the highlighted fields.');
        scrollToFieldId(firstErrorId(step1ScrollOrder, errs));
        return;
      }
      setFieldErrors({});
      setActiveStep(2);
    }
  };

  const handleWizardBack = () => {
    setError(null);
    setFieldErrors({});
    if (activeStep > 0) setActiveStep((s) => s - 1);
    else navigate(-1);
  };

  const finalizeSubmit = async () => {
    setError(null);
    const e0 = buildStep0Errors();
    const e1 = buildStep1Errors();
    const merged = { ...e0, ...e1 };
    if (Object.keys(merged).length > 0) {
      setFieldErrors(merged);
      setError('Please fix the highlighted fields.');
      const id0 = firstErrorId(STEP0_SCROLL_ORDER, merged);
      if (id0) {
        setActiveStep(0);
        scrollToFieldId(id0);
        return;
      }
      const id1 = firstErrorId(step1ScrollOrder, merged);
      setActiveStep(1);
      scrollToFieldId(id1);
      return;
    }
    setFieldErrors({});
    if (!isAuthenticated()) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }

    const company_name = (displayName.trim() || legalName.trim()).slice(0, 200);
    const branch_addresses = branches
      .filter((b) => (b.address_line1 || '').trim())
      .map((b) => ({
        label: b.label || undefined,
        address_line1: b.address_line1.trim(),
        address_line2: undefined,
        city: b.city || undefined,
        state: b.state || undefined,
        country: b.country || undefined,
        postal_code: b.postal_code || undefined,
      }));
    const founder_details = founders
      .filter((f) => (f.name || '').trim())
      .map((f) => ({
        name: f.name.trim(),
        role: f.role.trim() || undefined,
        email: f.email.trim() || undefined,
        phone: f.phone.trim() || undefined,
      }));

    const payload = {
      company_name,
      legal_name: legalName.trim(),
      headquarters_address: hqAddress.trim(),
      address: hqAddress.trim(),
      branch_addresses,
      website: website.trim() || undefined,
      gst_number: gst.trim().toUpperCase() || undefined,
      industry: industry.trim(),
      about: about.trim(),
      tagline: tagline.trim() || undefined,
      founder_details,
      emails: primaryEmail.trim() ? [primaryEmail.trim()] : [],
      phone_numbers: [],
      send_notification_emails: false,
      invite_flow: 'registration' as const,
    };

    setSubmitting(true);
    try {
      const res = await fetchWithAuth(getApiUrl('/companies/invites'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg: string = 'Submission failed';
        try {
          const j = await res.json();
          const d = j.detail;
          if (typeof d === 'string') msg = d;
          else if (Array.isArray(d)) msg = d.map((x: unknown) => JSON.stringify(x)).join(', ');
          else if (d) msg = JSON.stringify(d);
          else if (j.message) msg = String(j.message);
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      setSubmitPending(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const renderBranchEditors = () =>
    branches.map((b, i) => (
      <Paper key={i} variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Branch {i + 1}</Typography>
          <IconButton aria-label="remove" size="small" onClick={() => setBranches((rows) => rows.filter((_, j) => j !== i))}>
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              label="Label"
              value={b.label}
              onChange={(e) => {
                const v = e.target.value;
                setBranches((rows) => rows.map((row, j) => (j === i ? { ...row, label: v } : row)));
              }}
              placeholder="e.g. Bengaluru office"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              label="Address line"
              value={b.address_line1}
              onChange={(e) => {
                const v = e.target.value;
                setBranches((rows) => rows.map((row, j) => (j === i ? { ...row, address_line1: v } : row)));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              label="City"
              value={b.city}
              onChange={(e) => {
                const v = e.target.value;
                setBranches((rows) => rows.map((row, j) => (j === i ? { ...row, city: v } : row)));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              label="State"
              value={b.state}
              onChange={(e) => {
                const v = e.target.value;
                setBranches((rows) => rows.map((row, j) => (j === i ? { ...row, state: v } : row)));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              label="Country"
              value={b.country}
              onChange={(e) => {
                const v = e.target.value;
                setBranches((rows) => rows.map((row, j) => (j === i ? { ...row, country: v } : row)));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              label="Postal code"
              value={b.postal_code}
              onChange={(e) => {
                const v = e.target.value;
                setBranches((rows) => rows.map((row, j) => (j === i ? { ...row, postal_code: v } : row)));
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    ));

  const renderFounderEditors = () =>
    founders.map((f, i) => (
      <Box key={i} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              id={`founder-${i}-name`}
              label="Name"
              value={f.name}
              error={!!fieldErrors[`founder-${i}-name`]}
              helperText={fieldErrors[`founder-${i}-name`] || undefined}
              onChange={(e) => {
                const v = e.target.value;
                clearFieldError(`founder-${i}-name`);
                setFounders((rows) => rows.map((row, j) => (j === i ? { ...row, name: v } : row)));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              id={`founder-${i}-role`}
              label="Role (optional)"
              value={f.role}
              error={!!fieldErrors[`founder-${i}-role`]}
              helperText={fieldErrors[`founder-${i}-role`] || undefined}
              onChange={(e) => {
                const v = e.target.value;
                clearFieldError(`founder-${i}-role`);
                setFounders((rows) => rows.map((row, j) => (j === i ? { ...row, role: v } : row)));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              type="email"
              id={`founder-${i}-email`}
              label="Email"
              value={f.email}
              error={!!fieldErrors[`founder-${i}-email`]}
              helperText={fieldErrors[`founder-${i}-email`] || undefined}
              onChange={(e) => {
                const v = e.target.value;
                clearFieldError(`founder-${i}-email`);
                setFounders((rows) => rows.map((row, j) => (j === i ? { ...row, email: v } : row)));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={INPUT_PASTE_ALLOW}
              fullWidth
              size="small"
              id={`founder-${i}-phone`}
              label="Phone"
              value={f.phone}
              error={!!fieldErrors[`founder-${i}-phone`]}
              helperText={fieldErrors[`founder-${i}-phone`] || 'Include country code if outside India.'}
              onChange={(e) => {
                const v = e.target.value;
                clearFieldError(`founder-${i}-phone`);
                setFounders((rows) => rows.map((row, j) => (j === i ? { ...row, phone: v } : row)));
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                aria-label="remove founder"
                onClick={() => setFounders((rows) => rows.filter((_, j) => j !== i))}
                disabled={founders.length <= 1}
                size="small"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    ));

  const reviewLine = (label: string, value: string | undefined) => (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {value?.trim() ? value : '—'}
      </Typography>
    </Box>
  );

  const reviewLineIfFilled = (label: string, value: string | undefined) =>
    value?.trim() ? reviewLine(label, value) : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      {submitPending ? (
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: 'center',
            maxWidth: 560,
            mx: 'auto',
          }}
        >
          <PendingActionsIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} aria-hidden />
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Request pending approval
          </Typography>
          <Typography color="text.secondary" paragraph sx={{ mb: 2 }}>
            Your company registration was submitted successfully. It is now <strong>pending</strong> review. A platform
            admin will verify your details and approve your company account. You will be notified when a decision is
            made.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Your request appears in the admin company-invite queue so the relevant team can process it.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              if (fromSignup) navigate('/');
              else navigate(-1);
            }}
          >
            {fromSignup ? 'Go to home' : 'Done'}
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" paragraph>
            Complete the steps below. After submission, an admin will review your request. When approved, your company
            account and CMS access will be activated.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {STEP_LABELS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Company identity + about */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                Company identity
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputProps={INPUT_PASTE_ALLOW}
                    id={FIELD_IDS.legalName}
                    fullWidth
                    required
                    label="Company legal name"
                    value={legalName}
                    error={!!fieldErrors[FIELD_IDS.legalName]}
                    helperText={fieldErrors[FIELD_IDS.legalName] || undefined}
                    onChange={(e) => {
                      clearFieldError(FIELD_IDS.legalName);
                      setLegalName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputProps={INPUT_PASTE_ALLOW}
                    id={FIELD_IDS.displayName}
                    fullWidth
                    label="Brand name (optional)"
                    value={displayName}
                    error={!!fieldErrors[FIELD_IDS.displayName]}
                    helperText={
                      fieldErrors[FIELD_IDS.displayName] || 'Public name on the platform. If empty, legal name is used.'
                    }
                    onChange={(e) => {
                      clearFieldError(FIELD_IDS.displayName);
                      setDisplayName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputProps={INPUT_PASTE_ALLOW}
                    id={FIELD_IDS.primaryEmail}
                    fullWidth
                    required
                    type="email"
                    label="Company email"
                    value={primaryEmail}
                    error={!!fieldErrors[FIELD_IDS.primaryEmail]}
                    helperText={fieldErrors[FIELD_IDS.primaryEmail] || undefined}
                    onChange={(e) => {
                      clearFieldError(FIELD_IDS.primaryEmail);
                      setPrimaryEmail(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputProps={INPUT_PASTE_ALLOW}
                    id={FIELD_IDS.industry}
                    fullWidth
                    required
                    label="Industry"
                    value={industry}
                    error={!!fieldErrors[FIELD_IDS.industry]}
                    helperText={fieldErrors[FIELD_IDS.industry] || undefined}
                    onChange={(e) => {
                      clearFieldError(FIELD_IDS.industry);
                      setIndustry(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id={FIELD_IDS.gst}
                    fullWidth
                    required
                    label="GST number (GSTIN)"
                    value={gst}
                    inputProps={{
                      maxLength: 15,
                      style: { textTransform: 'uppercase' },
                      ...INPUT_PASTE_ALLOW,
                    }}
                    error={!!fieldErrors[FIELD_IDS.gst]}
                    helperText={fieldErrors[FIELD_IDS.gst] || '15-character Indian GSTIN, e.g. 22AAAAA0000A1Z5'}
                    onChange={(e) => {
                      clearFieldError(FIELD_IDS.gst);
                      setGst(e.target.value.toUpperCase());
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputProps={INPUT_PASTE_ALLOW}
                    id={FIELD_IDS.website}
                    fullWidth
                    label="Website (optional)"
                    value={website}
                    error={!!fieldErrors[FIELD_IDS.website]}
                    helperText={fieldErrors[FIELD_IDS.website] || undefined}
                    onChange={(e) => {
                      clearFieldError(FIELD_IDS.website);
                      setWebsite(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputProps={INPUT_PASTE_ALLOW}
                    id={FIELD_IDS.tagline}
                    fullWidth
                    label="Tagline (optional)"
                    value={tagline}
                    error={!!fieldErrors[FIELD_IDS.tagline]}
                    helperText={fieldErrors[FIELD_IDS.tagline] || undefined}
                    onChange={(e) => {
                      clearFieldError(FIELD_IDS.tagline);
                      setTagline(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                About
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Describe your company, products, and culture (at least 20 characters).
              </Typography>
              <TextField
                inputProps={INPUT_PASTE_ALLOW}
                id={FIELD_IDS.about}
                fullWidth
                required
                multiline
                minRows={6}
                label="About the company"
                value={about}
                error={!!fieldErrors[FIELD_IDS.about]}
                helperText={
                  fieldErrors[FIELD_IDS.about] ||
                  (about.trim().length > 0 && about.trim().length < 20 ? 'Enter at least 20 characters.' : undefined)
                }
                onChange={(e) => {
                  clearFieldError(FIELD_IDS.about);
                  setAbout(e.target.value);
                }}
              />
            </Box>
          )}

          {/* Step 2: Offices & founders */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                Head office
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    inputProps={INPUT_PASTE_ALLOW}
                    id={FIELD_IDS.hqAddress}
                    fullWidth
                    required
                    multiline
                    minRows={4}
                    label="Head office address"
                    value={hqAddress}
                    error={!!fieldErrors[FIELD_IDS.hqAddress]}
                    helperText={fieldErrors[FIELD_IDS.hqAddress] || undefined}
                    onChange={(e) => {
                      clearFieldError(FIELD_IDS.hqAddress);
                      setHqAddress(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Branch addresses
                </Typography>
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setBranches((b) => [...b, emptyBranch()])}
                  type="button"
                  size="small"
                >
                  Add branch
                </Button>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Optional — add branches if your company has more than one office.
              </Typography>
              {renderBranchEditors()}

              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                Founders / leadership
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add at least one founder or leader with name, email, and phone. Role is optional. If you add another row,
                fill name, email, and phone for that person or remove the row.
              </Typography>
              {renderFounderEditors()}
              <Button startIcon={<AddCircleOutlineIcon />} onClick={() => setFounders((r) => [...r, emptyFounder()])} type="button" size="small" sx={{ mb: 2 }}>
                Add founder
              </Button>
            </Box>
          )}

          {/* Step 3: Review */}
          {activeStep === 2 && (
            <Stack spacing={3}>
              <Card variant="outlined">
                <CardHeader
                  title="Company identity"
                  subheader="Legal name, brand, email, and about"
                  action={
                    <Button size="small" startIcon={<EditIcon />} onClick={() => setActiveStep(0)}>
                      Edit
                    </Button>
                  }
                />
                <CardContent>
                  {reviewLine('Legal name', legalName)}
                  {reviewLineIfFilled('Brand name', displayName)}
                  {reviewLine('Company email', primaryEmail)}
                  {reviewLine('Industry', industry)}
                  {reviewLine('GST', gst)}
                  {reviewLineIfFilled('Website', website)}
                  {reviewLineIfFilled('Tagline', tagline)}
                  <Divider sx={{ my: 2 }} />
                  {reviewLine('About', about)}
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader
                  title="Locations & team"
                  subheader="Head office, branches, and founders"
                  action={
                    <Button size="small" startIcon={<EditIcon />} onClick={() => setActiveStep(1)}>
                      Edit
                    </Button>
                  }
                />
                <CardContent>
                  {reviewLine('Head office', hqAddress)}
                  {branches.some((b) => (b.address_line1 || '').trim()) && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2, mb: 0.5 }}>
                      Branches
                    </Typography>
                  )}
                  {branches
                    .map((b, i) => ({ b, i }))
                    .filter(({ b }) => (b.address_line1 || '').trim())
                    .map(({ b, i }) => (
                      <Typography key={i} variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                        <strong>{b.label || `Branch ${i + 1}`}:</strong> {b.address_line1}
                        {[b.city, b.state, b.country, b.postal_code].filter(Boolean).join(', ')}
                      </Typography>
                    ))}
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2, mb: 0.5 }}>
                    Founders
                  </Typography>
                  {founders.filter((f) => (f.name || '').trim()).length === 0 ? (
                    <Typography variant="body2">—</Typography>
                  ) : (
                    founders
                      .filter((f) => (f.name || '').trim())
                      .map((f, i) => (
                        <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                          {f.name}
                          {f.role ? ` — ${f.role}` : ''}
                          {f.email ? ` · ${f.email}` : ''}
                          {f.phone ? ` · ${f.phone}` : ''}
                        </Typography>
                      ))
                  )}
                </CardContent>
              </Card>
            </Stack>
          )}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ mt: 4 }}
            >
              <Button variant="outlined" onClick={handleWizardBack}>
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {activeStep < 2 && (
                  <Button variant="contained" size="large" onClick={handleNext}>
                    Next
                  </Button>
                )}
                {activeStep === 2 && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => void finalizeSubmit()}
                    disabled={submitting}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit for review'}
                  </Button>
                )}
              </Box>
            </Stack>
        </Paper>
        </>
      )}
    </Container>
  );
};

export default CompanyRegistrationPage;
