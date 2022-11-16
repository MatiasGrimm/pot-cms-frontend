<template>
  <v-card>
    <v-card-title>Change Password</v-card-title>
    <v-card-text>
      <v-window :value="passwordChanged" vertical>
        <v-window-item :value="false">
          <p>Enter your current password and your new desired password</p>
          <v-form ref="changePasswordForm" v-model="isValid">
            <v-row no-gutters>
              <v-col cols="12" class="px-2">
                <v-text-field
                  v-model="currentPassword"
                  label="Current Password"
                  :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.length]"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  @click:append="showCurrentPassword = !showCurrentPassword"
                />
              </v-col>
              <v-col cols="12" class="px-2">
                <v-text-field
                  v-model="newPassword"
                  label="New Password"
                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.length, notMatching]"
                  :type="showNewPassword ? 'text' : 'password'"
                  @click:append="showNewPassword = !showNewPassword"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-alert type="error" v-if="errorMessage">
                  {{ errorMessage }}
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
        <v-window-item :value="true">
          <div>
            <p>Your password was successfully changed</p>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="!passwordChanged"
        block
        depressed
        :disabled="!isValid"
        color="success"
        class="mr-4 mb-4"
        @click="changePassword"
        :loading="isLoading"
      >
        Change Password
      </v-btn>
      <v-btn v-else block class="mr-4 mb-4" depressed @click="$emit('hide-changePassword')">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import apiService from '@/services/apiService.js';

export default {
  name: 'changePassword',
  data: () => ({
    currentPassword: null,
    newPassword: null,
    isValid: false,
    isLoading: false,
    showCurrentPassword: false,
    showNewPassword: false,
    errorMessage: null,
    passwordChanged: false,
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
      length: (value) => value?.length > 5 || 'Password must be at least 6 characters long.',
    },
  }),
  methods: {
    notMatching(value) {
      return value !== this.currentPassword || 'Password can not match.';
    },
    async changePassword() {
      if (this.$refs.changePasswordForm.validate()) {
        this.isLoading = true;
        await apiService
          .changePassword({ CurrentPassword: this.currentPassword, NewPassword: this.newPassword })
          .then(() => {
            this.passwordChanged = true;
          })
          .catch((e) => {
            this.errorMessage = e.message;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
  },
};
</script>
