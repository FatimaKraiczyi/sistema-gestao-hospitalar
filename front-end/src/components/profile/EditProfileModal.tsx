/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Address } from "../../types";
import { updateInfo } from "../../services/authenticate/user_service";
import { useDispatch } from "react-redux";
import { setUser } from "../../stores/slices/user.slice";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";

// Definir o tipo de dados das props do componente
interface EditProfileModalProps {
  open: boolean; // Estado de exibição do modal
  onClose: () => void; // Função para fechar o modal
  onSave: (data: any) => void; // Função para salvar as informações
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address | null;
  }; // Dados atuais do usuário
}

// Componente modal para editar informações pessoais
export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  onSave,
  userData,
}) => {
  const dispatch = useDispatch();
  // Gerencia o estado de loading
  const [loading, setLoading] = useState(false);
  // Gerencia o estado do snackbar de notificação
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Valores iniciais do formulário
  const initialValues = {
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || null,
  };

  // Validação do formulário usando Yup
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Tên là bắt buộc")
      .min(2, "Tên phải có ít nhất 2 ký tự"),
    lastName: Yup.string()
      .required("Họ là bắt buộc")
      .min(2, "Họ phải có ít nhất 2 ký tự"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Trường này là bắt buộc"),
    phone: Yup.string()
      .required("Trường này là bắt buộc")
      .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
    // Xác thực địa chỉ đã được loại bỏ theo yêu cầu
  });

  // Xử lý quando o usuário envia o formulário
  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setLoading(true);

    try {
      // Lấy userId từ localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId;

      // Định dạng dữ liệu cho API
      const apiData = {
        ...values,
      };

      if (!userId) {
        throw new Error("User ID not found");
      }
      console.log("API Data:", apiData);
      console.log("User ID:", userId);
      // Gọi API cập nhật thông tin
      const response = await updateInfo(userId, apiData);

      if (response.data && response.data.code === 200) {
        // Sử dụng dữ liệu phản hồi thay vì giá trị form
        const responseData = response.data.data;

        // Tạo đối tượng user cập nhật kết hợp dữ liệu hiện có với phản hồi từ server
        const updatedUser = {
          ...user,
          ...responseData, // Sử dụng dữ liệu phản hồi từ server
        };

        // Cập nhật state cục bộ thông qua callback
        onSave(updatedUser);

        // Cập nhật Redux store
        dispatch(setUser(updatedUser));

        // Lưu vào localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Hiển thị thông báo thành công
        setSnackbar({
          open: true,
          message: "Cập nhật thông tin thành công",
          severity: "success",
        });

        // Đóng modal
        onClose();
      } else {
        throw new Error(
          response.data?.message || "Cập nhật thông tin thất bại"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "Cập nhật thông tin thất bại",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Đóng thông báo snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* Modal chỉnh sửa thông tin cá nhân */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  {/* Trường nhập tên */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Tên"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập họ */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Họ"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập email */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      margin="normal"
                      type="email"
                    />
                  </Grid>
                  {/* Trường nhập số điện thoại */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      margin="normal"
                    />
                  </Grid>

                  {/* Phần nhập địa chỉ */}
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>Địa chỉ</Box>
                  </Grid>

                  {/* Trường nhập số nhà */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Số nhà"
                      name="address.number"
                      value={values.address?.cep || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Grid>

                  {/* Trường nhập phường/xã */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Phường/Xã"
                      name="address.ward"
                      value={values.address?.numero || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập quận/huyện */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Quận/Huyện"
                      name="address.district"
                      value={values.address?.complemento || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                {/* Nút hủy */}
                <Button onClick={onClose} disabled={loading || isSubmitting}>
                  Hủy
                </Button>
                {/* Nút lưu */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Lưu"
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Thông báo kết quả */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
