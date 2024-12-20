import { dataContext } from "./data.hook";
import { useUserData, useUserDataEx } from "./users.context.hook";

export interface DataContextI {
  user: useUserDataEx;
}

export function DataProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUserData();

  const value = { user };

  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
}
