<template>
  <div>
    <div v-if="license">
      <v-row>
        <v-col cols="12" sm="auto">
          <h1 class="text-left">{{ license.name }}</h1>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editLicense">
            <v-icon left>mdi-pencil-outline</v-icon>
            Edit
          </v-btn>
        </v-col>
      </v-row>

      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ license.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Name:</td>
            <td>{{ license.name }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Price factor:</td>
            <td>{{ license.priceFactor }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Currency Code:</td>
            <td>{{ license.currencyCode }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Price list code:</td>
            <td>{{ license.priceListCode }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Demonstration license:</td>
            <td>
              <readonly-checkbox :value="license.isDemonstrationLicense" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Enabled:</td>
            <td>
              <readonly-checkbox :value="!license.disabled" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Last updated:</td>
            <td><last-updated-field :item="license" /></td>
          </tr>
        </tbody>
      </v-simple-table>
      <div class="mt-8">
        <h3>Companies</h3>
        <v-data-table :headers="companyHeaders" :items="license.companies" v-bind="$util.dataTableAttributes()">
          <template #[`item.name`]="{ item }">
            <router-link :to="{ name: 'CompanyDetails', params: { Id: item.id } }">{{ item.name }}</router-link>
          </template>
          <template #[`item.disabled`]="{ item }">
            <readonly-checkbox :value="!item.disabled" />
          </template>
        </v-data-table>
      </div>

      <div class="mt-8">
        <h3>Configurations assigned to license</h3>
        <v-data-table
          v-bind="$util.dataTableAttributes()"
          :headers="[
            {
              text: 'Name',
              value: 'configurationName',
            },
            {
              text: 'Enabled',
              value: 'disabled',
            },
          ]"
          :items="license.configurations"
        >
          <template #[`item.configurationName`]="{ item }">
            <router-link :to="{ name: 'ConfigurationDetails', params: { Id: item.id } }">{{ item.configurationName }}</router-link>
          </template>
          <template #[`item.disabled`]="{ item }">
            <readonly-checkbox :value="!item.disabled" />
          </template>
        </v-data-table>
      </div>
      <create-edit-license ref="CreateEditLicenseRef" @license-updated="bubbleEmit" />
    </div>
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditLicense from '../Dialogs/CreateEditLicense.vue';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';

export default {
  components: { CreateEditLicense, ReadonlyCheckbox },
  name: 'licenseDetails',
  data: () => ({
    loading: true,
    license: {},
    subscriptions: [],
    companyHeaders: [
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
  methods: {
    async getLicense() {
      this.loading = true;
      this.license = await apiService.getLicenseById(this.$route.params.Id);
      this.loading = false;
    },
    editLicense() {
      this.$refs.CreateEditLicenseRef.editLicense(this.license);
    },
    bubbleEmit() {
      this.getLicense().then(() => {
        this.$emit('license-updated');
      });
    },
  },
  created() {
    this.getLicense();
  },
};
</script>

<style></style>
