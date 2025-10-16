<template>
  <PublicLayout>
    <q-page class="q-pa-md">
      <BackButton />
      
      <!-- Título principal -->
      <div class="text-center q-mb-lg">
        <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">EMPRESAS</h1>
      </div>
      
      <div class="container">
        <div class="row items-center q-mb-md q-gutter-y-sm">
          <div class="col-12 col-md-4">
            <q-input
              v-model="search"
              dense
              outlined
              placeholder="Buscar empresa..."
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-select
              outlined
              dense
              v-model="filter"
              :options="estadosOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-4 text-right">
            <Button1
              label="+ Nueva Empresa"
              @click="showCreateModal = true"
            />
          </div>
        </div>

        <!-- Tabla de empresas (reemplazada por componente Tabla) -->
        <Tabla
          :rows="filteredEmpresas"
          :columns="columns"
          row-key="_id"
          :loading="loading"
        >
          <template #acciones="{ row }">
            <div class="row items-center no-wrap justify-center">
              <q-btn flat round color="grey" icon="visibility" @click="verDetalles(row)">
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              <q-btn flat round color="grey" icon="edit" @click="openEditModal(row)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                :color="row.status === 0 ? 'grey' : 'grey'"
                :icon="row.status === 0 ? 'close' : 'check'"
                @click="row.status === 0 ? desactivarEmpresa(row._id) : activarEmpresa(row._id)"
              >
                <q-tooltip>{{ row.status === 0 ? 'Desactivar' : 'Activar' }}</q-tooltip>
              </q-btn>
            </div>
          </template>
        </Tabla>
      </div>

      <!-- Modal de detalles de empresa -->
      <q-dialog v-model="showDetailsModal">
        <q-card class="detail-modal" style="width: 1200px; max-width: 98vw;">
          <q-card-section class="row items-center q-pb-none justify-center">
            <div class="text-h4 company-title">
              {{ selectedEmpresa?.name }}
            </div>
          </q-card-section>

          <q-separator class="q-my-md" />

          <q-card-section class="q-pt-md">
            <div class="row q-col-gutter-lg">
              <!-- Datos de la empresa -->
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md section-title">Datos de la empresa</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Numero NIT:</div>
                    <div class="data-value">{{ selectedEmpresa?.company_nit || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Razon social:</div>
                    <div class="data-value">{{ selectedEmpresa?.name || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Direccion:</div>
                    <div class="data-value">{{ selectedEmpresa?.location || '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- Contacto de la empresa -->
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md section-title">Contacto de la empresa</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Representante Legal:</div>
                    <div class="data-value">{{ selectedEmpresa?.legal_representative_name || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Cargo:</div>
                    <div class="data-value">{{ selectedEmpresa?.legal_representative_position || '-' }}</div>
                  </div>
                </div>

                <div class="text-h6 q-mb-md q-mt-lg section-title">Datos de contacto</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Telefono de contacto:</div>
                    <div class="data-value">{{ selectedEmpresa?.legal_representative_phone || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Email de contacto:</div>
                    <div class="data-value">{{ selectedEmpresa?.legal_representative_email || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="center" class="q-mt-md">
            <ModalButton
              type="cancel"
              label="Cerrar"
              @click="showDetailsModal = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Modal para crear empresa -->
      <Modal_new v-model="showCreateModal" :loading="saving">
        <template #title>Añadir nueva empresa</template>
        
        <q-form @submit.prevent="createCompany" class="q-gutter-md">
          <div class="row q-col-gutter-lg">
            <!-- Datos de la empresa -->
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Datos de la empresa</div>
              <q-input
                outlined
                v-model="formData.company_nit"
                label="Numero NIT"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El NIT es requerido',
                  val => val.length >= 8 || 'El NIT debe tener al menos 8 dígitos',
                  val => val.length <= 20 || 'El NIT no puede tener más de 20 dígitos',
                  val => !val.includes(' ') || 'El NIT no debe contener espacios'
                ]"
              />
              <q-input
                outlined
                v-model="formData.name"
                label="Razon social"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'La razón social es requerida',
                  val => val.length >= 3 || 'La razón social debe tener al menos 3 caracteres',
                  val => val.length <= 100 || 'La razón social no debe exceder 100 caracteres',
                  val => /^[a-zA-ZÀ-ÿ0-9\s.]+$/.test(val) || 'La razón social solo debe contener letras, números, espacios y puntos'
                ]"
              />
              <q-input
                outlined
                v-model="formData.location"
                label="Direccion"
                :rules="[
                  val => !!val || 'La ubicación es requerida',
                  val => val.includes(',') && val.split(',').length === 2 || 'El formato debe ser: Ciudad, Departamento',
                  val => val.split(',').every(part => part.trim().length >= 3) || 'La ciudad y el departamento deben tener al menos 3 caracteres',
                  val => /^[a-zA-ZÀ-ÿ\s,]+$/.test(val) || 'La ubicación solo debe contener letras, espacios y comas'
                ]"
              />
              <!-- Carga masiva -->
              <div class="text-h6 q-mb-md section-title">Carga masiva de Empresas</div>
                  <div class="upload-area row items-center justify-center" style="min-height: 180px; border: 2px dashed rgba(0,0,0,0.12); border-radius: 8px; background-color: #fafafa;"
                    :class="{ 'upload-active': dragActive }"
                    @dragover.prevent
                    @dragenter.prevent="dragActive = true"
                    @dragleave.prevent="dragActive = false"
                    @drop.prevent="onFilesDropped"
                  >
                    <input
                      id="bulkFiles"
                      ref="bulkInput"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      @change="onFilesSelected"
                      class="hidden-file-input"
                    />

                    <label for="bulkFiles" class="upload-label q-pa-md column items-center text-center" style="cursor: pointer;">
                      <div class="upload-icon q-mb-sm">
                        <q-icon name="folder_open" size="90" color="grey" style="font-size: 90px !important;" />
                      </div>
                      <div class="text-subtitle1 q-mb-sm">Arrastrar archivos aquí o hacer click para seleccionar</div>
                      <div class="text-caption text-grey">Formatos admitidos: CSV, Excel (.xlsx, .xls)</div>
                    </label>
                  </div>
                  
                  <!-- Información del archivo seleccionado y botón de carga -->
                  <div v-if="selectedFile" class="q-mt-md">
                    <div class="row items-center q-mb-md">
                      <q-icon name="attachment" color="primary" class="q-mr-sm" />
                      <span class="text-body2">{{ selectedFile.name }}</span>
                      <q-btn 
                        flat 
                        round 
                        dense 
                        icon="close" 
                        color="grey" 
                        @click="clearSelectedFile"
                        class="q-ml-auto"
                      >
                        <q-tooltip>Quitar archivo</q-tooltip>
                      </q-btn>
                    </div>
                    <q-btn
                      color="primary"
                      label="Procesar Carga Masiva"
                      icon="cloud_upload"
                      :loading="uploadingFile"
                      @click="procesarCargaMasiva"
                      class="full-width"
                    />
                  </div>
                </div>

            <!-- Contacto de la empresa -->
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Contacto de la empresa</div>
              <q-input
                outlined
                v-model="formData.legal_representative_name"
                label="Jefe inmediato"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El nombre del representante es requerido',
                  val => val.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                  val => val.length <= 50 || 'El nombre no debe exceder 50 caracteres',
                  val => /^[a-zA-ZÀ-ÿ\s]+$/.test(val) || 'El nombre solo debe contener letras y espacios'
                ]"
              />
              <q-input
                outlined
                v-model="formData.legal_representative_position"
                label="Cargo"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El cargo es requerido',
                  val => val.length >= 3 || 'El cargo debe tener al menos 3 caracteres',
                  val => val.length <= 50 || 'El cargo no debe exceder 50 caracteres',
                  val => /^[a-zA-ZÀ-ÿ\s-]+$/.test(val) || 'El cargo solo debe contener letras, espacios y guiones'
                ]"
              />
              <div class="text-h6 q-mb-md q-mt-lg section-title">Datos de contacto</div>
              <q-input
                outlined
                v-model="formData.legal_representative_phone"
                label="Telefono de jefe inmediato"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El teléfono es requerido',
                  val => val.length === 10 || 'El teléfono debe tener exactamente 10 dígitos',
                  val => /^\d+$/.test(val) || 'El teléfono solo debe contener números',
                  val => /^[3]/.test(val) || 'El teléfono debe comenzar con 3'
                ]"
              />
              <q-input
                outlined
                v-model="formData.legal_representative_email"
                label="Email de jefe inmediato"
                type="email"
                :rules="[
                  val => !!val || 'El email es requerido',
                  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido',
                  val => val.length <= 100 || 'El email no debe exceder 100 caracteres',
                  val => !val.includes(' ') || 'El email no debe contener espacios'
                ]"
              />
            </div>
          </div>
        </q-form>

        <template #actions>
          <ModalButton
            type="cancel"
            label="Cancelar"
            @click="showCreateModal = false"
          />
          <ModalButton
            type="confirm"
            label="Añadir Empresa"
            :loading="saving"
            :disabled="!isFormValid"
            @click="createCompany"
          />
        </template>
      </modal_new>

      <!-- Modal de confirmación de cambios -->
      <ConfirmChangesModal
        v-model="showConfirmModal"
        :changes="getChanges()"
        @confirm="confirmUpdate"
        @cancel="showConfirmModal = false"
      />

      <!-- Modal para editar empresa -->
      <ModalEdit 
        v-model="showEditModal" 
        :loading="saving"
        @hide="handleModalClose"
      >
        <template #title>Editar empresa</template>
        
        <q-form @submit.prevent="updateCompany" class="q-gutter-md">
          <div class="row q-col-gutter-lg">
            <!-- Datos de la empresa -->
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Datos de la empresa</div>
              <q-input
                outlined
                v-model="editFormData.company_nit"
                label="Numero NIT"
                class="q-mb-md"
                type="text"
                disable
                hint="El NIT no se puede editar"
              />
              <q-input
                outlined
                v-model="editFormData.name"
                label="Razon social"
                class="q-mb-md"
                disable
                hint="La razón social no se puede editar"
              />
              <q-input
                outlined
                v-model="editFormData.location"
                label="Ciudad y Departamento"
                placeholder="Ciudad, Departamento"
                :rules=" [
                  val => !!val || 'La ubicación es requerida',
                  val => val.includes(',') && val.split(',').length === 2 || 'El formato debe ser: Ciudad, Departamento',
                  val => val.split(',').every(part => part.trim().length >= 3) || 'La ciudad y el departamento deben tener al menos 3 caracteres',
                  val => /^[a-zA-ZÀ-ÿ\s,]+$/.test(val) || 'La ubicación solo debe contener letras, espacios y comas'
                ]"
                hint="Formato: Ciudad, Departamento (Ej: Bogotá, Cundinamarca)"
              />
            </div>
            <!-- Contacto de la empresa -->
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Contacto de la empresa</div>
              <q-input
                outlined
                v-model="editFormData.legal_representative_name"
                label="Jefe inmediato"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El nombre del representante es requerido',
                  val => val.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                  val => val.length <= 50 || 'El nombre no debe exceder 50 caracteres',
                  val => /^[a-zA-ZÀ-ÿ\s]+$/.test(val) || 'El nombre solo debe contener letras y espacios'
                ]"
              />
              <q-input
                outlined
                v-model="editFormData.legal_representative_position"
                label="Cargo"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El cargo es requerido',
                  val => val.length >= 3 || 'El cargo debe tener al menos 3 caracteres',
                  val => val.length <= 50 || 'El cargo no debe exceder 50 caracteres',
                  val => /^[a-zA-ZÀ-ÿ\s-]+$/.test(val) || 'El cargo solo debe contener letras, espacios y guiones'
                ]"
              />
              <div class="text-h6 q-mb-md q-mt-lg section-title">Datos de contacto</div>
              <q-input
                outlined
                v-model="editFormData.legal_representative_phone"
                label="Telefono de jefe inmediato"
                class="q-mb-md"
                type="tel"
                :rules="[
                  val => !!val || 'El teléfono es requerido',
                  val => val.length === 10 || 'El teléfono debe tener exactamente 10 dígitos',
                  val => /^\d+$/.test(val) || 'El teléfono solo debe contener números',
                  val => /^[3]/.test(val) || 'El teléfono debe comenzar con 3'
                ]"
              />
              <q-input
                outlined
                v-model="editFormData.legal_representative_email"
                label="Email de jefe inmediato"
                type="email"
                :rules="[
                  val => !!val || 'El email es requerido',
                  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido',
                  val => val.length <= 100 || 'El email no debe exceder 100 caracteres',
                  val => !val.includes(' ') || 'El email no debe contener espacios'
                ]"
              />
            </div>
          </div>
        </q-form>

        <template #actions>
          <div class="row justify-center q-mt-xl q-gutter-md">
            <ModalButton
              type="cancel"
              label="Cancelar"
              @click="cancelEdit"
            />
            <ModalButton
              type="confirm"
              label="Editar Empresa"
              @click="handleUpdate"
              :loading="saving"
              :disabled="!hasChanges"
            />
          </div>
        </template>
      </ModalEdit>
    </q-page>
  </PublicLayout>
