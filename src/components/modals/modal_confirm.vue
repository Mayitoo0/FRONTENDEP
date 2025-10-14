<template>
  <q-dialog v-model="show" persistent>
    <q-card class="confirmation-modal">
      <div class="column items-center q-pa-xl">
        <!-- Header del modal con icono -->
        <div class="row items-center justify-center q-mb-md" style="width:100%;">
          <!-- Icono configurable -->
          <q-icon 
            :name="icon" 
            size="48px" 
            :color="iconColor" 
            class="q-mr-sm" 
          />
          <!-- Título del modal -->
          <div class="text-h5 text-bold text-center">
            <slot name="title">{{ title }}</slot>
          </div>
        </div>
        
        <!-- Mensaje de confirmación -->
        <div class="text-body1 text-center q-mb-lg confirmation-text">
          <slot name="message">{{ message }}</slot>
        </div>

        <!-- Contenido adicional (como resumen de cambios) -->
        <div v-if="$slots.content" class="full-width">
          <slot name="content"></slot>
        </div>

        <!-- Botones de acción -->
        <div class="row justify-center q-gutter-md q-mt-md" style="width:100%;">
          <slot name="actions">
            <ModalButton
              type="cancel"
              :label="cancelLabel"
              @click="handleCancel"
            />
            <ModalButton
              type="confirm"
              :label="confirmLabel"
              :loading="loading"
              @click="handleConfirm"
            />
          </slot>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import ModalButton from '../ModalButton.vue'

const props = defineProps({
  modelValue: Boolean,
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmar'
  },
  message: {
    type: String,
    default: '¿Estás seguro de realizar esta acción?'
  },
  icon: {
    type: String,
    default: 'help_outline'
  },
  iconColor: {
    type: String,
    default: 'warning'
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar'
  },
  confirmLabel: {
    type: String,
    default: 'Confirmar'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
/* Contenedor principal del modal de confirmación */
.confirmation-modal {
  max-width: 600px;
  width: 90%;
  border-radius: 16px;
  background: #fff;
}

/* Texto principal de confirmación */
.confirmation-text {
  font-size: 1.2rem;
  color: #555;
  font-weight: 500;
}

/* Resumen de cambios realizados */
.changes-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  width: 100%;
  border-left: 4px solid #1976d2;
}

/* Cada ítem de cambio en el resumen */
.change-item {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

/* Valor anterior (tachado y en rojo) */
.old-value {
  color: #d32f2f;
  text-decoration: line-through;
}

/* Nuevo valor (verde y en negrita) */
.new-value {
  color: #2e7d32;
  font-weight: 600;
}
</style>