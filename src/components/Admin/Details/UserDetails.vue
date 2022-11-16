<template>
  <div>
    <div v-if="user">
      <v-row dense no-gutters>
        <v-col cols="12" sm="auto">
          <h1 class="text-left">{{ user.name }}</h1>
          <h2 class="text-left">{{ user.companyName }}</h2>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editUser">
            <v-icon left>mdi-pencil-outline</v-icon>
            Edit
          </v-btn>
        </v-col>
        <!-- <v-col cols="12" sm="auto">
        </v-col> -->
        <v-btn :block="$vuetify.breakpoint.mobile" depressed class="mt-2 ml-auto mb-3 mb-md-0" @click="resetPassword">
          <v-icon left>mdi-lock-reset</v-icon>
          Send mail to reset password
        </v-btn>
      </v-row>

      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Email:</td>
            <td>{{ user.email }}</td>
          </tr>
          <tr v-if="user.phoneNumber">
            <td class="font-weight-bold">Phone number:</td>
            <td>{{ user.phoneNumber }}</td>
          </tr>
          <tr v-if="user.roles">
            <td class="font-weight-bold">Roles:</td>
            <td>
              {{ user.roles.join(', ') }}
            </td>
          </tr>
          <tr v-if="isAdmin">
            <td class="font-weight-bold">Receives prerelease versions:</td>
            <td>
              <readonly-checkbox :value="user.prereleaseEnabled" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Last updated:</td>
            <td><last-updated-field :item="user" /></td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <create-edit-user ref="CreateEditUserRef" @user-updated="bubbleEmit" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import apiService from '@/services/apiService';
import CreateEditUser from '@/components/Admin/Dialogs/CreateEditUser.vue';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';
import store from '@/store/index';

export default {
  components: { CreateEditUser, ReadonlyCheckbox },
  name: 'UserDetails',
  data: () => ({
    loading: true,
    user: {},
  }),
  computed: {
    ...mapGetters(['isAdmin'])
  },
  methods: {
    async getUser() {
      this.loading = true;
      this.user = await apiService.getUserById(this.$route.params.Id);
      this.loading = false;
    },
    async editUser() {
      this.$refs.CreateEditUserRef.editUser(this.user);
    },
    async resetPassword() {
      var response = await apiService.adminSendResetPassword(this.user.email);
      if (response == true) {
        store.commit('alert', {
          show: true,
          color: 'orange',
          title: 'Administration',
          message: `A link has been sent to ${this.user.email}`,
        });
      }
    },
    bubbleEmit() {
      this.getUser().then(() => {
        this.$emit('user-updated');
      });
    },
  },
  created() {
    this.getUser();
  },
};
</script>
