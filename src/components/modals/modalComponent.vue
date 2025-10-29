<template>
  <q-dialog v-model="isOpen">
    <q-card :style="cardStyle">
    <q-card-section style="background-color: #39a900; color: white;">
        <slot name="header">
            <div class="text-h6">Título por defecto</div>
        </slot>
    </q-card-section>
        
      <q-card-section>
        <slot name="body">
          <!-- Contenido por defecto si no se proporciona ningún slot -->
          <p>Contenido del diálogo por defecto, esto no se va a ver en el modal si colocan contenido</p>
        </slot>
      </q-card-section>

      <q-card-actions align="right">
        <slot name="footer">
        
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose, watch, defineEmits, computed } from 'vue';

const props = defineProps({
  width: {
    type: String,
    default: '400px'
  },
  maxWidth: {
    type: String,
    default: '95vw'
  }
})

const isOpen = ref(false);

const emit = defineEmits(['accept', 'update:modelValue']);

const cardStyle = computed(() => ({
  minWidth: props.width,
  maxWidth: props.maxWidth
}))

const openDialog = () => {
  isOpen.value = true;
};

const closeDialog = () => {
  isOpen.value = false;
};

const acceptDialog = () => {
  isOpen.value = false;
  emit('accept');
};

// Emitir cambios de estado para sincronización externa
watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});

defineExpose({
  openDialog,
  closeDialog,
});
</script>
