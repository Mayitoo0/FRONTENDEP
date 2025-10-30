<template>
  <div class="page-content">
  <!-- Forzar que la flecha lleve siempre al inicio del area de aprendiz -->
  <BackButton :disabled="showDialog || showConfirm" to="/app/aprendiz/inicio" />

    <div class="registro-container">
    <div class="text-center q-mb-xl">
      <h1 class="text-h3 text-weight-bold text-black">
        Registro Etapas Productivas
      </h1>
    </div>

    <div class="stepper-container q-mb-xl">
      <div class="stepper-wrapper">
        <div class="step-item">
          <div :class="['step-circle', currentStep >= 1 ? 'active' : '']">
            <div class="step-content">
              <div class="step-title">Selección</div>
              <div class="step-subtitle">De Modalidad</div>
            </div>
          </div>
        </div>
        <div class="step-item">
          <div :class="['step-circle', currentStep >= 2 ? 'active' : '']">
            <div class="step-content">
              <div class="step-title">Validación</div>
              <div class="step-subtitle">Administrativa</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="fechaConfirmada" class="fecha-container">
      <div class="fecha-confirmada">
        <strong>Fecha de inicio:</strong>
        <span class="q-ml-sm">{{ fechaConfirmada }}</span>
        <!-- Botón para volver a abrir el modal y cambiar la fecha -->
        <q-btn flat dense icon="edit" class="q-ml-sm" @click="openChangeDate" aria-label="Cambiar fecha" />
      </div>
    </div>

    <!-- Grid de Modalidades -->
    <div class="modalidades-grid q-mb-xl">
      <Card
        title="Contrato de aprendizaje"
        subtitle="Registra tu contrato de aprendizaje"
        imgSrc="/src/assets/Contrato_Aprendizaje.jpg"
        route="/app/aprendiz/modalidadesEP/contratodeaprendizaje"
        color="#5db82f"
        textColor="white"
      />
      <Card
        title="Pasantía U.P Familiar"
        subtitle="Registra tu pasantía U.P Familiar"
        imgSrc="/src/assets/pyme.jpg"
        route="/app/aprendiz/modalidadesEP/pasantiapyme"
        color="#5db82f"
        textColor="white"
      />
        <Card
        title="Pasantía PyME"
        subtitle="Registra tu pasantía en PyME"
        imgSrc="/src/assets/pyme.jpg"
        route="/app/aprendiz/modalidadesEP/pasantiapyme"
        color="#5db82f"
        textColor="white"
      />
      <Card
        title="Vínculo laboral o contractual"
        subtitle="Registra tu vínculo laboral"
        imgSrc="/src/assets/Contrato_Aprendizaje.jpg"
        route="/app/aprendiz/modalidadesEP/vinculolaboralcontractual"
        color="#5db82f"
        textColor="white"
      />
      <Card
        title="Pasantía ONG-Entidad"
        subtitle="Registra tu pasantía en ONG"
        imgSrc="/src/assets/Pasantia_ONG.jpg"
        route="/app/aprendiz/modalidadesEP/pasantiaongentidad"
        color="#5db82f"
        textColor="white"
      />
      <Card
        title="Monitoría SENA"
        subtitle="Registra tu monitoría SENA"
        imgSrc="/src/assets/Monitoria.jpg"
        route="/app/aprendiz/modalidadesEP/monitoriasena"
        color="#5db82f"
        textColor="white"
      />
      <Card
        title="Proyecto Productivo"
        subtitle="Registra tu proyecto productivo"
        imgSrc="/src/assets/Contrato_Aprendizaje.jpg"
        route="/app/aprendiz/modalidadesEP/proyectoproductivo"
        color="#5db82f"
        textColor="white"
      />
    </div>
  </div>

  <!--MODAL PRINCIPAL -->
  <modalComponent ref="dialogRef" v-model="showDialog">
    <template #header>
      <div class="text-center">
        <q-icon name="event" color="white" size="2.5rem" class="q-mb-sm" />
        <div class="text-h6 text-weight-bold">Ingresa tu fecha de inicio</div>
        <div class="text-subtitle2">de etapa productiva</div>
      </div>
    </template>

    <template #body>
      <p class="text-center text-grey-7 q-mb-lg">
        El sistema calculará automáticamente la fecha estimada de finalización
      </p>
      <q-input
        v-model="selectedDate"
        outlined
        type="date"
        label="Selecciona fecha de inicio:"
        class="q-mb-md"
        :rules="[val => !!val || 'La fecha es requerida']"
      >
        <template v-slot:prepend>
          <q-icon name="event" color="primary" />
        </template>
      </q-input>
    </template>

    <template #footer>
      <div class="row justify-end q-gutter-md full-width">
        <BotonCerrar label="Cancelar" @click="showDialog = false" />
        <BotonEnviar label="Calcular Fecha" @click="calcularFecha" :disabled="!selectedDate" />
      </div>
    </template>
  </modalComponent>

  <!-- MODAL DE CONFIRMACIÓN -->
  <modalComponent ref="confirmRef" v-model="showConfirm">
    <template #header>
      <div class="text-center">
        <div class="text-h6 text-weight-bold">
          ¿Seguro que quieres guardar esta fecha de inicio?
        </div>
      </div>
    </template>

    <template #body>
      <p class="text-center text-grey-8">
        Fecha seleccionada: <b>{{ selectedDate }}</b>
      </p>
    </template>

    <template #footer>
      <div class="row justify-end q-gutter-md full-width">
        <BotonCerrar label="Cancelar" @click="cerrarConfirmacion" />
        <BotonEnviar label="Confirmar" @click="confirmarFecha" />
      </div>
    </template>
  </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import modalComponent from 'src/components/modals/modalComponent.vue'
