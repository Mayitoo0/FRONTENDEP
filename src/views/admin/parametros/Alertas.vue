<template>
  <div class="page-container">

    <BackButton/>
      <h1 class="page-title">ALERTAS</h1>
    
      <div class="page-content">
    <h2 class="page-subtitle">Alertas de Vencimiento de Fichas</h2>

    <!-- Configuración de Fichas -->
    <div class="section-card">
      <div class="section-header">
        Configuración de Fichas
      </div>
      <div class="section-content">
        <div class="config-row">
          <div class="config-label-group">
            <div class="config-label">Fichas nuevas (post noviembre 2024)</div>
            <div class="config-sublabel">Tiempo límite sin registrar etapa productiva</div>
          </div>
          <div class="config-input-group">
            <q-select
              v-model="newRecordsTime"
              :options="monthOptions"
              outlined
              dense
              class="custom-select"
            />
            <span class="input-hint">Mes</span>
          </div>
        </div>

        <div class="config-row">
          <div class="config-label-group">
            <div class="config-label">Fichas antiguas (pre noviembre 2024)</div>
            <div class="config-sublabel">Tiempo límite sin registrar etapa productiva</div>
          </div>
          <div class="config-input-group">
            <q-select
              v-model="oldRecordsTime"
              :options="yearOptions"
              outlined
              dense
              class="custom-select"
            />
            <span class="input-hint">Año</span>
          </div>
        </div>
      </div>

    <!-- Alertas Escalonadas -->
   
      <div class="section-header">
        Alertas Escalonadas
      </div>
      <div class="section-content">
        <!-- Alerta Amarilla -->
        <div class="alert-box alert-yellow">
          <div class="alert-content">
            <div class="alert-label-group">
              <div class="alert-title">Amarilla</div>
              <div class="alert-subtitle">Primera notificación preventiva</div>
            </div>
            <div class="alert-input-group">
              <q-select
                v-model="yellowAlertDays"
                :options="daysOptions"
                outlined
                dense
                class="alert-select"
              />
              <span class="alert-hint">días antes del vencimiento</span>
            </div>
          </div>
        </div>

        <!-- Alerta Naranja -->
        <div class="alert-box alert-orange">
          <div class="alert-content">
            <div class="alert-label-group">
              <div class="alert-title">Naranja</div>
              <div class="alert-subtitle">Notificación de atención urgente</div>
            </div>
            <div class="alert-input-group">
              <q-select
                v-model="orangeAlertDays"
                :options="daysOptions"
                outlined
                dense
                class="alert-select"
              />
              <span class="alert-hint">días antes del vencimiento</span>
            </div>
          </div>
        </div>

        <!-- Alerta Roja -->
        <div class="alert-box alert-red">
          <div class="alert-content">
            <div class="alert-label-group">
              <div class="alert-title">Roja</div>
              <div class="alert-subtitle">Notificación crítica inmediata</div>
            </div>
            <div class="alert-input-group">
              <q-select
                v-model="redAlertDays"
                :options="daysOptions"
                outlined
                dense
                class="alert-select"
              />
              <span class="alert-hint">días antes del vencimiento</span>
            </div>
          </div>
        </div>

        <!-- Botón Guardar -->
        <div class="form-actions">
          <q-btn
            label="Guardar Configuración"
            class="save-button"
            unelevated
            @click="openConfirmDialog('escalated')"
          />
        </div>
      </div>
    </div>

    <!-- Alertas de Proceso -->
    <h2 class="page-subtitle">Alertas de Proceso</h2>
    
    <div class="section-card">
        <div class="section-header">
          Configuración de Fichas
        </div>
        <div class="section-content">
        <!-- Alerta de bitácora pendiente -->
        <div class="process-row">
          <div class="process-label-group">
            <div class="process-label">Alerta de bitácora pendiente</div>
            <div class="process-sublabel">Notificar cuando una bitácora está próxima a vencer</div>
          </div>
          <div class="process-input-group">
            <q-select
              v-model="pendingLogAlert"
              :options="daysOptions"
              outlined
              dense
              class="process-select"
            />
            <span class="process-hint">días antes</span>
            <q-toggle
              v-model="pendingLogAlertEnabled"
              color="green"
            />
          </div>
        </div>

        <!-- Alerta de seguimiento pendiente -->
        <div class="process-row">
          <div class="process-label-group">
            <div class="process-label">Alerta de seguimiento pendiente</div>
            <div class="process-sublabel">Notificar cuando un seguimiento está próximo a vencer</div>
          </div>
          <div class="process-input-group">
            <q-select
              v-model="pendingFollowUpAlert"
              :options="daysOptions"
              outlined
              dense
              class="process-select"
            />
            <span class="process-hint">días antes</span>
            <q-toggle
              v-model="pendingFollowUpAlertEnabled"
              color="green"
            />
          </div>
        </div>

        <!-- Alerta crítica último seguimiento -->
        <div class="process-row">
          <div class="process-label-group">
            <div class="process-label">Alerta crítica último seguimiento</div>
            <div class="process-sublabel">Notificación crítica para el último seguimiento programado</div>
          </div>
          <div class="process-input-group">
            <q-select
              v-model="criticalFollowUpAlert"
              :options="daysOptions"
              outlined
              dense
              class="process-select"
            />
            <span class="process-hint">días antes</span>
            <q-toggle
              v-model="criticalFollowUpAlertEnabled"
              color="green"
            />
          </div>
        </div>

        <!-- Tiempo para revisión por instructor -->
        <div class="process-row">
          <div class="process-label-group">
            <div class="process-label">Tiempo para revisión por instructor</div>
            <div class="process-sublabel">Tiempo límite y alerta para revisiones de instructor</div>
          </div>
          <div class="process-input-group">
            <q-select
              v-model="instructorReviewTime"
              :options="daysOptions"
              outlined
              dense
              class="process-select"
            />
            <span class="process-hint">días antes</span>
            <q-toggle
              v-model="instructorReviewTimeEnabled"
              color="green"
            />
          </div>
        </div>

        <!-- Botón Guardar -->
        <div class="form-actions">
          <q-btn
            label="Guardar Configuración"
            class="save-button"
            unelevated
            @click="openConfirmDialog('process')"
          />
        </div>
    </div>

    <!-- Modal de Confirmación -->
    <ModalBase ref="confirmModal">
      <template #header>
        <div class="modal-header-content">
          <div class="text-h6">Estas seguro que quieres guardar el cambio</div>
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
          <p class="confirmation-text">Guardar Alertas</p>
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

