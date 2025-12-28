import { createSlice } from "@reduxjs/toolkit";
import { CommonStatesTypes } from "../../types/store/CommonSliceTypes";

const initialState: CommonStatesTypes = {
  headerOpened: false,
  headerMenu: {
    id: 0,
    menuName: "",
    icon: null,
    subMenus: [],
  },
};

export const commonSlice = createSlice({
  name: "commonStates",
  initialState: initialState,
  reducers: {
    setCommonStates: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: () => {},
});

export const { setCommonStates } = commonSlice.actions;
export default commonSlice.reducer;
