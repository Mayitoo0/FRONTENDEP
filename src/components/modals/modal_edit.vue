<template>
  <q-dialog v-model="show" @hide="$emit('hide')">
    <q-card class="modal-card">
      <div class="text-center text-h5 q-pt-md">
        <slot name="title">Título del Modal</slot>
      </div>
      <q-card-section class="q-pt-md">
        <slot></slot>
      </q-card-section>
      <q-card-actions align="center" class="q-mt-xl q-gutter-md">
        <slot name="actions">
          <div class="row justify-center q-mt-xl q-gutter-md">
            <ModalButton
              type="cancel"
              :label="cancelLabel"
              @click="cancelEdit"
            />
            <ModalButton
              type="confirm"
              :label="confirmLabel"
              @click="handleUpdate"
              :disabled="!hasChanges"
            />
          </div>
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import ModalButton from '../ModalButton.vue'

const props = defineProps({
  modelValue: Boolean,
  loading: Boolean,
  hasChanges: {
    type: Boolean,
    default: false
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar'
  },
  confirmLabel: {
    type: String,
    default: 'Guardar'
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'hide', 'cancel'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const closeModal = () => {
  show.value = false
}

const cancelEdit = () => {
  emit('cancel')
}

const handleUpdate = () => {
  emit('submit')
}
</script>

<style scoped>
.modal-card {
  width: 1000px;
  max-width: 90vw;
  border-radius: 12px;
  padding: 20px;
}
</style>