// Configuración de Fichas
const newRecordsTime = ref(6)
const oldRecordsTime = ref(2)

// Alertas Escalonadas
const yellowAlertDays = ref(30)
const orangeAlertDays = ref(15)
const redAlertDays = ref(7)

// Alertas de Proceso
const pendingLogAlert = ref(7)
const pendingLogAlertEnabled = ref(true)
const pendingFollowUpAlert = ref(7)
const pendingFollowUpAlertEnabled = ref(true)
const criticalFollowUpAlert = ref(7)
const criticalFollowUpAlertEnabled = ref(true)
const instructorReviewTime = ref(4)
const instructorReviewTimeEnabled = ref(true)

// Opciones para los selects
const monthOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
const yearOptions = ref([1, 2, 3, 4, 5])
const daysOptions = ref([1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 45, 60])

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
  closeConfirmDialog()
}
</script>

<style scoped>
.page-container {
 padding: 20px 20px 50px 20px;
 position: relative;
}

.page-content{
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0 40px 0;
  color: #000;
}

.page-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

/* Secciones */
.section-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px 20px; 
  overflow: hidden;
}

.section-header {
  background: #44b900;
  color: white;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  border-radius: 10px;
}

.section-header-secondary {
  background: transparent;
  color: #333;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
}

.section-content {
  padding: 25px 20px;
}

.section-content-secondary {
  padding: 0 20px 25px 20px;
}

/* Configuración de Fichas */
.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  gap: 20px;
}

.config-label-group {
  flex: 1;
}

.config-label {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 5px;
}

.config-sublabel {
  font-size: 12px;
  color: #666;
}

.config-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-select {
  width: 100px;
}

.input-hint {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

/* Alertas Escalonadas */
.alert-box {
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 6px solid;
}

.alert-yellow {
  background-color: #fff9e6;
  border-left-color: #ffd700;
}

.alert-orange {
  background-color: #fff4e6;
  border-left-color: #ff8c00;
}

.alert-red {
  background-color: #ffe6e6;
  border-left-color: #ff0000;
}

.alert-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.alert-label-group {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  font-weight: 700;
  color: #000;
  margin-bottom: 3px;
}

.alert-subtitle {
  font-size: 11px;
  color: #666;
}

.alert-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-select {
  width: 80px;
}

.alert-hint {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
}

/* Alertas de Proceso */
.process-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  gap: 15px;
}

.process-label-group {
  flex: 1;
}

.process-label {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 3px;
}

.process-sublabel {
  font-size: 11px;
  color: #666;
}

.process-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.process-select {
  width: 80px;
}

.process-hint {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
}

/* Acciones */
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
  .config-row,
  .alert-content,
  .process-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .alert-input-group,
  .process-input-group {
    width: 100%;
    justify-content: space-between;
  }
}
</style>