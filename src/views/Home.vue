<template>
  <v-container fill-height class="d-flex">
    <v-card v-if="!isAuthenticated" class="mx-auto" width="500"><login-dialog /></v-card>
    <v-card v-else class="mx-auto" width="500">
      <v-card-title>Potshop Licensing System</v-card-title>
      <v-card-text>
        <p>
          Welcome to the Potshop Licensing System.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import LoginDialog from '@/components/LoginDialog.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: { LoginDialog },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
};
</script>
