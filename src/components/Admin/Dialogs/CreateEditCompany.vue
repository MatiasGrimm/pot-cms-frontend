<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentCompany">
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit company' : 'Add new company' }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="resetDialog">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editCompanyRef">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="currentCompany.name" :rules="[rules.required]" dense label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="currentCompany.cvr" dense label="CVR"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="currentCompany.phone" dense label="Phone"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="currentCompany.country" dense label="Country"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="currentCompany.address" dense label="Address"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :rules="[rules.required]"
                :items="licenses"
                item-text="name"
                v-model="currentCompany.licenseId"
                dense
                item-value="id"
                label="License"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-switch v-model="companyEnabled" label="Enabled" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="resetDialog" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentCompany"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update Company' : 'Add Company' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import apiService from '@/services/apiService';

export default {
  name: 'CreateEditCompany',
  components: {},
  computed: {
    isEditing() {
      return this.currentCompany?.id ? true : false;
    },
    companyEnabled: {
      get() {
        return !this.currentCompany.disabled;
      },
      set(val) {
        this.currentCompany.disabled = !val;
      },
    },
  },
  data: () => ({
    companies: [],
    licenses: [],
    show: false,
    currentCompany: null,
    isValid: false,
    isSaving: false,
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
    },
  }),
  methods: {
    async getCompanies() {
      this.companies = await apiService.getCompanies();
    },
    async getLicenses() {
      this.licenses = await apiService.getLicenses();
    },
    editCompany(company) {
      this.currentCompany = _.cloneDeep(company);
      this.initialize();
      this.show = true;
    },
    createCompany() {
      this.currentCompany = {
        address: null,
        country: null,
        cvr: null,
        disabled: false,
        id: null,
        licenseId: null,
        name: null,
        phone: null,
      };
      this.initialize();
      this.show = true;
      this.$nextTick(() => {
        this.$refs.editCompanyRef.resetValidation();
      });
    },
    async saveCurrentCompany() {
      this.isSaving = true;
      await apiService
        .createOrEditCompany(this.currentCompany)
        .then(() => {
          this.resetDialog();
          this.$emit('company-updated');
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    resetDialog() {
      this.$refs.editCompanyRef.reset();
      this.selectedProducts = [];
      this.show = false;
    },
    initialize() {
      this.getCompanies();
      this.getLicenses();
    },
  },
};
</script>

<style></style>
