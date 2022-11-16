<template>
  <div>
    <div v-if="company">
      <v-row>
        <v-col cols="12" sm="auto">
          <h1 class="text-left">{{ company.name }}</h1>
          <h2 class="text-left">{{ company.companyName }}</h2>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editCompany">
            <v-icon left>mdi-pencil-outline</v-icon>
            Edit
          </v-btn>
        </v-col>
      </v-row>

      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ company.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">CVR:</td>
            <td>{{ company.cvr }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Phone:</td>
            <td>{{ company.phone }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Country:</td>
            <td>{{ company.country }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Address:</td>
            <td>{{ company.address }}</td>
          </tr>
          <tr v-if="company.usersCount">
            <td class="font-weight-bold">Users:</td>
            <td>{{ company.usersCount }}</td>
          </tr>
          <tr v-if="company.licenseId">
            <td class="font-weight-bold">License:</td>
            <td>
              <router-link :to="{ name: 'LicenseDetails', params: { Id: company.licenseId } }">{{ company.licenseName }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Last updated:</td>
            <td><last-updated-field :item="company" /></td>
          </tr>
        </tbody>
      </v-simple-table>

      <div class="mt-8">
        <h3>Company users</h3>
        <v-data-table :headers="userHeaders" :items="company.users" @click:row="showUserDetails" v-bind="$util.dataTableAttributes()">
          <template #[`item.name`]="{ item }">
            <router-link :to="{ name: 'UserDetails', params: { Id: item.id } }">{{ item.name }}</router-link>
          </template>
        </v-data-table>
      </div>
    </div>
    <create-edit-company ref="CreateEditCompanyRef" @company-updated="bubbleEmit" />
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditCompany from '@/components/Admin/Dialogs/CreateEditCompany.vue';

export default {
  components: { CreateEditCompany },
  name: 'CompanyDetails',
  data: () => ({
    loading: true,
    company: {},
    userHeaders: [
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'E-mail',
        value: 'email',
      },
      {
        text: 'Phone',
        value: 'phone',
      },
      {
        text: 'Roles',
        value: 'roles',
      },
    ],
  }),
  methods: {
    async getCompany() {
      this.loading = true;
      this.company = await apiService.getCompanyById(this.$route.params.Id);
      this.loading = false;
    },
    async editCompany() {
      this.$refs.CreateEditCompanyRef.editCompany(this.company);
    },
    bubbleEmit() {
      this.getCompany().then(() => {
        this.$emit('company-updated');
      });
    },
    showUserDetails(user) {
      this.$router.push({ name: 'UserDetails', params: { Id: user.id } });
    },
  },
  created() {
    this.getCompany();
  },
};
</script>

<style></style>
