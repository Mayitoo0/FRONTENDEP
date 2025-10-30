<template>
  <div class="seguridad-container">
    <BackButton/>

    <div class="content-wrapper">
     
      <header class="titulo-seguridad">SEGURIDAD</header>

      <!-- Sección Credenciales  -->
      <div class="seccion-card">
        <div class="seccionpreheader">
          <div class="seccion-header">Credenciales y Acceso</div>
        </div>
        <div class="seccion-body">
          <div class="config-row">
            <div class="config-left">
              <span class="config-label">Contraseña temporal inicial</span>
            </div>
            <div class="config-right">
              <span class="config-value">Documento</span>
            </div>
          </div>

          <div class="config-row">
            <div class="config-left">
              <span class="config-label">Forzar cambio al iniciar sesión</span>
            </div>
            <div class="config-right">
              <span class="config-value"></span>
            </div>
          </div>

          <div class="config-row">
            <div class="config-left">
              <span class="config-label">Tiempo de sesión</span>
            </div>
            <div class="config-right">
              <div class="tiempo-container">
                <span class="tiempo-valor">30</span>
                <span class="tiempo-unidad">min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección IA -->
      <div class="seccion-card">
        <div class="seccionpreheader">
          <div class="seccion-header">Validaciones IA</div>
        </div>
        <div class="seccion-body">
          <div class="validacion-row-principal">
            <div class="validacion-left">
              <span class="config-label">Validación de firmas</span>
            </div>
          </div>

          <div class="validacion-row">
            <div class="validacion-left">
              <span class="config-label">Validación de firmas, docs firmados</span>
            </div>
          </div>

          <div class="validacion-row">
            <div class="validacion-left">
              <span class="config-label">Validación formato PDF para carga de instructor y aprendiz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/BackButton.vue'
const validacionFirmas = ref(true)
</script>

<style scoped>
.seguridad-container {
  min-height: 100vh;
  padding: 30px 20px;
  position: relative;
}

.back-arrow {
  position: absolute;
  left: 40px;
  top: 100px;
  cursor: pointer;
  transition: transform 0.2s;
}

.back-arrow:hover {
  transform: translateX(-5px);
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
}


.titulo-seguridad {
  text-align: center;
  font-size: clamp(1.4rem, 4vw, 2.5rem);
  font-weight: bold;
  color: #000;
  margin-bottom: 30px;
  letter-spacing: 2px;
}


.seccion-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  margin-bottom: 25px;
  overflow: hidden;
}

.seccionpreheader {
  padding: 25px;
}

.seccion-header {
  background-color: #39a900;
  color: white;
  padding: 12px 22px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  text-align: center;
}

.seccion-body {
  padding-bottom: 50px;
}


.config-row,
.validacion-row-principal,
.validacion-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 14px 30px;
  gap: 10px;
}


.config-left {
  display: flex;
  align-items: center;
}

.config-label {
  font-size: 14px;
  color: #2c2c2c;
  font-weight: 600;
  line-height: 1.3;
}

.config-right {
  text-align: right;
  justify-self: end;
}

.config-value {
  font-size: 14px;
  color: #5a5a5a;
  font-weight: 600;
  padding-right: 28px;
}


.tiempo-container {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
  padding-right: 28px;
}

.tiempo-valor {
  font-weight: 600;
  color: #000;
  font-size: 15px;
}

.tiempo-unidad {
  color: #777;
  font-size: 13px;
  font-weight: 600;
}


@media (max-width: 1024px) {
  .titulo-seguridad {
    font-size: clamp(1.2rem, 3.5vw, 2rem);
  }
}

@media (max-width: 768px) {
  .back-arrow {
    left: 20px;
    top: 80px;
  }

  .titulo-seguridad {
    font-size: clamp(1.1rem, 5vw, 1.6rem);
    margin-bottom: 25px;
  }

  .seccion-header {
    font-size: 15px;
    padding: 10px 18px;
  }

  .config-row,
  .validacion-row-principal,
  .validacion-row {
    grid-template-columns: 1fr auto;
    gap: 10px;
    padding: 12px 18px;
  }

  .config-label {
    font-size: 13px;
  }

  .config-value {
    font-size: 13px;
    padding-right: 20px;
  }

  .tiempo-container {
    padding-right: 20px;
  }

  .tiempo-valor {
    font-size: 14px;
  }

  .tiempo-unidad {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .titulo-seguridad {
    font-size: clamp(1rem, 6vw, 1.3rem);
  }

  .config-label {
    font-size: 12.5px;
  }
}
</style>