<template>
  <div>
    <div v-if="downloadLog">
      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ downloadLog.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Timestamp:</td>
            <td>{{ $util.formatDate(downloadLog.created, true) }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Element:</td>
            <td>
              <router-link :to="{ name: 'ApplicationElementDetails', params: { Id: downloadLog.elementId } }">{{
                downloadLog.element.elementName
              }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">User:</td>
            <td>
              <router-link :to="{ name: 'UserDetails', params: { Id: downloadLog.userId } }">{{ downloadLog.user.email }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Remote Address:</td>
            <td>{{ downloadLog.remoteAddress }}</td>
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
  name: 'downloadLogDetails',
  data: () => ({
    loading: true,
    downloadLog: {},
    license: {},
  }),
  computed: {},
  methods: {
    async getDownloadLog() {
      this.loading = true;
      this.downloadLog = await apiService.getUpdateDownloadLogById(this.$route.params.Id);
      this.loading = false;
    },
  },
  created() {
    this.getDownloadLog();
  },
};
</script>

<style></style>
