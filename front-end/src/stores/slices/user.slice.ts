import { createSlice } from "@reduxjs/toolkit";

interface UserJwtData {
  userId: string;
  cpf: string;
  email: string;
  type: string;
}

interface PatientData {
  id?: string;
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pontos?: number;
}

interface UserState {
  auth: UserJwtData | null;
  profile: PatientData | null;
}

const getUserFromLocalStorage = (): UserJwtData | null => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Erro ao obter user do localStorage:", error);
    return null;
  }
};

const initialState: UserState = {
  auth: getUserFromLocalStorage(),
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    logOut: (state) => {
      state.auth = null;
      state.profile = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setAuth, setProfile, logOut } = userSlice.actions;
export default userSlice.reducer;
