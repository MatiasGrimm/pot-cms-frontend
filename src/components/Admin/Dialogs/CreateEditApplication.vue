<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentApplication">
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit Application' : 'Add new Application' }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="show = false">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editApplicationRef">
          <v-row>
            <v-col cols="12">
              <v-text-field :rules="[rules.required]" v-model="currentApplication.name" dense label="Name"></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="applicationEnabled" label="Enabled" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="show = false" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentApplication"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update Application' : 'Add Application' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import apiService from '@/services/apiService.js';

export default {
  name: 'CreateEditApplication',
  data: () => ({
    isLoading: false,
    currentApplication: {},
    configurationFiles: [],
    isValid: null,
    isSaving: false,
    show: false,
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
    },
  }),
  computed: {
    isEditing() {
      return this.currentApplication?.id ? true : false;
    },
    applicationEnabled: {
      get() {
        return !this.currentApplication.disabled;
      },
      set(val) {
        this.currentApplication.disabled = !val;
      },
    },
  },
  methods: {
    createApplication() {
      this.show = true;
      this.currentApplication = {
        name: null,
        releases: [],
        disabled: false,
      };
    },
    editApplication(application) {
      this.show = true;
      this.currentApplication = _.cloneDeep(application);
    },
    async saveCurrentApplication() {
      this.isSaving = true;
      await apiService
        .createOrEditApplication(this.currentApplication)
        .then(() => {
          this.show = false;
          this.$emit('application-updated');
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    async getConfigurationFiles() {
      this.configurationFiles = await apiService.getConfigurationFiles();
    },
  },
  created() {
    this.getConfigurationFiles();
  },
};
</script>

<style></style>
