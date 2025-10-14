<template>
  <!-- Contenedor principal que centra todo el contenido -->
  <div class="datos-container">
    <!-- Tarjeta principal que contiene todos los datos del usuario -->
    <div class="datos-card">
      <!-- Header de la tarjeta principal -->
      <div class="datos-header">

        <!-- Botón para editar datos (esquina superior izquierda) -->
        <div class="editar-datos-link" style="cursor:pointer; display: flex; align-items: center; gap: 6px;"
          @click="abrirModalEdicion">
          <q-icon name="edit" size="22px" class="icon-editar" color="grey" />
          <span class="editar-texto" style="color: grey; font-weight: 600; font-size: 1.08rem;">Editar Datos</span>
        </div>
        <!-- Título principal centrado -->
        <h1 class="datos-title">Mis Datos Personales</h1>
      </div>
      <!-- Contenido principal dividido en tres columnas -->
      <div class="datos-content">

        <!-- Columna 1: Información personal básica -->
        <div class="datos-info">
          <!-- Nombre completo del usuario -->
          <div class="datos-row">
            <div class="datos-label">Nombre:</div>
            <div class="datos-value datos-gray">{{ usuario?.nombres || '-' }} {{ usuario?.apellidos || '' }}</div>
          </div>
          <!-- Número de documento -->
          <div class="datos-row">
            <div class="datos-label">Documento:</div>
            <div class="datos-value datos-gray">{{ usuario?.documento || '-' }}</div>
          </div>
          <!-- Correo electrónico personal -->
          <div class="datos-row">
            <div class="datos-label">Correo Personal:</div>
            <div class="datos-value datos-gray">{{ usuario?.correo || '-' }}</div>
          </div>

          <!-- Correo institucional (solo lectura) -->
          <div class="datos-row">
            <div class="datos-label">Correo institucional:</div>
            <div class="datos-value datos-gray">{{ usuario?.correoInstitucional || '-' }}</div>
          </div>



          <!-- Botón para cambiar contraseña (abre modal) -->

        </div>
        <!-- Columna 2: Información académica y de contacto -->
        <div class="datos-info">

          <!-- Número de ficha del programa -->
          <div class="datos-row">
            <div class="datos-label">Número de ficha:</div>
            <div class="datos-value datos-gray">{{ usuario?.ficha || '-' }}</div>
          </div>

          <!-- Número de teléfono de contacto -->
          <div class="datos-row">
            <div class="datos-label">Teléfono:</div>
            <div class="datos-value datos-gray">{{ usuario?.telefono || '-' }}</div>
          </div>
          <!-- Modalidad de etapa productiva actual -->
          <div class="datos-row">
            <div class="datos-label">Modalidad Activa:</div>
            <div class="datos-value datos-gray">Pasantia</div>
          </div>
          <!-- Estado de la modalidad (con estilo especial si está aprobado) -->
          <div class="datos-row">
            <div class="datos-label">Estado de Modalidad:</div>
            <div class="datos-value datos-aprobado">Aprobado</div>
          </div>
        </div>


        <!-- Columna 3: Instructores asignados y botón de contacto -->
        <div class="datos-instructores">

          <!-- Programa académico -->
          <div class="datos-row">
            <div class="datos-label">Programa:</div>
            <div class="datos-value datos-gray">{{ usuario?.programa || '-' }}</div>
          </div>
          <!-- Título de la sección de instructores -->
          <div class="datos-label instructores-title">Instructores Asignados</div>
          <!-- Tarjeta de instructor 1 -->
          <div class="instructor-card">
            <div class="instructor-circle">CM</div>
            <div class="instructor-nombre">Carlos Mendoza</div>
          </div>
          <!-- Tarjeta de instructor 2 -->
          <div class="instructor-card">
            <div class="instructor-circle">AR</div>
            <div class="instructor-nombre">Ana Rodríguez</div>
          </div>
          <!-- Botón para abrir el modal de contacto -->
          <button-1 label="Contactar" @click="abrirModalContactar" />
        </div>
      </div>
    </div>

    <!-- Modal de edición de datos: Permite al usuario editar su información personal -->
    <ModalEdit v-model="showEditModal" :has-changes="hasChanges" confirm-label="Guardar Cambios"
      @submit="mostrarModalConfirmacion" @cancel="cancelarEdicion">
      <template #title>
        <div class="modal-header-edit">
          <!-- Icono de edición en gris -->
          <q-icon name="edit" size="32px" color="grey" class="q-mr-sm" />
          <!-- Título del modal en verde (#39A900) -->
          <div class="text-h5 text-bold header-title" style="color: black">
            Editar Mis Datos
          </div>
        </div>
      </template>

      <!-- Contenido del formulario de edición -->
      <div class="edit-content">
        <!-- Grid de dos columnas para los campos -->
        <div class="edit-grid">
          <!-- Columna izquierda: Datos personales -->
          <div class="edit-column">
            <!-- Campo Nombre (no editable) -->
            <div class="edit-field">
              <div class="field-label">Nombre:</div>
              <q-input v-model="datosEdicion.nombre" outlined dense readonly class="input-readonly" />
            </div>

            <!-- Campo Documento (no editable) -->
            <div class="edit-field">
              <div class="field-label">Documento:</div>
              <q-input v-model="datosEdicion.documento" outlined dense readonly class="input-readonly" />
            </div>

            <!-- Campo Correo Personal (editable) -->
            <div class="edit-field">
              <div class="field-label">Correo Personal: *</div>
              <q-input v-model="datosEdicion.correo" outlined dense class="input-editable" type="email" />
            </div>

            <!-- Correo Institucional (no editable) -->
            <div class="edit-field">
              <div class="field-label">Correo Institucional:</div>
              <q-input v-model="datosEdicion.programa" outlined dense readonly class="input-readonly" />
            </div>


            <!-- Campo Programa (no editable) -->
            <div class="edit-field">
              <div class="field-label">Programa:</div>
              <q-input v-model="datosEdicion.programa" outlined dense readonly class="input-readonly" />
            </div>
          </div>

          <!-- Columna derecha: Datos académicos y de contacto -->
          <div class="edit-column">
            <!-- Campo Número de ficha (editable) -->
            <div class="edit-field">
              <div class="field-label">Número de ficha: *</div>
              <q-input v-model="datosEdicion.ficha" outlined dense class="input-editable" />
            </div>

            <!-- Campo Teléfono (editable) -->
            <div class="edit-field">
              <div class="field-label">Teléfono: *</div>
              <q-input v-model="datosEdicion.telefono" outlined dense class="input-editable" />
            </div>

            <!-- Campo Modalidad Activa (no editable) -->
            <div class="edit-field">
              <div class="field-label">Modalidad Activa:</div>
              <q-input v-model="datosEdicion.modalidad" outlined dense readonly class="input-readonly" />
            </div>

            <!-- Campo Estado de Modalidad (no editable) -->
            <div class="edit-field">
              <div class="field-label">Estado de Modalidad:</div>
              <q-input v-model="datosEdicion.estadoModalidad" outlined dense readonly class="input-readonly" />
            </div>
          </div>
        </div>

        <div class="edit-note">
          <small></small>
        </div>
      </div>
    </ModalEdit>

    <!-- Modal de confirmación: Se muestra después de editar datos para confirmar los cambios -->
    <ModalConfirm v-model="showConfirmModal" title="Confirmar Cambios"
      message="¿Estás de acuerdo con la edición de los cambios realizados?" confirm-label="Aceptar"
      cancel-label="Cancelar" @confirm="confirmarCambios" @cancel="cancelarConfirmacion">
      <template #content>
        <!-- Resumen de cambios: Muestra la comparación entre valores anteriores y nuevos -->
        <div class="changes-summary" v-if="cambiosRealizados.length > 0">
          <div class="text-subtitle2 q-mb-sm text-bold">Cambios detectados:</div>
          <!-- Lista de cambios con formato "campo: valor_anterior → valor_nuevo" -->
          <div class="change-item" v-for="cambio in cambiosRealizados" :key="cambio.campo">
            <strong>{{ cambio.campo }}:</strong>
            <span class="old-value">{{ cambio.anterior }}</span> →
            <span class="new-value">{{ cambio.nuevo }}</span>
          </div>
        </div>
      </template>
    </ModalConfirm>


    <!-- Footer específico para esta vista -->
    <q-footer reveal class="bg-grey-5 text-black" style="margin-top: 24px;">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <div style="font-size: 0.9rem; font-weight: 500; letter-spacing: 0.5px;">
            REPFORA - Sena 2025 © Todos los derechos reservados
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <!-- Modal de contacto: Permite enviar mensajes a los instructores
        <!-- MODAL CONTACTO INSTRUCTOR -->
    <q-dialog v-model="showContactModal" persistent>
      <q-card class="contact-card">
        <q-card-section class="text-center">
          <div class="titulo-modal">Contacto Instructor</div>

          <div class="tabla-contenedor">
            <table class="tabla-instructores">
              <thead>
                <tr>
                  <th>Nombre:</th>
                  <th>Teléfono:</th>
                  <th>Correo:</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(instructor, index) in instructores" :key="index">
                  <td>{{ instructor.nombre }}</td>
                  <td>{{ instructor.telefono }}</td>
                  <td>
                    <a :href="'mailto:' + instructor.correo" class="correo-link">
                      {{ instructor.correo }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-mt-md">
          <button-1 label="Cerrar" class="btn-cerrar" @click="showContactModal = false" />

        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
// Importaciones necesarias
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'            // Para notificaciones y funcionalidades Quasar
import Button1 from '../../components/button-1.vue'      // Botón personalizado
import ModalButton from '../../components/ModalButton.vue'  // Botón para modales
import ModalEdit from '../../components/modals/modal_edit.vue' // Modal de edición reutilizable
import ModalConfirm from '../../components/modals/modal_confirm.vue' // Modal de confirmación reutilizable

// Hook de Quasar para notificaciones
const $q = useQuasar()

// Datos del usuario actual (cargados desde localStorage)
const usuario = ref(null)

// Variables para el modal de edición de datos
const showEditModal = ref(false)      // Controla visibilidad del modal de edición
const showConfirmModal = ref(false)   // Controla visibilidad del modal de confirmación

// Objeto que contiene los datos en edición
const datosEdicion = ref({
  nombre: '',            // No editable
  documento: '',         // No editable
  correo: '',           // Editable
  programa: '',         // No editable
  ficha: '',           // Editable
  telefono: '',        // Editable
  modalidad: 'Pasantia',      // No editable
  estadoModalidad: 'Aprobado' // No editable
})

// Copia de los datos originales para detectar cambios
const datosOriginales = ref({})

// Array que guarda los cambios detectados para mostrar en confirmación
const cambiosRealizados = ref([])

// Propiedad computada para detectar si hay cambios
const hasChanges = computed(() => {
  if (!datosOriginales.value || !datosEdicion.value) return false

  return datosEdicion.value.correo !== datosOriginales.value.correo ||
    datosEdicion.value.ficha !== datosOriginales.value.ficha ||
    datosEdicion.value.telefono !== datosOriginales.value.telefono
})

const showContactModal = ref(false)

function abrirModalContactar() {
  showContactModal.value = true
}

const instructores = ref([
  { nombre: 'Carlos Mendoza', telefono: '32127368389', correo: 'carlos.gomez@sena.edu.co' },
  { nombre: 'Ana Rodríguez', telefono: '32127368389', correo: 'Ana.rodri@sena.edu.co' }
])



// Funciones para manejo de la edición de datos personales

/**
 * Abre el modal de edición y carga los datos actuales del usuario
 * Los campos no editables se muestran en gris y readonly
 * Los campos editables son: correo, ficha y teléfono
 */
function abrirModalEdicion() {
  // Cargar datos actuales del usuario en el formulario
  datosEdicion.value = {
    nombre: `${usuario.value?.nombres || ''} ${usuario.value?.apellidos || ''}`.trim(),
    documento: usuario.value?.documento || '',
    correo: usuario.value?.correo || '',
    programa: usuario.value?.programa || '',
    ficha: usuario.value?.ficha || '',
    telefono: usuario.value?.telefono || '',
    modalidad: 'Pasantia',
    estadoModalidad: 'Aprobado'
  }

  // Guardar copia de datos originales para detectar cambios
  datosOriginales.value = { ...datosEdicion.value }

  // Mostrar modal de edición
  showEditModal.value = true
}

/**
 * Cancela la edición y limpia los datos del formulario
 */
function cancelarEdicion() {
  showEditModal.value = false
  // Limpiar formularios
  datosEdicion.value = {}
  datosOriginales.value = {}
}

/**
 * Verifica los cambios realizados y muestra el modal de confirmación
 * Solo permite continuar si hay al menos un cambio
 */
function mostrarModalConfirmacion() {
  // Reiniciar lista de cambios
  cambiosRealizados.value = []

  // Detectar cambios en el correo personal
  if (datosEdicion.value.correo !== datosOriginales.value.correo) {
    cambiosRealizados.value.push({
      campo: 'Correo personal',
      anterior: datosOriginales.value.correo,
      nuevo: datosEdicion.value.correo
    })
  }

  // Detectar cambios en la ficha
  if (datosEdicion.value.ficha !== datosOriginales.value.ficha) {
    cambiosRealizados.value.push({
      campo: 'Número de ficha',
      anterior: datosOriginales.value.ficha,
      nuevo: datosEdicion.value.ficha
    })
  }

  // Detectar cambios en el teléfono
  if (datosEdicion.value.telefono !== datosOriginales.value.telefono) {
    cambiosRealizados.value.push({
      campo: 'Teléfono',
      anterior: datosOriginales.value.telefono,
      nuevo: datosEdicion.value.telefono
    })
  }

  // Si no hay cambios, mostrar notificación y no continuar
  if (cambiosRealizados.value.length === 0) {
    $q.notify({
      type: 'info',
      message: 'No se han realizado cambios',
      position: 'top'
    })
    return
  }

  // Ocultar modal de edición y mostrar confirmación
  showEditModal.value = false
  showConfirmModal.value = true
}

/**
 * Vuelve al modal de edición desde la confirmación
 */
function cancelarConfirmacion() {
  showConfirmModal.value = false
  showEditModal.value = true
}

/**
 * Confirma y aplica los cambios realizados en los datos del usuario
 * Actualiza:
 * 1. Estado local (usuario.value)
 * 2. LocalStorage (usuarios y usuarioLogueado)
 * 3. Muestra los datos actualizados
 */
function confirmarCambios() {
  // Obtener datos actuales de localStorage
  let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
  let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))

  // Actualizar el usuario actual con los nuevos datos
  const usuarioActualizado = {
    ...usuario.value,
    correo: datosEdicion.value.correo,  // Solo actualiza el correo personal
    ficha: datosEdicion.value.ficha,
    telefono: datosEdicion.value.telefono
  }

  // Actualizar la variable reactiva para que se refleje en la UI
  usuario.value = usuarioActualizado

  // Actualizar usuario en el array de usuarios
  usuarios = usuarios.map(u =>
    u.documento === usuario.value.documento ?
      usuarioActualizado : u
  )

  // Guardar cambios en localStorage
  localStorage.setItem('usuarios', JSON.stringify(usuarios))
  localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioActualizado))

  // Cerrar modal y mostrar notificación de éxito
  showConfirmModal.value = false

  // Limpiar formularios de edición
  datosEdicion.value = {}
  datosOriginales.value = {}

  $q.notify({
    type: 'positive',
    message: 'Datos actualizados correctamente',
    position: 'top'
  })
}

