<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentLicense">
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit License' : 'Add new License' }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="show = false">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editLicenseRef">
          <v-row>
            <v-col cols="12">
              <v-text-field :rules="[rules.required]" v-model="currentLicense.name" dense label="Name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field :rules="[rules.required]" v-model="currentLicense.currencyCode" dense label="Currency code"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field :rules="[rules.required]" v-model="currentLicense.priceListCode" dense label="Price list code"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field :rules="[rules.required, rules.decimal]" v-model="currentLicense.priceFactor" dense label="Price Factor"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :rules="[rules.required]"
                :items="companies"
                item-text="name"
                v-model="currentLicense.companies"
                dense
                return-object
                multiple
                item-value="id"
                label="Companies"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="configurations"
                item-text="configurationName"
                v-model="currentLicense.configurations"
                dense
                return-object
                multiple
                item-value="id"
                label="Configurations"
              ></v-select>
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="licenseEnabled" label="Enabled" />
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="currentLicense.isDemonstrationLicense" dense label="Demonstration license" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="show = false" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentLicense"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update License' : 'Add License' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import apiService from '@/services/apiService.js';

export default {
  name: 'CreateEditLicense',
  data: () => ({
    show: false,
    currentLicense: {},
    companies: [],
    isSaving: false,
    isValid: null,
    configurations: [],
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
      decimal: (v) => /^(\d+(\.?\d+)?)$/.test(v) || 'Number is not valid. (##.##) ',
    },
  }),
  computed: {
    isEditing() {
      return this.currentLicense?.id ? true : false;
    },
    licenseEnabled: {
      get() {
        return !this.currentLicense.disabled;
      },
      set(val) {
        this.currentLicense.disabled = !val;
      },
    },
  },
  methods: {
    addLicense() {
      this.initialize();
      this.currentLicense = {
        companies: [],
        name: null,
        currencyCode: null,
        isDemonstrationLicense: false,
        disabled: false,
        priceFactor: null,
        priceListCode: null,
      };
    },
    editLicense(license) {
      this.initialize();
      this.currentLicense = _.cloneDeep(license);
    },
    async saveCurrentLicense() {
      this.isSaving = true;
      await apiService
        .createOrEditLicense(this.currentLicense)
        .then(() => {
          this.show = false;
          this.$emit('license-updated');
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    async initialize() {
      this.companies = await apiService.getCompanies();
      this.configurations = await apiService.getConfigurations();
      this.show = true;
    },
  },
  created() {},
};
</script>

<style>
</style>