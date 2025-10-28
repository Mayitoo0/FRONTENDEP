<template>
  <q-dialog v-model="isOpen">
    <q-card>
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
import { ref, defineExpose } from 'vue';

const isOpen = ref(false);

const emit = defineEmits(['accept']);

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

defineExpose({
  openDialog,
  closeDialog,
});
</script>
