<template>
  <div class="page-container">
    <!-- Header compacto -->
    <div class="header">
      <q-btn
        flat
        round
        icon="arrow_back"
        color="green-7"
        size="sm"
        @click="handleBack"
      />
      <h1 class="page-title">HORAS POR INSTRUCTOR</h1>
    </div>

    <!-- Tarjeta principal -->
    <div class="main-card">
      <!-- Banner verde con border radius -->
      <div class="banner-verde">
        <h2 class="banner-title">Horas por Instructor</h2>
      </div>

      <!-- Formulario -->
      <div class="form-container">
        <!-- Fila única con ambos campos -->
        <div class="form-row-dual">
          <!-- Campo Instructores -->
          <div class="form-field">
            <label class="field-label">Instructores</label>
            <q-select
              v-model="instructor"
              :options="instructoresOptions"
              label="Seleccionar Instructor"
              outlined
              class="custom-select"
              behavior="menu"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="grey-6" size="20px" />
              </template>
            </q-select>
          </div>

          <!-- Campo Periodo con calendario -->
          <div class="form-field">
            <label class="field-label">Periodo</label>
            <q-input
              v-model="periodo"
              outlined
              placeholder="dd/mm/aa"
              class="custom-input"
              readonly
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" color="grey-6">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="periodo"
                      mask="DD/MM/YYYY"
                      color="green"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="green" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <!-- Campo Tipo de seguimiento (solo) -->
        <div class="form-row-single">
          <div class="form-field">
            <label class="field-label">Tipo de seguimiento</label>
            <q-select
              v-model="tipoSeguimiento"
              :options="tipoSeguimientoOptions"
              label="Seleccionar tipo de seguimiento"
              outlined
              class="custom-select"
              behavior="menu"
            >
              <template v-slot:prepend>
                <q-icon name="assignment" color="grey-6" size="20px" />
              </template>
            </q-select>
          </div>
        </div>

        <!-- Botones centrados -->
        <div class="buttons-container">
          <q-btn
            label="Limpiar"
            class="boton-limpiar"
            unelevated
            no-caps
            @click="handleLimpiar"
          />
          <q-btn
            label="Ver Reporte"
            class="boton-ver-reporte"
            unelevated
            no-caps
            @click="handleVerReporte"
          />
        </div>
      </div>
    </div>

    <!-- Botón flotante de notificaciones -->
    <q-btn
      fab
      icon="notifications"
      color="green"
      class="fab-notificaciones"
      @click="handleNotificaciones"
    >
      <q-badge color="red" floating>3</q-badge>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['back', 'limpiar', 'ver-reporte', 'notificaciones'])

// Estados del formulario
const instructor = ref(null)
const periodo = ref('')
const tipoSeguimiento = ref(null)

// Opciones para los selects (basadas en la imagen 2)
const instructoresOptions = ref([
  'Seleccionar Instructor',
  'Camila Alejandra Gomez',
  'Ana María Martínez',
  'Carmen Elena Vega',
  'Luis Fernando Torres'
])

const tipoSeguimientoOptions = ref([
  'Seguimiento Presencial',
  'Seguimiento Virtual',
  'Seguimiento Telefónico'
])

// Handlers
function handleBack() {
  emit('back')
}

function handleLimpiar() {
  instructor.value = null
  periodo.value = ''
  tipoSeguimiento.value = null
  emit('limpiar')
}

function handleVerReporte() {
  const data = {
    instructor: instructor.value,
    periodo: periodo.value,
    tipoSeguimiento: tipoSeguimiento.value
  }
  emit('ver-reporte', data)
}

function handleNotificaciones() {
  emit('notificaciones')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding: 15px 20px;
  position: relative;
}

/* Header más compacto */
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 0 10px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin: 0;
  letter-spacing: 0.3px;
}

/* Tarjeta principal */
.main-card {
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 100%;
}

/* Banner verde con border radius */
.banner-verde {
  background: linear-gradient(135deg, #5CB85C 0%, #4CAF50 100%);
  padding: 18px 25px;
  text-align: center;
  border-radius: 12px;
  margin: 15px;
}

.banner-title {
  font-size: 22px;
  font-weight: 600;
  color: white;
  margin: 0;
}

/* Contenedor del formulario */
.form-container {
  padding: 50px 80px 50px;
  width: 100%;
  max-width: 100%;
}

/* Fila con dos columnas */
.form-row-dual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 35px;
  margin-bottom: 30px;
  width: 100%;
}

/* Fila con una columna */
.form-row-single {
  width: 100%;
  margin-bottom: 40px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

/* Estilos personalizados para inputs */
:deep(.custom-select .q-field__control),
:deep(.custom-input .q-field__control) {
  border-radius: 8px;
  min-height: 50px;
  font-size: 15px;
  background-color: #FAFAFA;
}

:deep(.custom-select .q-field__native),
:deep(.custom-input .q-field__native) {
  color: #666;
  padding-left: 8px;
}

:deep(.custom-select .q-field__label),
:deep(.custom-input .q-field__label) {
  color: #999;
  font-size: 14px;
}

:deep(.custom-select.q-field--outlined .q-field__control:before),
:deep(.custom-input.q-field--outlined .q-field__control:before) {
  border-color: #D0D0D0;
}

:deep(.custom-select.q-field--focused .q-field__control:before),
:deep(.custom-input.q-field--focused .q-field__control:before) {
  border-color: #5CB85C;
  border-width: 2px;
}

/* Menú desplegable del calendario */
:deep(.q-date) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Botones centrados */
.buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 40px;
}

.boton-limpiar {
  background-color: #ADADAD;
  color: #333;
  border-radius: 12px;
  padding: 11px 35px;
  font-size: 15px;
  font-weight: 600;
  text-transform: none;
  transition: background-color 0.2s ease;
  min-width: 160px;
  height: 44px;
}

.boton-limpiar:hover {
  background-color: #999999;
}

.boton-ver-reporte {
  background-color: #5CB85C;
  color: white;
  border-radius: 12px;
  padding: 11px 35px;
  font-size: 15px;
  font-weight: 600;
  text-transform: none;
  transition: background-color 0.2s ease;
  min-width: 160px;
  height: 44px;
}

.boton-ver-reporte:hover {
  background-color: #4CAF50;
}

/* Botón flotante de notificaciones */
.fab-notificaciones {
  position: fixed;
  bottom: 30px;
  right: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 56px;
  height: 56px;
}

/* Responsive */
@media (max-width: 900px) {
  .form-row-dual {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .form-row-single {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 10px 15px;
  }

  .header {
    padding: 0 5px;
  }

  .page-title {
    font-size: 20px;
  }

  .banner-verde {
    margin: 12px;
    padding: 15px 20px;
  }

  .banner-title {
    font-size: 19px;
  }

  .form-container {
    padding: 25px 20px 30px;
  }

  .buttons-container {
    flex-direction: column;
    gap: 12px;
  }

  .boton-limpiar,
  .boton-ver-reporte {
    width: 100%;
  }

  .fab-notificaciones {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
}
</style>