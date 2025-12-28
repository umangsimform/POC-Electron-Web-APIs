import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../@config/axios";

// Initial state
const initialState = {
  user: { username: "", password: "", email: "" },
  isLoggedIn: false,
  loading: false,
};

export const login = createAsyncThunk(
  "/authSlice/login",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`api/login/`, body);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuthStates: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setAuthStates } = authSlice.actions;
export default authSlice.reducer;
