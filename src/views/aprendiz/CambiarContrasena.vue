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
        <q-btn flat round icon="arrow_back" color="green-7" class="back-btn" @click="goBack" />
        
        <div class="content-center">
          <q-card class="recovery-card" flat>
            <!-- Logo SENA -->
            <div class="logo-section">
              <img src="/src/assets/logo-sena.png" alt="Logo SENA" class="logo-img">
            </div>

            <!-- Título -->
            <div class="title-section">
              Cambia tu Contraseña
            </div>

            <!-- Descripción -->
            <div class="description-section">
              Ingrese la dirección de correo electrónico verificada de su cuenta de usuario y le enviaremos un enlace para restablecer su contraseña.
            </div>

            <!-- Label correo -->
            <div class="label-section">
              Correo electrónico:
            </div>

            <!-- Campo de correo -->
            <div class="input-section">
              <q-input 
                v-model="email" 
                type="email" 
                placeholder="karoluquez12@gmail.com" 
                outlined 
                dense
                class="email-input"
                :error="emailError"
                :error-message="emailErrorMessage"
                @blur="validateEmail"
                @input="validateEmail"
                :rules="[
                  val => !!val || 'El correo es requerido',
                  val => isValidEmail(val) || 'Debe ser un correo de Gmail o Hotmail válido'
                ]"
              />
            </div>

            <!-- Botón enviar -->
            <div class="button-section">
              <q-btn 
                @click="sendResetEmail" 
                unelevated 
                no-caps 
                class="submit-btn"
                :loading="loading"
              >
                Enviar correo electrónico de restablecimiento
              </q-btn>
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const email = ref('')
const loading = ref(false)
const emailError = ref(false)
const emailErrorMessage = ref('')

const isValidEmail = (emailValue) => {
    if (!emailValue) return false
    
    const emailLower = emailValue.toLowerCase().trim()
    const gmailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/
    const hotmailPattern = /^[a-zA-Z0-9._-]+@(hotmail|outlook)\.(com|es)$/
    
    return gmailPattern.test(emailLower) || hotmailPattern.test(emailLower)
}

const validateEmail = () => {
    if (!email.value) {
        emailError.value = true
        emailErrorMessage.value = 'El correo es requerido'
        return false
    }
    
    if (!isValidEmail(email.value)) {
        emailError.value = true
        emailErrorMessage.value = 'Debe ser un correo válido de Gmail o Hotmail (ejemplo: usuario@gmail.com)'
        return false
    }
    
    emailError.value = false
    emailErrorMessage.value = ''
    return true
}

const sendResetEmail = async () => {
    if (!validateEmail()) {
        $q.notify({
            type: 'negative',
            message: 'Por favor ingrese un correo de Gmail o Hotmail válido',
            position: 'top'
        })
        return
    }

    loading.value = true

    try {
        // Aquí se hace la petición al backend para enviar el correo de restablecimiento ej:
        // const response = await postData('/auth/forgot-password', { email: email.value })
        
        // Simulación
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        $q.notify({
            type: 'positive',
            message: `Correo de restablecimiento enviado a: ${email.value}`,
            position: 'top'
        })

        // Redirigir a la página de ingresar código
        router.push('/IngresarCodigoContrasena')
        
    } catch (error) {
        console.error('Error al enviar correo de restablecimiento:', error)
        $q.notify({
            type: 'negative',
            message: 'Error al enviar el correo. Intenta nuevamente.',
            position: 'top'
        })
    } finally {
        loading.value = false
    }
}

const goBack = () => {
    window.history.back()
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

.back-btn {
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

.logo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.logo-img {
  width: 90px;
  height: auto;
}

.title-section {
  font-size: 1.85rem;
  font-weight: bold;
  color: #111;
  text-align: center;
  margin-bottom: 16px;
}

.description-section {
  text-align: center;
  color: #444;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
  max-width: 500px;
}

.label-section {
  text-align: center;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  width: 100%;
}

.input-section {
  width: 100%;
  max-width: 500px;
  margin-bottom: 18px;
}

.email-input {
  width: 100%;
}

.email-input :deep(.q-field__control) {
  height: 52px;
  border-radius: 8px;
}

.email-input :deep(.q-field__native) {
  font-size: 1rem;
  color: #444;
}

.button-section {
  width: 100%;
  max-width: 500px;
}

.submit-btn {
  width: 100%;
  height: 52px;
  background-color: #39a900 !important;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
}

.submit-btn:hover {
  background-color: #2d8000 !important;
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
    padding: 35px 28px;
  }

  .logo-img {
    width: 90px;
  }

  .title-section {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  .description-section {
    font-size: 1rem;
    margin-bottom: 24px;
  }

  .label-section {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .input-section {
    margin-bottom: 20px;
  }

  .email-input :deep(.q-field__control) {
    height: 52px;
  }

  .submit-btn {
    height: 52px;
    font-size: 0.95rem;
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

  .back-btn {
    top: 15px;
    left: 15px;
  }

  .recovery-card {
    padding: 28px 22px;
    border-width: 2.5px;
  }

  .logo-img {
    width: 80px;
  }

  .logo-section {
    margin-bottom: 16px;
  }

  .title-section {
    font-size: 1.6rem;
    margin-bottom: 18px;
  }

  .description-section {
    font-size: 0.95rem;
    margin-bottom: 20px;
  }

  .label-section {
    font-size: 0.95rem;
  }

  .input-section {
    margin-bottom: 18px;
  }

  .email-input :deep(.q-field__control) {
    height: 50px;
  }

  .email-input :deep(.q-field__native) {
    font-size: 0.95rem;
  }

  .submit-btn {
    height: 50px;
    font-size: 0.9rem;
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
    padding: 24px 18px;
    border-width: 2px;
  }

  .logo-img {
    width: 70px;
  }

  .title-section {
    font-size: 1.4rem;
    margin-bottom: 16px;
  }

  .description-section {
    font-size: 0.88rem;
    margin-bottom: 18px;
    line-height: 1.5;
  }

  .label-section {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .input-section {
    margin-bottom: 16px;
  }

  .email-input :deep(.q-field__control) {
    height: 48px;
  }

  .email-input :deep(.q-field__native) {
    font-size: 0.9rem;
  }

  .submit-btn {
    height: 48px;
    font-size: 0.85rem;
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

  .back-btn {
    top: 12px;
    left: 12px;
  }

  .recovery-card {
    padding: 20px 16px;
  }

  .logo-img {
    width: 60px;
  }

  .logo-section {
    margin-bottom: 12px;
  }

  .title-section {
    font-size: 1.25rem;
    margin-bottom: 14px;
  }

  .description-section {
    font-size: 0.82rem;
    margin-bottom: 16px;
    line-height: 1.45;
  }

  .label-section {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }

  .input-section {
    margin-bottom: 14px;
  }

  .email-input :deep(.q-field__control) {
    height: 46px;
  }

  .email-input :deep(.q-field__native) {
    font-size: 0.85rem;
  }

  .submit-btn {
    height: 46px;
    font-size: 0.8rem;
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
    padding: 20px 24px;
  }

  .logo-img {
    width: 60px;
  }

  .logo-section {
    margin-bottom: 10px;
  }

  .title-section {
    font-size: 1.3rem;
    margin-bottom: 12px;
  }

  .description-section {
    font-size: 0.85rem;
    margin-bottom: 14px;
    line-height: 1.4;
  }

  .label-section {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }

  .input-section {
    margin-bottom: 12px;
  }

  .email-input :deep(.q-field__control) {
    height: 44px;
  }

  .submit-btn {
    height: 44px;
    font-size: 0.85rem;
  }
}
</style>