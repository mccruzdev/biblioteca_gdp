import { useEffect, useState } from "react";
import { UserI } from "../../types";
import { LocalStorageEx } from "../../hooks/local-storage";
import { fetchJSON } from "../../services/fetch";
import { BACKEND_SERVER } from "../../config/api";

export interface useAuthEx {
  isAuth: boolean | null;
  user: UserI | null;
}

export function useAuth(tokenStorage: LocalStorageEx<string>): useAuthEx {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserI | null>(null);

  useEffect(() => {
    (async () => {
      if (!tokenStorage.data) {
        setIsAuth(false);
        return;
      }

      const { response, json } = await fetchJSON<UserI>(
        `${BACKEND_SERVER}/user/me`,
        { authorization: tokenStorage.data }
      );

      if (response.ok) {
        setIsAuth(true);
        setUser(json);
      } else setIsAuth(false);
    })();
  }, [tokenStorage.data]);

  return { isAuth, user };
}
