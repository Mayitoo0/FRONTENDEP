<template>
  <div class="vista-documentos-page">
    <!-- Header con flecha de retroceso y título centrado -->
    <div class="header">
      <q-btn
        flat
        round
        icon="arrow_back"
        color="green-7"
        size="sm"
        @click="goBack"
        class="back-btn"
      />
      <h1 class="page-title">VISTA DOCUMENTOS</h1>
      <div class="header-spacer"></div> <!-- Espacio para centrar el título -->
    </div>

    <!-- Card principal -->
    <div class="main-card">
      <!-- Banner verde con número de ficha -->
      <div class="banner-ficha">
        <h2 class="ficha-title">Ficha {{ numeroFicha }}</h2>
      </div>

      <!-- Botón Filtrar -->
      <div class="filter-section">
        <q-btn
          label="Filtrar"
          icon="filter_list"
          color="green"
          unelevated
          no-caps
          class="btn-filtrar"
          @click="abrirModalFiltros"
        />
      </div>

      <!-- Tabla usando el componente maintable -->
      <div class="table-section">
        <maintable
          :datos="aprendicesFiltrados"
          :columnas="columnasTabla"
          row-key="id"
          :no-data-label="'No hay aprendices para mostrar'"
          :initial-rows-per-page="8"
          @visualizar="verDocumentosAprendiz"
        >
          <!-- Slot personalizado para la columna Estado -->
          <template #body-cell-estado="props">
            <q-td :props="props" class="text-center">
              <span 
                class="estado-badge"
                :class="props.row.estado === 'Completado' ? 'estado-completo' : 'estado-incompleto'"
              >
                {{ props.row.estado }}
              </span>
            </q-td>
          </template>

          <!-- Slot personalizado para la columna Documentos -->
          <template #body-cell-documentos="props">
            <q-td :props="props" class="text-center">
              <a 
                href="#" 
                class="ver-documentos-link"
                @click.prevent="verDocumentosAprendiz(props.row)"
              >
                Ver documentos
              </a>
            </q-td>
          </template>
        </maintable>
      </div>
    </div>

    <!-- Footer fijo -->
    <div class="footer">
      REPFORA - Sena 2025 © Todos los derechos reservados
    </div>

    <!-- Modal de Filtros -->
    <modalComponent ref="modalFiltrosRef">
      <template #header>
        <div class="text-h6">Filtrar Aprendices</div>
      </template>

      <template #body>
        <div class="q-pa-md">
          <q-select
            v-model="filtroEstado"
            :options="opcionesEstado"
            label="Estado"
            outlined
            class="q-mb-md"
            clearable
          />
        </div>
      </template>

      <template #footer>
        <BotonCerrar @click="cerrarModalFiltros" />
        <BotonEnviar label="Aplicar Filtros" @click="aplicarFiltros" />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import modalComponent from '@/components/modals/modalComponent.vue'
import BotonCerrar from '@/components/BotonCerrar.vue'
import BotonEnviar from '@/components/BotonEnviar.vue'
import maintable from '@/components/tables/maintable.vue'

const router = useRouter()
const route = useRoute()

// Obtener número de ficha de los parámetros de ruta
const numeroFicha = computed(() => route.params.ficha || '2926076')

// Referencias
const modalFiltrosRef = ref(null)

// Estados
const filtroEstado = ref(null)
const opcionesEstado = ['Todos', 'Completado', 'Incompleto']

// Columnas para la tabla
const columnasTabla = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: row => row.nombre,
    sortable: true
  },
  {
    name: 'documentos',
    required: true,
    label: 'Opciones',
    align: 'center',
    field: row => row.nombre
  },
  {
    name: 'estado',
    required: true,
    label: 'Estado',
    align: 'center',
    field: row => row.estado,
    sortable: true
  }
]

// Datos de aprendices (actualizados para coincidir con la imagen)
const aprendices = ref([
  { id: 1, nombre: 'Alejandra Ruiz Torres', estado: 'Completado' },
  { id: 2, nombre: 'Carlos Andrés Méndez Robledo', estado: 'Incompleto' },
  { id: 3, nombre: 'Luisa Gómez Salazar', estado: 'Incompleto' },
  { id: 4, nombre: 'Juan David Rodríguez Pérez', estado: 'Completado' },
  { id: 5, nombre: 'José Manuel Castañeda Torres', estado: 'Completado' },
  { id: 6, nombre: 'Valeria Pardo Guzmán', estado: 'Completado' },
  { id: 7, nombre: 'Maria Fernanda Salinas Rojas', estado: 'Completado' },
  { id: 8, nombre: 'Kevin Alexander Duarte Romero', estado: 'Incompleto' }
])