</template>

<script setup>
// Importaciones de Vue y Quasar
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

// Importaciones de componentes
import BackButton from '../../components/BackButton.vue'
import ModalButton from '../../components/modals/ModalButton.vue'
import Button1 from '../../components/button-1.vue'
import ConfirmChangesModal from '../../components/modals/ConfirmChangesModal.vue'
import Tabla from '../../components/tables/tabla.vue'
import ModalEdit from '../../components/modals/modal_edit.vue'

// Importaciones de servicios
import { apiClient } from '../../services/apiClient'
import Modal_new from '../../components/modals/ModalNew.vue'

const $q = useQuasar()

// Estados de UI
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filter = ref('all')

// Estados de modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showConfirmModal = ref(false)
const originalFormData = ref(null)
const hasChanges = ref(false)

// Computed property para validar el formulario
const isFormValid = computed(() => {
  return formData.value.company_nit?.trim() &&
         formData.value.name?.trim() &&
         formData.value.location?.trim() &&
         formData.value.legal_representative_name?.trim() &&
         formData.value.legal_representative_position?.trim() &&
         formData.value.legal_representative_phone?.trim() &&
         formData.value.legal_representative_email?.trim();
});

// Estados de datos
const empresas = ref([])
const selectedEmpresa = ref(null)
const editFormData = ref({
  company_nit: '',
  name: '',
  location: '',
  legal_representative_phone: '',
  legal_representative_name: '',
  legal_representative_email: '',
  legal_representative_position: ''
})
// Opciones para el filtro de estados
const estadosOptions = [
  { label: 'TODOS LOS ESTADOS', value: 'all' },
  { label: 'Activo', value: 0 },
  { label: 'Inactivo', value: 1 }
]

