<template>
  <div class="buscar-ficha-page">
    <!-- Header con flecha de retroceso -->
    <div class="header">
      <BackButton/>
    </div>

    <!-- Contenedor centrado -->
    <div class="content-wrapper">
      <!-- Título -->
      <h1 class="title">BUSCAR FICHA</h1>

      <!-- Buscador con dropdown -->
      <div class="search-container">
        <q-select
          v-model="fichaSeleccionada"
          :options="fichasFiltradas"
          use-input
          input-debounce="300"
          placeholder="Número de Ficha"
          outlined
          class="search-select"
          @filter="filterFichas"
          @update:model-value="handleSelectFicha"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" size="20px" />
          </template>

          <template v-slot:append>
            <q-icon name="expand_more" color="grey-6" />
          </template>
          
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- Lista de fichas sugeridas (opcional) -->
        <div v-if="!fichaSeleccionada && mostrarSugerencias && fichasSugeridas.length > 0" class="fichas-sugeridas">
          <div
            v-for="ficha in fichasSugeridas"
            :key="ficha"
            class="ficha-item"
            @click="selectFicha(ficha)"
          >
            Ficha {{ ficha }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// Estados
const fichaSeleccionada = ref(null)
const mostrarSugerencias = ref(false) // Cambiado a false para que no se muestre por defecto
const fichasFiltradas = ref([
  '2926076',
  '2926065',
  '2926034',
  '2589667'
])

// Todas las fichas disponibles
const todasLasFichas = [
  '2926076',
  '2926065',
  '2926034',
  '2589667'
]

// Fichas sugeridas por defecto
const fichasSugeridas = computed(() => {
  return todasLasFichas
})

// Funciones
function goBack() {
  router.back()
}

function filterFichas(val, update) {
  if (val === '') {
    update(() => {
      fichasFiltradas.value = todasLasFichas
      mostrarSugerencias.value = false
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    fichasFiltradas.value = todasLasFichas.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    )
    mostrarSugerencias.value = false
  })
}

function selectFicha(ficha) {
  fichaSeleccionada.value = ficha
  mostrarSugerencias.value = false
  handleSelectFicha(ficha)
}

function handleSelectFicha(ficha) {
  if (ficha) {
    // Navegar a la vista de documentos con el número de ficha
    router.push({
      name: 'vista-documentos',
      params: { ficha }
    })
  }
}
</script>

<style scoped>
.buscar-ficha-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 20px;
}

/* Header */
.header {
  margin-bottom: 60px;
  padding-left: 10px;
}
.title[data-v-58904e76] {
    font-size: 38px;
    font-weight: 700;
    color: #000;
    text-align: center;
    /* margin: 0 0 40px 0; */
    letter-spacing: 1px;
}
/* Contenedor centrado */
.content-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Título */


/* Contenedor de búsqueda */
.search-container {
  position: relative;
}

/* Select personalizado */
:deep(.search-select) {
  width: 100%;
}

:deep(.search-select .q-field__control) {
  border-radius: 25px;
  min-height: 55px;
  background-color: white;
  border: 2px solid #39A900;
  padding: 0 20px;
}

:deep(.search-select .q-field__control:before) {
  border: none;
}

:deep(.search-select .q-field__control:after) {
  border: none;
}

:deep(.search-select .q-field__native) {
  padding-left: 10px;
  font-size: 15px;
  color: #666;
}

:deep(.search-select .q-field__label) {
  color: #999;
  font-size: 15px;
  padding-left: 10px;
}

:deep(.search-select .q-field__prepend) {
  padding-left: 5px;
}

:deep(.search-select .q-field__append) {
  padding-right: 5px;
}

:deep(.search-select.q-field--focused .q-field__control) {
  background-color: white;
  border-color: #39A900;
  box-shadow: 0 0 0 3px rgba(57, 169, 0, 0.1);
}

:deep(.search-select .q-field__marginal) {
  height: 55px;
}

/* Input placeholder */
:deep(.search-select input::placeholder) {
  color: #999;
  font-size: 15px;
}

/* Lista de fichas sugeridas */
.fichas-sugeridas {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  margin-top: 8px;
  overflow: hidden;
  z-index: 10;
  border: 1px solid #E0E0E0;
}

.ficha-item {
  padding: 14px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #333;
  font-size: 15px;
  border-bottom: 1px solid #F0F0F0;
}

.ficha-item:last-child {
  border-bottom: none;
}

.ficha-item:hover {
  background-color: #F5F9F5;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 15px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 35px;
  }

  :deep(.search-select .q-field__control) {
    min-height: 50px;
    border-radius: 20px;
  }

  :deep(.search-select .q-field__marginal) {
    height: 50px;
  }
}
</style>