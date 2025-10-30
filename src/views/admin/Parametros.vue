<template>
  <div class="page-content">
    <BackButton />
    
    <div class="center">
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
          route="/app/admin/correos" 
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
  </div>
</template>

<script setup>
import BackButton from '../../components/BackButton.vue';
import Card from 'src/components/cards/MenuCard.vue';
</script>

<style scoped>
.page-content {
  padding: 1rem;
  min-height: calc(100vh - 120px);
  box-sizing: border-box;
}

.center {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin-top: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  padding: 0;
  justify-items: center;
  align-items: stretch;
}

/* Media Queries para diferentes tamaños de pantalla */
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    max-width: 1200px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 0.75rem;
  }
  
  .center {
    margin-top: 15px;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 500px;
  }
  
  .page-content {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .center {
    margin-top: 10px;
  }
  
  .grid {
    gap: 10px;
  }
  
  .page-content {
    padding: 0.25rem;
  }
}

/* Para pantallas muy grandes */
@media (min-width: 1600px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1600px;
  }
}

/* Asegurar que las tarjetas se adapten correctamente */
:deep(.menu-card) {
  height: 100%;
  min-height: 200px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.menu-card):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Mejorar la legibilidad en móviles */
@media (max-width: 768px) {
  :deep(.menu-card) {
    min-height: 180px;
  }
  
  :deep(.card-title) {
    font-size: 1.1rem !important;
  }
  
  :deep(.card-subtitle) {
    font-size: 0.9rem !important;
  }
}

/* Scroll suave para móviles */
@media (max-width: 640px) {
  .page-content {
    overflow-x: hidden;
  }
}
</style>