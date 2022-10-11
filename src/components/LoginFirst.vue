<template>
  <v-container>
  <v-form lazy-validation ref="form" v-model="valida" @submit.prevent="submit">
    <v-card align="center" class="elevation-12 contenedor">
      <v-toolbar dark color="primary">
        <v-icon size="30" color="black">mdi-card-account-details-outline</v-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title class="mr-2">LOGIN</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon size="40" color="black">mdi-truck-cargo-container</v-icon>
      </v-toolbar>
      <v-card-text>
          <v-text-field
          prepend-icon="person"
          v-model="usuario"
          label="USUARIO"
          :counter="10"
          hint="Al menos 5 caracteres"
          :rules="emailRules"
          ></v-text-field>

          <v-text-field
          prepend-icon="lock"
          v-model="contrasenia"
          :type="mostrar ? 'text' : 'password'"
          :append-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="mostrar = !mostrar"
          label="CONTRASEÑA"
          hint="Al menos 5 caracteres"
          :rules="contraseniaRules"
          :counter="16"
          autocomplete='off'
          ></v-text-field>
          <v-btn
          class="mr-4"
          @click="clear"
          color="primary">
          Limpiar
          </v-btn>
          <v-btn
          @click="submit"
          color="primary"
          @keyup.enter="submit"
          >
          Iniciar
          </v-btn>
        </v-card-text>
      <v-snackbar v-model="snackbar"
      color="#D50000"
      bottom
      shaped
      >
        {{ errores.message }}
        <v-divider vertical class="mx-10"></v-divider>
        <template>
          <v-btn
          text
          dark
          @click="snackbar = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </v-form>
  </v-container>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
    name: 'LoginFirst',
    data () {
        return {
            snackbar: false,
            y: 'bottom',
            x: null,
            mode: '',
            valida: false,
            usuario: '',
            contrasenia: '',
            mostrar:false,
            emailRules:[
                v => !!v || 'El Usuario es requerido',
            ],
                contraseniaRules:[
                v => !!v || 'La contraseña es requerida',
                v => (v && v.length > 3) || 'La contraseña debe tener un mínimo de 5 caracteres',
                v => (v && v === this.usuario) || 'El Usuario y Contraseña deben ser iguales'
            ],
        }
    },
    computed:{
        ...mapState(['datos','errores'])
    },
    methods:{
    ...mapActions(['iniciarSesion','clearErrores']),

      async submit () {
      // this.clearErrores()         //########################### Limpio Erroress
        this.$refs.form.validate()  //########################### BOTON INGRESAR
        if (this.valida) {
          await this.iniciarSesion( {usuario: this.usuario, password: this.contrasenia} )
          if (this.errores.length === 0) {
            this.$router.push('/planviaje')
          } else {
            this.snackbar = true
          }
        }
      },
      clear () {            //########################### BOTON LIMPIAR
          this.$refs.form.reset()
          this.contrasenia = ''
          this.email = ''
      },
    }
}
</script>

<style scoped>
.contenedor{
  margin-top: 15%;
}
</style>
