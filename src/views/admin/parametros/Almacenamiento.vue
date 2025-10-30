<template>
  <q-page class="almacenamiento-page"> 
    <div class="page-content">
    <BackButton/>
    <div class="content-wrapper">
    
      <div class="page-header">
        <h1 class="page-title">ALMACENAMIENTO</h1>
      </div>

      <!-- Límites de Archivos Card -->
      <q-card class="config-card">
        <!-- Cabecera verde completamente separada y ovalada -->
        <div class="green-header-container">
          <div class="card-header-green">
            <div class="header-title">Límites de Archivos</div>
          </div>
        </div>
        
        <!-- Contenido blanco -->
        <q-card-section class="card-content">
          <div class="limit-row">
            <span class="limit-label">Tamaño máx - Seguimientos</span>
            <div class="limit-input-group">
              <q-select
                v-model="tamañoSeguimientos"
                :options="sizeOptions"
                dense
                outlined
                class="size-select"
                behavior="menu"
                @update:model-value="onChangeSeguimientos"
              />
              <span class="unit-label">MB</span>
            </div>
          </div>
          
          <div class="limit-row">
            <span class="limit-label">Tamaño máx - Certificaciones</span>
            <div class="limit-input-group">
              <q-select
                v-model="tamañoCertificaciones"
                :options="sizeOptions"
                dense
                outlined
                class="size-select"
                behavior="menu"
                @update:model-value="onChangeCertificaciones"
              />
              <span class="unit-label">MB</span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Notificaciones Card -->
      <q-card class="config-card">
        <!-- Cabecera verde completamente separada y ovalada -->
        <div class="green-header-container">
          <div class="card-header-green">
            <div class="header-title">Notificaciones</div>
          </div>
        </div>
        

        <q-card-section class="card-content">
          <div class="notification-row">
            <span class="notification-label">Correo emisor</span>
            <span class="notification-value">repfora@sena.edu.co</span>
          </div>
          
          <div class="notification-row">
            <span class="notification-label">Correo base institucional</span>
            <span class="notification-value">@sena.edu.co</span>
          </div>

          <div class="button-container">
            <BotonIngresar label="Aceptar"
              @click="guardarNotificaciones"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>


    <ModalComponent ref="confirmModal" width="500px">
      <template #header>
        <div class="modal-header-content">
          <q-btn
            flat
            round
            dense
            icon="close"
            color="dark"
            @click="closeModal"
            class="close-btn"
          />
        </div>
      </template>

      <template #body>
        <div class="modal-body-content">
          <p class="modal-question">¿Estás seguro que quieres guardar los cambios?</p>
          <p class="modal-text">Guardar almacenamiento</p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-center">
          <BotonIngresar label="Aceptar"
            @click="confirmarGuardado"
          />
        </div>
      </template>
    </ModalComponent>
    </div>
  </q-page>
  
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import ModalComponent from '../../../components/modals/modalComponent.vue'
import BackButton from '../../../components/BackButton.vue'
import BotonIngresar from '../../../components/BotonIngresar.vue'

const router = useRouter()
const $q = useQuasar()
const confirmModal = ref(null)

// Estados
const tamañoSeguimientos = ref(10)
const tamañoCertificaciones = ref(7)
const sizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20]

// Métodos
const onChangeSeguimientos = (value) => {
  $q.notify({
    message: `Tamaño seguimientos actualizado a ${value} MB`,
    color: 'positive',
    position: 'bottom'
  })
}

const onChangeCertificaciones = (value) => {
  $q.notify({
    message: `Tamaño certificaciones actualizado a ${value} MB`,
    color: 'positive',
    position: 'bottom'
  })
}

const guardarNotificaciones = () => {
  confirmModal.value.openDialog()
}

const closeModal = () => {
  confirmModal.value.closeDialog()
}

