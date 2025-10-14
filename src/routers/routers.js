import { createRouter, createWebHashHistory } from "vue-router"
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/Login.vue'
import Inicio from '../views/Inicio.vue'
import InicioAprendiz from '../views/aprendiz/inicioAprendiz.vue'
import RegistroEP from '../views/aprendiz/RegistroEP.vue'
import AdminEmpresas from '../views/admin/Empresas.vue'
import Instructores from '../views/admin/Instructores.vue'
import DatosPersonales from '../views/aprendiz/DatosPersonales.vue'


const routes = [
  { path: "/", component: Login },
  {
    path: "/app", component: MainLayout, children: [
      { path: "inicio", name: "Inicio", component: Inicio },
      { path: "aprendiz/inicio", name: "Aprendiz", component: InicioAprendiz },
      { path: 'aprendiz/registros', name: 'AprendizMisRegistros', component: RegistroEP },
      { path:  'admin/empresas', name: 'AdminEmpresas', component: AdminEmpresas },
      { path:  'admin/instructores', name: 'AdminInstructores', component: Instructores },
      { path: '/aprendiz/datospersonales', name: 'AprendizDatosPersonales', component: DatosPersonales}
     

    ]
  }
]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router