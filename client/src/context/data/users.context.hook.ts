import { useCallback, useEffect, useState } from "react";
import { AllDataUserI, PaginatedI } from "../../types";
import { useTokenUC } from "../user/user.hook";
import { fetchJSON } from "../../services/fetch";
import { BACKEND_SERVER } from "../../config/api";

export interface FilterI {
  value: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: (...args: any[]) => any;
}

export interface useUserDataEx {
  allPaginatedUsers: PaginatedI<AllDataUserI> | null;
  getUsers: () => Promise<void>;
  filters: FilterI[];
}

export function useUserData() {
  const { data } = useTokenUC();

  const [allPaginatedUsers, setAllPaginatedUsers] =
    useState<PaginatedI<AllDataUserI> | null>(null);

  const [filteredUsers, setFilteredUsers] =
    useState<PaginatedI<AllDataUserI> | null>(null);

  const getUsers = useCallback(async () => {
    if (!data) return;

    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/user/all`,
      { authorization: data }
    );
    if (response.ok) {
      setAllPaginatedUsers(json);
      setFilteredUsers(json);
    }
  }, [data]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filterAll = () => {
    setFilteredUsers(allPaginatedUsers);
  };

  const filterDni = async (dni: string) => {
    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/search/user-by-dni/${dni}`,
      { authorization: data }
    );

    if (response.ok) setFilteredUsers(json);
  };

  const filterName = async (name: string) => {
    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/search/user-by-name/${name}`,
      { authorization: data }
    );

    if (response.ok) setFilteredUsers(json);
  };

  const filterLastname = async (lastname: string) => {
    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/search/user-by-lastname/${lastname}`,
      { authorization: data }
    );

    if (response.ok) setFilteredUsers(json);
  };

  const filterPhoneNumber = async (phonenumber: string) => {
    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/search/user-by-phonenumber/${phonenumber}`,
      { authorization: data }
    );

    if (response.ok) setFilteredUsers(json);
  };

  const filterRole = async (role: string) => {
    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/search/user-by-role/${role}`,
      { authorization: data }
    );

    if (response.ok) setFilteredUsers(json);
  };

  const filterEmail = async (email: string) => {
    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/search/user-by-email/${email}`,
      { authorization: data }
    );

    if (response.ok) setFilteredUsers(json);
  };

  const filterEmailVerified = async (emailverified: boolean) => {
    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/search/user-by-emailverified/${
        emailverified ? true : false
      }`,
      { authorization: data }
    );

    if (response.ok) setFilteredUsers(json);
  };

  const filterIsDisabled = async (isdisabled: boolean) => {
    const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
      `${BACKEND_SERVER}/search/user-by-isdisabled/${
        isdisabled ? true : false
      }`,
      { authorization: data }
    );

    if (response.ok) setFilteredUsers(json);
  };

  const filters: FilterI[] = [
    { value: "all", label: "Todo", filter: filterAll },
    { value: "dni", label: "DNI", filter: filterDni },
    { value: "name", label: "Nombre", filter: filterName },
    { value: "lastname", label: "Apellidos", filter: filterLastname },
    { value: "phonenumber", label: "Teléfono", filter: filterPhoneNumber },
    { value: "role", label: "Rol", filter: filterRole },
    { value: "email", label: "Correo", filter: filterEmail },
    {
      value: "emailverified",
      label: "Verificado",
      filter: filterEmailVerified,
    },
    { value: "isdisabled", label: "Habilitado", filter: filterIsDisabled },
  ];

  return { allPaginatedUsers: filteredUsers, getUsers, filters };
}
