<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="text-white custom-header">
      <div class="header-container">
        <div class="row items-center" style="gap:8px;">
          <q-btn flat round dense icon="menu" color="white" aria-label="Menú" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-avatar class="header-avatar">
          <img src="/src/assets/logoSENABlanco.png" alt="logo SENA" />
        </q-avatar>
        </div>
        <span class="header-title">REPFORA EP</span>
        <div class="header-action-btn">
          <q-btn fab color="white" size="lg" @click="showMorph = !showMorph" unelevated>
            <span style="font-weight:bold; color:#39a900;">yo</span>
          </q-btn>
        </div>
      </div>
    </q-header>

    <!-- Drawer SIMPLE: se abre/cierra con el botón hamburguesa -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="260" content-class="bg-white">
      <div class="drawer-header">
        <q-avatar class="drawer-avatar">
          <img src="/src/assets/images/logo-sena copy.png" alt="logo SENA" />
        </q-avatar>
        <div class="drawer-user">
          <div class="text-subtitle1 text-weight-bold">{{ firstName || 'Usuario' }}</div>
          <div class="text-caption">{{ roleLabel }}</div>
        </div>
      </div>
      <q-separator color="green-5" />
      <q-scroll-area style="height: calc(100% - 116px);">
        <!-- Lista mínima de navegación por rol -->
        <q-list padding separator>
          <template v-for="item in navItems" :key="item.to">
            <q-item clickable v-ripple @click="go(item.to)" class="drawer-item">
              <q-item-section avatar>
                <q-icon :name="item.icon" color="grey-7" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <transition name="fade">
      <div v-if="showMorph" class="morph-float-card">
        <q-card class="bg-primary text-white morph-card">
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

    <q-page-container class="page-container">
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

            <q-scroll-area class="notification-scroll-area">
              <q-list padding>
                <q-item v-for="note in notifications" :key="note.id" clickable :class="{ 'unread': !note.read }">
                  <q-item-section avatar>
                    <div class="note-thumb"></div>
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
const leftDrawerOpen = ref(false)
const firstName = ref('')
const lastName = ref('')
const role = ref('')
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const roleLabel = computed(() => {
  if (Array.isArray(role.value)) {
    return role.value.join(' ')
  }
  return role.value || 'Sin rol'
})
// Ítems de navegación mínimos por rol (sin captions, sin búsqueda)
const navItems = computed(() => {
  const isAdmin = role.value === 'ETAPA PRODUCTIVA VIRTUAL' || role.value === 'ETAPA PRODUCTIVA PRESENCIAL' || role.value === 'ADMINISTRADOR'
  const isInstructor = (Array.isArray(role.value) && role.value[0] === 'INSTRUCTOR') || role.value === 'INSTRUCTOR'
  const isAprendiz = role.value === 'APRENDIZ'

  if (isAdmin) {
    return [
      { label: 'Inicio', icon: 'home', to: '/app/inicio' },
      { label: 'Empresas', icon: 'business', to: '/app/admin/empresas' },
      { label: 'Documentos', icon: 'folder', to: '/app/admin/buscar-ficha' },
      { label: 'Instructores', icon: 'group', to: '/app/admin/instructores' },
      { label: 'Fichas', icon: 'ballot', to: '/app/admin/fichas' },
      { label: 'Parámetros', icon: 'tune', to: '/app/admin/parametros' },
      { label: 'Reportes', icon: 'insights', to: '/app/admin/reportes' }
    ]
  }
  if (isInstructor) {
    return [
      { label: 'Inicio', icon: 'home', to: '/app/inicio' },
      { label: 'Informe Personal', icon: 'badge', to: '/app/instructor/informepersonal' },
      { label: 'Seguimientos', icon: 'visibility', to: '/app/instructor/seguimientos' },
      { label: 'Bitácoras', icon: 'description', to: '/app/instructor/bitacoras' },
      { label: 'Mis Aprendices', icon: 'people', to: '/app/instructor/misaprendices' }
    ]
  }
  if (isAprendiz) {
    return [
      { label: 'Inicio', icon: 'home', to: '/app/aprendiz/inicio' },
      { label: 'Bitácoras', icon: 'description', to: '/app/aprendiz/bitacoras' },
      { label: 'Datos Personales', icon: 'person', to: '/app/aprendiz/datospersonales' },
      { label: 'Mis Registros', icon: 'fact_check', to: '/app/aprendiz/misregistros' }
    ]
  }
  return []
})

