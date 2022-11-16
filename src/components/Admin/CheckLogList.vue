<template>
  <div>
    <div v-if="checkLogs">
      <v-row no-gutters justify="space-between" align="center">
        <v-col />
        <v-col cols="4">
          <search-text-field v-model="search" />
        </v-col>
        <v-col />
      </v-row>
      <v-data-table @click:row="showDetails" dense :headers="headers" :items="checkLogs" :search="search" sort-by="created" sort-desc>
        <template v-slot:[`item.user`]="{ item }">
          <router-link :to="{ name: 'UserDetails', params: { Id: item.userId } }">{{ item.user.email }}</router-link>
        </template>
        <template v-slot:[`item.applicationName`]="{ item }">
          <router-link :to="{ name: 'ApplicationDetails', params: { Id: item.applicationId } }">{{ item.application.name }}</router-link>
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
  name: 'CheckLogList',
  components: {},
  data: () => ({
    checkLogs: [],
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
        text: 'Application',
        value: 'applicationName',
      },
      {
        text: 'Version',
        value: 'version',
      },
      {
        text: 'Remote Address',
        value: 'remoteAddress',
      },
    ],
  }),

  methods: {
    async getCheckLogs() {
      this.isLoading = true;
      this.checkLogs = await apiService.getUpdateCheckLogs();
      this.isLoading = false;
    },
    showDetails(checkLog) {
      this.$router.push({ name: 'CheckLogDetails', params: { Id: checkLog.id } });
    },
  },

  created() {
    this.getCheckLogs();
  },
};
</script>

<style>
</style>