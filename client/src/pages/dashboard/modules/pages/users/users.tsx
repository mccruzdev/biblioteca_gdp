import { useEffect, useState } from "react";
import "./users.sass";
import { AllDataUserI, PaginatedI } from "../../../../../types";
import { useTokenUC } from "../../../../../context/user/user.hook";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { UserTable } from "../../components/user-table";

export function DashboardUsers() {
  const { data } = useTokenUC();
  const [paginatedUsers, setPaginatedUsers] =
    useState<PaginatedI<AllDataUserI> | null>(null);

  useEffect(() => {
    (async () => {
      if (!data) return;

      const { response, json } = await fetchJSON<PaginatedI<AllDataUserI>>(
        `${BACKEND_SERVER}/user/all`,
        { authorization: data }
      );

      if (response.ok) setPaginatedUsers(json);
    })();
  }, [data]);

  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">BIBLIOTECA</h1>
        <p className="text-gray-400">¡Bienvenido! Administra tus usuarios.</p>
      </section>
      <section className="Catalog-content-section">
        <div className="border-b border-gray-100 py-1">
          <h2 className="text-xl font-bold text-white">Usuarios</h2>
        </div>
        <div className="pt-3">
          {paginatedUsers && <UserTable users={paginatedUsers?.data} />}
        </div>
      </section>
    </>
  );
}
