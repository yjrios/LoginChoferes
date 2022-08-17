<template>
  <v-app>
    <v-app-bar
      app
      color="transparent"
      dark
    >
      <div>
        <v-img
          contain
          min-width="100"
          src="./assets/scam2.jpg"
          gradient="to top right, rgba(55,236,186,.3), rgba(25,32,72,.3)"
        />
      </div>
      <v-spacer></v-spacer>
      <v-icon light @click="cerrarsesion" v-if="datos.length !== 0">mdi-close-circle-multiple</v-icon>
    </v-app-bar>

    <v-main class="background">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'App',

  data () {
    return {
      placa: '',
      trueFalse: true
    }
  },
  computed: {
    ...mapState(['datos']),
  },
  methods: {
    ...mapMutations(['cerrar']),
    cerrarsesion() {
      this.cerrar()
      this.$router.push( {name: "LoginChoferes"} )
    },
  }
};
</script>

<style scoped>
.background{
  /* background: url('./assets/Imagen1.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%; */
  background-color: #D0DAE0;
}
</style>
