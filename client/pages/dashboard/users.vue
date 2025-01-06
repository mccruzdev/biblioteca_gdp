<script setup lang="ts">
import ActionsDropdown from "~/features/dashboard/components/actions-dropdown.vue";
import Searchbar from "~/features/dashboard/components/searchbar.vue";
import { MIN_WIDTH_SCREEN_FOR_TABLE } from "~/features/dashboard/constants";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import { useUsersPage } from "~/features/dashboard/users/users.composable";
import { UserRoleE } from "~/types";

const {
  isNotAuthorized,
  selectedFilter,
  filters,
  searchInput,
  handleFilter,
  paginatedUsers,
  columns,
  items,
  currentPage,
  limitPerPage,
  width,
  showEditModal,
  editFormData,
  handleAcceptEdit,
} = useUsersPage();
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Usuarios</template>
    <template #description> Administra tus usuarios </template>
    <template #title-table>Usuarios</template>

    <template #search>
      <Searchbar
        v-model:input="searchInput"
        v-model:filter="selectedFilter"
        :filters="filters"
        @handle-filter="handleFilter"
      />
    </template>

    <template v-if="width < MIN_WIDTH_SCREEN_FOR_TABLE">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="row in paginatedUsers?.data"
          :key="row.id"
          class="bg-gray-800 rounded-lg p-4 shadow"
        >
          <div class="text-white text-lg font-bold">
            {{ row.names }} {{ row.lastName }}
          </div>
          <div class="text-white text-sm">
            <p><strong>ID:</strong> {{ row.id }}</p>
            <p><strong>DNI:</strong> {{ row.dni }}</p>
            <p><strong>Teléfono:</strong> {{ row.phoneNumber }}</p>
            <p>
              <strong>Rol:</strong>
              {{
                row.role === "ADMIN"
                  ? "ADMINISTRADOR"
                  : row.role === "LIBRARIAN"
                  ? "BIBLIOTECARIO"
                  : "LECTOR"
              }}
            </p>
            <p><strong>Email:</strong> {{ row.email }}</p>
            <p>
              <strong>Verificado:</strong>
              {{ row.emailVerified ? "✅" : "❌" }}
            </p>
            <p>
              <strong>Deshabilitado:</strong>
              {{ row.isDisabled ? "❌" : "✅" }}
            </p>
          </div>
          <div class="mt-4">
            <ActionsDropdown :items="items" :row="row" />
          </div>
        </div>
      </div>
      <div v-if="!paginatedUsers || !paginatedUsers.data" class="text-center py-6">
        <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 mx-auto" />
        <span class="text-white">No hay resultados</span>
      </div>
    </template>

    <UTable
      :loading="paginatedUsers === undefined || !paginatedUsers.data"
      :columns="columns"
      :rows="paginatedUsers?.data"
      v-else
    >
      <template #id-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #dni-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #names-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #lastName-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #phoneNumber-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #role-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #email-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #emailVerified-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #isDisabled-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #actions-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>

      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8" />
          <span class="text-white">No hay resultados</span>
        </div>
      </template>

      <template #loading-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <UIcon name="i-mdi-light-refresh" class="w-8 h-8 animate-spin" />
          <span class="text-white">Cargando...</span>
        </div>
      </template>

      <template #id-data="{ row }">
        <span class="text-white text-left">{{ row.id }}</span>
      </template>
      <template #dni-data="{ row }">
        <span class="text-white text-left">{{ row.dni }}</span>
      </template>
      <template #names-data="{ row }">
        <span class="text-white text-left">{{ row.names }}</span>
      </template>
      <template #lastName-data="{ row }">
        <span class="text-white text-left">{{ row.lastName }}</span>
      </template>
      <template #phoneNumber-data="{ row }">
        <span class="text-white text-left">{{ row.phoneNumber }}</span>
      </template>
      <template #role-data="{ row }">
        <span class="text-white text-left">{{
          row.role === "ADMIN"
            ? "ADMINISTRADOR"
            : row.role === "LIBRARIAN"
            ? "BIBLIOTECARIO"
            : "LECTOR"
        }}</span>
      </template>
      <template #email-data="{ row }">
        <span class="text-white text-left">{{ row.email }}</span>
      </template>
      <template #emailVerified-data="{ row }">
        <span class="text-white text-left">{{ row.emailVerified ? "✅" : "❌" }}</span>
      </template>
      <template #isDisabled-data="{ row }">
        <span class="text-white text-left">{{ row.isDisabled ? "❌" : "✅" }}</span>
      </template>
      <template #actions-data="{ row }">
        <ActionsDropdown :items="items" :row="row" />
      </template>
    </UTable>

    <template #current-page>{{ currentPage }}</template>
    <template #total-pages>{{ paginatedUsers?.lastPage }}</template>

    <template #pagination v-if="paginatedUsers">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedUsers.total"
        :size="width <= 360 ? '2xs' : width <= 450 ? 'xs' : 'sm'"
      />
    </template>
    <template #select-limit-per-page>
      <USelect
        v-model="limitPerPage"
        :options="[
          { value: 10, label: 'Mostrar 10' },
          { value: 20, label: 'Mostrar 20' },
          { value: 30, label: 'Mostrar 30' },
          { value: 40, label: 'Mostrar 40' },
          { value: 50, label: 'Mostrar 50' },
        ]"
      ></USelect>
    </template>

    <template #modals>
      <Modal v-model="showEditModal" @handle-accept="handleAcceptEdit">
        <template #header-title>Editar Usuario</template>
        <template #header-description> Modifica el rol e inabilita usuarios. </template>

        <USelect
          v-model="editFormData.role"
          :options="[
            { value: UserRoleE.READER, label: 'Lector' },
            { value: UserRoleE.LIBRARIAN, label: 'Bibliotecario' },
            { value: UserRoleE.ADMIN, label: 'Administrador' },
          ]"
        />
        <USelect
          v-model="editFormData.isDisabled"
          :options="[
            { value: 'false', label: 'Habilitado' },
            { value: 'true', label: 'Inhabilitado' },
          ]"
        />
      </Modal>
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
