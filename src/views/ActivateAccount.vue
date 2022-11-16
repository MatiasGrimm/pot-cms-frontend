<template>
  <v-container :fluid="$vuetify.breakpoint.lgAndDown">
    <div class="text-center mt-md-8"></div>
    <div class="text-center">
      <div class="text-h6 text-md-h5 my-4">Welcome to Cubic</div>
    </div>
    <v-card max-width="500" class="mx-auto mt-8">
      <v-window :value="activated" vertical>
        <v-window-item :value="false">
          <v-form v-model="isValid" class="pa-4" @submit.prevent="activate">
            <v-col cols="12">
              <div class="mb-6">Enter your desired password to activate your Cubic account:</div>
              <password-text-field v-model="password" label="Password" :rules="[rules.required, rules.length]" />
              <password-text-field
                v-model="password2"
                label="Password (again)"
                :rules="[rules.required, mustMatch]"
                @keypress.enter="activate()"
              />
              <v-alert v-if="error" class="error white--text" icon="mdi-alert"> Error activating account </v-alert>
              <v-btn class="mt-4" depressed @click="activate" :loading="isLoading" color="primary" block :disabled="!isValid">
                Activate account
              </v-btn>
            </v-col>
          </v-form>
        </v-window-item>
        <v-window-item :value="true">
          <div class="pa-8">
            <div class="text-h5 mb-4">Account activated</div>
            <p>Your Cubic account has been successfully activated and you have been logged in.</p>
            <v-btn class="mt-8" :to="{ name: 'UserList' }" block> Go to users </v-btn>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>
<script>
import PasswordTextField from '@/components/PasswordTextField.vue';
import apiService from '@/services/apiService';

export default {
  name: 'activate-account',
  components: { PasswordTextField },
  data: () => ({
    password: null,
    password2: null,
    isValid: false,
    showPassword: false,
    isLoading: false,
    error: null,
    activated: false,
    rules: {
      required: (value) => !!value || 'Value is required.',
      length: (value) => value?.length > 5 || 'Password must be at least 6 characters long.',
    },
  }),
  methods: {
    mustMatch(value) {
      return value === this.password || 'Passwords are not identical';
    },
    async activate() {
      if (this.isValid) {
        this.isLoading = true;

        try {
          await apiService.activateAccount({
            username: this.$route.query.email,
            token: this.$route.query.token,
            password: this.password,
          });

          await this.$store.dispatch('AUTHENTICATE', { userName: this.$route.query.email, password: this.password });

          this.password = null;
          this.password2 = null;
          this.activated = true;
        } catch (e) {
          this.error = e.message;
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
};
</script>