const confirmarGuardado = () => {
  confirmModal.value.closeDialog()
  $q.notify({
    message: 'Configuración guardada exitosamente',
    color: 'positive',
    position: 'top',
    icon: 'check_circle'
  })
}
</script>

<style scoped>
.page-content{
  padding: 1rem;
}
.almacenamiento-page {
  background-color: #f5f5f5;
  min-height: calc(100vh - 90px);
  padding: 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 15px 40px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 32px;
  padding-left: 0;
  max-width: 100%;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #000000;
  margin: 0;
  flex: 1;
  text-align: center;
  letter-spacing: 0.5px;
  margin-right: 48px;
}


.config-card {
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  overflow: visible;
  width: 100%;
  max-width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 0;
  position: relative;
}


.green-header-container {
  padding: 20px 40px 0 40px;
  margin-bottom: 10px;
}


.card-header-green {
  background-color: #5CB917;
  padding: 18px 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(92, 185, 23, 0.3);
  margin: 0 auto;
  max-width: 100%;
}

.header-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
  margin: 0;
}

.card-content {
  padding: 20px 50px 40px 50px;
  background-color: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 20px;
}


.limit-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  width: 100%;
  min-height: 60px;
}

.limit-row:first-child {
  padding-top: 0;
}

.limit-row:last-child {
  padding-bottom: 0;
}

.limit-label {
  font-size: 17px;
  color: #000000;
  font-weight: 600;
  flex: 1;
  min-width: 250px;
}

.limit-input-group {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.size-select {
  width: 100px;
}

:deep(.size-select .q-field__control) {
  border-radius: 8px;
  min-height: 44px;
  border-color: #d0d0d0;
  background-color: #ffffff;
}

:deep(.size-select .q-field__native) {
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  padding: 0 12px;
  color: #000000;
}

:deep(.size-select .q-field__append) {
  padding-left: 6px;
}

.unit-label {
  font-size: 15px;
  color: #757575;
  font-weight: 500;
  min-width: 35px;
}


.notification-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  width: 100%;
  min-height: 60px;
}

.notification-row:first-child {
  padding-top: 0;
}

.notification-row:last-child {
  padding-bottom: 0;
}

.notification-label {
  font-size: 17px;
  color: #000000;
  font-weight: 600;
  flex: 1;
  min-width: 250px;
}

.notification-value {
  font-size: 16px;
  color: #000000;
  font-weight: 500;
  text-align: right;
  flex-shrink: 0;
}


.button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 15px;
}


.modal-header-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 10px 10px 0 0;
  background-color: transparent;
}

.close-btn {
  color: #000000 !important;
}

.modal-body-content {
  text-align: center;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background-color: white;
}

.modal-question {
  font-size: 18px;
  color: #000000;
  margin: 0;
  font-weight: 600;
  line-height: 1.4;
}

.modal-text {
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}


.modal-footer-center {
  display: flex;
  justify-content: center;
  padding: 0 20px 30px 20px;
  width: 100%;
  background-color: white;
}

@media (max-width: 1024px) {
  .content-wrapper {
    max-width: 95%;
    padding: 24px 10px 35px;
  }
  
  .page-title {
    font-size: 28px;
    margin-right: 40px;
  }
  
  .card-content {
    padding: 20px 40px 35px 40px;
  }
  
  .green-header-container {
    padding: 18px 35px 0 35px;
  }
  
  .card-header-green {
    padding: 16px 25px;
    border-radius: 14px;
  }
  
  .limit-label,
  .notification-label {
    min-width: 220px;
    font-size: 16px;
  }
}


