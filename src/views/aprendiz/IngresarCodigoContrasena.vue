<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header con logo SENA y título -->
    <q-header elevated class="text-white" style="background-color: #39a900; height: 90px;">
      <div style="position: relative; height: 90px; width: 100%; display: flex; align-items: center; justify-content: center;">
        <q-avatar size="90px"
          style="position: absolute; left: 0; top: 0; bottom: 0; margin: auto 0 auto 16px; z-index: 5; background: #5EB930; display: flex; align-items: center; justify-content: center;">
          <img src="/src/assets/logoSENABlanco.png" style="height: 90px; width: auto; background-color: #39a900;" />
        </q-avatar>
        <span style="font-size: 3rem; font-weight: bold; line-height: 80px;">REPFORA EP</span>
      </div>
    </q-header>

    <q-page-container class="page-container">
      <div class="flex flex-center content-top" style="padding-top: 100px; padding-bottom: 32px; position: relative;">
        <div style="position: absolute; top: 20px; left: 20px; z-index: 10;">
          <BackButton :size="48" />
        </div>
        <q-card class="q-pa-md recovery-card" flat>
          <!-- Icono y título -->
          <div class="column items-center" style="width: 100%; margin-bottom: 2rem;">
            <div class="icon-container">
              <q-icon name="lock_reset" size="80px" color="green-6" />
            </div>
            <div class="text-h5 text-bold text-center q-mt-md" style="color: #111;">
              Ingrese código
            </div>
          </div>

          <!-- Descripción -->
          <div class="text-center q-mb-lg" style="color: #444; font-size: 1.05rem; line-height: 1.6; max-width: 500px; margin: 0 auto 2rem;">
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
          <div class="text-center q-mt-md q-mb-lg">
            <a @click="reenviarCodigo" class="reenviar-link">
              <q-icon name="refresh" size="18px" class="q-mr-xs" />
              Reenviar código
            </a>
          </div>

          <!-- Botón enviar -->
          <div class="row justify-center" style="width: 100%; padding-top: 16px;">
            <BotonEnviar 
              @click="verificarCodigo" 
              :loading="loading"
              :disable="!codigoCompleto"
            />
          </div>
        </q-card>
      </div>
    </q-page-container>

    <!-- Footer -->
    <q-footer reveal class="bg-grey-5 text-black">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <div style="font-size: 0.9rem; font-weight: 500; letter-spacing: 0.5px;">
            REPFORA - Sena 2025 © Todos los derechos reservados
          </div>
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
.recovery-card {
  width: 600px;
  border: 3px solid #39a900;
  border-radius: 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-inputs-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 0 auto;
}

.code-input {
  width: 60px;
}

.code-input :deep(.q-field__control) {
  height: 70px;
  border-radius: 12px;
  font-size: 28px;
  font-weight: bold;
}

.code-input :deep(input) {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
}

.code-input :deep(.q-field__control):focus-within {
  border: 2px solid #39a900;
  box-shadow: none;
}

.code-input :deep(.q-field__control) {
  box-shadow: none;
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

.content-top {
  align-items: flex-start !important;
}

.page-container {
  height: auto;
  padding: 0;
  overflow-y: auto;
}

@media (max-width: 650px) {
  .recovery-card {
    width: 95%;
    padding: 2rem 1rem;
  }
  
  .code-input {
    width: 50px;
  }
  
  .code-input :deep(.q-field__control) {
    height: 60px;
  }
  
  .code-inputs-container {
    gap: 8px;
  }
}
</style>