// Función para ver detalles de empresa
const verDetalles = (empresa) => {
  selectedEmpresa.value = empresa
  showDetailsModal.value = true
}

// Estado del formulario y la edición
const formData = ref({
  company_nit: '',
  name: '',
  location: '',
  legal_representative_name: '',
  legal_representative_position: '',
  legal_representative_email: '',
  legal_representative_phone: '',
  status: 0
})

// Estado para drag and drop y carga masiva
const dragActive = ref(false)
const selectedFile = ref(null)
const uploadingFile = ref(false)

const onFilesSelected = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'xls', 'xlsx'].includes(ext)) {
      event.target.value = null
      $q.notify({ type: 'negative', message: 'Por favor seleccione un archivo CSV o Excel (.xls/.xlsx)' })
      return
    }
    selectedFile.value = file
    $q.notify({ 
      type: 'positive', 
      message: `Archivo seleccionado: ${file.name}` 
    })
  }
}

const onFilesDropped = (event) => {
  dragActive.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'xls', 'xlsx'].includes(ext)) {
      $q.notify({ type: 'negative', message: 'Por favor seleccione un archivo CSV o Excel (.xls/.xlsx)' })
      return
    }
    selectedFile.value = file
    // Actualizar el input para reflejar el archivo seleccionado
    const fileInput = document.getElementById('bulkFiles')
    if (fileInput) {
      const dt = new DataTransfer()
      dt.items.add(file)
      fileInput.files = dt.files
    }
    $q.notify({ 
      type: 'positive', 
      message: `Archivo seleccionado: ${file.name}` 
    })
  }
}

