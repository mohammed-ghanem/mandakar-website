// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice";
import { contactApi } from "./contact/contactApi";
import { staticPagesApi } from "./staticPages/staticPagesApi";




export const store = configureStore({
  reducer: {
    app: appReducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [staticPagesApi.reducerPath]: staticPagesApi.reducer,
  
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      contactApi.middleware,
      staticPagesApi.middleware,
     
    ),
   
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;