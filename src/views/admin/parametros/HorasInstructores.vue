<template>
  <div class="page-container">
    <BackButton />
    <h1 class="page-title" style="font-size: 40px; text-align: center;">HORAS INSTRUCTORES</h1>
    
    <maintable 
      :datos="rows" 
      :columnas="columns" 
      row-key="id"
      no-data-label="Sin registros"
      :rows-per-page-options="[5, 10, 20, 50]"
      :initial-rows-per-page="10"
    >
      <!-- Slot personalizado para las opciones -->
      <template #body-cell-options="props">
        <q-td :props="props" class="text-center">
          <q-btn 
            dense 
            flat 
            round 
            icon="edit_square" 
            color="grey-7"
            @click="openEditModal(props.row)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </maintable>

    <modalComponent ref="editModalRef">
      <template #header>
        <div class="text-h6">Editar Hora Instructor</div>
      </template>
      <template #body>
        <h1 style="font-size: 20px; margin-bottom: 15px;">{{ registroEditando?.name }}</h1>
        <q-input outlined v-model="localValue" label="Hora Base" />
      </template>
      <template #footer>
        <ModalButton type="cancel" label="Cancelar" @click="closeEditModal" />
        <ModalButton type="confirm" label="Editar" @click="showConfirmModal = true" />
      </template>
    </modalComponent>

    <ModalConfirm 
      v-model="showConfirmModal" 
      title="Confirmar cambios"
      message="¿Estás seguro de guardar los cambios?" 
      confirmLabel="Guardar" 
      cancelLabel="Cancelar"
      @confirm="handleConfirm" 
      @cancel="showConfirmModal = false" 
    />
  </div>
</template>


<script setup>
import BackButton from 'src/components/BackButton.vue';
import { getData, putData } from 'src/services/apiClient.js';
import { ref, onMounted } from 'vue';
import modalComponent from 'src/components/modals/modalComponent.vue';
import maintable from 'src/components/tables/maintable.vue';



const rows = ref([])
const editModalRef = ref(null)
const registroEditando = ref(null)
const localValue = ref('')
const showConfirmModal = ref(false)

function openEditModal(row) {
  registroEditando.value = row
  localValue.value = row.value
  editModalRef.value.openDialog()
}

function closeEditModal() {
  editModalRef.value.closeDialog()
  registroEditando.value = null
  localValue.value = ''
}

async function handleConfirm() {
  try {
    const id = registroEditando.value?._id
    await putData(`/parameters/updateParameter/${id}`, {
      value: localValue.value
    })
    console.log('✅ Actualizado correctamente')
    showConfirmModal.value = false
    closeEditModal()
    await getParametersHoursInstructor()
  } catch (error) {
    console.error('❌ Error al actualizar:', error)
  }
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

<style scoped>
.page-container{
  padding: 1rem;
}
</style>