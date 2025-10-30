<template>
  <PublicLayout>
    <q-page class="q-pa-md">
      <BackButton :disabled="showCreateModal || showEditModal || showDetailsModal || showConfirmModal || showUploadModal" />
      
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
            <div class="row q-gutter-sm justify-end">
              <BotonIngresar
                label="Carga Masiva"
                @click="uploadModalRef?.openDialog()"
                icon="upload_file"
              />
              <BotonIngresar
                label="+ Nueva Empresa"
                @click="openCreateModal"
              />
            </div>
          </div>
        </div>

        <!-- Tabla de empresas -->
        <maintable
          :datos="filteredEmpresas"
          :columnas="columns"
          row-key="_id"
        >
          <template #body-cell-acciones="{ row }">
            <q-td class="text-center">
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
            </q-td>
          </template>
        </maintable>
      </div>

      <!-- Modal de detalles de empresa -->
            <!-- Modal de Detalles -->
      <modalComponent ref="detailsModalRef" v-model="showDetailsModal" width="1200px" max-width="98vw">
        <template #header>
          <div class="text-h6">Perfil de Empresa</div>
        </template>

        <template #body>
          <div class="detail-content">
            <div class="row q-col-gutter-lg q-pa-md">
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
          </div>
        </template>

        <template #footer>
          <BotonCerrar
            label="Cerrar"
            @click="detailsModalRef?.closeDialog()"
          />
        </template>
      </modalComponent>

      <!-- Modal para crear empresa -->
      <modalComponent ref="createModalRef" v-model="showCreateModal" width="900px" max-width="98vw">
        <template #header>
          <div class="text-h5">Añadir nueva empresa</div>
        </template>

        <template #body>
          <div class="row q-col-gutter-lg q-pa-md">
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
              <div class="text-h6 q-mb-md q-mt-lg section-title">Dirección</div>
              <q-select
                outlined
                v-model="selectedDepartamento"
                :options="departamentos"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                label="Departamento"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El departamento es requerido'
                ]"
              />
              <q-select
                outlined
                v-model="selectedCiudad"
                :options="ciudadesDisponibles"
                label="Ciudad"
                :disable="!selectedDepartamento"
                :rules="[
                  val => !!val || 'La ciudad es requerida'
                ]"
                :hint="!selectedDepartamento ? 'Primero selecciona un departamento' : ''"
              />
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
        </template>

        <template #footer>
          <BotonCerrar
            label="Cancelar"
            @click="createModalRef?.closeDialog()"
          />
          <BotonEnviar
            label="Crear Empresa"
            @click="createCompany"
            :loading="saving"
          />
        </template>
      </modalComponent>

      <!-- Modal de confirmación de cambios -->
      <modalComponent ref="confirmModalRef" v-model="showConfirmModal">
        <template #header>
          <div class="text-h5">Confirmar cambios</div>
        </template>

        <template #body>
          <div class="q-pa-md">
            <p class="text-body1 q-mb-md">¿Estás seguro de que deseas realizar los siguientes cambios?</p>
            <div v-for="(change, index) in getChanges()" :key="index" class="change-item q-mb-sm">
              <div class="text-weight-bold">{{ change.label }}:</div>
              <div class="change-values">
                <span class="old-value">{{ change.old }}</span>
                <q-icon name="arrow_forward" class="q-mx-sm" />
                <span class="new-value">{{ change.new }}</span>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <BotonCerrar
            label="Cancelar"
            @click="confirmModalRef?.closeDialog()"
          />
          <BotonEnviar
            label="Confirmar"
            @click="confirmUpdate"
          />
        </template>
      </modalComponent>

      <!-- Modal para editar empresa -->
      <!-- Modal de Editar Empresa -->
      <modalComponent ref="editModalRef" v-model="showEditModal" width="900px" max-width="98vw">
        <template #header>
          <div class="text-h6">Editar Empresa</div>
        </template>

        <template #body>
          <div class="row q-col-gutter-lg q-pa-md">
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
              <div class="text-h6 q-mb-md q-mt-lg section-title">Dirección</div>
              <q-select
                outlined
                v-model="selectedDepartamento"
                :options="departamentos"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                label="Departamento"
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El departamento es requerido'
                ]"
              />
              <q-select
                outlined
                v-model="selectedCiudad"
                :options="ciudadesDisponibles"
                label="Ciudad"
                :disable="!selectedDepartamento"
                :rules="[
                  val => !!val || 'La ciudad es requerida'
                ]"
                :hint="!selectedDepartamento ? 'Primero selecciona un departamento' : ''"
              />
            </div>
            
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
        </template>

        <template #footer>
          <BotonCerrar
            label="Cancelar"
            @click="cancelEdit"
          />
          <BotonEnviar
            label="Editar Empresa"
            @click="handleUpdate"
            :loading="saving"
            :disabled="!hasChanges"
          />
        </template>
      </modalComponent>

      <!-- Modal para carga masiva de empresas -->
      <modalComponent ref="uploadModalRef" v-model="showUploadModal">
        <template #header>
          <div class="text-h5">Carga Masiva de Empresas</div>
        </template>

        <template #body>
          <div class="q-pa-md">
            <div class="q-mb-md">
              <p class="text-body1 q-mb-sm">Sube un archivo Excel (.xlsx) o CSV (.csv) con la información de las empresas.</p>
              <p class="text-caption text-grey-7">El archivo debe contener las siguientes columnas: NIT, Razón Social, Ubicación, Nombre Representante, Cargo, Teléfono, Email</p>
            </div>

            <q-file
              v-model="uploadFile"
              outlined
              label="Seleccionar archivo"
              accept=".xlsx,.xls,.csv"
              max-file-size="5242880"
              @rejected="onFileRejected"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <template v-slot:hint>
                Formatos permitidos: Excel (.xlsx, .xls) o CSV (.csv). Tamaño máximo: 5MB
              </template>
            </q-file>

            <div v-if="uploadFile" class="q-mt-md">
              <q-banner class="bg-green-1 text-green-8" rounded>
                <template v-slot:avatar>
                  <q-icon name="check_circle" color="green" />
                </template>
                Archivo seleccionado: {{ uploadFile.name }} ({{ formatFileSize(uploadFile.size) }})
              </q-banner>
            </div>
          </div>
        </template>

        <template #footer>
          <BotonCerrar
            label="Cancelar"
            @click="cancelUpload"
          />
          <BotonEnviar
            label="Cargar Empresas"
            @click="uploadMassiveCompanies"
            :loading="saving"
            :disabled="!uploadFile"
          />
        </template>
      </modalComponent>
    </q-page>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