import BotonEnviar from 'src/components/BotonEnviar.vue'
import BotonCerrar from 'src/components/BotonCerrar.vue'
import Card from 'src/components/cards/MenuCard.vue'
import BackButton from 'src/components/BackButton.vue'


const $q = useQuasar()
const currentStep = ref(1)
const selectedDate = ref('')
const fechaConfirmada = ref('')
const dialogRef = ref(null)
const confirmRef = ref(null)
// Estados reactivos para controlar modales y desactivar el BackButton cuando estén abiertos
const showDialog = ref(false)
const showConfirm = ref(false)

onMounted(async () => {
  await nextTick()
  // Comportamiento deseado:
  // - Si ya hay una fecha confirmada guardada (localStorage), no volver a pedirla al entrar a la vista.
  // - Si no hay fecha guardada, abrir el diálogo para pedirla.
  const saved = localStorage.getItem('registroEP_fechaConfirmada')
  if (saved) {
    // Recuperar la fecha previamente confirmada y no mostrar el modal
    fechaConfirmada.value = saved
    showDialog.value = false
  } else {
    // No hay fecha guardada: abrir el diálogo para pedirla
    showDialog.value = true
  }
})

// Calcular fecha
const calcularFecha = () => {
  if (!selectedDate.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor selecciona una fecha de inicio',
      position: 'top'
    })
    return
  }

  // Cerrar diálogo y abrir confirmación usando los flags reactivos
  showDialog.value = false
  showConfirm.value = true
}

// Confirmar fecha
const confirmarFecha = () => {
  const fechaInicio = selectedDate.value
  fechaConfirmada.value = fechaInicio.split('-').reverse().join('/')
  // Guardar la fecha confirmada en localStorage para no volver a pedirla
  localStorage.setItem('registroEP_fechaConfirmada', fechaConfirmada.value)
  showConfirm.value = false
  currentStep.value = 2
}

// Cerrar modal confirmación
const cerrarConfirmacion = () => {
  showConfirm.value = false
}

// Abrir el modal para cambiar la fecha ya confirmada
function openChangeDate () {
  if (fechaConfirmada.value) {
    // fechaConfirmada está en formato dd/mm/yyyy -> convertir a yyyy-mm-dd para el input[type=date]
    const parts = fechaConfirmada.value.split('/')
    if (parts.length === 3) {
      const yyyy = parts[2]
      const mm = parts[1].padStart(2, '0')
      const dd = parts[0].padStart(2, '0')
      selectedDate.value = `${yyyy}-${mm}-${dd}`
    }
  }
  // Abrir diálogo para edición
  showConfirm.value = false
  showDialog.value = true
}
</script>

<style scoped>
.page-content {
  padding: 1rem;
}

.registro-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.stepper-container {
  background: #F5F5F5;
  border-radius: 12px;
  border: #d1d1d1 1px solid;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stepper-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.step-circle {
  width: 250px;
  height: 65px;
  border-radius: 45px;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  transition: all 0.3s ease;
}

.step-circle.active {
  background: #39a900;
  color: white;
  box-shadow: 0 4px 12px rgba(57, 169, 0, 0.3);
}

.step-content {
    text-align: center;
    padding: 1rem;
}

.step-title {
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1.2;
}

.step-subtitle {
    font-size: 1rem;
    margin-top: 0.25rem;
}

.fecha-container {
  display: flex;
  justify-content: flex-start;
  margin-left: 30px;
}

.fecha-confirmada {
  border: 1px solid #000000;
  color: #000000;
  font-size: 1.1rem;
  border-radius: 10px;
  padding: 10px 20px;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.modalidades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  justify-items: center;
}

@media (max-width: 768px) {
  .stepper-wrapper {
    flex-direction: column;
    gap: 1rem;
  }

  .step-circle {
    width: 120px;
    height: 120px;
  }
}
</style>