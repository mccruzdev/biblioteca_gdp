import "./users.sass";
import { UserTable } from "../../components/user-table";
import { useUserDataUDC } from "../../../../../context/data/data.hook";

export function DashboardUsers() {
  const { paginatedUsers } = useUserDataUDC();

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
