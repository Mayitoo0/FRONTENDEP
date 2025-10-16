<template>
  <div class="page-container">
    <h1 class="page-title" style="font-size: 40px; text-align: center;">HORAS INSTRUCTORES</h1>
    <div class="center" style="display: flex; justify-content: center;">
      <div class="table" style="width: 90%;">
        <q-card class="my-card">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6">Configuración</div>
          </q-card-section>

          <q-separator />

          <q-card-section>

            <q-table :columns="columns" :rows="rows" row-key="id" flat dense no-data-label="Sin registros">
              <template v-slot:body-cell-options="props">
                <q-td :props="props">
                  <div>
                    <!-- Btn para editar -->
                    <q-btn icon="edit_square" text-color="grey" @click="openEditModal(props.row)">
                      <q-tooltip anchor="top middle" self="top middle">Editar</q-tooltip>
                    </q-btn>


                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-horas="props">
                <q-td :props="props">{{ props.value }}</q-td>
              </template>

              <template v-slot:body-cell-multiplicador="props">
                <q-td :props="props">{{ props.value }}</q-td>
              </template>

            </q-table>


          </q-card-section>
        </q-card>

        <ModalHoras v-model="showEditModal" :registro="registroEditando" @close="handleCloseModal" />
      </div>
    </div>
  </div>
</template>


<script setup>
import { getData } from 'src/services/apiClient.js';
import { ref, onMounted } from 'vue';
import ModalHoras from 'src/components/modals/modal_horas.vue';


const rows = ref([])
const showEditModal = ref(false)
const registroEditando = ref(null)

function openEditModal(row) {
  registroEditando.value = row
  showEditModal.value = true
}

function handleCloseModal() {
  showEditModal.value = false
  registroEditando.value = null
  getParametersHoursInstructor()
}

const columns = [
  { name: 'name', align: 'center', label: 'Actividad', field: 'name' },
  { name: 'value', align: 'center', label: 'Hora Base', field: 'value' },
  { name: 'description', align: 'center', label: 'Descripción', field: 'description' },
  { name: 'options', align: 'center', label: 'Opciones' }
]


const getParametersHoursInstructor = async () => {
  try {
    const res = await getData("/parameters/filterParameters")
    rows.value = res.data
  } catch (error) {
    console.log(error);
  }
}



onMounted(() => {
  getParametersHoursInstructor()
})













</script>