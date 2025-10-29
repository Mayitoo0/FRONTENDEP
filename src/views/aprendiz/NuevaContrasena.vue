<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header con logo SENA y título -->
    <q-header elevated class="text-white header-custom">
      <div class="header-content">
        <q-avatar class="header-avatar">
          <img src="/src/assets/logoSENABlanco.png" class="avatar-img" />
        </q-avatar>
        <span class="header-title">REPFORA EP</span>
      </div>
    </q-header>

    <q-page-container class="page-container">
      <div class="main-wrapper">
        <div class="back-button-wrapper">
          <BackButton :size="48" />
        </div>
        
        <div class="content-center">
          <q-card class="recovery-card" flat>
            <!-- Icono y título -->
            <div class="icon-section">
              <div class="icon-container">
                <q-icon name="lock" class="icon-main" color="green-6" />
              </div>
              <div class="title-section">
                Seguridad de su contraseña
              </div>
            </div>

            <!-- Descripción -->
            <div class="description-section">
              Crea una contraseña nueva y segura utilizando 8 caracteres como mínimo, al menos 1 número, 1 letra minúscula y 1 letra mayúscula. No uses contraseñas de otros sitios web ni un término que sea demasiado obvio.
            </div>

            <!-- Campo Nueva contraseña -->
            <div class="input-wrapper">
              <label class="input-label">Nueva contraseña</label>
              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                outlined
                class="password-input"
                @blur="validatePassword"
                @input="passwordTouched = true"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
              <div v-if="passwordTouched && passwordErrors.length > 0" class="error-messages">
                <div v-for="error in passwordErrors" :key="error" class="error-message">
                  <q-icon name="error" size="18px" color="red" class="q-mr-xs" />
                  {{ error }}
                </div>
              </div>
            </div>

            <!-- Campo Confirmar nueva contraseña -->
            <div class="input-wrapper">
              <label class="input-label">Confirmar nueva contraseña</label>
              <q-input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                outlined
                class="password-input"
                @blur="validateConfirmPassword"
                @input="confirmPasswordTouched = true"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>
              <div v-if="confirmPasswordTouched && confirmPasswordError" class="error-messages">
                <div class="error-message">
                  <q-icon name="error" size="18px" color="red" class="q-mr-xs" />
                  {{ confirmPasswordError }}
                </div>
              </div>
            </div>

            <!-- Botón cambiar contraseña -->
            <div class="button-section">
              <BotonEnviar 
                @click="cambiarContrasena" 
                :loading="loading"
                :disable="!isFormValid"
              />
            </div>
          </q-card>
        </div>
      </div>
    </q-page-container>

    <!-- Footer -->
    <q-footer class="footer-custom">
      <q-toolbar class="footer-toolbar">
        <q-toolbar-title class="text-center footer-text">
          REPFORA - Sena 2025 © Todos los derechos reservados
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications.js'
import BackButton from '@/components/BackButton.vue'
import BotonEnviar from '@/components/BotonEnviar.vue'

const router = useRouter()
const notify = useNotifications()

const loading = ref(false)
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordTouched = ref(false)
const confirmPasswordTouched = ref(false)

const passwordErrors = computed(() => {
  const errors = []
  if (!password.value) return errors
  
  if (password.value.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }
  if (!/\d/.test(password.value)) {
    errors.push('La contraseña debe tener al menos 1 número')
  }
  if (!/[a-z]/.test(password.value)) {
    errors.push('La contraseña debe tener al menos 1 letra minúscula')
  }
  if (!/[A-Z]/.test(password.value)) {
    errors.push('La contraseña debe tener al menos 1 letra mayúscula')
  }
  
  return errors
})

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return ''
  if (password.value !== confirmPassword.value) {
    return 'Las contraseñas no coinciden'
  }
  return ''
})

const isFormValid = computed(() => {
  return password.value &&
         confirmPassword.value &&
         passwordErrors.value.length === 0 &&
         !confirmPasswordError.value
})

function validatePassword() {
  passwordTouched.value = true
}

function validateConfirmPassword() {
  confirmPasswordTouched.value = true
}

