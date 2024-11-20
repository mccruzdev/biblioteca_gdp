import { LocalStorageEx, useLocalStorage } from "../../hooks/local-storage";
import { useAuth, useAuthEx } from "./auth.user.hook";
import { userContext } from "./user.hook";

export interface UserContextI {
  tokenStore: LocalStorageEx<string>;
  auth: useAuthEx;
}

export function UserProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tokenStore = useLocalStorage<string>({ key: "gdp-bm", initial: null });
  const auth = useAuth(tokenStore);

  const value: UserContextI = { tokenStore, auth };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}
