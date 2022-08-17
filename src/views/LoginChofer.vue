<template>
  <v-container fluid>
    <v-expand-x-transition>
      <v-layout justify-center>
        <v-flex align-auto cols6 sm12 md6 lg6 xl6 :wrap="true">
            <loginFirst />
        </v-flex>
      </v-layout>
    </v-expand-x-transition>
  </v-container>
</template>

<script>
import loginFirst from '../components/LoginFirst.vue'

export default {
    name: 'LoginChoferes',

    components: {
        loginFirst
    }
}
</script>
