<template>
  <div class="instructores-container">
    <!-- Encabezado con botón de regreso y título -->
    <div class="header-container">
      <!-- El botón solo aparece cuando no hay ningún modal abierto -->
      <BackButton/>
      <header class="text-h2 text-weight-bold text-center">INSTRUCTORES</header>
    </div>

    <!-- Tarjetas de estadísticas generales -->
    <div class="stats-container">
      <div class="stats-grid">
        <!-- Recorremos el array de estadísticas para mostrar cada una -->
        <StatsCard v-for="(stat, index) in stats" :key="index" :title="stat.title" :value="stat.value"
          class="stat-card" />
      </div>
    </div>

    <div>
      <!-- Barra de búsqueda y filtros -->
      <div class="search-container">
        <!-- Input para buscar instructores -->
        <q-input v-model="search" placeholder="Buscar instructor..." outlined dense class="search-input">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Select para filtrar por estado (activo/inactivo) -->
        <q-select 
          v-model="filtroEstado" 
          :options="opcionesEstado" 
          label="Estado" 
          outlined 
          dense 
          clearable
          class="filter-select" 
          option-label="label" 
          option-value="value"
        />

        <!-- Select para filtrar por programa -->
        <q-select 
          v-model="filtroPrograma" 
          :options="opcionesPrograma" 
          label="Programa" 
          outlined 
          dense 
          clearable
          class="filter-select" 
          option-label="label" 
          option-value="value"
        />
      </div>

      <!-- Tabla principal con la lista de instructores -->
      <maintable 
        :datos="instructoresFiltrados" 
        :columnas="columns" 
        row-key="id"
        @visualizar="verDetalle"
      >
        <!-- Slot personalizado para la columna de estado -->
        <template #body-cell-status="props">
          <q-td :props="props" class="text-center">
            <!-- Badge que cambia de color según el estado -->
            <q-badge :color="getStatusColor(props.row.status)">
              {{ getStatusLabel(props.row.status) }}
            </q-badge>
          </q-td>
        </template>

        <!-- Slot para la columna de acciones -->
        <template #body-cell-acciones="props">
          <q-td :props="props" class="text-center">
            <!-- Botón para ver los detalles del instructor -->
            <q-btn flat round color="primary" icon="visibility" size="sm" @click="verDetalle(props.row)">
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </maintable>

      <!-- Modal principal: Detalles del Instructor -->
      <ModalComponent 
        ref="modalDetallesRef"
        :persistent="true"
        width="1200px"
        max-width="98vw"
      >
        <!-- Header del modal -->
        <template #header>
          <div class="text-h6">Perfil de Instructor</div>
        </template>

        <!-- Cuerpo del modal con toda la información -->
        <template #body>
          <div v-if="instructorSeleccionado" class="q-pa-md">
            <!-- Usamos un row de Quasar para dividir en columnas -->
            <div class="row q-col-gutter-lg">
              
              <!-- ===== COLUMNA IZQUIERDA ===== -->
              <div class="col-12 col-md-6">
                <!-- Sección: Información Personal -->
                <div class="text-h6 q-mb-md section-title">Información Personal</div>
                <div class="data-grid">
                  <!-- Cada data-row muestra un campo con su valor -->
                  <div class="data-row">
                    <div class="text-weight-bold">Nombre:</div>
                    <div class="data-value">{{ instructorSeleccionado.name }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Documento:</div>
                    <div class="data-value">{{ instructorSeleccionado.numdocument }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Email:</div>
                    <div class="data-value">{{ instructorSeleccionado.email }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Teléfono:</div>
                    <div class="data-value">{{ instructorSeleccionado.phone }}</div>
                  </div>
                </div>

                <!-- Sección: Estado del instructor -->
                <div class="text-h6 q-mb-md q-mt-lg section-title">Estado</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Estado:</div>
                    <div class="data-value">
                      <q-badge :color="getStatusColor(instructorSeleccionado.status)">
                        {{ getStatusLabel(instructorSeleccionado.status) }}
                      </q-badge>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ===== COLUMNA DERECHA ===== -->
              <div class="col-12 col-md-6">
                <!-- Sección: Información Académica -->
                <div class="text-h6 q-mb-md section-title">Información Académica</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Programa:</div>
                    <div class="data-value">{{ instructorSeleccionado.thematicarea || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Aprendices Asignados:</div>
                    <div class="data-value">{{ instructorSeleccionado.apprentices?.length || 0 }}</div>
                  </div>
                </div>

                <!-- Sección: Horas de Trabajo -->
                <div class="text-h6 q-mb-md q-mt-lg section-title">Horas de Trabajo</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Horas Acumuladas:</div>
                    <!-- Las horas se muestran con un estilo destacado -->
                    <div class="data-value horas-destacadas">{{ Math.round(instructorSeleccionado.hourswork || 0) }}</div>
                  </div>
                </div>

                <!-- Sección: Input para pagar horas -->
                <div class="text-h6 q-mb-md q-mt-lg section-title">Pagar Horas</div>
                <q-input
                  v-model.number="cantidadAPagar"
                  outlined
                  dense
                  type="number"
                  label="Cantidad de horas"
                  :placeholder="(instructorSeleccionado.hourswork || 0) > 0 ? 'Ingrese cantidad a pagar' : 'Ya pagaste todas las horas'"
                  :disable="(instructorSeleccionado.hourswork || 0) <= 0"
                  :min="0"
                  :max="Math.round(instructorSeleccionado.hourswork || 0)"
                  class="q-mb-md"
                  :rules="[
                    val => val >= 0 || 'La cantidad debe ser positiva',
                    val => val <= Math.round(instructorSeleccionado.hourswork || 0) || 'No puedes pagar más horas de las acumuladas'
                  ]"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Footer del modal con botones de acción -->
        <template #footer>
          <BotonCerrar @click="cerrarModal" />
          <!-- El botón de enviar se deshabilita si no hay una cantidad válida -->
          <BotonEnviar 
            @click="abrirModalConfirmacion" 
            :disabled="!cantidadAPagar || cantidadAPagar <= 0 || cantidadAPagar > Math.round(instructorSeleccionado.hourswork || 0)" 
          />
        </template>
      </ModalComponent>

      <!-- Modal secundario: Confirmación de Pago -->
      <ModalComponent 
        ref="modalConfirmacionRef"
        :persistent="true"
        width="600px"
        max-width="95vw"
      >
        <template #header>
          <div class="text-h6">Confirmación de Pago</div>
        </template>

        <!-- Cuerpo con el mensaje de confirmación -->
        <template #body>
          <div class="q-pa-md">
            <p class="confirmacion-text">
              ¿Estás seguro de pagar <strong>{{ cantidadAPagar }} horas</strong> al instructor 
              <strong>{{ instructorSeleccionado?.name }}</strong>?
            </p>
            <p class="confirmacion-text">
              Quedarían <strong>{{ Math.max(0, Math.round(instructorSeleccionado.hourswork || 0) - cantidadAPagar) }} horas</strong> pendientes por pagar.
            </p>
          </div>
        </template>

        <!-- Footer con botones de cancelar y confirmar -->
        <template #footer>
          <BotonCerrar @click="cerrarModalConfirmacion" />
          <!-- El botón muestra un loading mientras procesa el pago -->
          <BotonEnviar @click="confirmarPago" :loading="procesandoPago" />
        </template>
      </ModalComponent>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { apiClient } from '@/plugins/pluginAxios.js'
import { useNotifications } from '@/composables/useNotifications'
import BackButton from '@/components/BackButton.vue'
import StatsCard from '@/components/cards/StatsCard.vue'
import maintable from '@/components/tables/MainTable.vue'
import ModalComponent from '@/components/modals/ModalComponent.vue'
import BotonCerrar from '@/components/BotonCerrar.vue'
import BotonEnviar from '@/components/BotonEnviar.vue'

// Configuración de Quasar y notificaciones
const $q = useQuasar()
const notificaciones = useNotifications()
// Si no existe el composable de notificaciones, usamos el notify de Quasar
const showSuccess = notificaciones?.showSuccess || ((msg) => $q.notify({ type: 'positive', message: msg }))
const showError = notificaciones?.showError || ((msg) => $q.notify({ type: 'negative', message: msg }))

// Variables reactivas para el estado de la página
const loading = ref(false)
const error = ref(null)
const procesandoPago = ref(false)

// Array con las estadísticas que se muestran en las tarjetas superiores
const stats = ref([
  { title: 'TOTAL INSTRUCTORES', value: 0 },
  { title: 'INSTRUCTORES ACTIVOS', value: 0 },
  { title: 'APRENDICES ASIGNADOS', value: 0 },
  { title: 'CONTRATO TERMINADO', value: 0 }
])

// Arrays para almacenar los datos
const instructores = ref([])
const aprendices = ref([])

// Filtros para la búsqueda
const filtroEstado = ref(null)
const filtroPrograma = ref(null)

// Variables para controlar los modales y la búsqueda
const mostrarTabla = ref(false)
const search = ref('')
const mostrarDetalles = ref(false)
const mostrarConfirmacion = ref(false)
const instructorSeleccionado = ref(null)
const cantidadAPagar = ref(0)

// Referencias a los componentes de modal
const modalDetallesRef = ref(null)
const modalConfirmacionRef = ref(null)

// Opciones para los selectores de filtro
const opcionesEstado = ref([])
const opcionesPrograma = ref([])

// Definición de las columnas de la tabla
const columns = [
  { name: 'numdocument', align: 'left', label: 'Cédula', field: 'numdocument', sortable: true },
  { name: 'name', align: 'left', label: 'Nombre', field: 'name', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'thematicarea', align: 'left', label: 'Programa', field: 'thematicarea', sortable: true },
  { name: 'apprentices', align: 'center', label: 'Aprendices', field: row => row.apprentices?.length || 0, sortable: true },
  { name: 'status', align: 'center', label: 'Estado', field: 'status' },
  { name: 'acciones', align: 'center', label: 'Acciones', field: 'acciones' }
]

// Computed para obtener solo los instructores activos
const instructoresActivos = computed(() => {
  const activos = []
  for (let i = 0; i < instructores.value.length; i++) {
    if (instructores.value[i].status === 1) {
      activos.push(instructores.value[i])
    }
  }
  return activos
})

// Computed que filtra los instructores según los criterios de búsqueda
const instructoresFiltrados = computed(() => {
  let resultado = []
  
  for (let i = 0; i < instructores.value.length; i++) {
    resultado.push(instructores.value[i])
  }

  // Filtro por texto de búsqueda
  if (search.value) {
    const s = search.value.toLowerCase()
    const temp = []
    for (let i = 0; i < resultado.length; i++) {
      const instructor = resultado[i]
      const name = (instructor.name || '').toLowerCase()
      const numdocument = (instructor.numdocument || '').toString()
      const email = (instructor.email || '').toLowerCase()
      const thematicarea = (instructor.thematicarea || '').toLowerCase()
      
      if (name.includes(s) || numdocument.includes(s) || email.includes(s) || thematicarea.includes(s)) {
        temp.push(instructor)
      }
    }
    resultado = temp
  }

  // Filtro por estado - obtener el valor real del objeto
  if (filtroEstado.value !== null && filtroEstado.value !== undefined) {
    const valorEstado = typeof filtroEstado.value === 'object' ? filtroEstado.value.value : filtroEstado.value
    const temp = []
    for (let i = 0; i < resultado.length; i++) {
      if (resultado[i].status === valorEstado) {
        temp.push(resultado[i])
      }
    }
    resultado = temp
  }

  // Filtro por programa - obtener el valor real del objeto
  if (filtroPrograma.value) {
    const valorPrograma = typeof filtroPrograma.value === 'object' ? filtroPrograma.value.value : filtroPrograma.value
    const temp = []
    for (let i = 0; i < resultado.length; i++) {
      if (resultado[i].thematicarea === valorPrograma) {
        temp.push(resultado[i])
      }
    }
    resultado = temp
  }

  return resultado
})

// Función que carga los instructores desde el backend
async function fetchInstructor() {
  loading.value = true
  try {
    // Hacemos la petición al backend
    const response = await apiClient.get('/instructors/listInstructor')
    const msg = response.data?.msg

    // Extraemos el array de instructores (puede venir en diferentes formatos)
    const instructoresArray = Array.isArray(msg)
      ? msg
      : (msg?.instructores || msg?.instructors || msg?.list || [])

    const aprendicesArray = msg?.aprendices || msg?.apprentices || []

    // Asignamos directamente los datos del backend
    instructores.value = instructoresArray
    aprendices.value = Array.isArray(aprendicesArray) ? aprendicesArray : []

    // Generamos las opciones para los filtros
    generarOpcionesFiltro()

    // Calculamos las estadísticas
    let activos = 0
    let contratoTerminado = 0
    
    for (let i = 0; i < instructores.value.length; i++) {
      if (instructores.value[i].status === 1) {
        activos++
      }
      const bindingtype = instructores.value[i].bindingtype || ''
      if (bindingtype.toLowerCase().includes('contrato terminado')) {
        contratoTerminado++
      }
    }

    // Actualizamos las tarjetas de estadísticas
    stats.value = [
      { title: 'TOTAL INSTRUCTORES', value: instructores.value.length },
      { title: 'INSTRUCTORES ACTIVOS', value: activos },
      { title: 'APRENDICES ASIGNADOS', value: aprendices.value.length },
      { title: 'CONTRATO TERMINADO', value: contratoTerminado }
    ]
  } catch (err) {
    console.error('Error al cargar instructores:', err)
    error.value = err.response?.data?.msg || err.message || 'Error al cargar instructores'
  } finally {
    loading.value = false
  }
}

// Genera las opciones para los selectores de filtro
function generarOpcionesFiltro() {
  // Opciones de estado con etiquetas legibles
  opcionesEstado.value = [
    { label: 'Todos los estados', value: null },
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 0 }
  ]

  // Obtenemos los programas únicos
  const programasUnicos = []
  for (let i = 0; i < instructores.value.length; i++) {
    const programa = instructores.value[i].thematicarea
    if (programa && !programasUnicos.includes(programa)) {
      programasUnicos.push(programa)
    }
  }
  
  opcionesPrograma.value = [{ label: 'Todos los programas', value: null }]
  for (let i = 0; i < programasUnicos.length; i++) {
    opcionesPrograma.value.push({ label: programasUnicos[i], value: programasUnicos[i] })
  }
}

// Convierte el número de estado en una etiqueta legible
function getStatusLabel(status) {
  switch (status) {
    case 1: return 'Activo'
    case 0: return 'Inactivo'
    default: return 'Desconocido'
  }
}

// Devuelve el color del badge según el estado
function getStatusColor(status) {
  return status === 1 ? 'positive' : 'negative'
}

// Abre el modal de detalles con la información del instructor seleccionado
function verDetalle(instructor) {
  instructorSeleccionado.value = instructor
  cantidadAPagar.value = 0
  modalDetallesRef.value?.openDialog()
}

// Cierra el modal de detalles
function cerrarModal() {
  modalDetallesRef.value?.closeDialog()
  cantidadAPagar.value = 0
}

// Valida y abre el modal de confirmación
function abrirModalConfirmacion() {
  const hourswork = Math.round(instructorSeleccionado.value?.hourswork || 0)
  if (cantidadAPagar.value > 0 && cantidadAPagar.value <= hourswork) {
    modalConfirmacionRef.value?.openDialog()
  } else {
    showError('Por favor ingresa una cantidad válida de horas a pagar')
  }
}

// Cierra el modal de confirmación
function cerrarModalConfirmacion() {
  modalConfirmacionRef.value?.closeDialog()
}

// Procesa el pago de horas del instructor
async function confirmarPago() {
  if (!instructorSeleccionado.value || cantidadAPagar.value <= 0) {
    showError('Por favor verifica la cantidad de horas a pagar')
    return
  }

  procesandoPago.value = true
  
  try {
    // Calculamos las horas que quedarían después del pago
    const horasRestantes = Math.max(0, Math.round(instructorSeleccionado.value.hourswork || 0) - cantidadAPagar.value)
    
    // ===== AQUÍ VA LO DEL BACKEND=====
    // Descomentar esto cuando se tenga el endpoint listo:
    // const response = await apiClient.put(`/instructors/updateInstructor/${instructorSeleccionado.value._id}`, {
    //   hourswork: horasRestantes
    // })
    
    // Actualizamos los datos localmente
    instructorSeleccionado.value.hourswork = horasRestantes
    
    // Buscamos el instructor en el array y lo actualizamos
    let indiceInstructor = -1
    for (let i = 0; i < instructores.value.length; i++) {
      if (instructores.value[i]._id === instructorSeleccionado.value._id) {
        indiceInstructor = i
        break
      }
    }
    
    if (indiceInstructor !== -1) {
      instructores.value[indiceInstructor] = {
        ...instructores.value[indiceInstructor],
        hourswork: horasRestantes
      }
    }
    
    // Mostramos mensaje de éxito
    showSuccess(`Pago exitoso! Se pagaron ${cantidadAPagar.value} horas`)
    
    // Cerramos los modales
    cerrarModalConfirmacion()
    setTimeout(() => cerrarModal(), 300)

  } catch (err) {
    console.error('Error al procesar el pago:', err)
    const mensajeError = err.response?.data?.msg || err.response?.data?.message || 'Error al procesar el pago'
    showError(mensajeError)
  } finally {
    procesandoPago.value = false
  }
}

// Cuando el componente se monta, cargamos los instructores
onMounted(fetchInstructor)
</script>

<style scoped>
/* Los estilos CSS están organizados por secciones */

/* ===== ESTILOS GENERALES DEL COMPONENTE ===== */

/* Títulos de sección con el verde característico del SENA */
.section-title {
  color: #39a900;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-left: 8px;
  border-left: 4px solid #39a900;
}

/* Grid para mostrar la información de forma organizada */
.data-grid {
  display: grid;
  gap: 16px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Cada fila de datos tiene una etiqueta y un valor */
.data-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  align-items: center;
}

.text-weight-bold {
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 600;
}

.data-value {
  color: #34495e;
  font-size: 0.95rem;
}

/* Estilo especial para las horas trabajadas (más grande y en verde) */
.horas-destacadas {
  font-size: 1.5rem;
  font-weight: bold;
  color: #39a900;
}

/* Texto de confirmación en el modal secundario */
.confirmacion-text {
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 1.5;
  color: #333;
}

/* ===== CONTENEDOR DE ESTADÍSTICAS ===== */
.stats-container {
  padding: 20px 50px;
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

/* Efecto hover en las tarjetas de estadísticas */
.stat-card:hover {
  transform: translateY(-5px);
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.instructores-container {
  padding: 10px 16px 16px 16px;
}

.header-container {
  margin-top: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.text-h2 {
  font-size: 3rem !important;
  letter-spacing: 1px;
  flex: 1;
}

/* ===== ESTILOS DE LA TABLA ===== */
:deep(.q-table) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Encabezado de la tabla con el verde del SENA */
:deep(.q-table th) {
  font-weight: bold;
  background: #39A900 !important;
  color: white !important;
}

/* Filas alternas con fondo gris claro para mejor lectura */
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

/* ===== BARRA DE BÚSQUEDA Y FILTROS ===== */
.search-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  padding-left: 2.5%; 
}

.search-input {
  min-width: 250px;
  flex: 1;
  max-width: 400px;
}

.filter-select {
  min-width: 200px;
}

/* ================================================ */
/* MEDIA QUERIES - RESPONSIVIDAD */
/* ================================================ */

/* ===== MÓVILES MUY PEQUEÑOS (300px - 400px) ===== */
@media (min-width: 300px) and (max-width: 400px) {
  .instructores-container {
    padding: 6px 8px 8px 8px;
  }

  .header-container {
    margin-top: 10px;
    margin-bottom: 16px;
    gap: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .text-h2 {
    font-size: 1.5rem !important;
    text-align: center !important;
    width: 100%;
  }

  .stats-container {
    padding: 10px 8px;
    margin-bottom: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .search-container {
    padding-left: 8px !important;
    padding-right: 8px !important;
    gap: 8px !important;
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .search-input {
    min-width: 100% !important;
    max-width: 100% !important;
    width: 100% !important;
  }

  .filter-select {
    min-width: 100% !important;
    width: 100% !important;
  }

  /* Tabla más compacta en móviles */
  :deep(.q-table) {
    font-size: 0.7rem;
  }

  :deep(.q-table th),
  :deep(.q-table td) {
    padding: 4px 6px;
    font-size: 0.7rem;
  }

  :deep(.q-table th) {
    font-size: 0.65rem;
  }

  /* Ocultamos las columnas menos importantes */
  :deep(.q-table th:nth-child(3)),
  :deep(.q-table td:nth-child(3)),
  :deep(.q-table th:nth-child(4)),
  :deep(.q-table td:nth-child(4)) {
    display: none;
  }

  /* Ajustes del modal para móviles */
  .section-title {
    font-size: 0.95rem;
    margin-bottom: 10px;
    padding-left: 6px;
  }

  .data-grid {
    padding: 10px;
    gap: 8px;
  }

  .data-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .text-weight-bold {
    font-size: 0.75rem;
    margin-bottom: 2px;
  }

  .data-value {
    font-size: 0.8rem;
    padding-left: 8px;
  }

  .horas-destacadas {
    font-size: 1.1rem;
  }

  .confirmacion-text {
    font-size: 13px;
    margin-bottom: 10px;
  }

  /* Las columnas del modal ocupan todo el ancho */
  :deep(.col-md-6) {
    width: 100% !important;
    max-width: 100% !important;
  }

  :deep(.q-pa-md) {
    padding: 8px !important;
  }

  :deep(.q-col-gutter-lg) {
    margin: -6px;
  }

  :deep(.q-col-gutter-lg > *) {
    padding: 6px;
  }

  :deep(.q-input),
  :deep(.q-select) {
    font-size: 0.85rem;
  }

  :deep(.q-btn) {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  :deep(.q-badge) {
    padding: 3px 6px;
    font-size: 0.7em;
  }
}

/* ===== MÓVILES PEQUEÑOS (401px - 600px) ===== */
@media (min-width: 401px) and (max-width: 600px) {
  .instructores-container {
    padding: 7px 10px 10px 10px;
  }

  .header-container {
    margin-top: 12px;
    margin-bottom: 18px;
    gap: 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .text-h2 {
    font-size: 2rem !important;
    text-align: center !important;
    width: 100%;
  }

  .stats-container {
    padding: 12px 15px;
    margin-bottom: 25px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .search-container {
    padding-left: 15px !important;
    padding-right: 15px !important;
    gap: 10px !important;
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .search-input {
    min-width: 100% !important;
    max-width: 100% !important;
    width: 100% !important;
  }

  .filter-select {
    min-width: 100% !important;
    width: 100% !important;
  }

  :deep(.q-table) {
    font-size: 0.8rem;
  }

  :deep(.q-table th),
  :deep(.q-table td) {
    padding: 5px 8px;
    font-size: 0.8rem;
  }

  :deep(.q-table th) {
    font-size: 0.75rem;
  }

  /* En este rango solo ocultamos la columna de Email */
  :deep(.q-table th:nth-child(3)),
  :deep(.q-table td:nth-child(3)) {
    display: none;
  }

  .section-title {
    font-size: 1rem;
    margin-bottom: 12px;
    padding-left: 7px;
  }

  .data-grid {
    padding: 12px;
    gap: 10px;
  }

  .data-row {
    grid-template-columns: 120px 1fr;
    gap: 10px;
  }

  .text-weight-bold {
    font-size: 0.8rem;
  }

  .data-value {
    font-size: 0.85rem;
  }

  .horas-destacadas {
    font-size: 1.2rem;
  }

  .confirmacion-text {
    font-size: 14px;
    margin-bottom: 12px;
  }

  :deep(.col-md-6) {
    width: 100% !important;
    max-width: 100% !important;
  }

  :deep(.q-pa-md) {
    padding: 10px !important;
  }

  :deep(.q-col-gutter-lg) {
    margin: -7px;
  }

  :deep(.q-col-gutter-lg > *) {
    padding: 7px;
  }

  :deep(.q-input),
  :deep(.q-select) {
    font-size: 0.9rem;
  }

  :deep(.q-badge) {
    padding: 3px 7px;
    font-size: 0.75em;
  }
}

/* ===== TABLETS (601px - 900px) ===== */
@media (min-width: 601px) and (max-width: 900px) {
  .instructores-container {
    padding: 8px 12px 12px 12px;
  }

  .header-container {
    margin-top: 15px;
    margin-bottom: 20px;
    gap: 15px;
    flex-direction: row;
    justify-content: flex-start;
  }

  .text-h2{
    font-size: 3rem !important;
    text-align: center !important;
  }

  .stats-container {
    padding: 15px 20px;
    margin-bottom: 30px;
  }

  /* En tablets mostramos las estadísticas en 2 columnas */
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .search-container {
    padding-left: 25px;
    padding-right: 25px;
    gap: 10px;
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: 100%;
    max-width: 100%;
    width: 100%;
  }

  .filter-select {
    min-width: 100%;
    width: 100%;
  }

  :deep(.q-table) {
    font-size: 0.85rem;
  }

  :deep(.q-table th),
  :deep(.q-table td) {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  :deep(.q-table th) {
    font-size: 0.8rem;
  }

  .section-title {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  .data-grid {
    padding: 15px;
    gap: 12px;
  }

  .data-row {
    grid-template-columns: 140px 1fr;
    gap: 12px;
  }

  .text-weight-bold {
    font-size: 0.85rem;
  }

  .data-value {
    font-size: 0.85rem;
  }

  .horas-destacadas {
    font-size: 1.3rem;
  }

  .confirmacion-text {
    font-size: 14px;
    margin-bottom: 12px;
  }

  /* En tablets las columnas del modal todavía van en vertical */
  :deep(.col-md-6) {
    width: 100%;
    max-width: 100%;
  }

  :deep(.q-pa-md) {
    padding: 12px !important;
  }

  :deep(.q-col-gutter-lg) {
    margin: -8px;
  }

  :deep(.q-col-gutter-lg > *) {
    padding: 8px;
  }
}

/* ===== PANTALLAS MEDIANAS (901px - 1000px) ===== */
@media (min-width: 901px) and (max-width: 1000px) {
  .instructores-container {
    padding: 10px 16px 16px 16px;
  }

  .header-container {
    margin-top: 18px;
    margin-bottom: 22px;
    gap: 18px;
    flex-direction: row;
    justify-content: flex-start;
  }

  .text-h2 {
    font-size: 2.5rem !important;
    text-align: center !important;
  }

  .stats-container {
    padding: 18px 35px;
    margin-bottom: 35px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .search-container {
    padding-left: 25px !important;
    padding-right: 25px !important;
    gap: 10px !important;
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .search-input {
    min-width: 100% !important;
    max-width: 100% !important;
    width: 100% !important;
  }

  .filter-select {
    min-width: 100% !important;
    width: 100% !important;
  }

  :deep(.q-table) {
    font-size: 0.9rem;
  }

  :deep(.q-table th),
  :deep(.q-table td) {
    padding: 7px 12px;
    font-size: 0.9rem;
  }

  :deep(.q-table th) {
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 1.2rem;
    margin-bottom: 18px;
  }

  .data-grid {
    padding: 18px;
    gap: 14px;
  }

  .data-row {
    grid-template-columns: 160px 1fr;
    gap: 14px;
  }

  .text-weight-bold {
    font-size: 0.9rem;
  }

  .data-value {
    font-size: 0.9rem;
  }

  .horas-destacadas {
    font-size: 1.4rem;
  }

  .confirmacion-text {
    font-size: 15px;
    margin-bottom: 14px;
  }

  /* A partir de aquí las columnas del modal van lado a lado */
  :deep(.col-md-6) {
    width: 50%;
    max-width: 50%;
  }

  :deep(.q-pa-md) {
    padding: 14px !important;
  }

  :deep(.q-col-gutter-lg) {
    margin: -10px;
  }

  :deep(.q-col-gutter-lg > *) {
    padding: 10px;
  }
}
</style>