import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const BlacklistPolicy: React.FC = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            VerTechie Blacklist Policy
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
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

export default BlacklistPolicy; 