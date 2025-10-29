<template>
      <BackButton />
  <div class="center" style="margin-top: 20px;">

    <div class="grid">
      <Card
        title="HORAS INSTRUCTORES" 
        subtitle="Consulta, Registro y Visualización de horas" 
        imgSrc="/src/assets/Horas_Instructor.jpg"
        route="/app/admin/horasintructores" 
        color="#5db82f" 
        textColor="white" />
      <Card
        title="PROCESO FORMATIVO" 
        subtitle="Consulta y Visualización" 
        imgSrc="/src/assets/Proceso_Formativo.jpg"
        route="/app/admin/procesoformativo" 
        color="#5db82f" 
        textColor="white" />
      <Card
        title="ALERTAS" 
        subtitle="Consulta Alertas" 
        imgSrc="/src/assets/Alertas.jpg"
        route="/app/admin/alertas" 
        color="#5db82f" 
        textColor="white" />
      <Card
        title="ALMACENAMIENTO" 
        subtitle="Consulta y Visualización de Almacenamiento" 
        imgSrc="/src/assets/Almacenamiento.jpg" 
        route="/app/admin/almacenamiento"
        color="#5db82f" 
        textColor="white" />
      <Card
        title="MODALIDADES" 
        subtitle="Consulta Modalidades" 
        imgSrc="/src/assets/Modalidades.jpg" 
        route="/app/admin/paramaterosmodalidades"
        color="#5db82f" 
        textColor="white" />
      <Card
        title="SEGURIDAD" 
        subtitle="Consulta y Visualización de Seguridad" 
        imgSrc="/src/assets/Seguridad.jpg" 
        route="/app/admin/seguridad"
        color="#5db82f" 
        textColor="white" />
      <Card 
        title="CORREOS" 
        subtitle="Consulta y Envío de Correos"
        imgSrc="/src/assets/SubirDocumentos_negro.jpg" 
        route="/vista" 
        color="#5db82f" 
        textColor="white" />

      <Card 
        title="PLANTILLAS" 
        subtitle="Consulta de Plantillas"
        imgSrc="/src/assets/Plantillas_Negro.jpg" 
        route="/app/admin/plantillas" 
        color="#5db82f" 
        textColor="white" />

    </div>
  </div>
</template>
<script setup>
import BackButton from '../../components/BackButton.vue';
import Card from 'src/components/cards/MenuCard.vue';

</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
}
</style>