<template>
  <div class="page-content">
     <BackButton/>
    <div class="datos-container">
    <div class="datos-card">
      <div class="datos-header">
        <div class="editar-datos-link" style="cursor:pointer; display: flex; align-items: center; gap: 6px;"
          @click="abrirModalEdicion">
          <q-icon name="edit" size="22px" class="icon-editar" color="grey" />
          <span class="editar-texto" style="color: grey; font-weight: 600; font-size: 1.08rem;">Editar Datos</span>
        </div>
        <h1 class="datos-title">Mis Datos Personales</h1>
      </div>

      <div class="datos-content">
        <div class="datos-info">
          <div class="datos-row">
            <div class="datos-label">Nombre:</div>
            <div class="datos-value datos-gray">{{ usuario?.nombres || '-' }} {{ usuario?.apellidos || '' }}</div>
          </div>
          <div class="datos-row">
            <div class="datos-label">Documento:</div>
            <div class="datos-value datos-gray">{{ usuario?.documento || '-' }}</div>
          </div>
          <div class="datos-row">
            <div class="datos-label">Correo Personal:</div>
            <div class="datos-value datos-gray">{{ usuario?.correo || '-' }}</div>
          </div>
          <div class="datos-row">
            <div class="datos-label">Correo institucional:</div>
            <div class="datos-value datos-gray">{{ usuario?.correoInstitucional || '-' }}</div>
          </div>
        </div>

        <div class="datos-info">
          <div class="datos-row">
            <div class="datos-label">Teléfono:</div>
            <div class="datos-value datos-gray">{{ usuario?.telefono || '-' }}</div>
          </div>
        </div>

        <div class="datos-instructores">
          <div class="datos-label instructores-title">Instructores Asignados</div>
          <div class="instructor-card">
            <div class="instructor-circle"></div>
            <div class="instructor-nombre"></div>
          </div>
          <div class="instructor-card">
            <div class="instructor-circle"></div>
            <div class="instructor-nombre"></div>
          </div>
          <boton-enviar
            label="Contactar"
            unelevated
            @click="abrirModalContactar"
          />
        </div>
      </div>
    </div>

    <!-- Modal de edición de datos -->
    <modal-component ref="modalEdicion">
      <template #header>
        <div class="modal-header-edit">
          <q-icon name="edit" size="32px" color="white" class="q-mr-sm" />
          <div class="text-h5 text-bold" style="color: white">
            Editar Mis Datos
          </div>
        </div>
      </template>

      <div class="edit-content">
        <div class="edit-grid">
          <div class="edit-column">
            <div class="edit-field">
              <div class="field-label">Nombre:</div>
              <q-input v-model="datosEdicion.nombre" outlined dense readonly class="input-readonly" />
            </div>
            <div class="edit-field">
              <div class="field-label">Documento:</div>
              <q-input v-model="datosEdicion.documento" outlined dense readonly class="input-readonly" />
            </div>
            <div class="edit-field">
              <div class="field-label">Correo Personal:</div>
              <q-input v-model="datosEdicion.correo" outlined dense class="input-editable" type="email" />
            </div>
            <div class="edit-field">
              <div class="field-label">Correo Institucional:</div>
              <q-input v-model="datosEdicion.correoInstitucional" outlined dense readonly class="input-readonly" />
            </div>
          </div>

          <div class="edit-column">
            <div class="edit-field">
              <div class="field-label">Número de ficha: *</div>
              <q-input v-model="datosEdicion.ficha" outlined dense class="input-editable" />
            </div>
            <div class="edit-field">
              <div class="field-label">Teléfono: *</div>
              <q-input v-model="datosEdicion.telefono" outlined dense class="input-editable" />
            </div>
            <div class="edit-field">
              <div class="field-label">Programa:</div>
              <q-input v-model="datosEdicion.programa" outlined dense readonly class="input-readonly" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <boton-cerrar @click="cancelarEdicion" />
        <boton-enviar @click="mostrarModalConfirmacion" />
      </template>
    </modal-component>

    <!-- Modal de confirmación -->
    <modal-component ref="modalConfirmacion">
      <template #header>
        <div class="text-h6" style="color: white">Confirmar Cambios</div>
      </template>

      <div style="padding: 16px;">
        <p style="margin-bottom: 16px;">¿Estás de acuerdo con la edición de los cambios realizados?</p>
        
        <div class="changes-summary" v-if="cambiosRealizados.length > 0">
          <div class="text-subtitle2 q-mb-sm text-bold">Cambios detectados:</div>
          <div class="change-item" v-for="cambio in cambiosRealizados" :key="cambio.campo">
            <strong>{{ cambio.campo }}:</strong>
            <span class="old-value">{{ cambio.anterior }}</span> →
            <span class="new-value">{{ cambio.nuevo }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <boton-cerrar @click="cancelarConfirmacion" />
        <boton-enviar @click="confirmarCambios" />
      </template>
    </modal-component>

    <!-- Modal de contacto -->
    <modal-component ref="modalContacto">
      <template #header>
        <div class="text-h6" style="color: white">Contacto Instructor</div>
      </template>

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

      <template #footer>
        <boton-cerrar @click="cerrarModalContacto" />
      </template>
    </modal-component>

    <q-footer reveal class="bg-grey-5 text-black" style="margin-top: 24px;">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <div style="font-size: 0.9rem; font-weight: 500; letter-spacing: 0.5px;">
            REPFORA - Sena 2025 © Todos los derechos reservados
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import modalComponent from 'src/components/modals/modalComponent.vue'
import BotonCerrar from 'src/components/BotonCerrar.vue'
import BotonEnviar from 'src/components/BotonEnviar.vue'
import BackButton from 'src/components/BackButton.vue'

const $q = useQuasar()

const usuario = ref(null)
const modalEdicion = ref(null)
const modalConfirmacion = ref(null)
const modalContacto = ref(null)

const datosEdicion = ref({
  nombre: '',
  documento: '',
  correo: '',
  correoInstitucional: '',
  programa: '',
  ficha: '',
  telefono: '',
})

const datosOriginales = ref({})
const cambiosRealizados = ref([])

const instructores = ref([
  { nombre: 'Cargando...', telefono: '-', correo: '-' }
])

function abrirModalEdicion() {
  datosEdicion.value = {
    nombre: `${usuario.value?.nombres || ''} ${usuario.value?.apellidos || ''}`.trim(),
    documento: usuario.value?.documento || '',
    correo: usuario.value?.correo || '',
    correoInstitucional: usuario.value?.correoInstitucional || '',
    programa: usuario.value?.programa || '',
    ficha: usuario.value?.ficha || '',
    telefono: usuario.value?.telefono || ''
  }

  datosOriginales.value = { ...datosEdicion.value }
  modalEdicion.value.openDialog()
}

function cancelarEdicion() {
  modalEdicion.value.closeDialog()
  datosEdicion.value = {}
  datosOriginales.value = {}
}

function mostrarModalConfirmacion() {
  cambiosRealizados.value = []

  if (datosEdicion.value.correo !== datosOriginales.value.correo) {
    cambiosRealizados.value.push({
      campo: 'Correo personal',
      anterior: datosOriginales.value.correo,
      nuevo: datosEdicion.value.correo
    })
  }

  if (datosEdicion.value.ficha !== datosOriginales.value.ficha) {
    cambiosRealizados.value.push({
      campo: 'Número de ficha',
      anterior: datosOriginales.value.ficha,
      nuevo: datosEdicion.value.ficha
    })
  }

  if (datosEdicion.value.telefono !== datosOriginales.value.telefono) {
    cambiosRealizados.value.push({
      campo: 'Teléfono',
      anterior: datosOriginales.value.telefono,
      nuevo: datosEdicion.value.telefono
    })
  }

  if (cambiosRealizados.value.length === 0) {
    $q.notify({
      type: 'info',
      message: 'No se han realizado cambios',
      position: 'top'
    })
    return
  }

  modalEdicion.value.closeDialog()
  modalConfirmacion.value.openDialog()
}

function cancelarConfirmacion() {
  modalConfirmacion.value.closeDialog()
  modalEdicion.value.openDialog()
}

function confirmarCambios() {
  let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
  let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))

  const usuarioActualizado = {
    ...usuario.value,
    correo: datosEdicion.value.correo,
    ficha: datosEdicion.value.ficha,
    telefono: datosEdicion.value.telefono
  }

  usuario.value = usuarioActualizado

  usuarios = usuarios.map(u =>
    u.documento === usuario.value.documento ?
      usuarioActualizado : u
  )

  localStorage.setItem('usuarios', JSON.stringify(usuarios))
  localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioActualizado))

  modalConfirmacion.value.closeDialog()
  datosEdicion.value = {}
  datosOriginales.value = {}

  $q.notify({
    type: 'positive',
    message: 'Datos actualizados correctamente',
    position: 'top'
  })
}

