<template>
  <div>
    <div v-if="checkLog">
      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ checkLog.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Timestamp:</td>
            <td>{{ $util.formatDate(checkLog.created, true) }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Version:</td>
            <td>{{ checkLog.version }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Application:</td>
            <td>
              <router-link :to="{ name: 'ApplicationDetails', params: { Id: checkLog.applicationId } }">{{ checkLog.application.name }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">License:</td>
            <td>
              <router-link :to="{ name: 'LicenseDetails', params: { Id: checkLog.licenseId } }">{{ license.name }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">User:</td>
            <td>
              <router-link :to="{ name: 'UserDetails', params: { Id: checkLog.userId } }">{{ checkLog.user.email }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Remote Address:</td>
            <td>{{ checkLog.remoteAddress }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/apiService';

export default {
  components: {},
  name: 'checkLogDetails',
  data: () => ({
    loading: true,
    checkLog: {},
    license: {},
  }),
  computed: {},
  methods: {
    async getCheckLog() {
      this.loading = true;
      this.checkLog = await apiService.getUpdateCheckLogById(this.$route.params.Id);
      this.checkLog.licenseId ? this.getLicense() : null;
      this.loading = false;
    },
    async getLicense() {
      this.license = await apiService.getLicenseById(this.checkLog.licenseId);
    },
  },
  created() {
    this.getCheckLog();
  },
};
</script>

<style></style>
