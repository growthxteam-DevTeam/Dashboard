// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: {
    id: string;
    name: string;
    profilePicture: string | null;
    role: {
      title: string;
    };
    email: string | null;
  } | null;

}

export const ADMIN_ROLE_TITLE = "Admin";

const initialState: AuthState = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user?: AuthState["user"];
      }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
  
    logout: (state) => {
      state.token = null;
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:auth");
        sessionStorage.removeItem("persist:auth");
      }
    },
  },
});

export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.user?.role.title === ADMIN_ROLE_TITLE;

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;


