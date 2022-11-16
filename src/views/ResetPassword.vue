<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <v-card max-width="500" class="mx-auto mt-8">
      <template #header>
        <v-card-title>Reset password</v-card-title>
      </template>
      <v-window :value="passwordReset" vertical>
        <v-window-item :value="false">
          <v-form v-model="validPasswordReset" class="pa-4" @submit.prevent="resetPassword">
            <v-col cols="12">
              <div class="mb-6">Enter your email address and your new desired password</div>
              <v-text-field v-model="username" label="Email" />
              <password-text-field v-model="newPassword" label="Password" :rules="[rules.required, rules.length]" />
              <password-text-field
                v-model="newPassword2"
                label="Password (again)"
                :rules="[rules.required, mustMatch]"
                @keypress.enter="resetPassword()"
              />
              <v-alert v-if="error" class="error white--text" icon="mdi-alert"> Error resetting password </v-alert>
              <v-btn
                class="mt-4"
                depressed
                @click="resetPassword"
                :loading="isLoading"
                color="primary"
                block
                :disabled="!validPasswordReset"
              >
                Reset password
              </v-btn>
            </v-col>
          </v-form>
        </v-window-item>
        <v-window-item :value="true">
          <div class="pa-8">
            <div class="text-h5 mb-4">Password</div>
            <p>Your password was successfully reset and you have been logged in.</p>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script>
import PasswordTextField from '@/components/PasswordTextField.vue';
import apiService from '@/services/apiService.js';

export default {
  name: 'ResetPassword',
  components: { PasswordTextField },
  data: () => ({
    isLoading: false,
    validPasswordReset: true,
    passwordReset: false,
    username: null,
    newPassword: null,
    newPassword2: null,
    rules: {
      required: (value) => !!value || 'Value is required.',
      length: (value) => value?.length > 5 || 'Password must be at least 6 characters long.',
    },
  }),
  methods: {
    mustMatch(value) {
      return value === this.newPassword || 'Passwords are not identical';
    },
    async resetPassword() {
      if (this.validPasswordReset) {
        this.isLoading = true;

        try {
          await apiService.resetPasswordToken({
            username: this.username,
            token: this.$route.query.token,
            password: this.newPassword,
          });

          await this.$store.dispatch('AUTHENTICATE', { userName: this.username, password: this.newPassword });
          this.newPassword = null;
          this.newPassword2 = null;
          this.passwordReset = true;
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

<style></style>
