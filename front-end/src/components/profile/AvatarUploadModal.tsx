import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Avatar,
  styled,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface AvatarUploadModalProps {
  open: boolean;
  currentAvatar: string;
  onClose: () => void;
  onSave: (newAvatar: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
/**
 * Modal exibido após o usuário clicar no botão de editar do EditableAvatar
Permite ao usuário escolher uma nova imagem do computador para upload
Exibe o preview da nova imagem antes de salvar
Faz a interação com a API para enviar a imagem ao servidor
 */
const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  open,
  currentAvatar,
  onClose,
  onSave,
  isLoading = false,
  error = null,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = () => {
    onSave(previewUrl);
  };

  const handleClose = () => {
    if (!isLoading) {
      setPreviewUrl(currentAvatar);
      setFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Alterar foto do perfil</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            my: 2,
          }}
        >
          <Avatar
            src={previewUrl}
            alt="Avatar Preview"
            sx={{ width: 150, height: 150, mb: 2 }}
          />

          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={isLoading}
          >
            Enviar imagem
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </Button>

          {file && (
            <Typography variant="caption" sx={{ mt: 1 }}>
              {file.name}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={isLoading || !file}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarUploadModal;