onMounted(() => {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))

  // Si no tiene correo institucional, generarlo automáticamente
  if (usuarioLogueado && !usuarioLogueado.correoInstitucional) {
    // Generar correo institucional basado en el documento
    usuarioLogueado.correoInstitucional = `${usuarioLogueado.documento}@sena.edu.co`
  }

  usuario.value = usuarioLogueado
})
</script>

<style scoped>
.datos-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #ffffff;
}

/* Aplicar el mismo fondo al contenedor de página de Quasar cuando exista aquí */


.datos-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  max-width: 1520px;
  width: 80vw;
  min-width: 320px;
  min-height: 650px;
  margin: 3rem 0;
  margin-top: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 0;
}

.datos-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 2.5rem;
  margin-top: -1.2rem;
  min-height: 60px;
}

.datos-title {
  color: #111;
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0  1rem 0;
  font-family: SF Pro;
  text-align: center;
  letter-spacing: -1px;
  margin-top: 1.5 rem;
}


.editar-datos-link {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0;
  justify-content: flex-start;
  transition: all 0.3s ease;
}

.editar-datos-link:hover {
  transform: translateY(-2px);
}

.icon-editar {
  color: #1976d2;
}

.editar-texto {
  color: #1976d2;
  font-weight: 600;
  font-size: 1.08rem;
}



