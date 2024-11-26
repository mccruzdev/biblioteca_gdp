import { createContext, useContext } from "react";
import { LocalStorageEx } from "../../hooks/local-storage";
import { UserContextI } from "./user";
import { useAuthEx } from "./auth.user.hook";

export const userContext = createContext({});

export const useTokenUC = (): LocalStorageEx<string> => {
  return (useContext(userContext) as UserContextI).tokenStore;
};

export const useAuthUC = (): useAuthEx => {
  return (useContext(userContext) as UserContextI).auth;
};
