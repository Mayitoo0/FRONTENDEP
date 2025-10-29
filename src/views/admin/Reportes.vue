<template>
  <div class="page-content">

    <BackButton/>
    <div class="reportes-container">
    <!-- Título -->
    <div class="text-center q-mb-xl">
      <h1 class="text-h3 text-weight-bold text-black">
        Reportes
      </h1>
    </div>

    <!-- Grid de reportes -->
    <div class="reportes-grid">
      <Card title="Reporte por Año" subtitle="" imgSrc="/src/assets/Contrato_Aprendizaje.jpg" route="/app/admin/reporteporaño"
        color="#5db82f" textColor="white" />

      <Card title="Reporte por Modalidad" subtitle="" imgSrc="/src/assets/Modalidad,Contrato_negro.jpg"
        route="/app/admin/reportepormodalidad" color="#5db82f" textColor="white" />


      <Card title="Horas por Instructor" subtitle="" imgSrc="/src/assets/Horas_Instructor.jpg"
        route="/app/admin/horasporinstructor" color="#5db82f" textColor="white" />

      <Card title="Reporte por Empresa" subtitle="" imgSrc="/src/assets/SGVA_Negro.jpg"
        route="/app/admin/reporteporempresa" color="#5db82f" textColor="white" />
    </div>
    </div>
  </div>
</template>

<script setup>
import Card from 'src/components/cards/MenuCard.vue'
import BackButton from 'src/components/BackButton.vue'
</script>

<style scoped>
.page-content {
  padding: 1rem;
}

.reportes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.reportes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 800px;
}
</style>