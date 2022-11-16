<template>
  <div>
    <div v-if="configurations">
      <v-row no-gutters justify="space-between" align="center">
        <v-btn large depressed tile @click="addConfiguration">
          <v-icon left>mdi-application-outline </v-icon>
          Add configuration
        </v-btn>
        <v-col cols="4">
          <search-text-field v-model="search" />
        </v-col>
        <v-checkbox @change="getConfigurations" v-model="showAll" label="Show disabled" />
      </v-row>
      <v-data-table @click:row="showDetails" :headers="headers" :items="configurations" :search="search" v-bind="$util.dataTableAttributes()">
        <template #[`item.configurationName`]="{ item }">
          <router-link :to="{ name: 'ConfigurationDetails', params: { Id: item.id } }">{{ item.configurationName }}</router-link>
        </template>
        <template #[`item.disabled`]="{ item }">
          <readonly-checkbox :value="!item.disabled" />
        </template>
      </v-data-table>
    </div>
    <create-edit-configuration ref="CreateEditConfigurationRef" @configuration-updated="getConfigurations" />
  </div>
</template>


<script>
import apiService from '@/services/apiService.js';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';
import CreateEditConfiguration from './Dialogs/CreateEditConfiguration.vue';

export default {
  name: 'ConfigurationList',
  components: { ReadonlyCheckbox, CreateEditConfiguration },
  data: () => ({
    configurations: [],
    showAll: false,
    isLoading: false,
    search: null,
    headers: [
      {
        text: 'Name',
        value: 'configurationName',
      },
      {
        text: 'Enabled',
        value: 'disabled',
      },
    ],
  }),

  methods: {
    async getConfigurations() {
      this.isLoading = true;
      this.configurations = await apiService.getConfigurations(this.showAll);
      this.isLoading = false;
    },
    addConfiguration() {
      this.$refs.CreateEditConfigurationRef.addConfiguration();
    },
    showDetails(configuration) {
      this.$router.push({ name: 'ConfigurationDetails', params: { Id: configuration.id } });
    },
  },

  created() {
    this.getConfigurations();
  },
};
</script>

<style>
</style>