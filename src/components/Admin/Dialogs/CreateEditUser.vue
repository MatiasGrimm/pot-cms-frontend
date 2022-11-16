<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentUser">
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit user' : 'Add new user' }} {{ userName }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="show = false">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editUserRef">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="currentUser.name" :rules="[rules.required]" dense label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="currentUser.phoneNumber" dense label="Phone Number"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="currentUser.email" :rules="[rules.required]" dense label="Email"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select v-show="isAdmin" label="Company" :items="companies" v-model="currentUser.companyId" item-text="name" item-value="id" />
            </v-col>
            <v-col cols="12">
              <password-text-field v-model="currentUser.password" label="New password (enter to reset)" :rules="[rules.password]" />
            </v-col>
            <v-col cols="12" md="6">
              <strong>Roles:</strong>
              <v-checkbox v-model="currentUser.roles" value="manager" label="Manager" dense hide-details />
              <v-checkbox v-if="isAdmin" v-model="currentUser.roles" value="admin" label="Admin" dense hide-details />
            </v-col>
            <v-col cols="auto">
              <v-switch v-model="userEnabled" label="Enabled" hide-details="" />
              <v-switch v-if="isAdmin" v-model="currentUser.prereleaseEnabled" label="Prerelease enabled" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="show = false" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentUser"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update user' : 'Add user' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import apiService from '@/services/apiService';
import { mapGetters } from 'vuex';
import PasswordTextField from '@/components/PasswordTextField.vue';

export default {
  name: 'CreateEditUser',
  components: { PasswordTextField },
  computed: {
    ...mapGetters(['isAdmin', 'user']),
    isEditing() {
      return this.currentUser?.id ? true : false;
    },
    userEnabled: {
      get() {
        return !this.currentUser.disabled;
      },
      set(val) {
        this.currentUser.disabled = !val;
      },
    },
  },
  data: () => ({
    companies: [],
    userName: '',
    show: false,
    currentUser: null,
    isValid: false,
    isSaving: false,
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
      password: (value) => !value || value?.length > 5 || 'Password must be at least 6 characters long.',
    },
  }),
  methods: {
    async getCompanies() {
      this.companies = await apiService.getCompanies();
    },
    editUser(user) {
      this.currentUser = _.cloneDeep(user);
      this.userName = this.currentUser.name;
      this.show = true;
    },
    createUser() {
      this.currentUser = {
        name: null,
        email: null,
        phoneNumber: null,
        companyId: null,
        disabled: false,
        roles: [],
      };
      this.show = true;
    },
    async saveCurrentUser() {
      this.isSaving = true;
      await apiService
        .createOrEditUser(this.currentUser)
        .then(() => {
          this.show = false;
          this.$emit('user-updated');
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
  },
  created() {
    if (this.isAdmin) this.getCompanies();
  },
};
</script>

<style></style>
