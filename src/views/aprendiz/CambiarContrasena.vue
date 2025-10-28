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
          <q-btn flat round icon="arrow_back" color="green-7" size="lg" @click="goBack" />
        </div>
        <q-card class="q-pa-md recovery-card" flat>
          <!-- Logo SENA y título -->
          <div class="column items-center" style="width: 100%; margin-bottom: 2rem;">
            <div class="logo-container">
              <img src="/src/assets/logo-sena.png" alt="Logo SENA" style="width: 100px; height: auto;">
            </div>
            <div class="text-h5 text-bold text-center q-mt-md" style="color: #111;">
              Cambia tu Contraseña
            </div>
          </div>

          <!-- Descripción -->
          <div class="text-center q-mb-lg" style="color: #444; font-size: 1.05rem; line-height: 1.6; max-width: 500px; margin: 0 auto 2rem;">
            Ingrese la dirección de correo electrónico verificada de su cuenta de usuario y le enviaremos un enlace para restablecer su contraseña.
          </div>

          <!-- Campo de correo -->
          <div class="form-section">
            <label class="email-label">Correo electrónico:</label>
            <q-input 
              v-model="email" 
              type="email" 
              placeholder="karoluquez12@gmail.com" 
              outlined 
              dense
              class="email-input" 
              :rules="[val => !!val || 'El correo es requerido']" 
            />
          </div>

          <!-- Botón enviar -->
          <div class="row justify-center" style="width: 100%; padding-top: 24px;">
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const email = ref('')
const loading = ref(false)

const sendResetEmail = async () => {
    if (!email.value) {
        $q.notify({
            type: 'negative',
            message: 'Por favor ingrese un correo electrónico válido',
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
            message: 'Correo de restablecimiento enviado a: ${email.value}',
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

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.email-label {
  text-align: center;
  color: #666;
  font-size: 1.05rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.email-input {
  width: 100%;
  font-size: 1rem;
}

.email-input :deep(.q-field__control) {
  height: 56px;
  border-radius: 8px;
}

.email-input :deep(.q-field__native) {
  font-size: 1rem;
  color: #444;
}

.submit-btn {
  width: 100%;
  max-width: 500px;
  height: 56px;
  background-color: #39a900 !important;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  text-transform: none;
}

.submit-btn:hover {
  background-color: #2d8000 !important;
}

.content-top {
  align-items: flex-start !important;
}

.page-container {
  height: auto;
  padding: 0;
  overflow-y: auto;
  background-color: #f9fafb;
}

@media (max-width: 650px) {
  .recovery-card {
    width: 95%;
    padding: 2rem 1rem;
  }

  .email-input :deep(.q-field__control) {
    height: 50px;
  }

  .submit-btn {
    height: 50px;
    font-size: 0.95rem;
  }
}

@media (max-width: 400px) {
  .logo-container img {
    width: 80px;
  }

  .text-h5 {
    font-size: 1.5rem;
  }

  .submit-btn {
    font-size: 0.9rem;
    padding: 0 1rem;
  }
}
</style>