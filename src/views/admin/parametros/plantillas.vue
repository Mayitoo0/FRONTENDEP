<template>
  <div class="page-container">
    <BackButton />
    <h1 class="page-title">PLANTILLAS</h1>
    
    <div class="plantillas-container">
      <div class="plantillas-card">
        <div class="card-header">
          <q-icon name="description" size="32px" color="grey-7" />
        </div>
        
        <q-separator />
        
        <div class="plantillas-list">
          <div 
            v-for="plantilla in plantillas" 
            :key="plantilla.id"
            class="plantilla-item"
          >
            <span class="plantilla-name">{{ plantilla.name }}</span>
            <q-icon 
              name="circle" 
              size="12px" 
              :color="plantilla.active ? 'positive' : 'grey-4'" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from 'src/components/BackButton.vue'

const plantillas = ref([
  { id: 1, name: 'BITACORA', active: true },
  { id: 2, name: 'SEGUIMIENTO', active: true }
])
</script>

<style scoped>
.page-container {
  padding: 20px;
  position: relative;
}

.page-title {
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0 40px 0;
  color: #000;
}

.plantillas-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.plantillas-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  width: 95%;
  max-width: 1200px;
  overflow: hidden;
}

.card-header {
  background-color: #fff;
  padding: 20px 25px;
  display: flex;
  align-items: center;
}

.plantillas-list {
  padding: 0;
}

.plantilla-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 25px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.plantilla-item:last-child {
  border-bottom: none;
}

.plantilla-item:hover {
  background-color: #f9f9f9;
}

.plantilla-name {
  font-size: 16px;
  color: #666;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
