import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice";
import { contactApi } from "./contact/contactApi";
import { staticPagesApi } from "./staticPages/staticPagesApi";
import { scholarlyApi } from "./scholarly/scholarlyApi";
import { lecturesApi } from "./lectures/lecturesApi";
import { speechesApi } from "./speeches/speechesApi";
import { fatwasApi } from "./fatwas/fatwasApi";
import { articlesApi } from "./articles/articlesApi";
import { booksApi } from "./books/booksApi";
import { homeApi } from "./home/homeApi";

export const store = configureStore({
  reducer: {
    app: appReducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [staticPagesApi.reducerPath]: staticPagesApi.reducer,
    [scholarlyApi.reducerPath]: scholarlyApi.reducer,
    [lecturesApi.reducerPath]: lecturesApi.reducer,
    [speechesApi.reducerPath]: speechesApi.reducer,
    [fatwasApi.reducerPath]: fatwasApi.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [homeApi.reducerPath]: homeApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      contactApi.middleware,
      staticPagesApi.middleware,
      scholarlyApi.middleware,
      lecturesApi.middleware,
      speechesApi.middleware,
      fatwasApi.middleware,
      articlesApi.middleware,
      booksApi.middleware,
      homeApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