import BackButton from '../../components/BackButton.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import BotonEnviar from '../../components/BotonEnviar.vue'
import BotonIngresar from '../../components/BotonIngresar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

import { apiClient } from '../../services/apiClient'
import { useColombia } from '../../composables/useColombia'

const $q = useQuasar()

// Composable de Colombia
const { 
  departamentos, 
  getCiudadesByDepartamento,
  getDepartamentoByCiudad
} = useColombia()

//Control de estado: Loading, guardado y filtros de tabla
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filter = ref('all')

// Estados de modales
const createModalRef = ref(null)
const editModalRef = ref(null)
const detailsModalRef = ref(null)
const confirmModalRef = ref(null)
const uploadModalRef = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showConfirmModal = ref(false)
const showUploadModal = ref(false)
const originalFormData = ref(null)
const hasChanges = ref(false)

// Estados de datos
const empresas = ref([])
const selectedEmpresa = ref(null)
const uploadFile = ref(null)

// Estados para selectores de ubicación
const selectedDepartamento = ref('')
const selectedCiudad = ref('')
const ciudadesDisponibles = computed(() => {
  if (!selectedDepartamento.value) return []
  return getCiudadesByDepartamento(selectedDepartamento.value)
})

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

const editFormData = ref({
  company_nit: '',
  name: '',
  location: '',
  legal_representative_phone: '',
  legal_representative_name: '',
  legal_representative_email: '',
  legal_representative_position: ''
})

const estadosOptions = [
  { label: 'TODOS LOS ESTADOS', value: 'all' },
  { label: 'Activo', value: 0 },
  { label: 'Inactivo', value: 1 }
]

