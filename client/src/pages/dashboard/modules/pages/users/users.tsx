import "./users.sass";
import { UserTable } from "./components/user-table";
import { useUserDataUDC } from "@/context/data/data.hook";
import { SearchBar } from "./components/searchbar/searchbar";
import { useAuthUC } from "@/context/user/user.hook";
import { NotAuthorized } from "@/components/not-authorized/not-authorized";

export default function DashboardUsers() {
  const { user } = useAuthUC();
  const { allPaginatedUsers } = useUserDataUDC();

  if (!user) return <p>Loading...</p>;
  if (user.role !== "ADMIN") return <NotAuthorized path="/dashboard" />;

  return (
    <div className="dashboard-catalog">
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">BIBLIOTECA</h1>
        <p className="text-gray-400">¡Bienvenido! Administra tus usuarios.</p>
      </section>
      <div className="outer-container bg-secondary-bg rounded-lg p-4 md:p-6">
        <SearchBar />
        <div className="inner-container bg-[#0e0e0e] rounded-lg p-4 md:p-6 mt-4">
          <section className="Catalog-content-section">
            <div className="border-b border-gray-100 py-1">
              <h2 className="text-xl font-bold text-white">Usuarios</h2>
            </div>
            <div className="pt-3">
              {allPaginatedUsers && (
                <UserTable users={allPaginatedUsers.data} />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
