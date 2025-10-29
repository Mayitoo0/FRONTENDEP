<template>
  <q-page-container style="margin-top: 5px;">
    <div class="center">
      <div class="grid">
        <!-- Cards para ETAPA PRODUCTIVA VIRTUAL/PRESENCIAL -->
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
  route="admin/buscar-ficha" 
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
          route="/app/admin/reportes"
          color="#5db82f" 
          textColor="white" />

        <!-- Card para ADMINISTRADOR -->
        <Card 
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL' || role === 'ADMINISTRADOR'" 
          title="Novedades Admin"
          subtitle="Consulta y Visualización de Novedades" 
          imgSrc="/src/assets/pyme.jpg" 
          route="admin/novedadesAdmin" 
          color="#5db82f"
          textColor="white" />
        
        <!-- Cards para INSTRUCTOR -->
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Informe Personal" 
          subtitle="Consultar mi informacion y Horas"
          imgSrc="/src/assets/información_personal.jpg" 
          route="/vista" 
          color="#5db82f" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Seguimientos" 
          subtitle="Proceso de documentos de seguimiento"
          imgSrc="/src/assets/SubirDocumentos_negro.jpg" 
          route="/vista" 
          color="#5db82f" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Bitácoras" 
          subtitle="Procedimiento de subida de documentos de bitácoras"
          imgSrc="/src/assets/Documentos_negro.jpg" 
          route="/vista" 
          color="#5db82f" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Lista de Aprendices" 
          subtitle="Consultar mis aprendices asignados"
          imgSrc="/src/assets/Aprendices_negro.jpg" 
          route="/vista" 
          color="#5db82f" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Historial" 
          subtitle="Consultar mi actividad en el sitio"
          imgSrc="/src/assets/Historial_negro.jpg" 
          route="/vista" 
          color="#5db82f" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Novedades" 
          subtitle="Procesos Disciplinarios"
          imgSrc="/src/assets/Proyecto_Productivo.jpg" 
          route="/vista" 
          color="#5db82f" 
          textColor="white" />

        <!-- Card para OWNER -->
        <Card 
          v-if="role[0] === 'OWNER'" 
          title="Novedades" 
          subtitle="Procesos Disciplinarios"
          imgSrc="/src/assets/pyme.jpg" 
          route="/vista" 
          color="#5db82f" 
          textColor="white" />
      </div>
    </div>
  </q-page-container>
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 0px;
  justify-items: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}

/* Media queries para diferentes tamaños de pantalla */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
  }
  .header-title[data-v-22686b16] {
    font-size: 2rem;}
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 400px;
  }
  
  .center {
    padding: 0 10px;
  }
.header-title[data-v-22686b16] {
    font-size: 1rem;
    font-weight: bold;
    line-height: 80px;
    color: white;
}
}


@media (max-width: 480px) {
  .grid {
    gap: 10px;
  }
  
  .center {
    padding: 0 5px;
  }
}
</style>