// Función para limpiar archivo seleccionado
const clearSelectedFile = () => {
  selectedFile.value = null
  const fileInput = document.getElementById('bulkFiles')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Función para procesar carga masiva
const procesarCargaMasiva = async () => {
  if (!selectedFile.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor seleccione un archivo primero'
    })
    return
  }

  try {
    uploadingFile.value = true
    
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await apiClient.post('/companies/loadMassiveCompanie', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Recargar la tabla después de la carga exitosa
    await cargarEmpresas()
    
    // Limpiar el archivo seleccionado
    selectedFile.value = null
    const fileInput = document.getElementById('bulkFiles')
    if (fileInput) {
      fileInput.value = ''
    }

    $q.notify({
      type: 'positive',
      message: response.data?.message || 'Empresas cargadas exitosamente'
    })
    
    // Cerrar el modal después de una carga exitosa
    showCreateModal.value = false

  } catch (error) {
    console.error('Error en carga masiva:', error)
    
    let errorMessage = 'Error al procesar el archivo'
    
    // Capturar todos los tipos de errores posibles
    if (error.response) {
      // Error de respuesta del servidor
      errorMessage = error.response.data?.message || 
                    error.response.data?.msg || 
                    error.response.data?.error ||
                    `Error del servidor: ${error.response.status}`
    } else if (error.request) {
      // Error de red o no hay respuesta del servidor
      errorMessage = 'Error de conexión. Verifique su red y el servidor.'
    } else {
      // Error en la configuración de la petición
      errorMessage = error.message || 'Error desconocido'
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      timeout: 5000
    })
  } finally {
    uploadingFile.value = false
  }
}

