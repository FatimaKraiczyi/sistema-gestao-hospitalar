import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Shift } from "../../types/shift";
import { useFormik } from "formik";
import * as Yup from "yup";
import { formatTimeFromTimeString } from "../../utils/dateUtils";

// Interface que define as props para o componente ShiftForm
// Permite usar o mesmo formulário para adicionar e editar
interface ShiftFormProps {
  open: boolean; // Estado de exibição do modal
  onClose: () => void; // Função para fechar o modal
  onSubmit: (shift: Partial<Shift>) => void; // Função para submit do formulário
  shift?: Shift | null; // Dados do turno (ao editar)
  mode: "add" | "edit"; // Modo do formulário: adicionar ou editar
}

// Esquema de validação simplificado apenas para o número do turno
const validationSchema = Yup.object({
  shift: Yup.number()
    .required("O número do turno é obrigatório")
    .min(1, "O número do turno deve ser maior que 0"),
});

const ShiftForm: React.FC<ShiftFormProps> = ({
  open,
  onClose,
  onSubmit,
  shift,
  mode,
}) => {
  // Estado para erro de validação de horário
  const [timeError, setTimeError] = useState<string | null>(null);

  // Uso do formik para gerenciar o formulário
  const formik = useFormik({
    initialValues: {
      shift: 0,
      start: "",
      end: "",
      status: true,
      // Campos para gerenciar o valor Date do time picker
      startTime: null as Date | null,
      endTime: null as Date | null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Valida os horários antes de enviar
      if (!validateTimes(values.startTime, values.endTime)) {
        return; // Não envia se a validação falhar
      }

      // Envia com os valores em string
      onSubmit({
        shift: values.shift,
        start: values.start,
        end: values.end,
        status: values.status,
      });
    },
  });

  // Função de validação personalizada para horários
  const validateTimes = (
    startTime: Date | null,
    endTime: Date | null
  ): boolean => {
    setTimeError(null);

    // Se algum horário não estiver definido, não valida ainda
    if (!startTime || !endTime) {
      return true;
    }

    // Verifica se o horário de término é após o de início
    if (endTime <= startTime) {
      setTimeError("O horário de término deve ser após o horário de início");
      return false;
    }

    return true;
  };

  // Efeito para atualizar os valores do formulário ao editar
  useEffect(() => {
    if (shift && mode === "edit") {
      const startTime = parseTimeString(shift.start);
      const endTime = parseTimeString(shift.end);

      formik.setValues({
        shift: shift.shift,
        start: shift.start,
        end: shift.end,
        status: shift.status,
        startTime: startTime,
        endTime: endTime,
      });

      // Valida horários após definir valores
      validateTimes(startTime, endTime);
    } else if (mode === "add") {
      formik.resetForm();
      formik.setValues({
        shift: 0,
        start: "",
        end: "",
        status: true,
        startTime: null,
        endTime: null,
      });
      setTimeError(null);
    }
  }, [shift, mode, open]);

  // Função auxiliar para converter string de horário em Date
  const parseTimeString = (timeStr: string): Date | null => {
    if (!timeStr) return null;

    try {
      const today = new Date();

      if (timeStr.includes(":")) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        today.setHours(hours, minutes, 0, 0);
        return today;
      }

      if (timeStr.includes("-")) {
        return formatTimeFromTimeString(timeStr, "date");
      }

      return today;
    } catch (e) {
      console.error("Erro ao converter string de horário:", timeStr, e);
      return null;
    }
  };

  // Manipula mudanças no horário de início
  const handleStartTimeChange = (newValue: Date | null) => {
    formik.setFieldValue("startTime", newValue);
    // Sincroniza start com startTime
    if (newValue) {
      const timeString = `${String(newValue.getHours()).padStart(
        2,
        "0"
      )}:${String(newValue.getMinutes()).padStart(2, "0")}`;
      formik.setFieldValue("start", timeString);

      // Valida horários sempre que o início muda
      validateTimes(newValue, formik.values.endTime);
    }
  };

  // Manipula mudanças no horário de término
  const handleEndTimeChange = (newValue: Date | null) => {
    formik.setFieldValue("endTime", newValue);
    // Sincroniza endTime e end
    if (newValue) {
      const timeString = `${String(newValue.getHours()).padStart(
        2,
        "0"
      )}:${String(newValue.getMinutes()).padStart(2, "0")}`;
      formik.setFieldValue("end", timeString);

      // Valida horários sempre que o término muda
      validateTimes(formik.values.startTime, newValue);
    }
  };

  // Fecha o modal e reseta o formulário
  const handleClose = () => {
    formik.resetForm();
    setTimeError(null);
    onClose();
  };

  // Define título e texto do botão
  const title =
    mode === "add" ? "Adicionar novo turno" : "Editar informações do turno";
  const buttonText = mode === "add" ? "Adicionar turno" : "Salvar alterações";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="shift"
                label="Número do turno"
                type="number"
                value={formik.values.shift}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.shift && Boolean(formik.errors.shift)}
                helperText={formik.touched.shift && formik.errors.shift}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                  />
                }
                label="Ativo"
              />
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Horário de início"
                  value={formik.values.startTime}
                  onChange={handleStartTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Horário de término"
                  value={formik.values.endTime}
                  onChange={handleEndTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: Boolean(timeError),
                    },
                  }}
                />
                {timeError && (
                  <FormHelperText error>{timeError}</FormHelperText>
                )}
              </Grid>
            </LocalizationProvider>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting || Boolean(timeError)}
          >
            {buttonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShiftForm;
