<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentConfiguration">
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit Configuration' : 'Add new Configuration' }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="show = false">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editConfigurationRef">
          <v-row>
            <v-col cols="12">
              <v-text-field :rules="[rules.required]" v-model="currentConfiguration.configurationName" dense label="Name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :rules="[rules.required]"
                :items="applications"
                item-text="name"
                v-model="currentConfiguration.applicationId"
                dense
                item-value="id"
                :label="applications.length ? 'Applications' : 'No applications available'"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                :rules="[rules.required]"
                :items="configurationFiles"
                item-text="filename"
                v-model="currentConfiguration.configurationFiles"
                multiple
                dense
                return-object
                label="Configuration Files"
              ></v-select>
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="configurationEnabled" label="Enabled" />
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="currentConfiguration.isDefault" label="Default" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="show = false" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentConfiguration"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update Configuration' : 'Add Configuration' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import apiService from '@/services/apiService.js';

export default {
  name: 'CreateEditConfiguration',

  data: () => ({
    show: false,
    currentConfiguration: {},
    configurationFiles: [],
    applications: [],
    isSaving: false,
    isValid: null,
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
    },
  }),

  computed: {
    isEditing() {
      return this.currentConfiguration?.id ? true : false;
    },
    configurationEnabled: {
      get() {
        return !this.currentConfiguration.disabled;
      },
      set(val) {
        this.currentConfiguration.disabled = !val;
      },
    },
  },
  methods: {
    addConfiguration() {
      this.initialize();
      this.currentConfiguration = {
        configurationFiles: [],
        configurationName: null,
        disabled: false,
        isDefault: false,
      };
    },
    editConfiguration(configuration) {
      this.initialize();
      this.currentConfiguration = _.cloneDeep(configuration);
    },
    async saveCurrentConfiguration() {
      this.isSaving = true;
      await apiService
        .createOrEditConfiguration(this.currentConfiguration)
        .then(() => {
          this.show = false;
          this.$emit('configuration-updated');
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    async getConfigurationFiles() {
      this.configurationFiles = await apiService.getConfigurationFiles();
    },
    async getApplications() {
      this.applications = (await apiService.getApplications()).filter((x) => !x.configurationId || x.configurationId == this.currentConfiguration.id);
    },
    async initialize() {
      this.getConfigurationFiles();
      this.getApplications();
      this.show = true;
    },
  },
  created() {},
};
</script>

<style>
</style>