// Columnas de la tabla
const columns = [
  { name: 'company_nit', label: 'NIT', field: 'company_nit', sortable: true, align: 'left' },
  { name: 'name', label: 'Nombre', field: 'name', sortable: true, align: 'left' },
  { name: 'legal_representative_email', label: 'Email', field: 'legal_representative_email', sortable: true, align: 'left' },
  { name: 'legal_representative_phone', label: 'Teléfono', field: 'legal_representative_phone', sortable: true, align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', sortable: true, align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

// Empresas filtradas
const filteredEmpresas = computed(() => {
  if (!Array.isArray(empresas.value)) {
    console.warn('empresas.value no es un array:', empresas.value)
    return []
  }

  let filtered = [...empresas.value]
  
  // Filtrar por búsqueda
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(empresa => {
      if (!empresa) return false
      const nameMatch = empresa.name ? empresa.name.toLowerCase().includes(searchLower) : false
      const nitMatch = empresa.company_nit ? empresa.company_nit.toLowerCase().includes(searchLower) : false
      return nameMatch || nitMatch
    })
  }
  
  // Filtrar por estado
  if (filter.value !== 'all') {
    filtered = filtered.filter(empresa => empresa.status === filter.value)
  }
  
  return filtered
})

// Cargar empresas
onMounted(async () => {
  await cargarEmpresas()
})

// Función para detectar cambios en el formulario
const watchFormChanges = () => {
  if (!originalFormData.value || !editFormData.value) return false;
  
  const fields = [
    'location',
    'legal_representative_name',
    'legal_representative_position',
    'legal_representative_phone',
    'legal_representative_email'
  ];

  return fields.some(field => 
    editFormData.value[field] !== originalFormData.value[field]
  );
};

// Función para obtener los cambios realizados
const getChanges = () => {
  if (!originalFormData.value || !editFormData.value) return [];
  
  const fieldLabels = {
    'location': 'Ubicación',
    'legal_representative_name': 'Nombre del representante',
    'legal_representative_position': 'Cargo',
    'legal_representative_phone': 'Teléfono',
    'legal_representative_email': 'Email'
  };

  const changes = [];
  
  Object.keys(fieldLabels).forEach(field => {
    if (editFormData.value[field] !== originalFormData.value[field]) {
      changes.push({
        label: fieldLabels[field],
        old: originalFormData.value[field],
        new: editFormData.value[field]
      });
    }
  });

  return changes;
};

// Función para manejar el cierre del modal
const handleModalClose = () => {
  if (hasChanges.value) {
    editFormData.value = { ...originalFormData.value };
  }
  hasChanges.value = false;
};

// Funciones para el manejo de la edición
const handleUpdate = () => {
  if (watchFormChanges()) {
    showConfirmModal.value = true;
  }
};

const confirmUpdate = async () => {
  showConfirmModal.value = false;
  await updateCompany();
};

const cancelEdit = () => {
  showEditModal.value = false;
};

// Watch para detectar cambios en el formulario
watch(() => editFormData.value, () => {
  hasChanges.value = watchFormChanges();
}, { deep: true });

// Funciones CRUD
const createCompany = async () => {
  try {
    saving.value = true
    console.log('Datos del formulario:', formData.value)
    
    const empresaData = {
      company_nit: formData.value.company_nit,
      name: formData.value.name,
      location: formData.value.location,
      legal_representative_phone: formData.value.legal_representative_phone,
      legal_representative_name: formData.value.legal_representative_name,
      legal_representative_email: formData.value.legal_representative_email,
      legal_representative_position: formData.value.legal_representative_position
    }
    
    console.log('Datos a enviar:', empresaData)
  const response = await apiClient.post('/companies/saveCompanies', empresaData)
  console.log('Respuesta del servidor:', response)
    $q.notify({
      type: 'positive',
      message: 'Empresa creada exitosamente'
    })
    showCreateModal.value = false
    resetForm()
    await cargarEmpresas()
  } catch (error) {
    console.error('Error al crear la empresa:', error)
    const errorMessage = error?.response?.data?.errors?.[0] || 'Error al crear la empresa';
    $q.notify({
      type: 'negative',
      message: errorMessage
    })
  } finally {
    saving.value = false
  }
}

// Modificar la función resetForm para asegurarnos que limpia todos los campos
const resetForm = () => {
  formData.value = {
    company_nit: '',
    name: '',
    location: '',
    legal_representative_name: '',
    legal_representative_position: '',
    legal_representative_email: '',
    legal_representative_phone: '',
    status: 0
  }
}

// Añadir un watcher para el modal de creación
watch(() => showCreateModal.value, (newValue) => {
  if (!newValue) { // Cuando el modal se cierra
    resetForm()
  }
})

// Funciones de carga inicial
const cargarEmpresas = async () => {
  try {
    loading.value = true
    empresas.value = [] // Inicializar como array vacío
    console.log('🚀 Iniciando carga de empresas...')
    
    // Verificar autenticación
    const auth = JSON.parse(localStorage.getItem('auth') || '{}')
    
    
    if (!auth.token) {
      throw new Error('No hay token de autenticación')
    }
    
    console.log('📡 Haciendo petición a: /companies/listCompanies')
    const response = await apiClient.get('/companies/listCompanies')
    

    // Manejar diferentes formatos de respuesta posibles
    let data = []
    const payload = response?.data
    
    console.log('🔍 Analizando payload:', payload)
    
    if (payload?.companies && Array.isArray(payload.companies)) {
      data = payload.companies
      console.log('📋 Usando payload.companies')
    } else if (payload?.data && Array.isArray(payload.data)) {
      data = payload.data
      console.log('📋 Usando payload.data')
    } else if (payload?.msg && Array.isArray(payload.msg)) {
      data = payload.msg
      console.log('📋 Usando payload.msg')
    } else if (Array.isArray(payload)) {
      data = payload
      console.log('📋 Usando payload directo')
    } else {
      console.log('❌ Formato de respuesta no reconocido')
      console.log('🔍 Tipo de payload:', typeof payload)
      console.log('🔍 Keys del payload:', Object.keys(payload || {}))
    }
    
    console.log('✨ Datos procesados:', data)
    empresas.value = Array.isArray(data) ? data : []
    console.log('📊 Empresas asignadas:', empresas.value.length, 'empresas')
    
    if (empresas.value.length === 0) {
      $q.notify({
        type: 'warning',
        message: 'No hay empresas registradas'
      })
    } else {
      $q.notify({
        type: 'positive',
        message: `${empresas.value.length} empresas cargadas exitosamente`
      })
    }
    
} catch (error) {
    console.error('💥 Error al cargar empresas:', error)
    console.error('💥 Error response:', error.response)
    console.error('💥 Error data:', error.response?.data)
    
    empresas.value = []
    
    let errorMessage = 'Error al cargar las empresas'
    
    if (error.response?.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.'
    } else if (error.response?.status === 403) {
      errorMessage = 'No tienes permisos para ver las empresas'
    } else if (error.response?.status === 404) {
      errorMessage = 'Endpoint no encontrado'
    } else if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    $q.notify({
      type: 'negative',
      message: errorMessage
    })
  } finally {
    loading.value = false
  }
}



const updateCompany = async () => {
  try {
    saving.value = true
    const updateData = {
      company_nit: editFormData.value.company_nit,
      name: editFormData.value.name,
      location: editFormData.value.location,
      legal_representative_phone: editFormData.value.legal_representative_phone,
      legal_representative_name: editFormData.value.legal_representative_name,
      legal_representative_email: editFormData.value.legal_representative_email,
      legal_representative_position: editFormData.value.legal_representative_position
    }
  await apiClient.put(`/companies/updateCompanies/${editFormData.value._id}`, updateData)
    $q.notify({
      type: 'positive',
      message: 'Empresa actualizada exitosamente'
    })
    await cargarEmpresas()
    showEditModal.value = false
  } catch (error) {
    console.error('Error al actualizar la empresa:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar la empresa: ' + (error.response?.data?.message || error.message)
    })
  } finally {
    saving.value = false
  }
}

