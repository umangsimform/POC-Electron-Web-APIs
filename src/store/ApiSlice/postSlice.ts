import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../@config/axios";
import axios from "axios";
import { InitialStateTypes } from "../../types/store/postSliceTypes";

// Initial state
const initialState: InitialStateTypes = {
  posts: [],
  singlePost: "",
  loading: false,
};

export const fetchUsers = createAsyncThunk(
  "/postSlice/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`users`);
      return response?.data;
    } catch (e: any) {
      if (axios.isCancel(e)) {
        console.log("Request canceled", e.message);
      } else {
        return rejectWithValue(e.response.data);
      }
    }
  }
);

export const getMoreUsers = createAsyncThunk(
  "/postSlice/getMoreUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`users`);
      return response.data;
    } catch (e: any) {
      if (axios.isCancel(e)) {
        console.log("Request canceled", e.message);
      } else {
        return rejectWithValue(e.response.data);
      }
    }
  }
);

export const fetchUsersById = createAsyncThunk(
  "/postSlice/fetchUsersById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    } catch (e: any) {
      if (axios.isCancel(e)) {
        console.log("Request canceled", e.message);
      } else {
        return rejectWithValue(e.response.data);
      }
    }
  }
);

export const addPosts = createAsyncThunk(
  "/postSlice/addPosts",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/posts`, body);
      return response.data;
    } catch (e: any) {
      if (axios.isCancel(e)) {
        console.log("Request canceled", e.message);
      } else {
        return rejectWithValue(e.response.data);
      }
    }
  }
);

export const postSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    setPostStates: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        if ([...action?.payload]?.length > 0) {
          state.posts = action.payload;
          state.loading = false;
        }
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getMoreUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMoreUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state?.posts?.length
          ? [...state.posts, ...action.payload]
          : action.payload;
      })
      .addCase(getMoreUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPostStates } = postSlice.actions;
export default postSlice.reducer;
