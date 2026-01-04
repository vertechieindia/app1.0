import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const TermsOfService: React.FC = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Terms of Service
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Use License
          </Typography>
          <Typography paragraph>
            Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Disclaimer
          </Typography>
          <Typography paragraph>
            The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Limitations
          </Typography>
          <Typography paragraph>
            In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Revisions and Errata
          </Typography>
          <Typography paragraph>
            The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Links
          </Typography>
          <Typography paragraph>
            We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site.
          </Typography>

          <Typography variant="h6" gutterBottom>
            7. Site Terms of Use Modifications
          </Typography>
          <Typography paragraph>
            We may revise these terms of service for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </Typography>

          <Typography variant="h6" gutterBottom>
            8. Governing Law
          </Typography>
          <Typography paragraph>
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </Typography>

          <Typography variant="h6" gutterBottom>
            9. Permanent Blacklisting and Employer Visibility
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            🔐 English (Permanent Blacklist Clause)
          </Typography>
          <Typography paragraph>
            If your profile is suspended or terminated due to false or misleading information:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" paragraph>
              It will be permanently added to VerTechie's internal blacklist
            </Typography>
            <Typography component="li" paragraph>
              Your record will be stored indefinitely for audit and legal purposes
            </Typography>
            <Typography component="li" paragraph>
              It may be accessed by VerTechie-approved employers and partners for:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" paragraph>
                Background verification
              </Typography>
              <Typography component="li" paragraph>
                Fraud prevention
              </Typography>
              <Typography component="li" paragraph>
                Hiring risk alerts
              </Typography>
            </Box>
          </Box>
          <Typography paragraph>
            You will not be allowed to return to the platform under any identity.
            Employers may reject applications based on blacklist verification checks.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
            🔐 Español (Cláusula de Lista Negra Permanente)
          </Typography>
          <Typography paragraph>
            Si tu cuenta es suspendida o eliminada por proporcionar información falsa o engañosa:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" paragraph>
              Será agregada permanentemente a la lista negra interna de VerTechie
            </Typography>
            <Typography component="li" paragraph>
              Tu registro se conservará indefinidamente con fines de auditoría y cumplimiento legal
            </Typography>
            <Typography component="li" paragraph>
              Podrá ser consultado por empresas y socios aprobados por VerTechie para:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" paragraph>
                Verificaciones de antecedentes
              </Typography>
              <Typography component="li" paragraph>
                Prevención de fraudes
              </Typography>
              <Typography component="li" paragraph>
                Alertas de riesgo en contrataciones
              </Typography>
            </Box>
          </Box>
          <Typography paragraph>
            No podrás volver a registrarte en la plataforma bajo ninguna identidad.
            Los empleadores pueden rechazar solicitudes basadas en la verificación de esta lista negra.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService; 