const openEditModal = (empresa) => {
  editFormData.value = { ...empresa }
  originalFormData.value = { ...empresa }
  hasChanges.value = false
  showEditModal.value = true
}

const editarEmpresa = (empresa) => {
  editingEmpresa.value = { ...empresa }
  showEditModal.value = true
}

const desactivarEmpresa = async (id) => {
  try {
    loading.value = true
    console.log('Intentando desactivar empresa con ID:', id)
  const response = await apiClient.put(`/companies/inactiveCompanies/${id}`)
    console.log('Respuesta al desactivar:', response)

    if (response?.data) {
      const empresaActualizada = response.data
      // Actualizar la empresa en el arreglo local
      const index = empresas.value.findIndex(e => e._id === id)
      if (index !== -1) {
        empresas.value[index] = empresaActualizada
      }
    }
    await cargarEmpresas()
    $q.notify({
      type: 'positive',
      message: 'Empresa desactivada exitosamente'
    })
  } catch (error) {
    console.error('Error al desactivar empresa:', error)
    console.error('Detalles del error:', error.response?.data)
    $q.notify({
      type: 'negative',
      message: `Error al desactivar la empresa: ${error.response?.data?.message || error.message}`
    })
  } finally {
    loading.value = false
  }
}

const activarEmpresa = async (id) => {
  try {
  await apiClient.put(`/companies/activeCompanies/${id}`)
    await cargarEmpresas()
    $q.notify({
      type: 'positive',
      message: 'Empresa activada correctamente'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al activar la empresa'
    })
  }
}



