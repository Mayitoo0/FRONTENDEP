<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="text-white custom-header">
      <div class="header-container">
        <q-avatar size="90px" class="header-avatar">
          <img src="/src/assets/logoSENABlanco.png" alt="logo" />
        </q-avatar>
        <span class="header-title">REPFORA EP</span>
        <div class="header-action-btn">
          <q-btn fab color="white" size="lg" @click="showMorph = !showMorph" unelevated>
            <span style="font-weight:bold; color:#39a900;">yo</span>
          </q-btn>
        </div>
      </div>
    </q-header>

    <transition name="fade">
      <div v-if="showMorph" class="morph-float-card">
        <q-card class="bg-primary text-white"
          style="width: 320px; border-radius: 1.5em; background-color: #5ccb5f !important;">
          <q-card-section class="text-h6">
            ¡Hola, <strong>{{ firstName || 'Usuario' }} {{ lastName || '' }}</strong>, bienvenido!
          </q-card-section>
          <q-card-actions align="right">
            ¿Desea cerrar sesión?
            <q-btn flat round dense icon="logout" class="logout-btn" @click="logout" :aria-label="'Cerrar sesión'" />
          </q-card-actions>
        </q-card>
      </div>
    </transition>

    <q-page-container style="max-width: 100% !important; padding-top:0 !important;">
      <router-view />

      <div class="notification-container" aria-hidden="false">
        <transition name="fade">
          <q-card v-if="showNotifications" class="notification-panel shadow-5" role="dialog"
            aria-label="Panel de notificaciones">
            <div class="notification-header row items-center justify-between">
              <div>
                <div class="text-h6">Notificaciones</div>
                <div class="text-caption">{{ unreadCount }} sin leer</div>
              </div>
              <div class="row items-center">
                <q-btn flat dense round icon="done_all" title="Marcar todas" @click="markAllAsRead" />
                <q-btn flat dense round icon="close" title="Cerrar" @click="showNotifications = false" />
              </div>
            </div>

            <q-separator />

            <q-scroll-area style="height: 260px;">
              <q-list padding>
                <q-item v-for="note in notifications" :key="note.id" clickable :class="{ 'unread': !note.read }">
                  <q-item-section avatar>
                    <div class="note-thumb" style="background-image: url('/logo-del-sena-01.png')"></div>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ note.title }}</q-item-label>
                    <q-item-label caption lines="2">{{ note.description }}</q-item-label>
                    <div class="text-caption note-time">{{ note.time }}</div>
                  </q-item-section>

                  <q-item-section side top>
                    <div class="notification-actions column">
                      <q-btn flat dense round icon="done" color="positive" size="sm" @click.stop="markAsRead(note)"
                        title="Marcar como leída" />
                      <q-btn flat dense round icon="close" color="negative" size="sm"
                        @click.stop="deleteNotification(note.id)" title="Eliminar" />
                    </div>
                  </q-item-section>
                </q-item>

                <q-item v-if="notifications.length === 0">
                  <q-item-section class="text-center text-grey">
                    No hay notificaciones
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>

            <q-separator />

            <div class="notification-footer row items-center justify-between q-pa-sm">
              <q-btn flat label="Limpiar todas" color="negative" @click="clearAll"
                :disable="notifications.length === 0" />
              <q-btn flat label="Ver todas" color="primary" @click="openAll" />
            </div>
          </q-card>
        </transition>

        <q-btn ref="notiBtn" round icon="notifications" class="notifications-btn" @click="toggleNotifications"
          aria-label="Notificaciones">
          <q-badge v-if="unreadCount > 0" floating color="red" :label="unreadCount" />
        </q-btn>
      </div>
    </q-page-container>

    <q-footer reveal class="bg-grey-5 text-black custom-footer">
      <q-toolbar>
        <q-toolbar-title>
          <div class="footer-text">REPFORA - Sena 2025 © Todos los derechos reservados</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/authStore.js'

const showMorph = ref(false)
const firstName = ref('')
const lastName = ref('')
const role = ref('')
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()


// NOTIFICACIONES 
const showNotifications = ref(false)
const notifications = ref([
  { id: 1, title: 'Bienvenida', description: 'Tu cuenta se configuró correctamente.', time: 'Hace 2 horas', read: false },
  { id: 2, title: 'Nuevo mensaje', description: 'Tienes un nuevo mensaje de Juan Pérez.', time: 'Hace 5 horas', read: false },
  { id: 3, title: 'Actualización', description: 'Se actualizó tu perfil correctamente.', time: 'Ayer', read: true }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markAsRead(note) {
  note.read = true
}

function markAllAsRead() {
  notifications.value.forEach(n => { n.read = true })
  $q.notify({ message: 'Todas las notificaciones marcadas como leídas', color: 'positive' })
}

function deleteNotification(id) {
  const idx = notifications.value.findIndex(n => n.id === id)
  if (idx !== -1) {
    notifications.value.splice(idx, 1)
    $q.notify({ message: 'Notificación eliminada', color: 'info' })
  }
}

function clearAll() {
  notifications.value = []
  $q.notify({ message: 'Notificaciones limpiadas', color: 'negative' })
}

function openAll() {
  router.push('/vista')
}



// CARGUAR LA INFORMACION DEL USUARIO DESPLUES DE LOGUEARSE
onMounted(() => {
  const Auth = JSON.parse(localStorage.getItem("auth"))
  if (Auth.user) {
    if(Auth.user.firstName && Auth.user.lastName){
      firstName.value = Auth.user.firstName
      lastName.value = Auth.user.lastName
    }else{
      const Names = Auth.user.name.split(" ")
      firstName.value = Names[0]
      lastName.value = Names[1]
    }
  }
})


const logout = () => {
  try {
    authStore.clearAuth()

    $q.notify({
      message: 'Sesión cerrada correctamente',
      color: 'positive',
      icon: 'logout'
    })

    showMorph.value = false
    router.push('/')

  } catch (error) {
    $q.notify({
      message: 'Error al cerrar sesión',
      color: 'negative',
      icon: 'error'
    })
  }
}


</script>

<style scoped>
.q-layout,
.q-page-container {
  overflow: hidden;
}

.custom-header {
  background-color: #39a900;
  height: 90px;
  position: relative;
}

.header-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90px;
  padding: 0 32px;
}

.header-avatar {
  position: static;
  margin-right: 16px;
}

.header-avatar img {
  width: auto;
}

.header-title {
  font-size: 3rem;
  font-weight: bold;
  line-height: 80px;
  color: white;
}

.header-action-btn {
  position: static;
}

.morph-float-card {
  position: fixed;
  top: 90px;
  right: 32px;
  z-index: 9999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.custom-footer {
  background-color: #f5f5f5;
  color: #333;
  text-align: center;
  padding: 0;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
}

.footer-text {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.notification-container {
  position: fixed;
  right: 16px;

  bottom: calc(var(--app-footer-height, 56px) + 16px);
  z-index: 14000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
}


.notification-container>.q-card,
.notification-container>.q-btn {
  pointer-events: auto;
}

.notification-panel {
  margin-bottom: 12px;
  width: 360px;
  max-width: 90vw;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  color: #222;
  z-index: 15000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.note-thumb {
  width: 44px;
  height: 44px;
  background-color: #eee;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  background-image: url('/logo-del-sena-01.png');
}

.notifications-btn {
  margin: 0;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);

}

.q-footer {
  z-index: 1000;
}
</style>