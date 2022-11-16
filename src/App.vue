<template>
  <v-app>
    <v-snackbar
      v-if="globalAlert"
      v-model="globalAlert.show"
      class="mt-4 pa-4 mb-6 mr-n4"
      transition="slide-y-reverse-transition"
      bottom
      right
      elevation="0"
      :color="globalAlert.color"
      :timeout="parseInt(globalAlert.timeout)"
    >
      <div :class="globalAlert.textColor ? globalAlert.textColor + '--text' : 'black--text'">
        <div class="font-weight-bold">{{ globalAlert.title }}</div>
        <div class="py-2" v-html="globalAlert.message" />
        <div class="py-2" v-if="globalAlert.details">
          <div style="max-height: 500px; white-space: pre-break; word-break: break-word; overflow-y: scroll;">{{ globalAlert.details }}</div>
        </div>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="globalAlert.show = false" title="Dismiss">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-app-bar app elevation="0" :src="require('@/assets/headerBackground.png')" fade-img-on-scroll>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(255,255,255,.5), rgba(200,200,200,.8)"></v-img>
      </template>
      <div class="d-flex align-center">
        <v-img alt="CUBIC Logo" class="shrink mr-2" contain :src="require('@/assets/logo.png')" transition="scale-transition" width="80" />
      </div>
      <v-spacer />
      <div class="ml-auto">
        <v-menu offset-y bottom left v-if="user">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed large title="Account" icon v-bind="attrs" v-on="on" :color="user ? 'primary' : 'secondary'">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <user-menu @show-login="showLoginDialog = true" @show-changePassword="showChangePasswordDialog = true" />
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
      <template v-slot:extension v-if="isAuthenticated">
        <v-tabs align-with-title>
          <v-tab v-if="isManager" :to="{ name: 'UserList' }">Users</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'CompanyList' }">Companies</v-tab>
          
          <v-tab v-if="isAdmin" :to="{ name: 'ApplicationReleaseList' }">Releases</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'ApplicationElementList' }">Elements</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'License' }">Licenses</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'UpdateCheckLog' }">Update Log</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'UpdateDownloadLog' }">Download Log</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'ApplicationList' }">Applications</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'SqlScriptList' }">SQL Scripts</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'Configuration' }">Configurations</v-tab>
          <v-tab v-if="isAdmin" :to="{ name: 'ConfigurationFileList' }">Configuration Files</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-dialog v-model="showLoginDialog" width="500">
      <login-dialog v-if="showLoginDialog" @hide-login="showLoginDialog = false" />
    </v-dialog>
    <v-dialog v-model="showChangePasswordDialog" width="500">
      <change-password-dialog v-if="showChangePasswordDialog" @hide-changePassword="showChangePasswordDialog = false" />
    </v-dialog>
    <v-main>
      <div style="height: 2px; width: 100%" class="primary" />
      <router-view />
    </v-main>
    <v-footer app absolute>
      <div class="text-center mx-auto">CUBIC Licensing System © 2022 <a href="https://cubic.eu" target="_blank">CUBIC</a></div>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import LoginDialog from './components/LoginDialog.vue';
import UserMenu from './components/UserMenu.vue';
import ChangePasswordDialog from '@/components/ChangePasswordDialog.vue';

export default {
  components: { LoginDialog, UserMenu, ChangePasswordDialog },
  name: 'App',

  data: () => ({
    showLoginDialog: false,
    showChangePasswordDialog: false,
  }),

  computed: {
    ...mapGetters(['user', 'globalAlert', 'isAuthenticated', 'isManager', 'isAdmin']),
  },

  methods: {
    logout() {
      this.$store.dispatch('LOGOUT').then(() => {
        this.$router.push('/');
      });
    },
  },
};
</script>