.datos-content {
  display: flex;
  gap: 5rem;
  /* Espacio uniforme entre columnas */
  flex-wrap: wrap;
  justify-content: center;
  /* Centra las columnas */
  align-items: flex-start;
  /* Alinea al inicio verticalmente */
}

.datos-info {
  flex: 1 1 300px;
  /* Tamaño uniforme para las 3 columnas */
  min-width: 280px;
  max-width: 450px;
  /* Limita el ancho máximo */
  justify-content: center;
  /* Centra las columnas */
}

.datos-row {
  display: flex;
  align-items: center;
  margin-bottom: 1.1rem;
}

.datos-label {
  font-weight: bold;
  font-size: 1.45rem;
  margin-right: 0.7rem;
}

.datos-value {
  font-size: 1.35rem;
}

.datos-gray {
  color: #b0b0b0;
  font-weight: 500;
}

.datos-aprobado {
  color: #21ba45;
  font-weight: 700;
}

.datos-instructores {
  flex: 1 1 300px;
  /* Mismo tamaño que las otras columnas */
  min-width: 280px;
  max-width: 200px;
  /*aqui se ajusta el lado de la izquierda */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.1rem;
  margin-left: 0;
  /* Elimina el margen izquierdo */
}

.contact-card {
  width: 95%;
  max-width: 650px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
}

