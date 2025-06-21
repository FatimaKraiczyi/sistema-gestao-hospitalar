import React from "react";
import { Paper, Box, Typography, Grid, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Address } from "../../types";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  firstName,
  lastName,
  email,
  phone,
  address,
}) => {
  // Format the address into a readable string
  const addressString =
    address != null
      ? `${address.numero} ${address.logradouro}, ${address.complemento}, ${address.bairro}, ${address.cidade}, ${address.estado}, ${address.cep}`
      : "Sem dados disponíveis";

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {firstName} {lastName}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 1, width: "100%" }}
          >
            <EmailIcon color="primary" sx={{ mr: 1, flexShrink: 0 }} />
            <Typography
              variant="body1"
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "calc(100% - 30px)",
              }}
            >
              {email}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">{phone}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
            <LocationOnIcon color="primary" sx={{ mr: 1, mt: 0.3 }} />
            <Typography variant="body1">{addressString}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
