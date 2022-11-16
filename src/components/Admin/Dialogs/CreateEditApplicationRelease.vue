<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentApplicationRelease">
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit Application Release' : 'Add new Application Release' }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="show = false">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editApplicationReleaseRef">
          <v-row>
            <v-row v-if="!isEditing" class="ma-0 py-0 px-3" no-gutters>
              <v-col class="d-flex flex-column justify-end" cols="3">
                <v-checkbox class="ma-0" v-model="useExisting" hide-details label="Use Existing"></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-select
                  :disabled="!useExisting"
                  :items="applicationReleases"
                  item-value="id"
                  @change="selectExistingApplicationRelease"
                  item-text="publicName"
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
            <v-col cols="12">
              <v-select
                dense
                :items="applications"
                item-value="id"
                v-model="currentApplicationRelease.applicationId"
                item-text="name"
                label="Application"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :rules="[rules.required]" v-model="currentApplicationRelease.publicName" dense label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :rules="[rules.required]" v-model="currentApplicationRelease.version" dense label="Version"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="currentApplicationRelease.description" dense label="Description"></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="currentApplicationRelease.sqlScripts"
                return-object
                item-text="filename"
                multiple
                dense
                label="Sql Scripts"
                :items="sqlScripts"
                @change="currentApplicationRelease.sqlScriptCount = currentApplicationRelease.sqlScripts ? currentApplicationRelease.sqlScripts.length : 0"
              />
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="currentApplicationRelease.prerelease" dense label="Prerelease" />
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="applicationReleaseEnabled" dense label="Enabled" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="show = false" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentApplicationRelease"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update Application Release' : 'Add Application Release' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import apiService from '@/services/apiService.js';

export default {
  name: 'CreateEditApplicationRelease',
  data: () => ({
    show: false,
    useExisting: false,
    currentApplicationRelease: {},
    isValid: false,
    isSaving: false,
    sqlScripts: [],
    isLoading: false,
    applications: [],
    elements: [],
    applicationReleases: [],
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
    },
  }),
  computed: {
    isEditing() {
      return this.currentApplicationRelease?.id ? true : false;
    },
    applicationReleaseEnabled: {
      get() {
        return this.currentApplicationRelease.enabled;
      },
      set(val) {
        this.currentApplicationRelease.enabled = val;
      },
    },
  },
  methods: {
    createApplicationRelease() {
      this.show = true;
      this.initialize();
      this.currentApplicationRelease = {
        version: null,
        applicationId: null,
        publicName: null,
        description: null,
        enabled: true,
        disabled: false,
        debug: true,
        elements: [],
        sqlScripts: [],
      };
    },
    editApplicationRelease(applicationRelease) {
      this.show = true;
      this.currentApplicationRelease = _.cloneDeep(applicationRelease);
      this.initialize();
    },
    async saveCurrentApplicationRelease() {
      this.isSaving = true;
      await apiService
        .createOrEditApplicationRelease(this.currentApplicationRelease)
        .then(() => {
          this.show = false;
          this.$emit('applicationrelease-updated');
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    async getApplications() {
      this.applications = await apiService.getApplications();
    },
    async getSqlScripts() {
      this.sqlScripts = await apiService.getSqlScripts();
    },
    async getApplicationReleases() {
      this.applicationReleases = await apiService.getApplicationReleases();
    },
    async selectExistingApplicationRelease(id) {
      let applicationRelease = await await apiService.getApplicationReleaseById(id);
      applicationRelease.id = null;
      this.currentApplicationRelease = _.cloneDeep(applicationRelease);
    },
    initialize() {
      this.getApplications();
      this.getSqlScripts();
      this.getApplicationReleases();
      this.$refs.editApplicationReleaseRef?.resetValidation();
    },
  },
};
</script>

<style></style>
