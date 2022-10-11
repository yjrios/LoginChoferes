<template>
  <v-container fluid>
  <v-data-table
    :headers="cabecera"
    :items="this.lista"
    single-expand
    :expanded.sync="expanded"
    show-expand
    class="elevation-1"
    item-key="id_Viaje"
  >
    <template v-slot:item.status="{ item }">
      <v-chip
        :color="getcolor(item.status)"
        light
      >
        {{ item.status }}
      </v-chip>
    </template>
    <template v-slot:top>
      <v-btn
      v-if="expanded ? checarprogreso : this.select = []"
      ></v-btn>

      <v-toolbar flat>
        <v-toolbar-title class="pt-4">Lista de viajes para vehículo <span class="font-weight-bold success--text">{{ placa }}</span></v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:expanded-item="{ headers }">
      <td :colspan="headers.length" align="center">
        <!-- <v-layout :wrap="true">
          <v-flex cols12 xs12 sm12 md4 lg5 v-if="showInicio">
            <v-text-field
            prepend-icon="mdi-home-export-outline"
            v-model="salidatxt"
            label="Lugar inicial *"
            required
            @keyup="salidatxt ? uppercase : salidatxt = ''"
            ></v-text-field>
          </v-flex>
          <v-spacer v-if="!showInicio"></v-spacer>
          <v-flex cols12 xs12 sm12 md6 lg3>
            <span class="font-weight-black ml-0 pl-0">ACTUALIZANDO VIAJE NÚMERO {{ item.id_Viaje }}</span>
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout> -->
        <v-layout :wrap="true">
          <!-- ########################################  AQUI SLIDER ################################## -->
          <v-flex cols12 xs12 sm12 md5 lg4>
            <template>
              <v-sheet
                class="mx-auto mb-4 mt-4"
                elevation="8"
                max-width="300"
              >
                <v-slide-group
                  v-model="model"
                  class="pa-4"
                  show-arrows
                >
                  <v-slide-item
                    v-for="n in model"
                    :key="n.event"
                  >
                    <v-card
                    :color="n.event === model[selected].event ? 'success' : 'grey lighten-1'"
                    class="mx-5 mt-2"
                    height="40"
                    width="90"
                    >
                      <v-row
                        class="fill-height"
                        align="center"
                        justify="center"
                      >
                        <v-scale-transition>
                          <v-icon
                            v-if="n.event === model[selected].event"
                            color="black"
                            size="15"
                            v-text="'mdi-close-circle-outline'"
                            class="mt-1"
                          ></v-icon>
                        </v-scale-transition>
                      </v-row>
                      <span class="mb-1 font-weight-bold">{{n.event}}</span>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>

                <v-expand-transition>
                  <v-sheet
                    v-if="model != null"
                    height="30"
                    tile
                  >
                    <v-row
                      align="center"
                      justify="center"
                    >
                      <h3 class="text-h6">
                        {{ model[selected].event }}
                      </h3>
                    </v-row>
                  </v-sheet>
                </v-expand-transition>
              </v-sheet>
            </template>
          </v-flex>
          <v-flex cols12 xs5 sm5 md2 lg3>
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                class="ml-5 mt-10"
                v-model="fecha"
                :label="status ? 'FECHA DE SALIDA' : 'FECHA DE LLEGADA'"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha"
                @input="menu1 = false,dialog=false"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex cols12 xs5 sm5 md2 lg3>
            <v-menu
            ref="menu"
            v-model="menu3"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="hora"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                class="ml-5 mt-10"
                v-model="hora"
                :label="status ? 'HORA DE SALIDA' : 'HORA DE LLEGADA'"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu3"
                v-model="hora"
                full-width
                @click:minute="$refs.menu.save(hora)"
                @input="dialog=false"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <!-- ########################################  AQUI SLIDER ################################## -->
          <v-flex cols12 xs2 sm2 md1 lg1>
            <v-icon
              @click="dialog = true, guardarfecha(), isEditing = !isEditing"
              class="pt-5 mt-10"
              :color="isEditing ? 'success' : 'info'"
              v-text="'mdi-check-outline'"
            ></v-icon>
          </v-flex>
          <v-flex cols12 xs12 sm12 md2 lg1>
            <div text-align="center" justify="center">
              <v-btn
                color="success"
                fab
                class="mb-2 mt-8"
              >
              <v-icon color="black" @click="dialog = true, rigthnow = !rigthnow, guardarfecha()">mdi-alarm</v-icon></v-btn>
            </div>
          </v-flex>
        </v-layout>
      </td>
    </template>
  </v-data-table>
  <template v-if="dialog">
    <modal :mensaje="mensaje" :tipo="tipo" :title="titulo" />
  </template>
  </v-container>
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import modal from './ModalNotificacion.vue'
 
