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
                <q-icon name="lock_reset" class="icon-main" color="green-6" />
              </div>
              <div class="title-section">
                Ingrese código
              </div>
            </div>

            <!-- Descripción -->
            <div class="description-section">
              Revisa tu correo electrónico para encontrar un código de verificación para restablecer tu contraseña. Si no aparece en unos minutos, revisa tu carpeta de correo no deseado.
            </div>

            <!-- Campos para el código -->
            <div class="code-inputs-container">
              <q-input
                v-for="(digit, index) in code"
                :key="index"
                v-model="code[index]"
                :ref="el => inputRefs[index] = el"
                outlined
                maxlength="1"
                class="code-input"
                @input="handleInput(index, $event)"
                @keydown="handleKeydown(index, $event)"
                @paste="handlePaste"
                input-class="text-center"
              />
            </div>

            <!-- Reenviar código -->
            <div class="reenviar-section">
              <a @click="reenviarCodigo" class="reenviar-link">
                <q-icon name="refresh" size="18px" class="q-mr-xs" />
                Reenviar código
              </a>
            </div>

            <!-- Botón enviar -->
            <div class="button-section">
              <BotonEnviar 
                @click="verificarCodigo" 
                :loading="loading"
                :disable="!codigoCompleto"
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
import BotonEnviar from '@/components/BotonEnviar.vue'
import BackButton from '@/components/BackButton.vue'

const router = useRouter()
const notify = useNotifications()

const loading = ref(false)
const code = ref(['', '', '', '', '', ''])
const inputRefs = ref([])

const codigoCompleto = computed(() => {
  return code.value.every(digit => digit !== '')
})

function handleInput(index, event) {
  const value = event.target.value
  
  if (value && /^\d$/.test(value)) {
    code.value[index] = value
    
    if (index < 5) {
      inputRefs.value[index + 1]?.focus()
    }
  } else if (!value) {
    code.value[index] = ''
  } else {
    code.value[index] = ''
    event.target.value = ''
  }
}

function handleKeydown(index, event) {
  if (event.key === 'Backspace') {
    if (!code.value[index] && index > 0) {
      inputRefs.value[index - 1]?.focus()
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

function handlePaste(event) {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').slice(0, 6)
  
  if (/^\d+$/.test(pastedData)) {
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      code.value[i] = pastedData[i]
    }
    
    const nextEmptyIndex = code.value.findIndex(digit => digit === '')
    if (nextEmptyIndex !== -1) {
      inputRefs.value[nextEmptyIndex]?.focus()
    } else {
      inputRefs.value[5]?.focus()
    }
  }
}

function reenviarCodigo() {
  notify.success('Código reenviado. Revisa tu correo electrónico.')
  code.value = ['', '', '', '', '', '']
  inputRefs.value[0]?.focus()
}

async function verificarCodigo() {
  loading.value = true
  
  try {
    const codigoCompleto = code.value.join('')
    
    //  petición al backend para verificar el código
    // const response = await postData('/auth/verify-code', { code: codigoCompleto })
    
    // Simulación de verificación
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Codigo invalido (descomentar cuando se conecte a el backend)
    // if (!response.success) {
    //   notify.error('Código inválido o expirado')
    //   code.value = ['', '', '', '', '', '']
    //   inputRefs.value[0]?.focus()
    //   return
    // }
    
    notify.success('Código verificado correctamente')
    router.push('/NuevaContrasena')
    
  } catch (error) {
    console.error('Error al verificar código:', error)
    notify.error('Código inválido o expirado')
    code.value = ['', '', '', '', '', '']
    inputRefs.value[0]?.focus()
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

/* Código inputs */
.code-inputs-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.code-input {
  width: 58px;
}

.code-input :deep(.q-field__control) {
  height: 65px;
  border-radius: 12px;
  box-shadow: none;
}

.code-input :deep(input) {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
}

.code-input :deep(.q-field__control):focus-within {
  border: 2px solid #39a900;
  box-shadow: none;
}

/* Reenviar */
.reenviar-section {
  text-align: center;
  margin-bottom: 18px;
}

.reenviar-link {
  color: #39a900;
  cursor: pointer;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.reenviar-link:hover {
  text-decoration: underline;
  color: #2d8000;
}

/* Button section */
.button-section {
  width: 100%;
  max-width: 500px;
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

  .code-input {
    width: 54px;
  }

  .code-input :deep(.q-field__control) {
    height: 62px;
  }

  .code-input :deep(input) {
    font-size: 24px;
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

  .code-inputs-container {
    gap: 8px;
    margin-bottom: 14px;
  }

  .code-input {
    width: 48px;
  }

  .code-input :deep(.q-field__control) {
    height: 58px;
  }

  .code-input :deep(input) {
    font-size: 22px;
  }

  .reenviar-section {
    margin-bottom: 16px;
  }

  .reenviar-link {
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

  .code-inputs-container {
    gap: 6px;
    margin-bottom: 12px;
  }

  .code-input {
    width: 44px;
  }

  .code-input :deep(.q-field__control) {
    height: 54px;
  }

  .code-input :deep(input) {
    font-size: 20px;
  }

  .reenviar-section {
    margin-bottom: 14px;
  }

  .reenviar-link {
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

  .code-inputs-container {
    gap: 15px;
    margin-bottom: 10px;
  }

  .code-input {
    width: 40px;
  }

  .code-input :deep(.q-field__control) {
    height: 50px;
    border-radius: 10px;
  }

  .code-input :deep(input) {
    font-size: 18px;
  }

  .reenviar-section {
    margin-bottom: 12px;
  }

  .reenviar-link {
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

  .code-inputs-container {
    gap: 6px;
    margin-bottom: 10px;
  }

  .code-input {
    width: 42px;
  }

  .code-input :deep(.q-field__control) {
    height: 50px;
  }

  .code-input :deep(input) {
    font-size: 18px;
  }

  .reenviar-section {
    margin-bottom: 10px;
  }

  .reenviar-link {
    font-size: 0.8rem;
  }
}
</style>