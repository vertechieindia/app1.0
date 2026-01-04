import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';

const Privacy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Introduction
          </Typography>
          <Typography paragraph>
            VerTechie is deeply committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains in detail how we collect, use, store, share, and protect your personal information in compliance with global data protection standards, including GDPR, CCPA, and HIPAA.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. Data Collection Practices
          </Typography>
          <Typography paragraph>
            We collect various types of information to enhance your user experience:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Personal Information"
                secondary="Name, address, email, phone number, professional credentials."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Verification Data"
                secondary="Government-issued IDs, educational qualifications, employment history, biometric data for identity verification."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Technical Information"
                secondary="IP addresses, device information, browser type, and operating systems."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Usage Data"
                secondary="Website interactions, login frequency, services used, communication preferences."
              />
            </ListItem>
          </List>
          <Typography paragraph>
            Methods of collection include direct user submission, automated tracking technologies (cookies, analytics tools), and third-party verification integrations.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. Purpose of Data Collection
          </Typography>
          <Typography paragraph>
            We use your data for:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Verification"
                secondary="Verification of identity and qualifications."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Profile Management"
                secondary="Profile creation and account management."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Job Matching"
                secondary="Matching professionals with suitable job opportunities."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="User Experience"
                secondary="Enhancing and personalizing the user experience."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Security"
                secondary="Fraud prevention and security enhancement."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Analytics"
                secondary="Providing analytical insights for improving platform performance."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Compliance"
                secondary="Legal and regulatory compliance."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            4. Sharing of Personal Data
          </Typography>
          <Typography paragraph>
            We may share your data with:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Service Providers"
                secondary="Third-party service providers (for verification, cloud storage, analytics)."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Legal Authorities"
                secondary="Legal authorities under mandatory disclosure."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Business Partners"
                secondary="Strategic business partners, strictly for defined purposes, ensuring confidentiality agreements."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            5. Data Security and Protection Measures
          </Typography>
          <Typography paragraph>
            Your data security is paramount. We implement:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Encryption"
                secondary="Advanced encryption (AES-256, SSL/TLS)."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Access Control"
                secondary="Secure, controlled-access data storage."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Security Audits"
                secondary="Routine security audits and penetration testing."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Incident Response"
                secondary="Incident response plans to promptly address security breaches."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            6. User Rights and Data Control
          </Typography>
          <Typography paragraph>
            Under GDPR, CCPA, and other regulations, you have rights to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Access and Control"
                secondary="Access, rectify, or erase your personal data."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Processing Control"
                secondary="Restrict or object to the processing of your data."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Data Portability"
                secondary="Data portability (transfer data to another provider)."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Consent Management"
                secondary="Withdraw consent at any time."
              />
            </ListItem>
          </List>
          <Typography paragraph>
            To exercise these rights, contact <Link href="mailto:privacy@vertechie.com">privacy@vertechie.com</Link>.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            7. Cookies and Similar Technologies
          </Typography>
          <Typography paragraph>
            We use cookies and tracking technologies to enhance your experience:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Essential Cookies"
                secondary="Essential cookies for basic functionality."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Analytical Cookies"
                secondary="Analytical cookies for performance improvement."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Preference Cookies"
                secondary="Preference cookies for personalized settings."
              />
            </ListItem>
          </List>
          <Typography paragraph>
            Manage or disable these cookies through your browser settings.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            8. International Data Transfers
          </Typography>
          <Typography paragraph>
            As a global platform, we may transfer your data across borders:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Cross-Border Transfers"
                secondary="Data may be transferred to and processed in countries outside your jurisdiction."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Safeguards"
                secondary="We implement appropriate safeguards (Standard Contractual Clauses, Privacy Shield) for international transfers."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Compliance"
                secondary="We ensure compliance with international data protection laws and regulations."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            9. Children's Privacy
          </Typography>
          <Typography paragraph>
            Our services are not intended for children under 16:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Age Restriction"
                secondary="We do not knowingly collect personal information from children under 16."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Parental Consent"
                secondary="If we discover we have collected information from a child under 16, we will delete it immediately."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            10. Data Retention
          </Typography>
          <Typography paragraph>
            We retain your data based on specific criteria:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Retention Periods"
                secondary="Data is retained for as long as necessary to fulfill the purposes outlined in this policy."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Deletion"
                secondary="Data is securely deleted when no longer needed or upon user request."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Archival"
                secondary="Some data may be archived for legal or regulatory compliance purposes."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            11. Third-Party Links and Services
          </Typography>
          <Typography paragraph>
            Our platform may contain links to third-party services:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="External Links"
                secondary="We are not responsible for the privacy practices of external websites."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Third-Party Services"
                secondary="Third-party services integrated with our platform have their own privacy policies."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            12. Changes to Privacy Policy
          </Typography>
          <Typography paragraph>
            We may update this policy periodically:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Updates"
                secondary="Significant changes will be notified through our platform or via email."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Review"
                secondary="We encourage users to review this policy regularly for updates."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            13. Contact Information
          </Typography>
          <Typography paragraph>
            For privacy-related inquiries or concerns:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={<Link href="mailto:privacy@vertechie.com">privacy@vertechie.com</Link>}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Data Protection Officer"
                secondary="Contact our DPO at dpo@vertechie.com"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Mailing Address"
                secondary="1111 Oak Hollow Ct, Hampton, GA 30228"
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            14. Dispute Resolution
          </Typography>
          <Typography paragraph>
            In case of privacy-related disputes:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Complaints"
                secondary="Users may file complaints with our privacy team."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Regulatory Authorities"
                secondary="Users have the right to contact relevant data protection authorities."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Arbitration"
                secondary="Disputes may be resolved through binding arbitration in accordance with our Terms of Service."
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} VerTechie. All rights reserved.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Privacy; 