import { createContext, useContext } from "react";
import { DataContextI } from "./data";

export const dataContext = createContext({});

export const useUserDataUDC = () => {
  return (useContext(dataContext) as DataContextI).user;
};
