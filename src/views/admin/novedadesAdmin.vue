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

    <!-- Vista condicional -->
    <div v-if="!mostrarTabla" class="urgent-cards-container">
      <CardNovedades
        :novedades="novedadesUrgentes"
        :loading="loading"
        :error-message="errorMessage"
        @mostrar-tabla="mostrarTabla = true"
        @clear-error="errorMessage = ''"
      />
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
        <Button1 label="Filtrar" size="sm" class="filter-button" @click="applyFilter" />
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

      <!-- Diálogo de detalles -->
      <q-dialog v-model="mostrarDetalles" persistent>
        <q-card class="detail-card">
          <q-card-section class="header-section bg-primary text-white">
            <div class="text-h6">Información General</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup class="text-white" />
          </q-card-section>

          <q-card-section v-if="novedadSeleccionada" class="detail-content q-pa-lg">
            <div class="row q-col-gutter-lg">
              <div class="col-12">
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Aprendiz</div>
                    <div class="info-value">{{ novedadSeleccionada.aprendiz }}</div>
                  </div>

                  <div class="info-item">
                    <div class="info-label">Tipo</div>
                    <div class="info-value">{{ novedadSeleccionada.tipo }}</div>
                  </div>

                  <div class="info-item">
                    <div class="info-label">Instructor</div>
                    <div class="info-value">{{ novedadSeleccionada.instructor }}</div>
                  </div>


                  <div class="info-item">
                    <div class="info-label">Ficha</div>
                    <div class="info-value">{{ novedadSeleccionada.ficha }}</div>
                  </div>

                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="bg-grey-1 q-pa-md q-gutter-sm">
            <q-btn 
              label="Cerrar" 
              color="grey-7" 
              v-close-popup 
              flat
              class="q-px-lg"
            />
            <q-btn 
              label="Ver" 
              color="positive" 
              @click="verCompleto(novedadSeleccionada)"
              class="q-px-lg"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Agregar el Modal después del diálogo de detalles -->
      <ModalNew
        v-model="mostrarModalNew"
        :novedad="novedadSeleccionada"
      />

      <!-- Botón volver -->
      <div class="row justify-center q-mt-lg">
        <Button1
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
import Button1 from '@/components/button-1.vue'
import ModalNew from '@/components/modals/ModalNew.vue'
import BackButton from '@/components/BackButton.vue'


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

// Columnas para la tabla
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
    field: row => `${row.aprendiz} - ${row.documento}`,
    style: 'width: 150px'
  },
  { 
    name: 'ficha', 
    align: 'left', 
    label: 'Ficha/Programa', 
    field: row => `${row.ficha} - ${row.programa}`
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
  return urgentes.slice(0, 1) // Retorna solo la primera novedad urgente
})

function getDays(fecha) {
  return Math.floor((Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24))
}

// Función para calcular tiempo transcurrido
function tiempoTranscurrido(fecha) {
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24))
  return dias <= 0 ? 'Hoy' : `Hace ${dias} días`
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
    fecha: new Date(novedad.createdAt).toLocaleDateString(),
    aprendiz: novedad.name,
    documento: `${novedad.tpdocument} ${novedad.document}`,
    ficha: novedad.fiche.number ,
    programa: novedad.coordination || 'Pendiente',
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

// Función para ver la novedad completa
function verCompleto(novedad) {
  mostrarModalNew.value = true
  // La novedad ya está en novedadSeleccionada.value
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

.urgent-cards-container {
  margin-top: 48px;
  padding: 24px;
  background-color: #fff3e0;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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

</style>