function abrirModalContactar() {
  modalContacto.value.openDialog()
}

function cerrarModalContacto() {
  modalContacto.value.closeDialog()
}

async function cargarDatosAprendiz() {
  try {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null')

    if (!usuarioLogueado) {
      throw new Error('No hay datos de usuario logueado en localStorage')
    }

    usuario.value = {
      nombres: usuarioLogueado.firstName || '',
      apellidos: usuarioLogueado.lastName || '',
      documento: usuarioLogueado.documentNumber || '',
      tipoDocumento: usuarioLogueado.documentType || '',
      correo: usuarioLogueado.email?.personal || '',
      correoInstitucional: usuarioLogueado.email?.institutional || '',
      telefono: (usuarioLogueado.phone || '').replace(/\r/g, ''),
      ficha: usuarioLogueado.ficha || '-',
      programa: usuarioLogueado.programa || '-'
    }

    $q.notify({
      type: 'positive',
      message: 'Datos cargados desde localStorage',
      position: 'top',
      timeout: 2000
    })
  } catch (error) {
    console.error('❌ No se pudo cargar el usuario desde localStorage:', error)

    usuario.value = {
      nombres: '',
      apellidos: '',
      documento: '',
      correo: '',
      correoInstitucional: '',
      telefono: '',
      ficha: '',
      programa: ''
    }

    $q.notify({
      type: 'negative',
      message: 'No se pudo cargar la información del usuario',
      position: 'top'
    })
  }
}

