<template>
  <div>
    <div v-if="downloadLogs">
      <v-row no-gutters justify="space-between" align="center">
        <v-col />
        <v-col cols="4">
          <search-text-field v-model="search" />
        </v-col>
        <v-col />
      </v-row>
      <v-data-table @click:row="showDetails" dense :headers="headers" :items="downloadLogs" :search="search" sort-by="created" sort-desc>
        <template v-slot:[`item.user`]="{ item }">
          <router-link :to="{ name: 'UserDetails', params: { Id: item.userId } }">{{ item.user.email }}</router-link>
        </template>
        <template v-slot:[`item.elementName`]="{ item }">
          <router-link :to="{ name: 'ApplicationElementDetails', params: { Id: item.elementId } }">{{ item.element.elementName }}</router-link>
        </template>
        <template v-slot:[`item.created`]="{ item }">
          {{ $util.formatDate(item.created, true) }}
        </template>
      </v-data-table>
    </div>
  </div>
</template>


<script>
import apiService from '@/services/apiService.js';

export default {
  name: 'DownloadLogList',
  components: {},
  data: () => ({
    downloadLogs: [],
    isLoading: false,
    search: null,
    headers: [
      {
        text: 'Timestamp',
        value: 'created',
      },
      {
        text: 'User',
        value: 'user',
      },
      {
        text: 'Element',
        value: 'elementName',
      },
      {
        text: 'Remote Address',
        value: 'remoteAddress',
      },
    ],
  }),

  methods: {
    async getDownloadLogs() {
      this.isLoading = true;
      this.downloadLogs = await apiService.getUpdateDownloadLogs();
      this.isLoading = false;
    },
    showDetails(downloadLog) {
      this.$router.push({ name: 'DownloadLogDetails', params: { Id: downloadLog.id } });
    },
  },

  created() {
    this.getDownloadLogs();
  },
};
</script>

<style>
</style>