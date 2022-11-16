<template>
  <div>
    <div v-if="application">
      <v-row>
        <v-col cols="12" sm="auto">
          <h1 class="text-left">{{ application.name }}</h1>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editApplication">
            <v-icon left>mdi-pencil-outline</v-icon>
            Edit
          </v-btn>
        </v-col>
      </v-row>

      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ application.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Name:</td>
            <td>{{ application.name }}</td>
          </tr>
          <tr v-if="application.releases && application.releases.length > 0">
            <td class="font-weight-bold">Newest release:</td>
            <td>Version. {{ application.releases[application.releases.length - 1].version }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Enabled:</td>
            <td>
              <readonly-checkbox :value="!application.disabled" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Last updated:</td>
            <td><last-updated-field :item="application" /></td>
          </tr>
        </tbody>
      </v-simple-table>

      <div class="mt-8">
        <h3>Releases</h3>
        <v-data-table @click:row="showRelease" :items="application.releases" item-key="id" :headers="releaseListHeaders" v-bind="$util.dataTableAttributes()">
          <template #[`item.publicName`]="{ item }">
            <router-link :to="{ name: 'ApplicationReleaseDetails', params: { Id: item.id } }">{{ item.publicName }}</router-link>
          </template>
          <template #[`item.enabled`]="{ item }">
            <readonly-checkbox :value="item.enabled" />
          </template>
          <template #[`item.prerelease`]="{ item }">
            <readonly-checkbox :value="item.prerelease" />
          </template>
        </v-data-table>
      </div>
    </div>
    <create-edit-application ref="CreateEditApplicationRef" @application-updated="bubbleEmit" />
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditApplication from '../Dialogs/CreateEditApplication.vue';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';

export default {
  components: { CreateEditApplication, ReadonlyCheckbox },
  name: 'applicationDetails',
  data: () => ({
    loading: true,
    application: {},
    currentRelease: {},
    releaseListHeaders: [
      {
        text: 'Name',
        value: 'publicName',
      },
      {
        text: 'Version',
        value: 'version',
      },
      {
        text: 'Enabled',
        value: 'enabled',
      },
      {
        text: 'Prerelease',
        value: 'prerelease',
      },
    ],
  }),
  methods: {
    async getApplication() {
      this.loading = true;
      this.application = await apiService.getApplicationById(this.$route.params.Id);
      this.currentRelease = this.application.releases ? this.application.releases[this.application.releases.length - 1] : null;
      this.loading = false;
    },

    showRelease(release) {
      this.$router.push({ name: 'ApplicationReleaseDetails', params: { Id: release.id } });
    },

    editApplication() {
      this.$refs.CreateEditApplicationRef.editApplication(this.application);
    },
    bubbleEmit() {
      this.getApplication().then(() => {
        this.$emit('application-updated');
      });
    },
  },
  created() {
    this.getApplication();
  },
};
</script>
