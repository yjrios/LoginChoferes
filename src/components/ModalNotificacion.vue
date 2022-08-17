<template>
    <v-layout :wrap="true">
        <v-flex cols="auto">
            <v-dialog
            transition="dialog-top-transition"
            max-width="600"
            max-height="300"
            v-model="dialog"
            >
                <v-card color="teal lighten-5">
                    <v-toolbar
                    :color="tipo ? 'success' : '#D50000'"
                    dark
                    >{{ title }}</v-toolbar>
                    <v-card-text>
                    <div align="center" justify="center" class="text-h6 pa-8">{{ mensaje }}</div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                    <v-btn
                    :color="tipo ? 'success' : '#D50000'"
                    text
                    @click="dialog=false"
                    >Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-flex>
    </v-layout>
</template>

<script>

export default {
    name: 'NotificacionMessage',

    data () {
        return {
            dialog: true
        }
    },

    props: {
        mensaje: String,
        title: String,
        tipo: Boolean
    },
}
</script>