const columns = [
  { name: 'company_nit', label: 'NIT', field: 'company_nit', sortable: true, align: 'left' },
  { name: 'name', label: 'Nombre', field: 'name', sortable: true, align: 'left' },
  { name: 'legal_representative_email', label: 'Email', field: 'legal_representative_email', sortable: true, align: 'left' },
  { name: 'legal_representative_phone', label: 'Teléfono', field: 'legal_representative_phone', sortable: true, align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', sortable: true, align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

const filteredEmpresas = computed(() => {
  if (!Array.isArray(empresas.value)) return []

  let filtered = [...empresas.value]
  
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(empresa => {
      if (!empresa) return false
      const nameMatch = empresa.name ? empresa.name.toLowerCase().startsWith(searchLower) : false
      const nitMatch = empresa.company_nit ? empresa.company_nit.toLowerCase().startsWith(searchLower) : false
      return nameMatch || nitMatch
    })
  }
  
  if (filter.value !== 'all') {
    filtered = filtered.filter(empresa => empresa.status === filter.value)
  }
  
  return filtered
})

const verDetalles = (empresa) => {
  selectedEmpresa.value = empresa
  detailsModalRef.value?.openDialog()
}

const watchFormChanges = () => {
  if (!originalFormData.value || !editFormData.value) return false
  
  const fields = [
    'location',
    'legal_representative_name',
    'legal_representative_position',
    'legal_representative_phone',
    'legal_representative_email'
  ]

  return fields.some(field => 
    editFormData.value[field] !== originalFormData.value[field]
  )
}

const getChanges = () => {
  if (!originalFormData.value || !editFormData.value) return []
  
  const fieldLabels = {
    'location': 'Ubicación',
    'legal_representative_name': 'Nombre del representante',
    'legal_representative_position': 'Cargo',
    'legal_representative_phone': 'Teléfono',
    'legal_representative_email': 'Email'
  }

  const changes = []
  
  Object.keys(fieldLabels).forEach(field => {
    if (editFormData.value[field] !== originalFormData.value[field]) {
      changes.push({
        label: fieldLabels[field],
        old: originalFormData.value[field],
        new: editFormData.value[field]
      })
    }
  })

  return changes
}

const handleModalClose = () => {
  if (hasChanges.value) {
    editFormData.value = { ...originalFormData.value }
  }
  hasChanges.value = false
}

const handleUpdate = () => {
  if (watchFormChanges()) {
    confirmModalRef.value?.openDialog()
  }
}

const confirmUpdate = async () => {
  confirmModalRef.value?.closeDialog()
  await updateCompany()
}

const cancelEdit = () => {
  editModalRef.value?.closeDialog()
}

watch(() => editFormData.value, () => {
  hasChanges.value = watchFormChanges()
}, { deep: true })

const createCompany = async () => {
  try {
    saving.value = true
    
    const empresaData = {
      company_nit: formData.value.company_nit,
      name: formData.value.name,
      location: formData.value.location,
      legal_representative_phone: formData.value.legal_representative_phone,
      legal_representative_name: formData.value.legal_representative_name,
      legal_representative_email: formData.value.legal_representative_email,
      legal_representative_position: formData.value.legal_representative_position
    }
    
    await apiClient.post('/companies/saveCompanies', empresaData)
    
    $q.notify({
      type: 'positive',
      message: 'Empresa creada exitosamente'
    })
    
    createModalRef.value?.closeDialog()
    resetForm()
    await cargarEmpresas()
  } catch (error) {
    const resp = error?.response?.data;
    const errorMessage = resp?.message || resp?.msg || (resp?.errors ? (Array.isArray(resp.errors) ? resp.errors.join(', ') : resp.errors) : null) || error?.message || 'Error al crear la empresa'
    $q.notify({
      type: 'negative',
      message: errorMessage
    })
  } finally {
    saving.value = false
  }
}

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

watch(() => editFormData.value, () => {
  hasChanges.value = watchFormChanges()
}, { deep: true })

const cargarEmpresas = async () => {
  try {
    loading.value = true
    empresas.value = []
    
    const response = await apiClient.get('/companies/listCompanies')
    
    let data = []
    const payload = response?.data
    
    if (payload?.companies && Array.isArray(payload.companies)) {
      data = payload.companies
    } else if (payload?.data && Array.isArray(payload.data)) {
      data = payload.data
    } else if (payload?.msg && Array.isArray(payload.msg)) {
      data = payload.msg
    } else if (Array.isArray(payload)) {
      data = payload
    }
    
    empresas.value = Array.isArray(data) ? data : []
    
    if (empresas.value.length === 0) {
      $q.notify({
        type: 'warning',
        message: 'No hay empresas registradas'
      })
    }
    
  } catch (error) {
    empresas.value = []
    
    let errorMessage = 'Error al cargar las empresas'
    
    if (error.response?.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.'
    } else if (error.response?.status === 403) {
      errorMessage = 'No tienes permisos para ver las empresas'
    } else if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg
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
    editModalRef.value?.closeDialog()
  } catch (error) {
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
  
  // Parsear location para llenar los selects
  if (empresa.location && empresa.location.includes(',')) {
    const [city, dept] = empresa.location.split(',').map(s => s.trim())
    selectedDepartamento.value = dept
    selectedCiudad.value = city
  }
  
  editModalRef.value?.openDialog()
}

const openCreateModal = () => {
  // Limpiar los selects
  selectedDepartamento.value = ''
  selectedCiudad.value = ''
  
  // Limpiar el formulario
  formData.value = {
    company_nit: '',
    name: '',
    location: '',
    legal_representative_name: '',
    legal_representative_position: '',
    legal_representative_email: '',
    legal_representative_phone: ''
  }
  
  createModalRef.value?.openDialog()
}

const desactivarEmpresa = async (id) => {
  try {
    loading.value = true
    const response = await apiClient.put(`/companies/inactiveCompanies/${id}`)

    if (response?.data) {
      const empresaActualizada = response.data
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

// Funciones para carga masiva
const cancelUpload = () => {
  uploadFile.value = null
  uploadModalRef.value?.closeDialog()
}

const onFileRejected = (rejectedEntries) => {
  const reason = rejectedEntries[0].failedPropValidation
  let message = 'Archivo rechazado'
  
  if (reason === 'max-file-size') {
    message = 'El archivo supera el tamaño máximo permitido de 5MB'
  } else if (reason === 'accept') {
    message = 'Formato de archivo no permitido. Use Excel (.xlsx, .xls) o CSV (.csv)'
  }
  
  $q.notify({
    type: 'negative',
    message: message
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const uploadMassiveCompanies = async () => {
  if (!uploadFile.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor selecciona un archivo'
    })
    return
  }

  try {
    saving.value = true

    // Preparar FormData con el campo que espera el backend
    const fileToSend = uploadFile.value
    const formData = new FormData()
    formData.append('archivo', fileToSend, fileToSend.name)

    // Token actualizado
    const auth = JSON.parse(localStorage.getItem('auth') || '{}')

    // Enviar con fetch (multipart nativo del navegador)
    const resp = await fetch('https://repfora-ep-backend.onrender.com/api/companies/loadMassiveCompanie', {
      method: 'POST',
      headers: {
        'x-token': auth?.token || ''
      },
      body: formData
    })

    const data = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      throw { response: { status: resp.status, data } }
    }

     // Extraer el conteo de empresas de diferentes posibles ubicaciones en la respuesta
    const count = data?.count || data?.data?.count || data?.companiesCreated || data?.total || 0
    
    // Construir el mensaje
    let message = data?.message || data?.msg || 'Carga masiva exitosa'
    
    // Si el mensaje del servidor no incluye el conteo, agregarlo
    if (count > 0 && !message.includes(count.toString())) {
      message = `${message}. ${count} empresa${count !== 1 ? 's' : ''} importada${count !== 1 ? 's' : ''}.`
    }
    
    $q.notify({
      type: 'positive',
      message: message,
      timeout: 3000
    })
    
    uploadFile.value = null
    uploadModalRef.value?.closeDialog()
    await cargarEmpresas()
    
  } catch (error) {
    const status = error?.response?.status
    const payload = error?.response?.data || {}

    let errorMessage = 'Error al cargar el archivo.'
    let caption = undefined

    if (status === 400 && (payload?.msg || payload?.message)) {
      errorMessage = payload?.msg || payload?.message
    } else if (status === 500) {
      errorMessage = 'Error interno del servidor'
    } else if (payload?.error) {
      errorMessage = payload.error
    } else if (error?.message) {
      errorMessage = error.message
    }

    $q.notify({ type: 'negative', message: errorMessage, caption, timeout: 6000 })
  } finally {
    saving.value = false
  }
}

// Watchers para sincronizar departamento y ciudad con location
watch([selectedDepartamento, selectedCiudad], ([dept, city]) => {
  if (dept && city) {
    const locationValue = `${city}, ${dept}`
    formData.value.location = locationValue
    if (editFormData.value) {
      editFormData.value.location = locationValue
    }
  }
})

onMounted(async () => {
  await cargarEmpresas()
})
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
}

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

.detail-content {
  min-width: 800px;
  max-width: 1200px;
}

.separator-custom {
  background-color: #39a900;
  height: 2px;
  opacity: 0.5;
}

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

.company-title {
  color: white !important;
  font-weight: 700;
  text-align: center;
  font-size: 1.8rem;
}

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

.text-weight-bold {
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 600;
}

.data-value {
  color: #34495e;
  font-size: 0.95rem;
}

.change-item {
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border-left: 3px solid #39a900;
}

.change-values {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
}

.old-value {
  color: #e74c3c;
  text-decoration: line-through;
  font-weight: 500;
}

.new-value {
  color: #39a900;
  font-weight: 600;
}

:deep(.q-separator) {
  background-color: #39a900;
  height: 2px;
  opacity: 0.5;
}

:deep(.q-card) {
  min-width: 900px;
  max-width: 98vw;
}

:deep(.q-dialog__inner) {
  padding: 16px;
}
</style>