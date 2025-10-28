<template>
  <div class="contrato-container q-pa-lg">
    <div class="text-center q-mb-lg">
      <h2 class="text-h5 text-weight-bold text-green-9">
        Contrato de aprendizaje
      </h2>
    </div>
    <div class="text-body1 q-mb-md">
      <p>
        A continuación deberá enviar un archivo PDF con los siguientes documentos:
      </p>
      <ul class="q-pl-lg">
        <li>Contrato firmado por todas las partes</li>
        <li>Certificación de afiliación ARL</li>
        <li>Registro en planilla</li>
      </ul>
    </div>

    <!-- Subida de documento -->
    <div class="document-section q-pa-md q-mb-lg">
      <div class="doc-label text-weight-bold text-green-9 q-mb-sm">
        Documento PDF requerido
      </div>
      <input
        type="file"
        accept="application/pdf"
        @change="handleFileUpload"
        class="input-file"
      />
      <div v-if="fileName" class="text-caption q-mt-sm">
        Archivo seleccionado: <strong>{{ fileName }}</strong>
      </div>
    </div>

    <!-- Fecha estimada -->
    <div class="fecha-section q-mb-md">
      <p class="text-subtitle2 text-weight-bold">
        Fecha estimada de finalización: {{ fechaFinalizacion }}
      </p>
    </div>

    <!-- Botón de envío -->
    <div class="text-right">
      <BotonEnviar label="ENVIAR SOLICITUD" @click="enviarSolicitud" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BotonEnviar from 'src/components/BotonEnviar.vue'

// Estado del archivo
const fileName = ref('')
const fechaFinalizacion = ref('12/03/2026') 

// Manejar subida de archivo
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    fileName.value = file.name
  }
}

// Acción al enviar solicitud
const enviarSolicitud = () => {
  if (!fileName.value) {
    alert('Por favor selecciona un archivo PDF antes de enviar.')
    return
  }

  alert(`✅ Solicitud enviada correctamente con el archivo: ${fileName.value}`)
}
</script>

<style scoped>
.contrato-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.document-section {
  background: #f5f5f5;
  border-radius: 12px;
  border: 2px solid #4caf50;
  text-align: center;
}

.input-file {
  display: block;
  margin: 0 auto;
}

.fecha-section {
  border-top: 3px solid #4caf50;
  padding-top: 10px;
  text-align: left;
}
</style>