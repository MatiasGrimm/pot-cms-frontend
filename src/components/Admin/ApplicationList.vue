<template>
  <div>
    <div v-if="!detailsView">
      <div v-if="applications">
        <v-row no-gutters>
          <v-btn large depressed tile @click="addApplication">
            <v-icon left>mdi-application-outline </v-icon>
            Add application
          </v-btn>
          <v-checkbox @change="getApplications" v-model="showAll" class="ml-auto" label="Show disabled" />
        </v-row>
        <v-data-table @click:row="showDetails" :headers="headers" :items="applications" v-bind="$util.dataTableAttributes()">
          <template #[`item.name`]="{ item }">
            <router-link :to="{ name: 'ApplicationDetails', params: { Id: item.id } }">{{ item.name }}</router-link>
          </template>
          <template #[`item.disabled`]="{ item }">
            <readonly-checkbox :value="!item.disabled" />
          </template>
          <template v-slot:[`item.releases`]="{ item }"> {{ item.releases.length }} </template>
        </v-data-table>
        <create-edit-application ref="CreateEditApplicationRef" @application-updated="getApplications" />
      </div>
    </div>
    <application-details @application-updated="getApplications" v-else />
  </div>
</template>

<script>
import apiService from '@/services/apiService.js';
import CreateEditApplication from './Dialogs/CreateEditApplication.vue';
import ApplicationDetails from './Details/ApplicationDetails.vue';
import ReadonlyCheckbox from '../ReadonlyCheckbox.vue';

export default {
  components: { CreateEditApplication, ApplicationDetails, ReadonlyCheckbox },
  computed: {
    detailsView() {
      return this.$route.params.Id;
    },
  },
  data: () => ({
    applications: [],
    isLoading: false,
    showAll: false,
    headers: [
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Enabled',
        value: 'disabled',
      },
      {
        text: 'Releases',
        value: 'releases',
      },
    ],
  }),
  methods: {
    async getApplications() {
      this.isLoading = true;
      this.applications = await apiService.getApplications(this.showAll);
      this.isLoading = false;
    },
    addApplication() {
      this.$refs.CreateEditApplicationRef.createApplication();
    },
    showDetails(application) {
      this.$router.push({ name: 'ApplicationDetails', params: { Id: application.id } });
    },
  },

  created() {
    this.getApplications();
  },
};
</script>

<style></style>