async function cambiarContrasena() {
  loading.value = true
  
  try {
    // Aqui se hace la peticion al backend para cambiar la contraseña ej:
    // const response = await postData('/auth/reset-password', { password: password.value })
    
    // Simulación
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    notify.success('Contraseña cambiada exitosamente')
    router.push('/')
    
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    notify.error('Error al cambiar la contraseña. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Header */
.header-custom {
  background-color: #39a900;
  height: 90px;
}

.header-content {
  position: relative;
  height: 90px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-avatar {
  position: absolute;
  left: 16px;
  width: 80px;
  height: 80px;
  background: #5EB930;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  height: 80px;
  width: auto;
  background-color: #39a900;
}

.header-title {
  font-size: 2.5rem;
  font-weight: bold;
}

/* Page Container */
.page-container {
  background-color: #f9fafb;
  min-height: calc(100vh - 90px - 52px);
}

.main-wrapper {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 90px - 52px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
}

.content-center {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
}

.back-button-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

/* Card */
.recovery-card {
  width: 100%;
  border: 3px solid #39a900;
  border-radius: 24px;
  background: #fff;
  padding: 28px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
}

.icon-container {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.icon-main {
  font-size: 70px;
}

.title-section {
  font-size: 1.85rem;
  font-weight: bold;
  color: #111;
  text-align: center;
}

.description-section {
  text-align: center;
  color: #444;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
  max-width: 500px;
}

/* Input fields */
.input-wrapper {
  width: 100%;
  max-width: 500px;
  margin-bottom: 18px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  color: #111;
  font-weight: 500;
  font-size: 0.95rem;
}

.password-input :deep(.q-field__control) {
  border-radius: 8px;
  box-shadow: none;
  min-height: 48px;
}

.password-input :deep(.q-field__control):focus-within {
  border: 2px solid #39a900;
  box-shadow: none;
}

.password-input :deep(input) {
  font-size: 1rem;
}

.error-messages {
  margin-top: 8px;
}

.error-message {
  color: #d32f2f;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

/* Button section */
.button-section {
  width: 100%;
  max-width: 500px;
  padding-top: 8px;
  display: flex;
  justify-content: center;
}

/* Footer */
.footer-custom {
  background-color: #e0e0e0;
  color: black;
}

.footer-toolbar {
  min-height: 52px;
}

.footer-text {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Tablets */
@media (max-width: 768px) {
  .header-custom {
    height: 80px;
  }

  .header-content {
    height: 80px;
  }

  .header-avatar {
    width: 70px;
    height: 70px;
  }

  .avatar-img {
    height: 70px;
  }

  .header-title {
    font-size: 2.2rem;
  }

  .main-wrapper {
    min-height: calc(100vh - 80px - 48px);
    padding: 25px 18px;
  }

  .recovery-card {
    padding: 26px 28px;
  }

  .icon-container {
    width: 100px;
    height: 100px;
  }

  .icon-main {
    font-size: 64px;
  }

  .title-section {
    font-size: 1.75rem;
  }

  .description-section {
    font-size: 0.95rem;
    margin-bottom: 18px;
  }

  .input-wrapper {
    margin-bottom: 16px;
  }

  .input-label {
    font-size: 0.9rem;
  }

  .password-input :deep(.q-field__control) {
    min-height: 46px;
  }

  .error-message {
    font-size: 0.82rem;
  }

  .footer-toolbar {
    min-height: 48px;
  }

  .footer-text {
    font-size: 0.85rem;
  }
}

/* Móviles */
@media (max-width: 600px) {
  .header-custom {
    height: 70px;
  }

  .header-content {
    height: 70px;
  }

  .header-avatar {
    width: 60px;
    height: 60px;
    left: 12px;
  }

  .avatar-img {
    height: 60px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .main-wrapper {
    min-height: calc(100vh - 70px - 46px);
    padding: 20px 15px;
  }

  .back-button-wrapper {
    top: 15px;
    left: 15px;
  }

  .recovery-card {
    padding: 22px 20px;
    border-width: 2.5px;
  }

  .icon-section {
    margin-bottom: 14px;
  }

  .icon-container {
    width: 90px;
    height: 90px;
    margin-bottom: 12px;
  }

  .icon-main {
    font-size: 56px;
  }

  .title-section {
    font-size: 1.6rem;
  }

  .description-section {
    font-size: 0.9rem;
    line-height: 1.45;
    margin-bottom: 16px;
  }

  .input-wrapper {
    margin-bottom: 14px;
  }

  .input-label {
    font-size: 0.88rem;
    margin-bottom: 6px;
  }

  .password-input :deep(.q-field__control) {
    min-height: 44px;
  }

  .password-input :deep(input) {
    font-size: 0.95rem;
  }

  .error-message {
    font-size: 0.8rem;
  }

  .button-section {
    padding-top: 6px;
  }

  .footer-toolbar {
    min-height: 46px;
  }

  .footer-text {
    font-size: 0.8rem;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {
  .header-custom {
    height: 65px;
  }

  .header-content {
    height: 65px;
  }

  .header-avatar {
    width: 55px;
    height: 55px;
  }

  .avatar-img {
    height: 55px;
  }

  .header-title {
    font-size: 1.6rem;
  }

  .main-wrapper {
    min-height: calc(100vh - 65px - 44px);
    padding: 18px 12px;
  }

  .recovery-card {
    padding: 20px 16px;
    border-width: 2px;
  }

  .icon-container {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }

  .icon-main {
    font-size: 50px;
  }

  .icon-section {
    margin-bottom: 12px;
  }

  .title-section {
    font-size: 1.4rem;
  }

  .description-section {
    font-size: 0.85rem;
    margin-bottom: 14px;
  }

  .input-wrapper {
    margin-bottom: 12px;
  }

  .input-label {
    font-size: 0.85rem;
    margin-bottom: 6px;
  }

  .password-input :deep(.q-field__control) {
    min-height: 42px;
    border-radius: 6px;
  }

  .password-input :deep(input) {
    font-size: 0.9rem;
  }

  .error-message {
    font-size: 0.78rem;
  }

  .button-section {
    padding-top: 4px;
  }

  .footer-toolbar {
    min-height: 44px;
  }

  .footer-text {
    font-size: 0.75rem;
  }
}

/* Móviles muy pequeños */
@media (max-width: 360px) {
  .header-custom {
    height: 60px;
  }

  .header-content {
    height: 60px;
  }

  .header-avatar {
    width: 50px;
    height: 50px;
    left: 10px;
  }

  .avatar-img {
    height: 50px;
  }

  .header-title {
    font-size: 1.4rem;
  }

  .main-wrapper {
    min-height: calc(100vh - 60px - 42px);
    padding: 15px 10px;
  }

  .back-button-wrapper {
    top: 12px;
    left: 12px;
  }

  .recovery-card {
    padding: 18px 14px;
  }

  .icon-container {
    width: 70px;
    height: 70px;
    margin-bottom: 8px;
  }

  .icon-main {
    font-size: 44px;
  }

  .icon-section {
    margin-bottom: 10px;
  }

  .title-section {
    font-size: 1.25rem;
  }

  .description-section {
    font-size: 0.8rem;
    line-height: 1.4;
    margin-bottom: 12px;
  }

  .input-wrapper {
    margin-bottom: 10px;
  }

  .input-label {
    font-size: 0.82rem;
    margin-bottom: 5px;
  }

  .password-input :deep(.q-field__control) {
    min-height: 40px;
    border-radius: 6px;
  }

  .password-input :deep(input) {
    font-size: 0.85rem;
  }

  .error-message {
    font-size: 0.75rem;
  }

  .button-section {
    padding-top: 2px;
  }

  .footer-toolbar {
    min-height: 42px;
  }

  .footer-text {
    font-size: 0.7rem;
  }
}

/* Landscape móviles */
@media (max-height: 600px) and (orientation: landscape) {
  .main-wrapper {
    padding: 15px;
  }

  .recovery-card {
    padding: 16px 24px;
  }

  .icon-container {
    width: 70px;
    height: 70px;
    margin-bottom: 8px;
  }

  .icon-main {
    font-size: 44px;
  }

  .icon-section {
    margin-bottom: 10px;
  }

  .title-section {
    font-size: 1.3rem;
  }

  .description-section {
    font-size: 0.85rem;
    margin-bottom: 12px;
    line-height: 1.35;
  }

  .input-wrapper {
    margin-bottom: 10px;
  }

  .input-label {
    font-size: 0.8rem;
    margin-bottom: 4px;
  }

  .password-input :deep(.q-field__control) {
    min-height: 40px;
  }

  .password-input :deep(input) {
    font-size: 0.85rem;
  }

  .error-message {
    font-size: 0.75rem;
  }

  .button-section {
    padding-top: 2px;
  }
}
</style>