export default {
    data () {
      return {
        errorTrue: false,
        idViaje_message: 0,
        rigthnow: false,
        placa: '',
        showInicio: false,
        salidatxt: '',
        dialog: false,
        tipo: true,
        titulo: '',
        mensaje: '',
        eventoOrigen: [],
        objectViaje: new Object,
        select: [],
        eventos: [],
        selected: 2,
        fecha: new Date().toISOString().substr(0,10),
        model: [{ event:'Carga'},{event:'Descarga'}],
        status: false,
        origen: '',
        destino: '',
        isEditing: false,
        hora: new Date().toLocaleTimeString(),
        menu1: null,
        menu3: null,
        lista:[],
        expanded: [],
        info: [],
        cabecera: [
          { text: 'Nro. Viaje', value: 'id_Viaje', align: 'center', sortable: false },
          { text: 'Placa', value: 'placa', sortable: false, align: 'center' },
          { text: 'Cédula', value: 'cedula', sortable: false, align: 'center' },
          { text: 'Origen', value: 'origen', sortable: false, align: 'center' },
          { text: 'Destino', value: 'destino', sortable: false, align: 'center' },
          { text: 'Estatus', value: 'status', sortable: false, align: 'center' },
        ],
      }
    },
    components: {
      modal
    },
    computed: {
      ...mapState(['dirapi','datos']),
      checarprogreso () {
        this.iniciarmodel()
        this.errorTrue = false
        if (this.expanded.length !== 0) {
          this.expanded.map(item => {
            this.idViaje_message = item.id_Viaje
            if (item.ViajeAsoc !== '' && item.ViajeAsoc !== null) {
              try {
                axios.put(`${this.dirapi}/amc/putdetalleeventoasociado/${item.id_Viaje}`, {Viaje_Asoc: item.ViajeAsoc})
                  .then(resp => {
                    if (resp.data.message === 'Viaje padre no ha culminado') {
                      this.tipo = false
                      this.mensaje = '¡' + resp.data.message + '!'
                      this.titulo = '¡Error!'
                      this.errorTrue = true
                    } else {
                      this.lista = []
                      this.cargargrid()
                      this.obtenerdetalleseventos(item.id_Viaje)
                    }
                  })
                  .catch(err => {
                    this.tipo = false
                    this.mensaje = 'Error al actualizar'
                    this.titulo = '¡Error!'
                  })
              } catch (error) {
                this.tipo = false
                this.mensaje = 'Error al actualizar'
                this.titulo = '¡Error!'
              }
            } else {
              this.obtenerdetalleseventos(item.id_Viaje)
            }
          })
        }
      },
      uppercase () {
        this.salidatxt = this.salidatxt.toUpperCase()
      }
    },
    watch: {
      viaje(val) {
        this.cargargrid()
      }
    },
    mounted () {
      this.getEventos()
      this.cargargrid()
      this.iniciarmodel()
      this.objectViaje = {
        carga : '',
        descarga : ''
      }
    },
    methods: {
      getcolor (status) {
        return status === 'PENDIENTE' ? '#C9C9C9' : '#006BB0'
      },
      async cargargrid () {
        this.placa = localStorage.getItem('placa')
         await axios.get(this.dirapi + '/amc/tofindviaje/'+this.placa)
          .then(resp => {
            resp.data.viaje.forEach(item => {
              resp.data.sedes.forEach(ele => {
                if (ele.id === item.id_SedeOrigen) {
                  this.origen = ele.descripcion
                }
                if (ele.id === item.id_SedeDestino) {
                  this.destino = ele.descripcion
                }
              })
              this.info = {
                id_Viaje: item.id_Viaje,
                placa: item.placa,
                cedula: item.cedula,
                origen: this.origen,
                destino: this.destino,
                status: item.status,
                ViajeAsoc: item.Viaje_Asoc
                }
              this.lista.push(this.info)
            })
         })
         .catch(e => {
            this.tipo = false
            this.mensaje = 'Error al cargar viajes para PLACA'
            this.titulo = '¡ERROR!'
            this.dialog = true
         })
      },
      iniciarmodel () {
        this.selected = this.model.findIndex(element => {
          if (element.event === 'Carga') {
            return element
          }
        })
      },
      async guardarfecha () {
        if (!this.errorTrue) {
          if (this.objectViaje.carga.length !== 0 && this.objectViaje.descarga.length !== 0) {
            if (this.objectViaje.carga[0].fchhoraestimada_Llegada !== null && this.objectViaje.descarga[0].fchhoraestimada_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Llegada === null && this.objectViaje.carga[0].fchhorareal_Salida === null) {
              let fchaux = new Date()
              if (this.rigthnow) {
                fchaux = new Date()
              } else {
                fchaux = new Date(this.fecha + ' ' + this.hora)
              }
              this.objectViaje.carga[0].fchhorareal_Llegada = fchaux.toISOString()
              this.enviarputfecha(this.objectViaje.carga[0], this.objectViaje.carga[0].id)

            } else if (this.objectViaje.carga[0].fchhoraestimada_Llegada !== null && this.objectViaje.descarga[0].fchhoraestimada_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Salida === null) {
              let fchaux = new Date()
              if (this.rigthnow) {
                fchaux = new Date()
              } else {
                fchaux = new Date(this.fecha+' '+this.hora)
              }
              if ( fchaux.toISOString() > this.objectViaje.carga[0].fchhorareal_Llegada ) {
                this.objectViaje.carga[0].fchhorareal_Salida = fchaux.toISOString()
                this.enviarputfecha(this.objectViaje.carga[0], this.objectViaje.carga[0].id)
              } else {
                this.tipo = false
                this.mensaje = 'Fecha de salida de CARGA no puede ser menor o la misma de llegada a CARGA'
                this.titulo = '¡Error!'
              }

            } else if (this.objectViaje.carga[0].fchhoraestimada_Llegada !== null && this.objectViaje.descarga[0].fchhoraestimada_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Salida !== null && this.objectViaje.descarga[0].fchhorareal_Llegada === null && this.objectViaje.descarga[0].fchhorareal_Salida === null ) {
              let fchaux = new Date()
              if (this.rigthnow) {
                fchaux = new Date()
              } else {
                fchaux = new Date(this.fecha+' '+this.hora)
              }
              
              if ( fchaux.toISOString() > this.objectViaje.carga[0].fchhorareal_Salida ) {
                this.objectViaje.descarga[0].fchhorareal_Llegada = fchaux.toISOString()
                this.enviarputfecha(this.objectViaje.descarga[0], this.objectViaje.descarga[0].id)
              } else {
                this.tipo = false
                this.mensaje = 'Fecha de llegada a DESCARGA no puede ser menor o la misma de salida de CARGA'
                this.titulo = '¡Error!'
              }

            } else if (this.objectViaje.carga[0].fchhoraestimada_Llegada !== null && this.objectViaje.descarga[0].fchhoraestimada_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Salida !== null && this.objectViaje.descarga[0].fchhorareal_Salida === null && this.objectViaje.descarga[0].fchhorareal_Llegada !== null ) {
              let fchaux = new Date()
              if (this.rigthnow) {
                fchaux = new Date()
              } else {
                fchaux = new Date(this.fecha+' '+this.hora)
              }
              if ( fchaux.toISOString() > this.objectViaje.descarga[0].fchhorareal_Llegada ) {
                this.objectViaje.descarga[0].fchhorareal_Salida = fchaux.toISOString()
                this.enviarputfecha(this.objectViaje.descarga[0], this.objectViaje.descarga[0].id)
              } else {
                this.tipo = false
                this.mensaje = 'Fecha de salida de DESCARGA no puede ser menor o la misma de llegada a DESCARGA'
                this.titulo = '¡Error!'
              }
            }
          }
        }
      },
      getEventos () {
        try {
          axios.get(this.dirapi+'/amc/allevents')
          .then(resp => {
            this.eventos = resp.data
          })
        } catch (error) {
          console.log(error)
        }
      },
      async enviarputfecha (payload,idDet) {
        try {
          await axios.put(`${this.dirapi}/amc/putdetalleevento/${idDet}`, payload)
          .then(resp => {
              this.tipo = true
              this.mensaje = '¡Actualización de viaje '+ this.idViaje_message +' Exitosa!'
              this.titulo = '¡BIEN!'
          })
          .catch(err => {
            console.log(err)
            this.tipo = false
            this.mensaje = 'Error al actualizar'
            this.titulo = '¡Error!'
          })
        } catch (error) {
          console.log(error)
          this.tipo = false
          this.mensaje = 'Error al actualizar'
          this.titulo = '¡Error!'
        }
      },
      async obtenerdetalleseventos (id) {
        try{
        await axios.get(this.dirapi+'/amc/getdetallesviaje/'+id)
            .then(resp => {
              if (resp.data) {
                this.verificarFechas(resp.data)
                this.dialog = false
                this.isEditing = false
                this.rigthnow = false
              }
            })
            .catch(error => {
              console.log(error)
              this.tipo = false
              this.mensaje = 'Hubo un problema al cargar la información'
              this.titulo = '¡Error!'
            })
        }catch(e){
          this.tipo = false
          this.mensaje = 'Error en el servidor'
          this.titulo = '¡Error!'
        }
      },
      verificarFechas (data) {
        this.objectViaje.carga = []
        this.objectViaje.descarga = []
        this.eventos.forEach((ele, index) => {
          if (index === 1) {
            this.objectViaje.carga = data.filter(item => item.id_Evento === ele.id && ele.descripcion === 'CARGA')
          }
          if (index === 2) {
            this.objectViaje.descarga = data.filter(item => item.id_Evento === ele.id && ele.descripcion === 'DESCARGA')
          }
        })
        if ( this.objectViaje.carga.length !== 0 && this.objectViaje.descarga.length !== 0 ) {
          if (this.objectViaje.carga[0].fchhoraestimada_Llegada !== null && this.objectViaje.descarga[0].fchhoraestimada_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Salida === null && (this.objectViaje.carga[0].fchhorareal_Llegada === null || this.objectViaje.carga[0].fchhorareal_Llegada !== null )) {
            this.showInicio = false
            this.selected = this.model.findIndex(element => {
              if (element.event === 'Carga') {
                return element
              }
            })
            if (this.objectViaje.carga[0].fchhorareal_Llegada === null) {
              this.status = false
            }
            if (this.objectViaje.carga[0].fchhorareal_Llegada !== null) {
              this.status = true
            }
          }
          if (this.objectViaje.carga[0].fchhoraestimada_Llegada !== null && this.objectViaje.descarga[0].fchhoraestimada_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Llegada !== null && this.objectViaje.carga[0].fchhorareal_Salida !== null && this.objectViaje.descarga[0].fchhorareal_Salida === null && (this.objectViaje.descarga[0].fchhorareal_Llegada !== null || this.objectViaje.descarga[0].fchhorareal_Llegada === null) ) {
            this.showInicio = false
            this.selected = this.model.findIndex(element => {
              if (element.event === 'Descarga') {
                return element
              }
            })

            if (this.objectViaje.descarga[0].fchhorareal_Llegada === null) {
              this.status = false
            }
            if(this.objectViaje.descarga[0].fchhorareal_Llegada !== null) {
              this.status = true
            }
          }
        }
      }
    }
}
</script>
