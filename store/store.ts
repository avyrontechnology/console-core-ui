import { combineReducers, configureStore } from "@reduxjs/toolkit";

import appReducer from "./appSlice";

const rootReducer = combineReducers({
  app: appReducer,
});

export function makeStore() {
  return configureStore({ reducer: rootReducer });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