.titulo-modal {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
}

.tabla-contenedor {
  overflow-x: auto;
}

.tabla-instructores {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.tabla-instructores th {
  font-weight: 700;
  font-size: 1.05rem;
  padding: 8px;
  color: #000;
}

.tabla-instructores td {
  font-weight: 600;
  font-size: 1.1rem;
  color: #777;
  padding: 10px 6px;
}

.correo-link {
  color: #555;
  text-decoration: underline;
  font-weight: 600;
}

.btn-cerrar {
  background-color: #39A900;
  color: white;
  border-radius: 10px;
  padding: 10px 35px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.instructores-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.instructor-card {
  display: flex;
  align-items: center;
  background: #f6f8fa;
  border-radius: 2rem;
  padding: 0.4rem 1.2rem 0.4rem 0.4rem;
  margin-bottom: 0.2rem;
  min-width: 180px;
  gap: 0.7rem;
}

.instructor-circle {
  background: linear-gradient(135deg, #7ed957 60%, #39c598 100%);
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-right: 0.5rem;
}

.instructor-nombre {
  font-size: 1.1rem;
  color: #222;
  font-weight: 500;
}

.contactar-btn {
  background: #7ed957 !important;
  color: #222 !important;
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
  margin-top: 0.7rem;
  min-width: 160px;
  min-height: 44px;
}

/* Estilos modal de contacto */
.contact-modal {
  max-width: 520px;
  width: 92%;
  border-radius: 14px;
  overflow: hidden;
}

.contact-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #5EB930, #3fa022);
  color: #fff;
  padding: 12px 12px;
}

.contact-header--with-icon {
  gap: 8px;
}

.contact-icon-left {
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-header-center {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.contact-title {
  font-size: 1.15rem;
  font-weight: 700;
  text-align: center;
}

.contact-subtitle {
  display: none;
}

/* Botón de cerrar: círculo blanco en la esquina superior derecha */
.contact-modal {
  position: relative;
}

.contact-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fff !important;
  color: #333 !important;
  min-width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12) !important;
  z-index: 50;
}


.contact-modal .form-row {
  margin-bottom: 12px;
}

.contact-modal .form-row .label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.contact-modal .q-field__control {
  border-radius: 15px;
}

.contact-modal .q-field__native {
  min-height: 110px;
}

.contact-modal .action-buttons .q-btn {
  min-width: 120px;
}

.contact-modal .action-buttons .q-btn--outline {
  border-radius: 15px;
}

.contact-modal .action-buttons .contact-cancel[disabled],
.contact-modal .action-buttons .contact-cancel[aria-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}

.contact-modal .action-buttons .contact-send {
  min-width: 120px;
}

/* Estilos para el contenido del modal de edición (usado con ModalEdit) */

/* Encabezado del modal con título centrado */
.modal-header-edit {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 16px 24px;
}

/* Título en color verde institucional */
.modal-header-edit .header-title {
  color: #39A900;
  /* Verde SENA */
}

/* Línea divisoria verde bajo el título */
.divider-line-edit {
  height: 2px;
  background-color: #39A900;
  /* Verde SENA */
  width: 100%;
  margin-bottom: 24px;
}

/* Contenedor del formulario con padding */
.edit-content {
  padding: 0 24px 24px 24px;
}

/* Grid de 2 columnas para campos del formulario */
.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Dos columnas de igual ancho */
  gap: 24px;
  /* Espacio entre columnas */
  margin-bottom: 16px;
}

/* Columna individual del formulario */
.edit-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* Espacio entre campos */
}

