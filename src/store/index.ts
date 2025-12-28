import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { persistReducer } from "redux-persist";
import { allPersists } from "./persists";
import authSlice from "./ApiSlice/authSlice";
import postSlice from "./ApiSlice/postSlice";
import commonSlice from "./ApiSlice/commonStates";

const auhtPersister = persistReducer(allPersists.authConfig, authSlice);
const commonPersister = persistReducer(allPersists.commonConfig, commonSlice);
const postsPersister = persistReducer(allPersists.postsConfig, postSlice);

const rootReducer = combineReducers({
  auth: auhtPersister,
  posts: postsPersister,
  common: commonPersister,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
