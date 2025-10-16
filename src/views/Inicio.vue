<template>
  <div class="center">
    <div class="grid">
      <Card
        v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
        title="SGVA" 
        subtitle="Consulta, Registro y Visualización de empresas" 
        imgSrc="/src/assets/Monitoria.jpg"
        route="admin/empresas" 
        color="#5db82f" 
        textColor="white" />
      <Card
        v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
        title="Vista de Documentos" 
        subtitle="Consulta y Visualización" 
        imgSrc="/src/assets/Almacenamiento.jpg"
        route="/vista" 
        color="#5db82f" 
        textColor="white" />
      <Card
        v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
        title="Instructores" 
        subtitle="Consulta Instructores" 
        imgSrc="/src/assets/Pasantia_ONG.jpg"
        route="admin/instructores" 
        color="#5db82f" 
        textColor="white" />
      <Card
        v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
        title="Aprendices" 
        subtitle="Consulta y Visualización" 
        imgSrc="/src/assets/pyme.jpg" 
        route="/app/admin/fichas"
        color="#5db82f" 
        textColor="white" />
      <Card
        v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
        title="Parametros" 
        subtitle="Consulta Parametros" 
        imgSrc="/src/assets/Pasantia_ONG.jpg" 
        route="/app/admin/parametros"
        color="#5db82f" 
        textColor="white" />
      <Card
        v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
        title="Reportes" 
        subtitle="Consulta y Visualización de Reportes" 
        imgSrc="/src/assets/pyme.jpg" 
        route="/vista"
        color="#5db82f" 
        textColor="white" />

         <Card 
         v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' ||  role === 'ETAPA PRODUCTIVA PRESENCIAL' || role === 'ADMINISTRADOR'" 
         title="Novedades Admin"
        subtitle="Consulta y Visualización de Novedades" 
        imgSrc="/src/assets/pyme.jpg" 
        route="admin/novedadesAdmin" 
        color="#5db82f"
        textColor="white" />
      <!-- INSTRUCTORES -->
      
      <Card 
        v-if="role[0] === 'INSTRUCTOR'" 
        title="Informe Personal" 
        subtitle="Consultar mi informacion y Horas"
        imgSrc="/src/assets/Monitoria.jpg" 
        route="/vista" 
        color="#5db82f" 
        textColor="white" />

      <Card 
        v-if="role[0] === 'INSTRUCTOR'" 
        title="Seguimientos" 
        subtitle="Proceso de documentos de seguimiento"
        imgSrc="/src/assets/Almacenamiento.jpg" 
        route="/vista" 
        color="#5db82f" 
        textColor="white" />
      <Card 
        v-if="role[0] === 'INSTRUCTOR'" 
        title="Bitácoras" 
        subtitle="Procedimiento de subida de documentos de bitácoras"
        imgSrc="/src/assets/Pasantia_ONG.jpg" 
        route="/vista" 
        color="#5db82f" 
        textColor="white" />

      <Card 
        v-if="role[0] === 'INSTRUCTOR'" 
        title="Lista de Aprendices" 
        subtitle="Consultar mis aprendices asignados"
        imgSrc="/src/assets/pyme.jpg" 
        route="/vista" 
        color="#5db82f" 
        textColor="white" />

      <Card 
        v-if="role[0] === 'INSTRUCTOR'" 
        title="Historial" 
        subtitle="Consultar mi actividad en el sitio"
        imgSrc="/src/assets/Pasantia_ONG.jpg" 
        route="/vista" 
        color="#5db82f" 
        textColor="white" />

      <Card 
        v-if="role[0] === 'INSTRUCTOR'" 
        title="Novedades" 
        subtitle="Procesos Disciplinarios"
        imgSrc="/src/assets/pyme.jpg" 
        route="/vista" 
        color="#5db82f" 
        textColor="white" />

      
    </div>
  </div>
</template>
<script setup>
import Card from '../components/cards/MenuCard.vue';

import { ref, onMounted } from 'vue'

const role = ref('')
onMounted(() => {
  const Auth = JSON.parse(localStorage.getItem("auth"))
  if (Auth.user) {
    role.value = Auth.user.role
    if(role.value == "INSTRUCTOR OWNER" || role.value == 'INSTRUCTOR'){
      role.value = role.value.split(" ")
    }
  }

  console.log(role.value);
})

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