// Aprendices filtrados
const aprendicesFiltrados = computed(() => {
  if (!filtroEstado.value || filtroEstado.value === 'Todos') {
    return aprendices.value
  }
  return aprendices.value.filter(a => a.estado === filtroEstado.value)
})

// Funciones
function goBack() {
  router.back()
}

function abrirModalFiltros() {
  modalFiltrosRef.value?.openDialog()
}

function cerrarModalFiltros() {
  modalFiltrosRef.value?.closeDialog()
}

function aplicarFiltros() {
  cerrarModalFiltros()
}

function verDocumentosAprendiz(aprendiz) {
  router.push({
    name: 'detalle-aprendiz',
    params: { 
      ficha: numeroFicha.value,
      aprendizId: aprendiz.id
    },
    query: {
      nombre: aprendiz.nombre
    }
  })
}

// Ajustar altura al montar el componente
onMounted(() => {
  // Asegurar que la página ocupe toda la altura
  document.documentElement.style.height = '100%'
  document.body.style.height = '100%'
})
</script>

<style scoped>
.vista-documentos-page {
  height: 100vh;
  background-color: #F5F5F5;
  padding: 10px 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header centrado */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 0 10px;
}

.back-btn {
  flex-shrink: 0;
}

.header-spacer {
  width: 40px; /* Mismo ancho que el botón para centrar */
  flex-shrink: 0;
}

.page-title {
  font-size: 38px;
  font-weight: 700;
  color: #000;
  margin: 0;
  letter-spacing: 0.5px;
  text-align: center;
  flex-grow: 1;
}

/* Card principal */
.main-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

/* Banner verde */
.banner-ficha {
  background: linear-gradient(135deg, #39A900 0%, #2E8700 100%);
  padding: 12px 20px;
  text-align: center;
  flex-shrink: 0;
}

.ficha-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
}

/* Sección de filtrar */
.filter-section {
  padding: 15px 20px 10px;
  flex-shrink: 0;
}

.btn-filtrar {
  border-radius: 8px;
  padding: 6px 20px;
  font-weight: 600;
  font-size: 14px;
}

/* Sección de tabla */
.table-section {
  flex: 1;
  padding: 0 20px 15px;
  overflow: hidden;
  min-height: 0;
}

/* Link de ver documentos */
.ver-documentos-link {
  color: #39A900;
  text-decoration: none;
  font-weight: 500;
  font-size: 12px;
  transition: color 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.ver-documentos-link:hover {
  color: #2E8700;
  text-decoration: underline;
  background-color: #f0f8e8;
}

/* Estados con badges */
.estado-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 11px;
  display: inline-block;
  min-width: 90px;
  text-align: center;
}

.estado-completo {
  background-color: #E8F5E8;
  color: #2E7D32;
  border: 1px solid #C8E6C9;
}

.estado-incompleto {
  background-color: #FFEBEE;
  color: #C62828;
  border: 1px solid #FFCDD2;
}

/* Footer fijo */
.footer {
  text-align: center;
  padding: 8px 0;
  font-size: 10px;
  color: #666;
  background-color: #F5F5F5;
  border-top: 1px solid #E0E0E0;
  flex-shrink: 0;
}

/* Ajustes específicos para la tabla maintable */
:deep(.tabla-container) {
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  height: 100%;
  box-shadow: none !important;
  border-radius: 0 !important;
}

:deep(.custom-table) {
  height: 100%;
}

:deep(.q-table__top) {
  display: none;
}

:deep(.q-table__bottom) {
  padding: 8px 0;
  min-height: 40px;
}

:deep(.q-table__control) {
  font-size: 11px;
}

/* Responsive para pantallas muy pequeñas */
@media (max-width: 480px) {
  .vista-documentos-page {
    padding: 8px 10px;
  }
  
  .header {
    padding: 0 5px;
    margin-bottom: 10px;
  }
  
  .page-title {
    font-size: 16px;
  }
  
  .banner-ficha {
    padding: 10px 15px;
  }
  
  .ficha-title {
    font-size: 14px;
  }
  
  .filter-section {
    padding: 12px 15px 8px;
  }
  
  .table-section {
    padding: 0 15px 12px;
  }
  
  .estado-badge {
    min-width: 80px;
    padding: 5px 10px;
    font-size: 10px;
  }
  
  .ver-documentos-link {
    font-size: 11px;
  }
  
  .footer {
    font-size: 9px;
    padding: 6px 0;
  }

  :deep(.q-table__bottom) {
    padding: 6px 0;
    min-height: 35px;
  }
}
</style>