<template>
  <div>
    <div v-if="!detailsView">
      <div v-if="applicationReleases">
        <v-row no-gutters justify="space-between" align="center">
          <v-btn large depressed tile @click="createApplicationRelease()">
            <v-icon left>mdi-application-braces-outline </v-icon>
            Add Release
          </v-btn>
          <v-col cols="4">
            <search-text-field v-model="search" />
          </v-col>
          <v-checkbox @change="getApplicationReleases" v-model="showAll" label="Show disabled" />
        </v-row>
        <v-data-table @click:row="showDetails" :headers="headers" :items="applicationReleases" :search="search" v-bind="$util.dataTableAttributes()">
          <template #[`item.publicName`]="{ item }">
            <router-link :to="{ name: 'ApplicationReleaseDetails', params: { Id: item.id } }">{{ item.publicName }}</router-link>
          </template>
          <template #[`item.enabled`]="{ item }">
            <readonly-checkbox :value="item.enabled" />
          </template>
        </v-data-table>
        <create-edit-application-release ref="CreateEditApplicationReleaseRef" @applicationrelease-updated="getApplicationReleases" />
      </div>
    </div>
    <application-release-details @applicationrelease-updated="getApplicationReleases" v-else />
  </div>
</template>

<script>
import apiService from '@/services/apiService.js';
import CreateEditApplicationRelease from './Dialogs/CreateEditApplicationRelease.vue';
import ApplicationReleaseDetails from './Details/ApplicationReleaseDetails.vue';
import ReadonlyCheckbox from '../ReadonlyCheckbox.vue';

export default {
  components: { CreateEditApplicationRelease, ApplicationReleaseDetails, ReadonlyCheckbox },
  name: 'ApplicationReleases',
  computed: {
    detailsView() {
      return this.$route.params.Id;
    },
  },
  data: () => ({
    applicationReleases: null,
    isLoading: false,
    showAll: false,
    search: null,
    headers: [
      {
        text: 'Name',
        value: 'publicName',
      },
      {
        text: 'Version',
        value: 'version',
      },
      {
        text: 'Application',
        value: 'applicationName',
      },
      {
        text: 'Enabled',
        value: 'enabled',
      },
      {
        text: 'Description',
        value: 'description',
      },
      {
        text: 'Sql Scripts',
        value: 'sqlScriptsCount',
      },
    ],
  }),
  methods: {
    async getApplicationReleases() {
      this.isLoading = true;
      this.applicationReleases = await apiService.getApplicationReleases(this.showAll);
      this.isLoading = false;
    },
    createApplicationRelease() {
      this.$refs.CreateEditApplicationReleaseRef.createApplicationRelease();
    },
    showDetails(applicationRelease) {
      this.$router.push({ name: 'ApplicationReleaseDetails', params: { Id: applicationRelease.id } });
    },
  },
  created() {
    this.getApplicationReleases();
  },
};
</script>

<style></style>
