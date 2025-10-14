<template>
  <div>
    <h1 style="font-size: 40px; text-align: center;">SELECCIONAR FICHA</h1>

    <div class="center" style="display: flex; justify-content: center;">
      <q-select outlined v-model="model" :options="fiches" use-input input-debounce="500" @filter="getFiches"
        option-label="number" option-value="_id" emit-value map-options label="Seleccionar ficha" style="width: 800px"
        clearable />
    </div>

  </div>
</template>



<script setup>
import { onMounted, ref } from 'vue';
import { getData } from '../../services/apiClient';

const fiches = ref([])
const model = ref(null)

const getFiches = async (number, update) => {
  try {
    const response = await getData(`/fiches/listFiche?number=${number || ''}`)
    update(() => {
      fiches.value = response.msg
    })
  } catch (error) {
    console.log(error)
  }
}


</script>

<style scoped></style>