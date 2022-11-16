<template>
  <div>
    <div v-if="user" class="text-center">
      Logged in: <br />
      <strong>{{ user.name }}</strong>
    </div>
    <v-list>
      <v-list-item v-if="user" @click="$emit('show-changePassword')">
        <v-list-item-title>
          <v-icon left>mdi-lock-reset</v-icon>
          Change Password
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="user" @click="logout()">
        <v-list-item-title>
          <v-icon left>mdi-logout</v-icon>
          Log out
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-else @click="$emit('show-login')">
        <v-list-item-title>
          <v-icon left>mdi-login</v-icon>
          Log in
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'userMenu',
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    logout() {
      this.$store.dispatch('LOGOUT').then(() => {
        this.$router.push({ name: 'FrontPage' });
      });
    },
  },
};
</script>

<style></style>
