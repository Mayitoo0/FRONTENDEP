<template>
    <q-page class="correos-page">

        <div class="page-header">
            <BackButton/>
            <h2 class="page-title">CORREOS</h2>
        </div>

        <div class="seccion borde-gris">
            <div class="seccion-titulo">Alertas Escalonadas</div>
            <div class="tabla-filas">
                <div v-for="(item, index) in alertasEscalonadas" :key="item.id" class="fila">
                    <div class="descripcion">{{ item.descripcion }}</div>
                    <q-btn label="Modificar" color="positive" no-caps rounded unelevated class="modify-btn"
                        @click="abrirModalPorIndice(index)" />
                </div>
            </div>
        </div>

        <div class="seccion borde-gris q-mt-md">
            <div class="seccion-titulo">Alertas de Procesos</div>
            <div class="tabla-filas">
                <div v-for="(item, index) in alertasProcesos" :key="item.id" class="fila">
                    <div class="descripcion">{{ item.descripcion }}</div>
                    <q-btn label="Modificar" color="positive" no-caps rounded unelevated class="modify-btn"
                        @click="abrirModalPorIndice(index + 3)" />
                </div>
            </div>
        </div>

        <ModalComponent v-for="(modal, index) in modales" :key="index" :ref="el => modalRefs[index] = el" 
            width="600px" maxWidth="90%" persistent>
            <template #header>
                <div class="modal-header-title">Correos</div>
            </template>

            <template #body>
                <div class="modal-content">
                    <div class="email-info">
                        <p class="info-text">De notificaciones@sena.edu.co</p>
                        <p class="info-text">Para alejandra.ruiz@ejemplo.com</p>
                        <p class="info-text">Fecha 7 de octubre de 2025, 10:30 AM</p>
                    </div>

                    <p class="asunto-text">
                        Asunto: {{ modal.icono }} @usuario - <strong>{{ modal.asunto }}</strong>
                    </p>

                    <p class="parrafo" v-html="modal.contenido"></p>

                    <p class="parrafo">
                        Este mensaje es automático, no responda a este correo.<br />
                        📩 Para consultas adicionales, comuníquese con la mesa de soporte.
                    </p>
                </div>
            </template>

            <template #footer>
                <div style="display: flex; justify-content: center; width: 100%;">
                    <q-btn label="Aceptar" color="positive" no-caps rounded unelevated class="accept-btn"
                        @click="cerrarModal(index)" />
                </div>
            </template>
        </ModalComponent>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalComponent from 'src/components/modals/ModalComponent.vue'
import BackButton from '../../../components/BackButton.vue'

const router = useRouter()
const modalRefs = ref([])

const alertasEscalonadas = ref([
    { id: 1, descripcion: '30 Antes del vencimiento' },
    { id: 2, descripcion: '15 Antes del vencimiento' },
    { id: 3, descripcion: '7 Antes del vencimiento' }
])

const alertasProcesos = ref([
    { id: 4, descripcion: 'Bitácora pendiente' },
    { id: 5, descripcion: 'Seguimiento pendiente' },
    { id: 6, descripcion: 'Último seguimiento' },
    { id: 7, descripcion: 'Tiempo revisión por instructor' }
])