</script>

<style scoped>
/* Layout y contenedores */
.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Estilos de modales */
.modal-card {
  width: 1000px;
  max-width: 90vw;
  border-radius: 12px;
  padding: 20px;
}

.detail-modal {
  border-radius: 12px;
  border: 3px solid #39a900;
  background-color: #f8f9fa;
}

.detail-modal .q-card-section {
  padding: 32px 40px;
}

/* Títulos y encabezados */
.section-title {
  color: #39a900;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-left: 8px;
  border-left: 4px solid #39a900;
}

.detail-modal .text-h4.company-title {
  color: #39a900;
  font-weight: 700;
  text-align: center;
  padding: 20px 0;
  font-size: 2.2rem;
}

/* Grids y datos */
.data-grid {
  display: grid;
  gap: 16px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.data-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  align-items: center;
}

/* Textos y tipografía */
.text-weight-bold {
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 600;
}

.data-value {
  color: #34495e;
  font-size: 0.95rem;
}

/* Elementos UI */
.q-badge {
  padding: 4px 8px;
}

/* Separadores */
:deep(.q-separator) {
  background-color: #39a900;
  height: 2px;
  opacity: 0.5;
}

/* Tabla */
.q-table__card {
  box-shadow: none;
}

/* Estilos para carga masiva PDF (maquetado) */
.hidden-file-input {
  display: none;
}

.text-orange {
  color: #ff8c00;
}

.hidden-file-input {
  display: none;
}

.upload-area {
  width: 100%;
  min-height: 140px;
  border: 2px dashed rgba(0,0,0,0.12);
  border-radius: 8px;
  background-color: #fafafa;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.upload-area.upload-active {
  background-color: #f0f9ff;
  border-color: #66b2ff;
}

.upload-label {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: center;
  text-align: center;
}

.upload-icon q-icon,
.upload-icon {
  color: rgba(0,0,0,0.5);
}

.bulk-upload-box {
  padding: 12px;
  border-radius: 8px;
  background-color: #f7f8fa;
  border: 1px solid rgba(0,0,0,0.03);
}

.file-list .text-caption {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>