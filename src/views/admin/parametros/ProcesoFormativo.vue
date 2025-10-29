<template>
  <div class="page-container">
      <BackButton/>
      <h1 class="page-title">PROCESO FORMATIVO</h1>

      <div class="page-content">

    <!-- Bitácoras y Seguimientos -->
    <div class="section-card">
      <div class="section-header">
        Bitácoras y Seguimientos
      </div>
      <div class="section-content">
        
        <div class="form-row">
          <label class="form-label">Máx bitácoras por programa</label>
          <div class="form-input-group">
            <q-select
              v-model="maxLogsPerProgram"
              :options="numberOptions"
              outlined
              dense
              class="custom-select"
            />
            <span class="input-hint">Unidades</span>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Seguimientos - Técnico/Tecnólogo</label>
          <div class="form-input-group">
            <q-select
              v-model="followUpsTechnical"
              :options="numberOptions"
              outlined
              dense
              class="custom-select"
            />
            <span class="input-hint">Obligatorio</span>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Seguimientos - Operario</label>
          <div class="form-input-group">
            <q-select
              v-model="followUpsOperator"
              :options="numberOptions"
              outlined
              dense
              class="custom-select"
            />
            <span class="input-hint">Obligatorio</span>
          </div>
        </div>

      
        <div class="form-actions">
          <q-btn
            label="Guardar Configuración"
            class="save-button"
            unelevated
            @click="openConfirmDialog('bitacoras')"
          />
        </div>
      </div>
    </div>

    <!-- Validaciones y Límites -->
    <div class="section-card">
      <div class="section-header">
        Validaciones y Límites
      </div>
      <div class="section-content">
     
        <div class="form-row">
          <label class="form-label">Máx registros aprendiz-ficha</label>
          <div class="form-input-group">
            <q-select
              v-model="maxRecordsPerStudent"
              :options="numberOptions"
              outlined
              dense
              class="custom-select"
            />
            <span class="input-hint">Etapas EP</span>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Tiempo máx revisión bitácoras</label>
          <div class="form-input-group">
            <q-select
              v-model="maxReviewTime"
              :options="daysOptions"
              outlined
              dense
              class="custom-select"
            />
            <span class="input-hint">Días Hábiles</span>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Límites de tiempo para revisiones</label>
          <div class="form-input-group">
            <q-select
              v-model="reviewTimeLimit"
              :options="timeLimitOptions"
              outlined
              dense
              class="custom-select"
            />
            <span class="input-hint">Día de Alerta</span>
          </div>
        </div>

        <div class="form-actions">
          <q-btn
            label="Guardar Configuración"
            class="save-button"
            unelevated
            @click="openConfirmDialog('validaciones')"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <ModalBase ref="confirmModal">
      <template #header>
        <div class="modal-header-content">
          <div class="text-h6">Estas seguro que quieres guardar los cambios</div>
          <q-btn 
            flat 
            round 
            dense 
            icon="close" 
            color="red"
            @click="closeConfirmDialog"
          />
        </div>
      </template>

      <template #body>
        <div class="modal-body-content">
          <p class="confirmation-text">Guardar Proceso Formativo</p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <BotonIngresar label="Aceptar" @click="saveConfiguration" />
        </div>
      </template>
    </ModalBase>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalBase from 'src/components/modals/modalComponent.vue'
import BotonIngresar from 'src/components/BotonIngresar.vue'
import BackButton from 'src/components/BackButton.vue'

const router = useRouter()

// Referencias
const confirmModal = ref(null)
const currentSection = ref('')

// Valores del formulario - Bitácoras y Seguimientos
const maxLogsPerProgram = ref(13)
const followUpsTechnical = ref(3)
const followUpsOperator = ref(2)

// Valores del formulario - Validaciones y Límites
const maxRecordsPerStudent = ref(3)
const maxReviewTime = ref(5)
const reviewTimeLimit = ref('Configurable')

// Opciones para los selects
const numberOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
const daysOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const timeLimitOptions = ref(['Configurable', 'Fijo', 'Variable'])

// Funciones
const openConfirmDialog = (section) => {
  currentSection.value = section
  confirmModal.value?.openDialog()
}

const closeConfirmDialog = () => {
  confirmModal.value?.closeDialog()
}

const saveConfiguration = () => {
  console.log('Guardando configuración de:', currentSection.value)
  
  // TODO: Aquí va la llamada a la API
  // await api.post('/proceso-formativo/guardar', data)
  
  closeConfirmDialog()
  
  // TODO: Mostrar notificación de éxito
  // $q.notify({ type: 'positive', message: 'Configuración guardada exitosamente' })
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  position: relative;
}

.page-title {
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0 40px 0;
  color: #000;
}

.page-content{
  max-width: 1200px;
  margin: 0 auto;
}

/* Secciones */
.section-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.section-header {
  background: #44b900;
  color: white;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.section-content {
  padding: 25px 20px;
}

/* Formulario */
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 15px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  flex: 1;
  min-width: 200px;
}

.form-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.custom-select {
  width: 120px;
}

.input-hint {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  min-width: 80px;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.save-button {
  background-color: #44b900;
  color: white;
  border-radius: 8px;
  padding: 10px 30px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #3a9d00;
}

/* Modal */
.modal-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.modal-body-content {
  padding: 20px;
  text-align: center;
}

.confirmation-text {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.modal-footer-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Ajustes del modal */
:deep(.q-card) {
  min-width: 400px;
  border-radius: 12px;
}

:deep(.q-card-section) {
  padding: 20px;
}

:deep(.q-card-actions) {
  padding: 20px;
  background: white;
}

/* Responsive */
@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-label {
    min-width: 100%;
    margin-bottom: 10px;
  }
  
  .form-input-group {
    width: 100%;
    justify-content: space-between;
  }
  
  .custom-select {
    flex: 1;
  }
}
</style>