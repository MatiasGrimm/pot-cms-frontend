<template>
  <div v-if="!isLoading">
    <v-row>
      <v-col cols="12" sm="auto">
        <h1 class="text-left">{{ configuration.configurationName }}</h1>
      </v-col>
      <v-col cols="12" sm="auto">
        <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editConfiguration">
          <v-icon left>mdi-pencil-outline</v-icon>
          Edit
        </v-btn>
      </v-col>
    </v-row>

    <v-simple-table dense class="my-4">
      <tbody>
        <tr>
          <td class="font-weight-bold">Id:</td>
          <td>{{ configuration.id }}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Name:</td>
          <td>{{ configuration.configurationName }}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Application:</td>
          <td>
            <router-link :to="{ name: 'ApplicationDetails', params: { Id: application.id } }">{{ application.name }}</router-link>
          </td>
        </tr>
        <tr>
          <td class="font-weight-bold">Default:</td>
          <td>
            <readonly-checkbox :value="configuration.isDefault" />
          </td>
        </tr>
        <tr>
          <td class="font-weight-bold">Enabled:</td>
          <td>
            <readonly-checkbox :value="!configuration.disabled" />
          </td>
        </tr>
        <tr>
          <td class="font-weight-bold">Last updated:</td>
          <td><last-updated-field :item="configuration" /></td>
        </tr>
      </tbody>
    </v-simple-table>
    <div>
      <div class="mt-8">
        <h3>Licenses using this configuration</h3>
        <v-data-table :headers="licenseHeaders" :items="configuration.licenses" v-bind="$util.dataTableAttributes()">
          <template #[`item.name`]="{ item }">
            <router-link :to="{ name: 'LicenseDetails', params: { Id: item.id } }">{{ item.name }}</router-link>
          </template>
          <template #[`item.disabled`]="{ item }">
            <readonly-checkbox :value="!item.disabled" />
          </template>
        </v-data-table>
      </div>
      <div class="mt-8">
        <h3>Configuration Files</h3>
        <v-data-table :headers="configurationFileHeaders" :items="configuration.configurationFiles" v-bind="$util.dataTableAttributes()">
          <template #[`item.filename`]="{ item }">
            <router-link :to="{ name: 'ConfigurationFileDetails', params: { Id: item.id } }">{{ item.filename }}</router-link>
          </template>
          <template #[`item.disabled`]="{ item }">
            <readonly-checkbox :value="!item.disabled" />
          </template>
        </v-data-table>
      </div>
    </div>
    <create-edit-configuration ref="CreateEditConfigurationRef" @configuration-updated="bubbleEmit" />
  </div>
</template>

<script>
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';
import apiService from '@/services/apiService.js';
import CreateEditConfiguration from '../Dialogs/CreateEditConfiguration.vue';

export default {
  name: 'ConfigurationDetails',
  components: { ReadonlyCheckbox, CreateEditConfiguration },
  data: () => ({
    configuration: {},
    isLoading: false,
    application: {},

    configurationFileHeaders: [
      {
        text: 'Filename',
        value: 'filename',
      },
      {
        text: 'Description',
        value: 'description',
      },
      {
        text: 'Path',
        value: 'path',
      },
      {
        text: 'Enabled',
        value: 'disabled',
      },
    ],
    licenseHeaders: [
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Enabled',
        value: 'disabled',
      },
    ],
  }),

  methods: {
    async getConfiguration() {
      this.isLoading = true;
      this.configuration = await apiService.getConfigurationById(this.$route.params.Id);
      await this.getApplication();
      this.isLoading = false;
    },
    editConfiguration() {
      this.$refs.CreateEditConfigurationRef.editConfiguration(this.configuration);
    },
    async getApplication() {
      this.configuration.applicationId ? (this.application = await apiService.getApplicationById(this.configuration?.applicationId)) : null;
    },
    bubbleEmit() {
      this.getConfiguration().then(() => {
        this.$emit('configuration-updated');
      });
    },
  },

  created() {
    this.getConfiguration();
  },
};
</script>

<style>
</style>