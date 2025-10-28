FRAME 31 AL FRAME 32 

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
              <q-icon name="lock" size="80px" color="green-6" />
            </div>
            <div class="text-h5 text-bold text-center q-mt-md" style="color: #111;">
              seguridad de su contraseña
            </div>
          </div>

          <!-- Descripción -->
          <div class="text-center q-mb-lg" style="color: #444; font-size: 0.95rem; line-height: 1.6; max-width: 520px; margin: 0 auto 2rem;">
            crea una contraseña nueva y segura utilizando 8 caracteres como mínimo al menos 1 numero,1 letra minúscula y 1 letra mayúscula .no uses contraseñas de otros sitios web y ni un termino que sea demasiado obvio
          </div>

          <!-- Campo Nueva contraseña -->
          <div class="q-mb-md" style="width: 100%; max-width: 450px; margin: 0 auto 1rem;">
            <label style="display: block; margin-bottom: 8px; color: #111; font-weight: 500;">Nueva contraseña</label>
            <q-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
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
          <div class="q-mb-lg" style="width: 100%; max-width: 450px; margin: 0 auto 2rem;">
            <label style="display: block; margin-bottom: 8px; color: #111; font-weight: 500;">Confirmar nueva contraseña</label>
            <q-input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              outlined
              dense
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
          <div class="row justify-center" style="width: 100%; padding-top: 16px;">
            <BotonEnviar 
              @click="cambiarContrasena" 
              :loading="loading"
              :disable="!isFormValid"
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
    errors.push('La contraseña debe tener al menos 1 numero')
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

.password-input :deep(.q-field__control) {
  border-radius: 8px;
  box-shadow: none;
}

.password-input :deep(.q-field__control):focus-within {
  border: 2px solid #39a900;
  box-shadow: none;
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
}
</style>