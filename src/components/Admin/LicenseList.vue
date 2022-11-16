<template>
  <div>
    <div v-if="licenses">
      <v-row no-gutters justify="space-between" align="center">
        <v-btn large depressed tile @click="addLicense">
          <v-icon left>mdi-application-outline </v-icon>
          Add license
        </v-btn>
        <v-col cols="4">
          <search-text-field v-model="search" />
        </v-col>
        <v-checkbox @change="getLicenses" v-model="showAll" label="Show disabled" />
      </v-row>
      <v-data-table @click:row="showDetails" :headers="headers" :items="licenses" :search="search" v-bind="$util.dataTableAttributes()">
        <template #[`item.name`]="{ item }">
          <router-link :to="{ name: 'LicenseDetails', params: { Id: item.id } }">{{ item.name }}</router-link>
        </template>
        <template #[`item.disabled`]="{ item }">
          <readonly-checkbox :value="!item.disabled" />
        </template>
      </v-data-table>
    </div>
    <create-edit-license ref="CreateEditLicenseRef" @license-updated="getLicenses" />
  </div>
</template>


<script>
import apiService from '@/services/apiService.js';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';
import CreateEditLicense from './Dialogs/CreateEditLicense.vue';

export default {
  name: 'LicenseList',
  components: { ReadonlyCheckbox, CreateEditLicense },
  data: () => ({
    licenses: [],
    showAll: false,
    isLoading: false,
    search: null,
    headers: [
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
    async getLicenses() {
      this.isLoading = true;
      this.licenses = await apiService.getLicenses(this.showAll);
      this.isLoading = false;
    },
    addLicense() {
      this.$refs.CreateEditLicenseRef.addLicense();
    },
    showDetails(license) {
      this.$router.push({ name: 'LicenseDetails', params: { Id: license.id } });
    },
  },

  created() {
    this.getLicenses();
  },
};
</script>

<style>
</style>