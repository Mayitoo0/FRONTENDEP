<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card>
            <q-card-section class="row items-center justify-between">
                <div>
                    <slot name="title">
                        <div style="font-size: 24px; font-weight: bold;">Editar Hora Instructor</div>
                    </slot>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <h1 style="font-size: 20px;">{{ title }}</h1>
                <q-input outlined v-model="localText" label="" />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <slot name="actions">
                    <div>
                        <ModalButton type="cancel" label="Cancelar" @click="cancel" />
                        <ModalButton type="confirm" label="Editar" @click="showConfirmModal = true" />
                    </div>
                </slot>
            </q-card-actions>
        </q-card>
        <ModalConfirm v-model="showConfirmModal" :title="'Confirmar cambios'"
            :message="'¿Estás seguro de guardar los cambios?'" :confirmLabel="'Guardar'" :cancelLabel="'Cancelar'"
            @confirm="handleConfirm" @cancel="showConfirmModal = false" />
    </q-dialog>
</template>

<script setup>
import { putData } from 'src/services/apiClient.js';
import { ref, watch } from 'vue'
import ModalConfirm from 'src/components/modals/modal_confirm.vue'
import ModalButton from 'src/components/ModalButton.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    registro: {
        type: Object,
        default: () => ({})
    },
    title: {
        type: String,
        default: 'Accion para editar'
    }
})

const emit = defineEmits(['update:modelValue', 'close'])

const showDialog = ref(props.modelValue)
const localText = ref(props.registro?.value ?? '')
const showConfirmModal = ref(false)

watch(() => props.modelValue, (val) => {
    showDialog.value = val
})

watch(showDialog, (val) => {
    emit('update:modelValue', val)
    if (!val) emit('close')
})

watch(() => props.registro, (val) => {
    localText.value = val?.value ?? ''
})

function handleConfirm() {
    updateParametersHoursInstructor(localText.value);
    emit('update:modelValue', false)
    emit('close')
    showConfirmModal.value = false
}

function cancel() {
  showDialog.value = false
}

const updateParametersHoursInstructor = async () => {
    try {
        const id = props.registro?._id
        const res = await putData(`/parameters/updateParameter/${id}`, {
            value: localText.value
        })
        
        console.log('✅ Actualizado:', res)
    } catch (error) {
        console.error(' Error al actualizar:', error)
    }
}

</script>
