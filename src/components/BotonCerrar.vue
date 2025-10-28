<template>
  <q-btn
    label="Cerrar"
    class="boton-cerrar"
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
.boton-cerrar {
  background-color: #FF0000;
  color: white;
  border-radius: 15px;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  transition: background-color 0.3s ease;
}

.boton-cerrar:hover {
  background-color: #CC0000;
}
</style>