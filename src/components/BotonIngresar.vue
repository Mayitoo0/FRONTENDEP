<template>
  <q-btn
    label="INGRESAR"
    class="boton-ingresar"
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
.boton-ingresar {
  background-color: #39A900;
  color: white;
  border-radius: 15px; /* esquinas redondeadas */
  border: none; /* sin borde visible */
  padding: 10px 25px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
}

.boton-ingresar:hover {
  background-color: #2E8700;
}
</style>