const modales = ref([
    {
        icono: '🔔',
        asunto: 'Notificación de vencimiento de ficha en 30 días',
        contenido: `Estimado usuario,<br />Este es un recordatorio automático generado por el sistema para informarle sobre el estado de sus fichas.<br /><br />🔷 <strong>Alerta de Vencimiento de Ficha</strong><br />Su ficha @ficha, posterior a noviembre de 2024, cuenta con un tiempo máximo de 6 meses para registrar la etapa productiva.<br /><br />👉 Actualmente tiene 30 días restantes para registrar la etapa productiva a partir de hoy.`
    },
    {
        icono: '🔔',
        asunto: 'Notificación de vencimiento de ficha en 15 días',
        contenido: `Estimado usuario,<br />Este es un recordatorio automático generado por el sistema para informarle sobre el estado de sus fichas.<br /><br />🔹 <strong>Alerta de Vencimiento de Ficha</strong><br />Su ficha @ficha, posterior a noviembre de 2024, está próxima a vencer.<br /><br />👉 Actualmente tiene 15 días restantes para registrar la etapa productiva a partir de hoy.`
    },
    {
        icono: '🔴',
        asunto: 'Ficha próxima a vencerse en 7 días',
        contenido: `Estimado usuario,<br />Este es un recordatorio urgente generado por el sistema para informarle que su ficha @ficha se encuentra en estado crítico.<br /><br />👉 Solo dispone de 7 días restantes para registrar la etapa productiva.<br /><br />Si no se realiza el registro en este plazo, la ficha pasará a estado de vencida.`
    },
    {
        icono: '📒',
        asunto: 'Bitácora pendiente por vencerse en 7 días',
        contenido: `Estimado usuario,<br />Se detectó que aún tiene una bitácora pendiente por registrar.<br /><br />👉 Dispone de 7 días para completarla antes del vencimiento.`
    },
    {
        icono: '📌',
        asunto: 'Seguimiento pendiente por vencerse en 7 días',
        contenido: `Estimado usuario,<br />Se detectó que aún tiene un seguimiento pendiente por registrar.<br /><br />👉 Dispone de 7 días para completarlo antes del vencimiento.`
    },
    {
        icono: '⚠️',
        asunto: 'Último seguimiento pendiente por vencerse en 7 días',
        contenido: `Estimado usuario,<br />Se detectó que tiene un último seguimiento pendiente por registrar.<br /><br />👉 Tiene un plazo máximo de 7 días para completarlo.`
    },
    {
        icono: '🔴',
        asunto: 'Bitácora sin revisar',
        contenido: `Estimado instructor,<br />Este es un recordatorio urgente generado por el sistema para informarle que la bitácora del aprendiz @aprendiz, correspondiente a la ficha @ficha, no ha sido revisada.<br /><br />👉 Dispone de un plazo máximo de 4 días para realizar esta revisión, con el fin de evitar retrasos en el seguimiento académico.`
    }
])

const goBack = () => router.back()

const abrirModalPorIndice = (index) => {
    modalRefs.value[index]?.openDialog()
}

const cerrarModal = (index) => {
    modalRefs.value[index]?.closeDialog()
}
</script>

<style scoped>
.correos-page {
    background-color: #f0f0f0;
    min-height: 100vh;
    padding: 24px 30px;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.back-button {
    position: absolute;
    left: 0;
}

.page-title {
    font-size: 40px;
    font-weight: 700;
    margin: 0;
    text-align: center;
}

.seccion {
    margin-top: 20px;
}

.borde-gris {
    border: 1px solid #ccc;
    border-radius: 8px;
}

.seccion-titulo {
    background-color: #44b900;
    color: white;
    font-weight: 600;
    font-size: 18px;
    padding: 12px 16px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.tabla-filas {
    background: white;
    border-radius: 0 0 8px 8px;
}

.fila {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 16px;
    border-top: 1px solid #eee;
}

.descripcion {
    color: #666;
    font-size: 16px;
    font-weight: 500;
}

.modify-btn {
    background-color: #52b848 !important;
    color: white !important;
    font-weight: 600;
    padding: 6px 18px;
}

.modal-header-title {
    font-size: 24px;
    font-weight: 600;
}

.modal-content {
    padding: 8px 0;
}

.email-info {
    margin-bottom: 16px;
}

.info-text {
    margin: 4px 0;
    font-size: 14px;
    color: #333;
}

.asunto-text {
    margin: 12px 0;
    font-size: 15px;
    line-height: 1.5;
}

.parrafo {
    margin: 12px 0;
    font-size: 14px;
    line-height: 1.6;
    color: #333;
}

.accept-btn {
    background-color: #39a900 !important;
    color: white !important;
    padding: 8px 32px;
    font-weight: 600;
}
</style>