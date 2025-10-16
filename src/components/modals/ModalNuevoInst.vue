<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <q-card style="min-width: 800px; border-radius: 15px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-bold text-center col">{{ titulo }}</div>
        <q-btn icon="close" flat round dense color="red" @click="onCancel" />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <div class="text-subtitle1 text-bold q-mb-sm">Número de Cédula</div>
            <q-input v-model="instructor.cedula" outlined dense class="custom-input" type="number" />
          </div>
          <div class="col-6">
            <div class="text-subtitle1 text-bold q-mb-sm">Apellidos</div>
            <q-input
              v-model="instructor.apellidos"
              outlined
              dense
              class="custom-input"
              @keypress="onlyLetters"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-6">
            <div class="text-subtitle1 text-bold q-mb-sm">Nombres</div>
            <q-input
              v-model="instructor.nombres"
              outlined
              dense
              class="custom-input"
              @keypress="onlyLetters"
            />
          </div>
          <div class="col-6">
            <div class="text-subtitle1 text-bold q-mb-sm">Teléfono</div>
            <q-input v-model="instructor.telefono" outlined dense class="custom-input" type="number" />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-6">
            <div class="text-subtitle1 text-bold q-mb-sm">Email Institucional</div>
            <q-input
              v-model="instructor.email"
              outlined
              dense
              class="custom-input"
              type="email"
              :rules="[val => val.includes('@') || 'El email debe contener un @']"
              @keypress="blockSpaces"
              @paste="handlePaste"
            />
          </div>

          <div class="col-6">
            <div class="text-subtitle1 text-bold q-mb-sm">Dirección de Residencia</div>
            <q-input v-model="instructor.direccion" outlined dense class="custom-input" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md q-pt-lg">
        <q-btn
          label="Cancelar"
          unelevated
          class="bg-grey-4 text-black text-bold q-px-xl"
          style="border-radius: 8px;"
          @click="onCancel"
        />
        <q-btn
          label="Aceptar"
          unelevated
          class="bg-green-7 text-white text-bold q-px-xl q-ml-sm"
          style="border-radius: 8px;"
          @click="onAccept"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { watch, ref } from 'vue'

const $q = useQuasar()

const props = defineProps({
  modelValue: Boolean,
  instructor: Object,
  titulo: {
    type: String,
    default: 'Nuevo Instructor'
  }
})

const emit = defineEmits(['update:modelValue', 'accept', 'cancel'])

const originalData = ref({})


watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      originalData.value = { ...props.instructor }
    }
  }
)

const onCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

const onAccept = () => {
  const campos = [
    { key: 'cedula', label: 'Cédula' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'direccion', label: 'Dirección' }
  ]


  for (const campo of campos) {
    const valor = props.instructor[campo.key]
    if (!valor || !valor.toString().trim()) {
      $q.notify({
        type: 'negative',
        message: `Por favor complete el campo ${campo.label}`,
        position: 'top',
        timeout: 2000
      })
      return
    }
  }


  const haCambiado = campos.some(
    campo => props.instructor[campo.key]?.toString().trim() !== originalData.value[campo.key]?.toString().trim()
  )

  if (!haCambiado) {
    $q.notify({
      type: 'warning',
      message: 'Debe realizar al menos un cambio antes de continuar',
      position: 'top',
      timeout: 2000
    })
    return
  }

  emit('accept')
  emit('update:modelValue', false)
}

const onlyLetters = (event) => {
  const char = event.key || String.fromCharCode(event.charCode)
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
  if (!regex.test(char)) {
    event.preventDefault()
  }
}

const blockSpaces = (event) => {
  if (event.key === ' ') {
    event.preventDefault()
  }
}

const handlePaste = (event) => {
  const paste = (event.clipboardData || window.clipboardData).getData('text')
  if (paste.includes(' ')) {
    event.preventDefault()
  }
}
</script>

<style scoped>
.custom-input .q-field__control {
  border: 1px solid #5db82f !important;
  border-radius: 15px !important;
  padding-left: 10px;
  padding-right: 10px;
}

.custom-input .q-field__native {
  background-color: white;
}
</style>
