<template>
  <div>
    <div v-if="!detailsView">
      <v-row no-gutters justify="space-between" align="center">
        <v-btn large depressed tile @click="addCompany()">
          <v-icon left>mdi-store-plus</v-icon>
          Add company
        </v-btn>
        <v-col cols="4">
          <search-text-field v-model="search" />
        </v-col>
        <v-checkbox @change="getCompanies" v-model="showAll" label="Show disabled" />
      </v-row>
      <v-data-table @click:row="showDetails" :headers="headers" :items="companies" v-if="!detailsView" :search="search" v-bind="$util.dataTableAttributes()">
        <template #[`item.name`]="{ item }">
          <router-link :to="{ name: 'CompanyDetails', params: { Id: item.id } }">{{ item.name }}</router-link>
        </template>
        <template #[`item.disabled`]="{ item }">
          <readonly-checkbox :value="!item.disabled" />
        </template>
      </v-data-table>
    </div>
    <company-details @company-updated="getCompanies" v-else />
    <create-edit-company ref="CreateEditCompanyRef" @company-updated="getCompanies" />
  </div>
</template>

<script>
import apiService from '../../services/apiService';
import CompanyDetails from './Details/CompanyDetails.vue';
import CreateEditCompany from './Dialogs/CreateEditCompany.vue';
import ReadonlyCheckbox from '../ReadonlyCheckbox.vue';

export default {
  name: 'CompanyList',
  components: { CompanyDetails, CreateEditCompany, ReadonlyCheckbox },

  data: () => ({
    companies: [],
    showAll: false,
    loading: true,
    search: null,
    headers: [
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'CVR',
        value: 'cvr',
      },
      {
        text: 'Enabled',
        value: 'disabled',
      },
      {
        text: 'Users',
        value: 'usersCount',
      },
    ],
  }),
  computed: {
    detailsView() {
      return this.$route.params.Id;
    },
  },

  methods: {
    async getCompanies() {
      this.loading = true;

      this.companies = await apiService.getCompanies(this.showAll);
      this.loading = false;
    },
    showDetails(company) {
      this.$router.push({ name: 'CompanyDetails', params: { Id: company.id } });
    },
    addCompany() {
      this.$refs.CreateEditCompanyRef.createCompany();
    },
  },

  created() {
    this.getCompanies();
  },
};
</script>

<style></style>