function go(to) {
  router.push(to)
  leftDrawerOpen.value = false
}


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
    role.value = Auth.user.role
    if(role.value == "INSTRUCTOR OWNER" || role.value == 'INSTRUCTOR'){
      role.value = role.value.split(" ")
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

/* HEADER RESPONSIVE - LOGO SIN MODIFICACIONES */
.custom-header {
  background-color: #39a900;
  height: auto;
  min-height: 90px;
  position: relative;
}

.header-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto;
  min-height: 90px;
  padding: 0 32px;
  flex-wrap: wrap;
}

/* LOGO DEL SENA SIN MODIFICACIONES - MANTIENE TAMAÑO ORIGINAL */
.header-avatar {
  position: static;
  margin-right: 16px;
  width: 90px !important;
  height: 90px !important;
  flex-shrink: 0;
}

.header-avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* SOLO EL TÍTULO ES RESPONSIVE */
.header-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: bold;
  line-height: 1.2;
  color: white;
  flex: 1;
  text-align: center;
  margin: 0 16px;
}

.header-action-btn {
  position: static;
  flex-shrink: 0;
}

/* MORPH CARD RESPONSIVE */
.morph-float-card {
  position: fixed;
  top: 90px;
  right: 32px;
  z-index: 9999;
}

.morph-card {
  width: 320px;
  border-radius: 1.5em;
  background-color: #5ccb5f !important;
}

/* PAGE CONTAINER */
.page-container {
  max-width: 100% !important;
  padding-top: 0 !important;
  min-height: calc(100vh - 120px);
}

/* NOTIFICATIONS RESPONSIVE */
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
  max-width: calc(100vw - 32px);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  color: #222;
  z-index: 15000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.notification-scroll-area {
  height: 260px;
  max-height: 40vh;
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

/* FOOTER */
.custom-footer {
  background-color: #f5f5f5;
  color: #333;
  text-align: center;
  padding: 0;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
}

.footer-text {
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 8px;
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* MEDIA QUERIES */
@media (max-width: 1024px) {
  .header-container {
    padding: 0 24px;
  }
  
  .header-title {
    font-size: clamp(1.6rem, 3.5vw, 2.5rem);
  }
  
  .morph-float-card {
    right: 24px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    justify-content: space-between;
  }
  
  .header-title {
    font-size: 1.8rem;
    margin: 0 12px;
    text-align: center;
  }
  
  .header-avatar {
    width: 80px !important;
    height: 80px !important;
    margin-right: 12px;
  }
  
  .morph-float-card {
    top: 80px;
    right: 16px;
  }
  
  .morph-card {
    width: 280px;
  }
  
  .notification-container {
    right: 12px;
    bottom: calc(var(--app-footer-height, 50px) + 12px);
  }
  
  .notification-panel {
    width: 320px;
  }
}

@media (max-width: 480px) {
  .custom-header {
    min-height: 80px;
  }
  
  .header-container {
    padding: 0 12px;
    min-height: 80px;
  }
  
  .header-title {
    font-size: 1.5rem;
    margin: 0 8px;
  }
  
  .header-avatar {
    width: 70px !important;
    height: 70px !important;
    margin-right: 8px;
  }
  
  .morph-float-card {
    top: 75px;
    right: 12px;
  }
  
  .morph-card {
    width: 260px;
  }
  
  .notification-panel {
    width: 280px;
  }
  
  .notification-scroll-area {
    height: 220px;
  }
}

@media (max-width: 360px) {
  .header-container {
    padding: 0 8px;
  }
  
  .header-title {
    font-size: 1.3rem;
  }
  
  .header-avatar {
    width: 60px !important;
    height: 60px !important;
  }
  
  .morph-card {
    width: 240px;
  }
  
  .notification-panel {
    width: 260px;
  }
}

/* Z-INDEX MANAGEMENT */
.q-footer {
  z-index: 1000;
}

/* DRAWER THEME */
.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #ffffff;
  color: #111111;
  border-bottom: 1px solid #e6e6e6;
}

.drawer-avatar {
  width: 40px !important;
  height: 40px !important;
}

.drawer-user .text-caption {
  opacity: 0.9;
}

.drawer-item:hover {
  background-color: #f5f7f5;
}

.drawer-item.q-item--active {
  background-color: #eef5ee;
}
</style>