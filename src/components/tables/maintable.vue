<script setup>
import { ref } from 'vue'

const props = defineProps({
  datos: {
    type: Array,
    required: true
  },
  columnas: {
    type: Array,
    required: true
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  noDataLabel: {
    type: String,
    default: 'Sin registros'
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 20, 50]
  },
  initialRowsPerPage: {
    type: Number,
    default: 10
  }
})

// Declarar los eventos que emite el componente
const emit = defineEmits(['eliminar', 'descargar', 'visualizar', 'editar'])

// Configuración de paginación interna
const pagination = ref({
  page: 1,
  rowsPerPage: props.initialRowsPerPage
})
</script>

<template>
  <div class="tabla-container">
    <q-table
      :rows="datos"
      :columns="columnas"
      :row-key="rowKey"
      flat
      dense
      separator="none"
      class="custom-table"
      :pagination="pagination"
      :rows-per-page-options="rowsPerPageOptions"
      :no-data-label="noDataLabel"
    >
      <!-- Estado -->
      <template #body-cell-estado="props">
        <q-td :props="props" class="text-center">
          <q-badge
            :color="props.row.estado === 'RECHAZADO' ? 'red' : 'green'"
            :label="props.row.estado"
            class="text-uppercase"
          />
        </q-td>
      </template>

      <!-- Estado con status numérico (0 = Activo, 1 = Inactivo) -->
      <template #body-cell-status="props">
        <q-td :props="props" class="text-center">
          <q-badge
            :color="props.row.status === 0 ? 'green' : 'red'"
            :label="props.row.status === 0 ? 'Activo' : 'Inactivo'"
            class="text-uppercase"
          />
        </q-td>
      </template>
      
      <!-- Acciones por defecto -->
      <template #body-cell-acciones="props">
        <q-td :props="props" class="text-center actions-column">
          <q-btn 
            dense 
            flat 
            round 
            icon="file_download" 
            color="grey-7"
            @click="emit('descargar', props.row)"
          >
            <q-tooltip>Descargar</q-tooltip>
          </q-btn>
          <q-btn 
            dense 
            flat 
            round 
            icon="visibility" 
            color="grey-7"
            @click="emit('visualizar', props.row)"
          >
            <q-tooltip>Visualizar</q-tooltip>
          </q-btn>
          <q-btn 
            dense 
            flat 
            round 
            icon="close" 
            color="grey-7"
            @click="emit('eliminar', props.row)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- Permitir slots personalizados desde el componente padre -->
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </q-table>
  </div>
</template>

<style scoped>
.tabla-container {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin: 35px auto;
  width: 95%;
}

/* ==== Encabezado verde ==== */
:deep(.q-table thead tr th) {
  background-color: #44b900 !important;
  color: white !important;
  font-weight: bold;
  text-align: center;
  border: none !important;
  padding: 10px;
  font-size: 14px;
}

:deep(.q-table thead tr:first-child th:first-child) {
  border-top-left-radius: 10px;
}

:deep(.q-table thead tr:first-child th:last-child) {
  border-top-right-radius: 10px;
}

/* ==== Cuerpo ==== */
:deep(.q-table tbody tr td) {
  text-align: center;
  border: none !important;
  font-size: 13px;
  padding: 10px 8px;
}

:deep(.q-table tbody tr) {
  border: none !important;
  box-shadow: none !important;
}

/* ==== Botones ==== */
:deep(.actions-column .q-btn) {
  margin: 0 5px;
}
</style>