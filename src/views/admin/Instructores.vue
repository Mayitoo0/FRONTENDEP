<template>
  <div class="instructores-container">
    <div class="back-button-container">
      <BackButton />
    </div>
    <div class="header-container">
      <header class="text-h2 text-weight-bold text-center">INSTRUCTORES</header>
    </div>

    <div class="stats-container">
      <div class="stats-grid">
        <StatsCard v-for="(stat, index) in stats" :key="index" :title="stat.title" :value="stat.value"
          class="stat-card" />
      </div>
    </div>

    <!-- Mostrar la tabla directamente -->
    <div>
      <div class="search-container">
        <q-input v-model="search" placeholder="Buscar instructor..." outlined dense class="search-input">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select v-model="filtroEstado" :options="opcionesEstado" label="Estado" outlined dense clearable
          class="filter-select" emit-value map-options />

        <q-select v-model="filtroPrograma" :options="opcionesPrograma" label="Programa" outlined dense clearable
          class="filter-select" emit-value map-options />

        <Button1 label="Nuevo Instructor" icon="add" color="#39A900" class="button-nuevo boton-alargado"
          @click="showNuevoInstructorDialog = true" />
      </div>

      <q-table :rows="instructoresFiltrados" :columns="columns" row-key="id" :loading="loading" flat bordered
        :pagination="{ rowsPerPage: 10 }">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.row.status)">
              {{ getStatusLabel(props.row.status) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn flat round color="primary" icon="visibility" size="sm" @click="verDetalle(props.row)"
              class="q-mr-xs">
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
            <q-btn flat round color="warning" icon="edit" size="sm" @click="abrirModalEditar(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="mostrarDetalles" persistent>
        <q-card class="detail-card">
          <q-card-section class="header-section">
            <div class="text-h6">Detalles del Instructor</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-separator />

          <q-card-section v-if="instructorSeleccionado" class="detail-content">
            <div class="row q-col-gutter-md">
              <!-- Información Personal -->
              <div class="col-12 col-md-6">
                <q-card flat bordered class="detail-section">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-bold">Información Personal</div>
                    <div class="q-mt-sm">
                      <div class="text-subtitle2">Nombre Completo</div>
                      <div>{{ instructorSeleccionado.nombre }}</div>
                    </div>
                    <div class="q-mt-md">
                      <div class="text-subtitle2">Documento</div>
                      <div>{{ instructorSeleccionado.tipoDocumento }} {{ instructorSeleccionado.numeroDocumento }}</div>
                    </div>
                    <div class="q-mt-md">
                      <div class="text-subtitle2">Teléfono</div>
                      <div>{{ instructorSeleccionado.telefono }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Información de Contacto -->
              <div class="col-12 col-md-6">
                <q-card flat bordered class="detail-section">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-bold">Información de Contacto</div>
                    <div class="q-mt-sm">
                      <div class="text-subtitle2">Email Institucional</div>
                      <div>{{ instructorSeleccionado.email }}</div>
                    </div>
                    <div class="q-mt-md">
                      <div class="text-subtitle2">Email Personal</div>
                      <div>{{ instructorSeleccionado.emailPersonal }}</div>
                    </div>
                    <div class="q-mt-md">
                      <div class="text-subtitle2">Estado</div>
                      <q-badge :color="getStatusColor(instructorSeleccionado.status)">
                        {{ getStatusLabel(instructorSeleccionado.status) }}
                      </q-badge>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Información Académica -->
              <div class="col-12 col-md-6">
                <q-card flat bordered class="detail-section">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-bold">Información Académica</div>
                    <div class="q-mt-sm">
                      <div class="text-subtitle2">Área de Conocimiento</div>
                      <div>{{ instructorSeleccionado.conocimiento }}</div>
                    </div>
                    <div class="q-mt-md">
                      <div class="text-subtitle2">Área Temática</div>
                      <div>{{ instructorSeleccionado.areaTematica }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Información Laboral -->
              <div class="col-12 col-md-6">
                <q-card flat bordered class="detail-section">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-bold">Información Laboral</div>
                    <div class="q-mt-sm">
                      <div class="text-subtitle2">Tipo de Vinculación</div>
                      <div>{{ instructorSeleccionado.tipoVinculacion || 'No especificado' }}</div>
                    </div>
                    <div class="q-mt-md">
                      <div class="text-subtitle2">Capacidad de Horas</div>
                      <div>{{ instructorSeleccionado.capacidadHoras }} horas</div>
                    </div>
                    <div class="q-mt-md">
                      <div class="text-subtitle2">Horas Trabajadas</div>
                      <div>{{ instructorSeleccionado.horasTrabajadas }} horas</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Aprendices Asignados -->
              <div class="col-12">
                <q-card flat bordered class="detail-section">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-bold">Aprendices Asignados</div>
                    <div class="q-mt-sm">
                      <div class="text-h4">{{ instructorSeleccionado.aprendices }}</div>
                      <div class="text-caption">Total de aprendices</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Fechas -->
              <div class="col-12">
                <q-card flat bordered class="detail-section">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-bold">Información del Sistema</div>
                    <div class="row q-mt-sm q-col-gutter-md">
                      <div class="col-6">
                        <div class="text-subtitle2">Fecha de Registro</div>
                        <div>{{ instructorSeleccionado.fechaCreacion }}</div>
                      </div>
                      <div class="col-6">
                        <div class="text-subtitle2">Última Actualización</div>
                        <div>{{ instructorSeleccionado.fechaActualizacion }}</div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-separator />
          <div class="dialog-buttons q-pa-md">
            <div class="row justify-end buttons-row">
              <Button1 label="Editar" color="primary" icon="edit" style="width: 150px"
                @click="abrirModalEditar(instructorSeleccionado)" />
              <Button1 label="Cerrar" color="grey-7" icon="close" style="width: 150px"
                @click="mostrarDetalles = false" />
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>

    <ModalNuevoInst
      v-model="showNuevoInstructorDialog" 
      :instructor="nuevoInstructor"
      titulo="Nuevo Instructor"
      @accept="mostrarConfirmacionNuevo"
      @cancel="cancelarNuevo" 
    />

    <ModalNuevoInst
      v-model="showEditarInstructorDialog" 
      :instructor="instructorAEditar"
      titulo="Editar Instructor"
      @accept="mostrarConfirmacionEditar"
      @cancel="cancelarEditar" 
    />

    <ConfirmChangesModal
      v-model="showConfirmacionNuevoDialog" 
      :changes="cambiosDetectadosNuevo"
      @confirm="guardarNuevoInstructor"
      @cancel="showConfirmacionNuevoDialog = false" 
    />

    <ConfirmChangesModal
      v-model="showConfirmacionEditarDialog" 
      :changes="cambiosDetectadosEditar"
      @confirm="guardarEdicionInstructor"
      @cancel="showConfirmacionEditarDialog = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { apiClient } from '@/plugins/pluginAxios.js'
import BackButton from '@/components/BackButton.vue'
import StatsCard from '@/components/cards/StatsCard.vue'
import Button1 from '@/components/button-1.vue'
import ConfirmChangesModal from 'src/components/modals/ConfirmChangesModal.vue'
import ModalNuevoInst from 'src/components/modals/ModalNuevoInst.vue'

const $q = useQuasar()

const loading = ref(false)
const error = ref(null)
const stats = ref([
  { title: 'TOTAL INSTRUCTORES', value: 0 },
  { title: 'INSTRUCTORES ACTIVOS', value: 0 },
  { title: 'APRENDICES ASIGNADOS', value: 0 },
  { title: 'INSTRUCTORES CONTRATO TERMINADO', value: 0 }
])
const instructores = ref([])
const aprendices = ref([])

const filtroEstado = ref(null)
const filtroPrograma = ref(null)

const mostrarTabla = ref(false)
const search = ref('')
const mostrarDetalles = ref(false)
const instructorSeleccionado = ref(null)

const showNuevoInstructorDialog = ref(false)
const showConfirmacionNuevoDialog = ref(false)
const cambiosDetectadosNuevo = ref([])

const nuevoInstructor = ref({
  cedula: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  email: '',
  direccion: ''
})

const showEditarInstructorDialog = ref(false)
const showConfirmacionEditarDialog = ref(false)
const cambiosDetectadosEditar = ref([])
const instructorOriginal = ref(null)

const instructorAEditar = ref({
  cedula: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  email: '',
  direccion: ''
})

const opcionesEstado = ref([])
const opcionesPrograma = ref([])

const columns = [
  { name: 'numeroDocumento', align: 'left', label: 'Cédula', field: 'numeroDocumento', sortable: true },
  { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'areaTematica', align: 'left', label: 'Programa', field: 'areaTematica', sortable: true },
  { name: 'aprendices', align: 'center', label: 'Aprendices', field: 'aprendices', sortable: true },
  { name: 'status', align: 'center', label: 'Estado', field: 'status' },
  { name: 'acciones', align: 'center', label: 'Acciones', field: 'acciones' }
]

const instructoresActivos = computed(() => instructores.value.filter(i => i.status === 1))

const instructoresFiltrados = computed(() => {
  let resultado = instructores.value

  if (search.value) {
    const s = search.value.toLowerCase()
    resultado = resultado.filter(i =>
      i.nombre.toLowerCase().includes(s) ||
      i.numeroDocumento.toString().includes(s) ||
      i.email.toLowerCase().includes(s) ||
      (i.areaTematica && i.areaTematica.toLowerCase().includes(s))
    )
  }

  if (filtroEstado.value !== null) {
    resultado = resultado.filter(i => i.status === filtroEstado.value)
  }

  if (filtroPrograma.value) {
    resultado = resultado.filter(i => i.areaTematica === filtroPrograma.value)
  }

  return resultado
})

async function fetchStats() {
  loading.value = true
  try {
    const [instructoresResponse, aprendicesResponse] = await Promise.all([
      apiClient.get('/instructor/listInstructor'),
      apiClient.get('/apprentice/listApprentice')
    ])

    const instructoresArray = instructoresResponse.data.msg || []
    const aprendicesArray = aprendicesResponse.data.msg || []
    aprendices.value = aprendicesArray

    instructores.value = instructoresArray.map(instructor => ({
      id: instructor._id,
      nombre: instructor.name,
      tipoDocumento: instructor.tpdocument,
      numeroDocumento: instructor.numdocument,
      emailPersonal: instructor.emailpersonal,
      email: instructor.email,
      telefono: instructor.phone,
      direccion: instructor.address || '',
      conocimiento: instructor.knowledge,
      areaTematica: instructor.thematicarea || 'Sin programa',
      tipoVinculacion: instructor.bindingtype || 'No especificado',
      capacidadHoras: instructor.caphour || 0,
      horasTrabajadas: instructor.hourswork || 0,
      aprendices: 0,
      status: instructor.status,
      fechaCreacion: new Date(instructor.createdAt).toLocaleDateString(),
      fechaActualizacion: new Date(instructor.updatedAt).toLocaleDateString()
    }))

    generarOpcionesFiltro()

    const activos = instructores.value.filter(i => i.status === 1).length
    const contratoTerminado = instructores.value.filter(i =>
      i.tipoVinculacion.toLowerCase().includes('contrato terminado')
    ).length

    stats.value = [
      { title: 'TOTAL INSTRUCTORES', value: instructores.value.length },
      { title: 'INSTRUCTORES ACTIVOS', value: activos },
      { title: 'APRENDICES ASIGNADOS', value: aprendicesArray.length },
      { title: 'INSTRUCTORES CONTRATO TERMINADO', value: contratoTerminado }
    ]
  } catch (err) {
    console.error('Error al cargar instructores:', err)
    error.value = 'Error al cargar instructores'
  } finally {
    loading.value = false
  }
}

function generarOpcionesFiltro() {
  const estadosUnicos = [...new Set(instructores.value.map(i => i.status))].filter(v => v !== undefined)
  opcionesEstado.value = [
    { label: 'Todos los estados', value: null },
    ...estadosUnicos.map(v => ({
      label: getStatusLabel(v),
      value: v
    }))
  ]

  const programasUnicos = [...new Set(instructores.value.map(i => i.areaTematica).filter(Boolean))]
  opcionesPrograma.value = [
    { label: 'Todos los programas', value: null },
    ...programasUnicos.map(p => ({ label: p, value: p }))
  ]
}

function getStatusLabel(status) {
  switch (status) {
    case 1: return 'Activo'
    case 0: return 'Inactivo'
    default: return 'Desconocido'
  }
}

function getStatusColor(status) {
  return status === 1 ? 'positive' : 'negative'
}

function verDetalle(instructor) {
  instructorSeleccionado.value = instructor
  mostrarDetalles.value = true
}

const limpiarFormularioNuevo = () => {
  nuevoInstructor.value = {
    cedula: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: ''
  }
}

const cancelarNuevo = () => {
  limpiarFormularioNuevo()
  showNuevoInstructorDialog.value = false
}

const mostrarConfirmacionNuevo = () => {
  const campos = [
    { key: 'cedula', label: 'Cédula' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'direccion', label: 'Dirección' }
  ]

  for (const campo of campos) {
    const valor = nuevoInstructor.value[campo.key]
    if (!valor || !valor.trim()) {
      $q.notify({
        type: 'negative',
        message: `Por favor ingrese ${campo.label.toLowerCase()}`,
        position: 'top',
        timeout: 2000
      })
      return
    }
  }

  cambiosDetectadosNuevo.value = campos.map((campo) => ({
    label: campo.label,
    old: '-',
    new: nuevoInstructor.value[campo.key]
  }))

  showNuevoInstructorDialog.value = false
  showConfirmacionNuevoDialog.value = true
}

const guardarNuevoInstructor = () => {
  const nombreCompleto = `${nuevoInstructor.value.nombres} ${nuevoInstructor.value.apellidos}`

  instructores.value.unshift({
    id: Date.now().toString(),
    nombre: nombreCompleto,
    numeroDocumento: nuevoInstructor.value.cedula,
    email: nuevoInstructor.value.email,
    telefono: nuevoInstructor.value.telefono,
    direccion: nuevoInstructor.value.direccion, 
    status: 1,
    fechaCreacion: new Date().toLocaleDateString(),
    fechaActualizacion: new Date().toLocaleDateString()
  })

  $q.notify({
    type: 'positive',
    message: 'Instructor guardado exitosamente',
    position: 'top',
    timeout: 2000
  })

  limpiarFormularioNuevo()
  showConfirmacionNuevoDialog.value = false
}

const abrirModalEditar = (instructor) => {
  mostrarDetalles.value = false
  instructorOriginal.value = instructor

  const nombrePartes = instructor.nombre.split(' ')
  const nombres = nombrePartes.slice(0, Math.ceil(nombrePartes.length / 2)).join(' ')
  const apellidos = nombrePartes.slice(Math.ceil(nombrePartes.length / 2)).join(' ')

  instructorAEditar.value = {
    cedula: instructor.numeroDocumento?.toString() || '',
    nombres,
    apellidos,
    telefono: instructor.telefono || '',
    email: instructor.email || '',
    direccion: instructor.direccion || '' 
  }

  showEditarInstructorDialog.value = true
}

const cancelarEditar = () => {
  instructorAEditar.value = {
    cedula: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: ''
  }
  instructorOriginal.value = null
  showEditarInstructorDialog.value = false
}

const mostrarConfirmacionEditar = () => {
  const campos = [
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'direccion', label: 'Dirección' }
  ]

  for (const campo of campos) {
    const valor = instructorAEditar.value[campo.key]
    if (!valor || !valor.trim()) {
      $q.notify({
        type: 'negative',
        message: `El campo ${campo.label} es obligatorio`,
        position: 'top',
        timeout: 2000,
        icon: 'error'
      })
      return
    }
  }

  const nombreOriginalPartes = instructorOriginal.value.nombre.split(' ')
  const nombresOriginal = nombreOriginalPartes.slice(0, Math.ceil(nombreOriginalPartes.length / 2)).join(' ')
  const apellidosOriginal = nombreOriginalPartes.slice(Math.ceil(nombreOriginalPartes.length / 2)).join(' ')

  const cedulaOriginal = instructorOriginal.value.numeroDocumento?.toString() || ''
  const telefonoOriginal = instructorOriginal.value.telefono || ''
  const emailOriginal = instructorOriginal.value.email || ''
  const direccionOriginal = instructorOriginal.value.direccion || ''

  const hayCambios =
    instructorAEditar.value.cedula.trim() !== cedulaOriginal.trim() ||
    instructorAEditar.value.nombres.trim() !== nombresOriginal.trim() ||
    instructorAEditar.value.apellidos.trim() !== apellidosOriginal.trim() ||
    instructorAEditar.value.telefono.trim() !== telefonoOriginal.trim() ||
    instructorAEditar.value.email.trim() !== emailOriginal.trim() ||
    instructorAEditar.value.direccion.trim() !== direccionOriginal.trim()

  if (!hayCambios) {
    $q.notify({
      type: 'negative',
      message: 'Actualice los datos para continuar',
      position: 'top',
      timeout: 2500,
      icon: 'error'
    })
    return
  }

  cambiosDetectadosEditar.value = campos.map((campo) => ({
    label: campo.label,
    old: instructorOriginal.value[campo.key] || '-',
    new: instructorAEditar.value[campo.key]
  }))

  showEditarInstructorDialog.value = false
  showConfirmacionEditarDialog.value = true
}

const guardarEdicionInstructor = () => {
  const nombreCompleto = `${instructorAEditar.value.nombres} ${instructorAEditar.value.apellidos}`
  const index = instructores.value.findIndex(i => i.id === instructorOriginal.value.id)

  if (index !== -1) {
    instructores.value[index] = {
      ...instructores.value[index],
      nombre: nombreCompleto,
      numeroDocumento: instructorAEditar.value.cedula,
      email: instructorAEditar.value.email,
      telefono: instructorAEditar.value.telefono,
      direccion: instructorAEditar.value.direccion, 
      fechaActualizacion: new Date().toLocaleDateString()
    }
  }

  $q.notify({
    type: 'positive',
    message: 'Instructor actualizado exitosamente',
    position: 'top',
    timeout: 2000
  })

  cancelarEditar()
  showConfirmacionEditarDialog.value = false
}

onMounted(fetchStats)
</script>


<style scoped>
.urgent-section {
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.text-weight-bold {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.button-wide {
  width: 400px;
}

* {
  margin: 0;
  padding: 0;
}

.stats-container {
  padding: 20px;
  width: 100%;
  margin-bottom: 40px;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  justify-items: center;
  align-items: stretch;
}

.stat-card {
  width: 100%;
  height: 100%;
  min-height: 120px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.instructores-container {
  padding: 10px 16px 16px 16px;
}

.header-container {
  margin-top: -20px;
  margin-bottom: 24px;
}

.text-h2 {
  font-size: 3rem !important;
  letter-spacing: 1px;
}

.urgent-cards-container {
  margin-top: 48px;
  padding: 24px;
  background-color: #e3f2fd;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.q-table) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.q-table th) {
  font-weight: bold;
  background: #39A900 !important;
  color: white !important;
}

:deep(.q-table tr:nth-child(even)) {
  background: #f9f9f9;
}

:deep(.q-table td) {
  padding: 8px 16px;
}

:deep(.q-badge) {
  padding: 4px 8px;
  font-size: 0.8em;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  min-width: 250px;
  flex: 1;
  max-width: 400px;
}

.filter-select {
  min-width: 200px;
}

.text-subtitle1 {
  color: #1976d2;
}

.text-subtitle2 {
  color: #666;
  margin-bottom: 4px;
}

.detail-card {
  width: 900px;
  max-width: 90vw;
  max-height: 90vh;
}

.header-section {
  background: #f5f5f5;
  padding: 12px 20px;
}

.detail-content {
  padding: 20px;
  overflow-y: auto;
}

.detail-section {
  height: 100%;
  background: #ffffff;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-buttons {
  background: #f5f5f5;
  border-radius: 0 0 8px 8px;
  padding: 16px 24px;
}

.buttons-row {
  gap: 24px;
}

.dialog-buttons :deep(.q-btn) {
  padding: 8px 0;
}

.volver-container {
  margin-top: 60px;
}

.boton-alargado {
  height: 38px;
  width: 220px;
  font-size: 15px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>