cardNovedades 

<template>
  <div class="urgent-section q-pa-md">


    <div v-if="loading" class="text-center q-pa-md">
      <SpinnerButton label="Cargando..." :loading="true" />
    </div>

    <div v-else-if="novedades.length" class="q-pa-sm">
      <div v-for="(novedad, idx) in novedades" :key="idx" class="novedad-item q-mb-md">
        <div class="novedad-content">
          <div class="text-h6">{{ novedad.tipo }}</div>
          <div class="text-subtitle1">{{ novedad.aprendiz }}</div>
          <div class="text-caption">Ficha: {{ novedad.ficha }}</div>
        </div>
        <div class="text-right text-caption text-grey-7 q-mt-xs">
          {{ tiempoTranscurrido(novedad.fecha) }}
        </div>
      </div>
    </div>

    <!-- Reemplazar con mensaje de error del backend -->
    <div class="  text-center">
          {{ errorMessage }}
        </div>
  </div>
      
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  novedades: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    required: true
  }
})

defineEmits(['mostrar-tabla'])

function tiempoTranscurrido(fecha) {
  const [dia, mes, anio] = fecha.split('/')
  const fechaFormateada = `${mes}/${dia}/${anio}`
  const dias = getDays(fechaFormateada)

  if (dias < 0) return `Faltan ${Math.abs(dias)} días`
  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Hace 1 día'
  return `Hace ${dias} días`
}

function getDays(fecha) {
  const fechaNovedad = new Date(fecha)
  const hoy = new Date()
  
  // Establecer las horas a medianoche para ambas fechas
  fechaNovedad.setHours(0, 0, 0, 0)
  hoy.setHours(0, 0, 0, 0)
  
  // Convertir a UTC para evitar problemas con zona horaria
  const utcNovedad = Date.UTC(fechaNovedad.getFullYear(), fechaNovedad.getMonth(), fechaNovedad.getDate())
  const utcHoy = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  
  // Calcular la diferencia en días
  return Math.floor((utcHoy - utcNovedad) / (1000 * 60 * 60 * 24))
}

</script>

<style scoped>
.urgent-section {
  background: #FFF3E0;
  border-radius: 8px;
}

.button-wide {
  width: 400px;
  max-width: 90%;
}

.novedad-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.novedad-content {
  padding: 8px 0;
}

.text-h6 {
  font-weight: 600;
  margin-bottom: 4px;
}

.text-subtitle1 {
  color: #666;
  margin-bottom: 2px;
}

.error-item {
  border-left: 4px solid #C10015;
}

.text-negative {
  color: #C10015;
  font-weight: 500;
}
</style>