onMounted(async () => {
  await cargarDatosAprendiz()
  console.log('🧠 Usuario cargado:', usuario.value)
})
</script>

<style scoped>
.page-content {
  padding: 1rem;
}

.datos-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #ffffff;
}

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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.datos-title {
  color: #111;
  font-size: 3.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-align: center;
  letter-spacing: -1px;
  margin-top: 1.5rem;
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
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.datos-info {
  flex: 1 1 300px;
  min-width: 280px;
  max-width: 450px;
  justify-content: center;
}

.datos-row {
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

.datos-instructores {
  flex: 1 1 300px;
  min-width: 280px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.1rem;
  margin-left: 0;
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
  border: 1px solid #D9D9D9;
  padding: 0.4rem 1.2rem 0.4rem 0.4rem;
  margin-bottom: 0.2rem;
  min-width: 180px;
  gap: 0.7rem;
}

.instructor-circle {
  background-color: #39A900;
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.instructor-nombre {
  font-size: 1.1rem;
  color: #222;
  font-weight: 500;
}

.modal-header-edit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.edit-content {
  padding: 24px;
}

.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 16px;
}

.edit-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.input-readonly {
  opacity: 0.6;
}

.input-readonly .q-field__control {
  background-color: #f5f5f5 !important;
  border-color: #e0e0e0 !important;
}

.input-editable .q-field__control {
  border-color: #1976d2 !important;
  background-color: #fff !important;
}

.input-editable .q-field__control:hover {
  border-color: #1565c0 !important;
}

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

.tabla-contenedor {
  overflow-x: auto;
  padding: 16px;
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
  background-color: #f0f0f0;
}

.tabla-instructores td {
  font-weight: 600;
  font-size: 1.1rem;
  color: #777;
  padding: 10px 6px;
  border-top: 1px solid #e0e0e0;
}

.correo-link {
  color: #555;
  text-decoration: underline;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .datos-card {
    padding: 2rem 1rem 2rem 1rem;
  }

  .datos-content {
    gap: 1.2rem;
  }
}

@media (max-width: 900px) {
  .datos-content {
    flex-direction: column;
    gap: 2rem;
  }

  .datos-instructores {
    margin-left: 0;
    align-items: stretch;
  }

  .edit-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .datos-header {
    margin-bottom: 2rem;
  }

  .editar-datos-link {
    position: relative;
    margin-bottom: 8px;
  }

  .datos-title {
    font-size: 2.5rem;
    margin-top: 0.5rem;
  }
}
</style>