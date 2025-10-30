novedades admin

<template>
  <div class="novedades-container">
    <!-- Botón de regreso -->
    <div class="back-button-container">
      <BackButton />
    </div>

    <!-- Título -->
    <div class="header-container">
      <header class="text-h2 text-weight-bold text-center">NOVEDADES</header>
    </div>

    <!-- Stats Cards -->
    <div class="stats-container">
      <div class="stats-grid">
        <StatsCard
          v-for="(stat, index) in stats"
          :key="index"
          :title="stat.title"
          :value="stat.value"
          class="stat-card"
        />
      </div>
    </div>
 <div><p class="text-center">las novedades tienen un plazo máximo de 15 días hábiles para ser resueltas
  
</p></div>
    <!-- Vista condicional -->
    <div v-if="!mostrarTabla" class="urgent-cards-container">
      <div class="text-weight-bold text-center q-mb-md">Novedades Urgentes</div>
      <div class="urgent-cards-grid">
        <CardNovedades
          v-for="novedad in novedadesUrgentes"
          :key="novedad.id"
          :novedades="[novedad]"
          :loading="loading"
          :error-message="errorMessage"
          @clear-error="errorMessage = ''"
        />
      </div>
      <!-- Agregar botón para ver todas las novedades -->
      <div class="text-center q-mt-xl">
        <BotonIngresar
          label="Ver todas las novedades"
          @click="mostrarTabla = true"
          class="view-all-button"
        />
      </div>
    </div>
    
    <div v-else>
      <!-- Barra de búsqueda -->
      <div class="search-container">
        <q-input
          v-model="search"
          placeholder="Buscar..."
          outlined
          dense
          class="search-input"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <!-- Conectar el botón al método applyFilter -->
        <BotonIngresar label="Filtrar" size="sm" class="filter-button" @click="applyFilter" />
      </div>

      <!-- Tabla -->
      <q-table
        :rows="filteredNovedades"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              size="sm"
              @click="verDetalle(props.row)"
            />
          </q-td>
        </template>
      </q-table>

      <!-- Reemplazar el q-dialog de detalles por el nuevo modal -->
      <modalComponent
        v-model="mostrarDetalles"
        width="1200px"
        max-width="98vw"
      >
        <template #header>
          <div class="text-h6">Detalles de la Novedad</div>
        </template>

        <template #body>
          <div v-if="novedadSeleccionada" class="q-pa-md">
            <div class="row q-col-gutter-lg">
              <!-- Columna Izquierda -->
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md section-title">Información del Aprendiz</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Nombre:</div>
                    <div class="data-value">{{ novedadSeleccionada.aprendiz }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Documento:</div>
                    <div class="data-value">{{ novedadSeleccionada.documento }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Ficha:</div>
                    <div class="data-value">{{ novedadSeleccionada.ficha }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Programa:</div>
                    <div class="data-value">{{ novedadSeleccionada.programa }}</div>
                  </div>
                </div>

                <div class="text-h6 q-mb-md section-title q-mt-lg">Descripción de la Novedad</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Tipo:</div>
                    <div class="data-value">{{ novedadSeleccionada.tipo }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Descripción:</div>
                    <div class="data-value">{{ novedadSeleccionada.descripcion || 'Sin descripción' }}</div>
                  </div>
                </div>
              </div>

              <!-- Columna Derecha -->
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md section-title">Estado y Seguimiento</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Estado:</div>
                    <div class="data-value">{{ novedadSeleccionada.estado }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Gravedad:</div>
                    <div class="data-value">{{ novedadSeleccionada.gravedad }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Instructor:</div>
                    <div class="data-value">{{ novedadSeleccionada.instructor }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Tiempo transcurrido:</div>
                    <div class="data-value">{{ tiempoTranscurrido(novedadSeleccionada.fecha) }}</div>
                  </div>
                </div>

                <div v-if="novedadSeleccionada.respuestas?.length" class="text-h6 q-mb-md section-title q-mt-lg">
                  Respuestas
                  <div class="data-grid">
                    <div v-for="(respuesta, idx) in novedadSeleccionada.respuestas" :key="idx" class="data-row">
                      <div class="text-weight-bold">Respuesta {{idx + 1}}:</div>
                      <div class="data-value">{{ respuesta }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <BotonCerrar
            label="Cerrar"
            @click="mostrarDetalles = false"
          />
        </template>
      </modalComponent>

      <!-- Botón volver -->
      <div class="row justify-center q-mt-lg">
        <BotonIngresar
          label="Volver a novedades urgentes"
          @click="mostrarTabla = false"
          class="button-wide"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '@/plugins/pluginAxios.js'
import CardNovedades from '@/components/CardNovedades.vue'
import StatsCard from '@/components/cards/StatsCard.vue'
import BotonIngresar from '@/components/BotonIngresar.vue'
import BotonCerrar from '@/components/BotonCerrar.vue'
import BackButton from '@/components/BackButton.vue'
import modalComponent from '@/components/modals/modalComponent.vue'


const loading = ref(false)
const errorMessage = ref('')
const stats = ref([
  { title: 'TOTAL NOVEDADES ACTIVAS', value: 0 },
  { title: 'EN PROCESO', value: 0 },
  { title: 'RESUELTAS ESTE MES', value: 0 },
  { title: 'CRÍTICAS SIN ATENDER >3 DÍAS', value: 0 }
])
const novedades = ref([])

// Estado para controlar la vista
const mostrarTabla = ref(false)
const search = ref('')
const mostrarDetalles = ref(false)
const novedadSeleccionada = ref(null)
const mostrarModalNew = ref(false)

const columns = [
  { 
    name: 'fecha', 
    align: 'left', 
    label: 'Fecha', 
    field: 'fecha', 
    sortable: true 
  },
  { 
    name: 'aprendiz', 
    align: 'left', 
    label: 'Aprendiz', 
    field: 'aprendiz',
    style: 'width: 150px'
  },
  { 
    name: 'cedula', 
    align: 'left', 
    label: 'Cédula', 
    field: 'documento'
  },
  { 
    name: 'ficha', 
    align: 'left', 
    label: 'Ficha', 
    field: 'ficha'
  },
  {
    name: 'programa',
    align: 'left',
    label: 'Programa',
    field: 'programa'
  },
  { 
    name: 'tipo', 
    align: 'left', 
    label: 'Tipo', 
    field: 'tipo'
  },
  { 
    name: 'estado', 
    align: 'center', 
    label: 'Estado', 
    field: 'estado'
  },
  { 
    name: 'instructor', 
    align: 'left', 
    label: 'Instructor', 
    field: 'instructor'
  },
  { 
    name: 'tiempo', 
    align: 'center', 
    label: 'Tiempo', 
    field: row => tiempoTranscurrido(row.fecha)
  },
  { 
    name: 'acciones', 
    align: 'center', 
    label: 'Acciones',
    field: 'acciones'
  }
]

// Computed property para filtrar novedades urgentes
const novedadesUrgentes = computed(() => {
  const urgentes = novedades.value.filter(n => n.prioridad === 'urgente' || n.prioridad === 'critica')
  return urgentes.slice(0, 4) // Retorna las primeras 4 novedades urgentes
})

function getDays(fecha) {
  // Convertir la fecha a objeto Date y establecer la hora a medianoche
  const fechaNovedad = new Date(fecha)
  fechaNovedad.setHours(0, 0, 0, 0)
  
  // Obtener fecha actual y establecer la hora a medianoche
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  // Calcular la diferencia en milisegundos y convertir a días
  const diferencia = hoy - fechaNovedad
  const dias = Math.round(diferencia / (1000 * 60 * 60 * 24))
  
  return dias
}

// Función para calcular tiempo transcurrido
function tiempoTranscurrido(fecha) {
  const [dia, mes, anio] = fecha.split('/')
  const fechaFormateada = `${mes}/${dia}/${anio}`
  const dias = getDays(fechaFormateada)

  if (dias < 0) return `Faltan ${Math.abs(dias)} días`
  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Hace 1 día'
  return `Hace ${dias} días`
}

async function fetchNovedades() {
  try {
    const response = await apiClient.get('/news/listNews')
    if (!response.data.msg) {
      throw new Error('No hay datos disponibles')
    }
    return response.data.msg
  } catch (error) {
    errorMessage.value = error.response?.data?.msg || error.message
    throw error
  }
}

async function fetchStats() {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const novedadesArray = await fetchNovedades()
    
    if (Array.isArray(novedadesArray)) {
      actualizarStats(novedadesArray)
      procesarNovedadesParaTabla(novedadesArray)
    }
  } catch (error) {
    console.error('Error:', error)
    // No establecemos mensaje de error aquí ya que se maneja en fetchNovedades
  } finally {
    loading.value = false
  }
}

function actualizarStats(novedadesArray) {
  stats.value = [
    { 
      title: 'TOTAL NOVEDADES ACTIVAS', 
      value: novedadesArray.length 
    },
    { 
      title: 'EN PROCESO', 
      value: novedadesArray.filter(n => n.state === "APROBADA").length 
    },
    { 
      title: 'RESUELTAS ESTE MES', 
      value: novedadesArray.filter(n => n.processed).length 
    },
    { 
      title: 'CRÍTICAS SIN ATENDER >3 DÍAS', 
      value: novedadesArray.filter(n => {
        const dias = getDays(n.createdAt);
        return !n.processed && dias > 3;
      }).length 
    }
  ]
}

function procesarNovedadesParaTabla(novedadesArray) {
  novedades.value = novedadesArray.map(novedad => ({
    id: novedad._id,
    fecha: new Date(novedad.createdAt).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    aprendiz: novedad.name,
    documento: `${novedad.tpdocument} ${novedad.document}`,
    ficha: novedad.fiche.number ,
    programa: novedad.coordination,
    tipo: novedad.tpnew,
    gravedad: novedad.status === 0 ? 'Alta' : 'Baja',
    estado: novedad.state || 'PENDIENTE',
    instructor: novedad.nameInstructor || 'Pendiente',
    prioridad: novedad.processed ? 'normal' : 'urgente',
    descripcion: novedad.cause,
    respuestas: novedad.answers || [],
    imagenes: novedad.img || null
  }))
}

// Actualizar la función verDetalle para mostrar más información
function verDetalle(novedad) {
  novedadSeleccionada.value = novedad
  mostrarDetalles.value = true
}

// Agregar función handleSubmit
function handleSubmit() {
  mostrarDetalles.value = false
}

// Reemplazar binding de rows por computed filtrado
const filteredNovedades = computed(() => {
  const q = (search.value || '').toString().trim().toLowerCase()
  if (!q) return novedades.value

  // Si la búsqueda contiene solo dígitos, usar también comparación por número de cédula
  const searchDigits = q.replace(/\D/g, '')

  return novedades.value.filter(row => {
    const nombre = (row.aprendiz || '').toString().toLowerCase()
    const documento = (row.documento || '').toString().toLowerCase() // ej: "CC 12345"
    const ficha = (row.ficha || '').toString().toLowerCase()
    const programa = (row.programa || '').toString().toLowerCase()

    // Normal match (nombre, documento completo, ficha, programa)
    const matchesText =
      nombre.includes(q) ||
      documento.includes(q) ||
      ficha.includes(q) ||
      programa.includes(q)

    if (matchesText) return true

    // Si el usuario escribió solo dígitos, comparar con los dígitos del documento
    if (searchDigits) {
      const docDigits = (row.documento || '').toString().replace(/\D/g, '')
      if (docDigits.includes(searchDigits)) return true
    }

    return false
  })
})

// Método llamado por el botón "Filtrar" (normaliza/trim)
function applyFilter() {
  search.value = (search.value || '').toString().trim()
  // El computed filteredNovedades se actualizará automáticamente
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

/* Reset margins */
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

.novedades-container {
  padding: 10px 16px 16px 16px;
}

.back-button-container {
  padding: 16px 16px 0 16px;
  margin-bottom: -16px;
}

.header-container {
  margin-top: 0;  /* Ajustado desde -20px */
  margin-bottom: 24px;
}

.text-h2 {
  font-size: 3rem !important;
  letter-spacing: 1px;
}

.urgent-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: row;
  gap: 20px;
  width: 100%;
}

.urgent-cards-container {
  margin-top: 48px;
  padding: 24px;
  background-color: #fff3e0;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
}

/* Estilos para la tabla */
:deep(.q-table) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
}

.search-input {
  width: 250px;
}

.filter-button {
  margin-left: 4px;
}

.text-subtitle1 {
  color: #1976d2;
}

.text-subtitle2 {
  color: #666;
  margin-bottom: 4px;
}

.detail-card {
  width: 600px;
  max-width: 90vw;
  border-radius: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 500;
}

.header-section {
  background: #39A900 !important;
  padding: 16px 24px;
}

.detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.q-item__label--overline) {
  color: #666;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

:deep(.text-weight-medium) {
  font-size: 1.1rem;
  color: #2c3e50;
}

:deep(.q-list) {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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

.view-all-button {
  width: 300px;
}

/* Ajustes para que el modal tenga estilo similar a la imagen adjunta */
.modal-sections {
  display: grid;
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.section-title {
  font-weight: 700;
  color: #197B00;
  margin-bottom: 8px;
}

/* footer: alinear botón a la derecha y estilo similar a imagen */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}

/* pequeño ajuste para el botón cerrar si necesita espaciado */
.boton-cerrar {
  /* si BotonCerrrar acepta class, aquí puedes ajustar ancho/margen */
  min-width: 120px;
}

/* Estilos del modal */
.section-title {
  color: #39a900;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-left: 8px;
  border-left: 4px solid #39a900;
}

.data-grid {
  display: grid;
  gap: 16px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

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

/* responsive */
@media (max-width: 900px) {
  .modal-sections { gap: 12px; }
  .urgent-cards-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>