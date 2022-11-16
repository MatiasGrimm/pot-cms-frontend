<template>
  <div>
    <div v-if="!detailsView">
      <v-row no-gutters justify="space-between" align="center">
        <v-btn large depressed tile @click="addUser()">
          <v-icon left>mdi-account-plus</v-icon>
          Add user
        </v-btn>
        <v-col cols="4">
          <search-text-field v-model="search" />
        </v-col>
        <v-checkbox @change="getUsers" v-model="showAll" label="Show disabled" />
      </v-row>
      <v-data-table @click:row="showDetails" :headers="headers" :items="users" v-if="!detailsView" :search="search" v-bind="$util.dataTableAttributes()">
        <template v-slot:[`item.roles`]="{ item }">
          {{ item.roles.join(', ') }}
        </template>
        <template #[`item.name`]="{ item }">
          <router-link :to="{ name: 'UserDetails', params: { Id: item.id } }">{{ item.name }}</router-link>
        </template>
        <template #[`item.disabled`]="{ item }">
          <readonly-checkbox :value="!item.disabled" />
        </template>
        <template #[`item.prereleaseEnabled`]="{ item }">
          <readonly-checkbox :value="item.prereleaseEnabled" />
        </template>
      </v-data-table>
    </div>
    <user-details @user-updated="getUsers" v-else />
    <create-edit-user ref="CreateEditUserRef" @user-updated="getUsers" />
  </div>
</template>

<script>
import apiService from '../../services/apiService';
import ReadonlyCheckbox from '../ReadonlyCheckbox.vue';
import UserDetails from './Details/UserDetails.vue';
import CreateEditUser from './Dialogs/CreateEditUser.vue';

export default {
  name: 'UserList',
  components: { UserDetails, CreateEditUser, ReadonlyCheckbox },
  data: () => ({
    users: [],
    showAll: false,
    loading: true,
    search: null,
    headers: [
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Company',
        value: 'companyName',
      },
      {
        text: 'Email',
        value: 'email',
      },
      {
        text: 'Enabled',
        value: 'disabled',
      },
      {
        text: 'Prerelease',
        value: 'prereleaseEnabled',
      },
      {
        text: 'Roles',
        value: 'roles',
      },
    ],
  }),
  computed: {
    detailsView() {
      return this.$route.params.Id;
    },
  },

  methods: {
    async getUsers() {
      this.loading = true;

      this.users = await apiService.getUsers(this.showAll);

      this.loading = false;
    },
    showDetails(user) {
      this.$router.push({ name: 'UserDetails', params: { Id: user.id } });
    },
    addUser() {
      this.$refs.CreateEditUserRef.createUser();
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
