<template>
  <div class="center" style="margin-top: 80px;">
    <div class="grid">
      <Card
        title="Datos Personales"
        subtitle="Visualización de datos y cambios "
          imgSrc="/src/assets/información_personal.jpg"
        route="datospersonales"
        color="#5db82f"
        textColor="white"
      />
      <Card
        title="Bitacoras y Documentos"
        subtitle="Consulta, Registro y Visualización"
         imgSrc="/src/assets/Documentos_negro.jpg"
        route="bitacoras"
        color="#5db82f"
        textColor="white"
      />
      <Card
        title="Etapa Productiva"
        subtitle="Registro de Etapa Productiva"
     imgSrc="/src/assets/Modalidad,Contrato_negro.jpg"
        route="registroep"
        color="#5db82f"
        textColor="white"
      />
      <Card
        title="Proceso de EP"
        subtitle="Visualización del Proceso de EP"
         imgSrc="/src/assets/Avance_negro.jpg"
        route="procesoep"
        color="#5db82f"
        textColor="white"
      />
    </div>
  </div>
</template>

<script setup>
import Card from 'src/components/cards/MenuCard.vue'
</script>


<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 0px;
  justify-items: center;
  align-items: center;
}
.center {
    display: flex;
    justify-content: center;
    align-items: center;
  max-width: 100vw;
padding-top: 70px;
  overflow-y: auto;
  padding-top: 50px;
}
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
    max-width: 500px;
  }
.center[data-v-478b3464] {
    display: flex
;
    justify-content: center;
    align-items: center;
    max-width: 100vw;
    padding-top: 70px;
    overflow-y: auto;
    padding-top: 0px;
    padding-bottom: 50px;
}
}
</style>