<template>
  <q-btn
    label="Enviar"
    class="boton-enviar"
    unelevated
    @click="handleClick"
  />
</template>

<script setup>
const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.boton-enviar {
  background-color: #39A900;
  color: white;
  border-radius: 15px;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none; /* mantiene la E mayúscula y el resto normal */
  transition: background-color 0.3s ease;
}

.boton-enviar:hover {
  background-color: #2E8700;
}
</style>