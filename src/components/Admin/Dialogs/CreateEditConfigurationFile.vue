<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentConfigurationFile">
      <v-alert v-if="errorCreation" class="error white--text" icon="mdi-alert"> Error creating configuration file </v-alert>
      <v-alert v-if="errorUpload" class="error white--text" icon="mdi-alert"> Error uploading configuration file </v-alert>
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit Configuration File' : 'Add new Configuration File' }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="show = false">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editConfigurationFileRef">
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="currentConfigurationFile.description" dense label="Description" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :disabled="!uploadFile" :rules="[rules.required]" v-model="currentConfigurationFile.filename" dense label="Filename" />
            </v-col>
            <v-col cols="6" md="6">
              <v-file-input
                @change="currentConfigurationFile.filename = uploadFile ? uploadFile.name : null"
                :rules="isEditing ? [] : [rules.required]"
                v-model="uploadFile"
                dense
                label="File"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="currentConfigurationFile.path" dense label="Path (Default: %ProgramData%\Cubic\Updates" />
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="configurationFileEnabled" label="Enabled" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="show = false" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentConfigurationFile"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update Configuration File' : 'Add Configuration File' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import apiService from '@/services/apiService.js';
import _ from 'lodash';

export default {
  name: 'CreateEditConfigurationFile',
  data: () => ({
    show: false,
    isValid: false,
    isSaving: false,
    errorCreation: null,
    errorUpload: null,
    currentConfigurationFile: {},
    applications: [],
    isLoading: false,
    uploadFile: null,
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
    },
  }),
  computed: {
    isEditing() {
      return this.currentConfigurationFile?.id ? true : false;
    },
    configurationFileEnabled: {
      get() {
        return !this.currentConfigurationFile.disabled;
      },
      set(val) {
        this.currentConfigurationFile.disabled = !val;
      },
    },
  },
  methods: {
    createConfigurationFile() {
      this.getApplications();
      this.show = true;
      this.currentConfigurationFile = {
        filename: null,
        description: null,
        content: [],
        disabled: false,
        path: '',
      };
    },
    editConfigurationFile(configurationFile) {
      this.show = true;
      this.getApplications();
      this.currentConfigurationFile = _.cloneDeep(configurationFile);
      this.uploadFile = new File([configurationFile.content], configurationFile.filename, {
        type: 'application/text',
      });
    },
    async saveCurrentConfigurationFile() {
      this.isSaving = true;

      if (this.uploadFile.name != this.currentConfigurationFile.filename) {
        this.uploadFile = this.renameFile(this.uploadFile, this.currentConfigurationFile.filename);
        this.setFileInfo();
      }
      let createdId;
      try {
        createdId = await apiService.createOrEditConfigurationFile(this.currentConfigurationFile);
      } catch (e) {
        this.errorCreation = e.message;
      }
      try {
        await apiService.uploadConfigurationFile(this.uploadFile, createdId);
      } catch (e) {
        this.errorUpload = e.message;
      }

      this.show = false;
      this.$emit('configurationfile-updated');
      this.isSaving = false;
    },
    async getApplications() {
      this.isLoading = true;
      this.applications = await apiService.getApplications();
      this.isLoading = false;
    },
    setFileInfo() {
      this.currentConfigurationFile.filename = this.uploadFile?.name;
    },
    renameFile(originalFile, newName) {
      return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
    },
  },
};
</script>

<style></style>