/* Contenedor de cada campo del formulario */
.edit-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* Espacio entre label e input */
}

/* Etiquetas de los campos */
.field-label {
  font-weight: 600;
  /* Semi-bold */
  font-size: 0.95rem;
  color: #333;
}

/* Estilo para campos de solo lectura */
.input-readonly {
  opacity: 0.6;
  /* Efecto visual de deshabilitado */
}

/* Control de campo de solo lectura */
.input-readonly .q-field__control {
  background-color: #f5f5f5 !important;
  /* Fondo gris claro */
  border-color: #e0e0e0 !important;
  /* Borde gris */
}

/* Control de campo editable */
.input-editable .q-field__control {
  border-color: #1976d2 !important;
  /* Borde azul */
  background-color: #fff !important;
  /* Fondo blanco */
}

/* Hover en campos editables */
.input-editable .q-field__control:hover {
  border-color: #1565c0 !important;
  /* Azul más oscuro al hover */
}

/* Nota informativa bajo el formulario */
.edit-note {
  text-align: center;
  color: #666;
  /* Gris medio */
  font-style: italic;
  margin-top: 16px;
}

/* Estilo común para botones del footer (ya no se usa - el ModalEdit maneja los botones) */
.footer-btn {
  min-width: 120px;
  /* Ancho mínimo del botón */
  font-weight: 600;
  /* Semi-bold */
  border-radius: 8px;
  /* Bordes redondeados */
  padding: 8px 24px;
}