@media (max-width: 768px) {
  .content-wrapper {
    padding: 20px 8px 30px;
  }
  
  .page-header {
    margin-bottom: 28px;
    gap: 3px;
  }
  
  .page-title {
    font-size: 26px;
    margin-right: 35px;
  }
  
  .config-card {
    min-height: 180px;
    border-radius: 18px;
    margin-bottom: 25px;
  }
  
  .green-header-container {
    padding: 15px 30px 0 30px;
  }
  
  .card-header-green {
    border-radius: 12px;
    padding: 14px 20px;
    max-width: 85%;
  }
  
  .card-content {
    border-radius: 18px;
    padding: 15px 35px 30px 35px;
  }
  
  .header-title {
    font-size: 18px;
  }
  
  .limit-row,
  .notification-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 18px 0;
    min-height: auto;
  }
  
  .limit-input-group {
    align-self: flex-end;
    width: 100%;
    justify-content: flex-end;
  }

  .notification-value {
    align-self: flex-end;
    text-align: right;
    width: 100%;
  }
  
  .limit-label,
  .notification-label {
    min-width: auto;
    font-size: 16px;
  }
  
  .button-container {
    margin-top: 25px;
  }
}


@media (max-width: 480px) {
  .content-wrapper {
    padding: 15px 5px 25px;
  }
  
  .page-header {
    gap: 2px;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 22px;
    margin-right: 30px;
  }
  
  .config-card {
    border-radius: 16px;
    margin-bottom: 20px;
    min-height: 160px;
  }
  
  .green-header-container {
    padding: 12px 20px 0 20px;
  }
  
  .card-header-green {
    border-radius: 10px;
    padding: 12px 15px;
    max-width: 80%;
  }
  
  .card-content {
    border-radius: 16px;
    padding: 12px 20px 25px 20px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .limit-row,
  .notification-row {
    padding: 15px 0;
    gap: 12px;
  }
  
  .limit-label,
  .notification-label {
    font-size: 15px;
  }
  
  .notification-value {
    font-size: 14px;
  }
  
  .size-select {
    width: 90px;
  }
  
  :deep(.size-select .q-field__control) {
    min-height: 40px;
  }
  
  .button-container {
    margin-top: 20px;
  }


  .modal-body-content {
    padding: 20px 25px;
  }
  
  .modal-question {
    font-size: 16px;
  }
  
  .modal-text {
    font-size: 14px;
  }
}


@media (max-width: 300px) {
  .content-wrapper {
    padding: 12px 3px 20px;
    min-width: 280px;
  }
  
  .page-header {
    gap: 1px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-title {
    font-size: 20px;
    margin-right: 0;
    order: 2;
    width: 100%;
    text-align: center;
    margin-top: 5px;
  }
  
  .config-card {
    border-radius: 14px;
    margin-bottom: 15px;
    min-height: auto;
  }
  
  .green-header-container {
    padding: 10px 15px 0 15px;
  }
  
  .card-header-green {
    border-radius: 8px;
    padding: 10px 12px;
    max-width: 75%;
  }
  
  .card-content {
    border-radius: 14px;
    padding: 10px 15px 20px 15px;
  }
  
  .header-title {
    font-size: 15px;
  }
  
  .limit-row,
  .notification-row {
    padding: 12px 0;
    gap: 10px;
  }
  
  .limit-label,
  .notification-label {
    font-size: 14px;
    word-break: break-word;
  }
  
  .notification-value {
    font-size: 13px;
    word-break: break-all;
  }
  
  .limit-input-group {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
  
  .size-select {
    width: 80px;
  }
  
  :deep(.size-select .q-field__control) {
    min-height: 36px;
  }
  
  :deep(.size-select .q-field__native) {
    font-size: 14px;
    padding: 0 8px;
  }
  
  .unit-label {
    font-size: 14px;
    min-width: 30px;
  }
  
  .button-container {
    margin-top: 15px;
  }

  /* Modal responsive muy pequeño */
  .modal-body-content {
    padding: 15px 20px;
    gap: 12px;
  }
  
  .modal-question {
    font-size: 15px;
  }
  
  .modal-text {
    font-size: 13px;
  }
  
  .modal-footer-center {
    padding: 0 15px 20px 15px;
  }
}
</style>