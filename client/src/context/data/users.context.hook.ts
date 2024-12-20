import { useCallback, useEffect, useState } from "react";
import { AllDataUserI, PaginatedI } from "../../types";
import { useTokenUC } from "../user/user.hook";
import { fetchJSON } from "../../services/fetch";
import { BACKEND_SERVER } from "../../config/api";

export interface useUserDataEx {
  paginatedUsers: PaginatedI<AllDataUserI> | null;
  getUsers: () => Promise<void>;
}

export function useUserData() {
  const { data } = useTokenUC();

  const [paginatedUsers, setPaginatedUsers] =
    useState<PaginatedI<AllDataUserI> | null>(null);

  const getUsers = useCallback(async () => {
    if (!data) return;

    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/user/all`,
      { authorization: data }
    );
    if (response.ok) setPaginatedUsers(json);
  }, [data]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return { paginatedUsers, getUsers };
}