/* Estilos específicos para el resumen de cambios (usado en ModalConfirm) */
.changes-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  width: 100%;
  border-left: 4px solid #1976d2;
}

.change-item {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.old-value {
  color: #d32f2f;
  text-decoration: line-through;
}

.new-value {
  color: #2e7d32;
  font-weight: 600;
}

/* Estilos para el modal de cambio de contraseña */

/* Contenedor principal del modal de contraseña */
.password-modal {
  max-width: 600px;
  width: 100%;
  border: 2px solid #5EB930;
  /* Borde verde SENA */
  border-radius: 16px;
  background: #fff;
}

/* Icono de candado en el header */
.lock-icon {
  font-size: 56px;
  /* Icono grande para énfasis */
  color: #888;
  /* Gris neutro */
}

/* Campos de entrada con borde verde */
.input-green .q-field__control {
  border-color: #5EB930 !important;
  /* Verde SENA */
  border-radius: 8px;
}

/* Botón de confirmación de cambio de contraseña */
.confirm-btn {
  width: 100%;
  /* Botón de ancho completo */
  min-width: 180px;
  font-size: 1.1rem;
  /* Texto más grande */
  font-weight: bold;
  /* Negrita para énfasis */
  border-radius: 8px;
  padding: 12px 0;
  display: block;
  margin: 0 auto;
}

/* Lista de requisitos de contraseña */
.requisitos-lista {
  text-align: left;
  /* Alineación a la izquierda */
  margin: 0.5em 0 0 0;
  /* Margen superior */
  padding-left: 1.2em;
  /* Sangría para viñetas */
}


.modal-card {
  min-width: 700px;
  max-width: 90vw;
  border-radius: 8px;
  padding: 16px;
}

.modal-header {
  margin-bottom: 16px;
}

.modal-title {
  color: #5eb930;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  margin-bottom: 8px;
}

.divider-line {
  height: 1px;
  background-color: rgb(173, 173, 173);
  width: 100%;
}

.table-container {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.history-table thead {
  background-color: #5eb930;
  color: white;
}

.history-table th {
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border: 1px solid #ddd;
}

.history-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.history-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.modal-footer {
  text-align: right;
}

.cambiar-contrasena-btn {
  color: grey !important;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: none;
  margin-left: 0;
  margin-top: 0.2rem;
  background: transparent !important;
  transition: color 0.2s;
}

.cambiar-contrasena-btn .q-icon {
  color: grey !important;
  margin-right: 6px;
}

.cambiar-contrasena-btn:hover {
  color: grey !important;
}

/* Diseño Responsivo */

/* Pantallas grandes (hasta 1200px) */
@media (max-width: 1200px) {

  /* Ajustar padding de la tarjeta principal */
  .datos-card {
    padding: 2rem 1rem 2rem 1rem;
    /* Reducir padding horizontal */
  }

  /* Reducir espacio entre elementos */
  .datos-content {
    gap: 1.2rem;
  }
}

/* Tablets y pantallas medianas (hasta 900px) */
@media (max-width: 900px) {

  /* Cambiar layout a una columna */
  .datos-content {
    flex-direction: column;
    gap: 2rem;
  }

  /* Ajustar sección de instructores */
  .datos-instructores {
    margin-left: 0;
    /* Eliminar margen izquierdo */
    align-items: stretch;
    /* Extender elementos al ancho completo */
  }

  /* Modal de edición a una columna */
  .edit-grid {
    grid-template-columns: 1fr;
    /* Una sola columna */
    gap: 16px;
  }
}

/* Móviles y pantallas pequeñas (hasta 600px) */
@media (max-width: 600px) {

  /* Ajustar espaciado del header */
  .datos-header {
    margin-bottom: 2rem;
  }

  /* Reposicionar enlaces de edición */
  .editar-datos-link {
    position: relative;
    /* Quitar posición absoluta */
    margin-bottom: 8px;
    /* Agregar espacio entre enlaces */
  }

  /* Reducir tamaño del título */
  .datos-title {
    font-size: 2.5rem;
    /* Título más pequeño */
    margin-top: 0.5rem;
  }
}
</style>