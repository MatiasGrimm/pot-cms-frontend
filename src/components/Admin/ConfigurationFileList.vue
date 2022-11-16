<template>
  <div>
    <div v-if="!detailsView">
      <v-row no-gutters justify="space-between" align="center">
        <v-btn large depressed tile @click="addConfigurationFile()">
          <v-icon left>mdi-script-text-outline</v-icon>
          Add Configuration File
        </v-btn>
        <v-col cols="4">
          <search-text-field v-model="search" />
        </v-col>
        <v-checkbox @change="getConfigurationFiles" v-model="showAll" label="Show disabled" />
      </v-row>
      <v-data-table @click:row="showDetails" :headers="headers" :items="configurationFiles" :search="search" v-if="!detailsView" v-bind="$util.dataTableAttributes()">
        <template #[`item.filename`]="{ item }">
          <router-link :to="{ name: 'ConfigurationFileDetails', params: { Id: item.id } }">{{ item.filename }}</router-link>
        </template>
        <template #[`item.disabled`]="{ item }">
          <readonly-checkbox :value="!item.disabled" />
        </template>
      </v-data-table>
    </div>
    <configuration-file-details @configurationfile-updated="getConfigurationFiles" v-else />
    <create-edit-configuration-file ref="CreateEditConfigurationFileRef" @configurationfile-updated="getConfigurationFiles" />
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditConfigurationFile from '@/components/Admin/Dialogs/CreateEditConfigurationFile.vue';
import ConfigurationFileDetails from './Details/ConfigurationFileDetails.vue';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';

export default {
  components: { CreateEditConfigurationFile, ConfigurationFileDetails, ReadonlyCheckbox },
  name: 'ConfigurationFileList',

  data: () => ({
    configurationFiles: [],
    showAll: false,
    isLoading: false,
    search: null,
    headers: [
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
  }),
  computed: {
    detailsView() {
      return this.$route.params.Id;
    },
  },
  methods: {
    async getConfigurationFiles() {
      this.loading = true;
      this.configurationFiles = await apiService.getConfigurationFiles(this.showAll);
      this.loading = false;
    },
    addConfigurationFile() {
      this.$refs.CreateEditConfigurationFileRef.createConfigurationFile();
    },
    showDetails(configurationFile) {
      this.$router.push({ name: 'ConfigurationFileDetails', params: { Id: configurationFile.id } });
    },
  },

  created() {
    this.getConfigurationFiles();
  },
};
</script>

<style></style>
