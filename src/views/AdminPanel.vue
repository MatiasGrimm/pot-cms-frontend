<template>
  <div>
    <v-container fluid class="pa-0 pa-md-8" style="max-width: 1600px">
      <router-view />
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AdminPanel',
  computed: {
    ...mapGetters(['isAdmin', 'isManager']),
  },
};
</script>

<style></style>
