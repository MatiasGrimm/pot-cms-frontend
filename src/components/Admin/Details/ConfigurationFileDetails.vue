<template>
  <div>
    <div v-if="configurationFile">
      <v-row>
        <v-col cols="12" sm="auto">
          <h1 class="text-left">{{ configurationFile.filename }}</h1>
          <h2 class="text-left">{{ configurationFile.order }}</h2>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editConfigurationFile">
            <v-icon left>mdi-pencil-outline</v-icon>
            Edit
          </v-btn>
        </v-col>
      </v-row>

      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ configurationFile.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Path:</td>
            <td>{{ configurationFile.path }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Description:</td>
            <td>{{ configurationFile.description }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Enabled:</td>
            <td>
              <readonly-checkbox :value="!configurationFile.disabled" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Last updated:</td>
            <td><last-updated-field :item="configurationFile" /></td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-btn :loading="downloading" depressed @click="showContent">
        <v-icon left>mdi-script-text-outline</v-icon>
        View configuration content
      </v-btn>
    </div>
    <v-dialog fullscreen v-model="contentVisible" v-if="fileContent" class="ma-4">
      <overlay>
        <template #header>
          <v-row no-gutters>
            <v-card-title>{{ configurationFile.filename }}</v-card-title>
            <v-btn class="mt-4" title="Download File" @click="download">Download</v-btn>
            <v-btn class="ml-auto mr-4 mt-4 white--text" title="Close window" icon @click="contentVisible = false">
              <v-icon dark> mdi-close-thick </v-icon>
            </v-btn>
          </v-row>
        </template>
        <v-card-text>
          <pre style="white-space: pre-wrap">{{ fileContent }}</pre>
        </v-card-text>
      </overlay>
    </v-dialog>
    <create-edit-configuration-file ref="CreateEditConfigurationFileRef" @configurationfile-updated="bubbleEmit" />
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditConfigurationFile from '../Dialogs/CreateEditConfigurationFile.vue';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';

export default {
  components: { CreateEditConfigurationFile, ReadonlyCheckbox },
  name: 'configurationFileDetails',
  data: () => ({
    downloading: false,
    loading: true,
    configurationFile: {},
    contentVisible: false,
    fileContent: null,
  }),
  methods: {
    async getConfigurationFile() {
      this.contentVisible = false;
      this.loading = true;
      this.configurationFile = await apiService.getConfigurationFileById(this.$route.params.Id);
      this.loading = false;
    },
    async showContent() {
      this.downloading = true;
      this.fileContent = await apiService.getConfigurationFile(this.configurationFile.id);
      this.downloading = false;
      this.contentVisible = true;
    },
    download() {
      const fileURL = window.URL.createObjectURL(new Blob([this.fileContent]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', this.configurationFile.filename);
      fileLink.setAttribute('target', '_blank');
      document.body.appendChild(fileLink);
      fileLink.click();
    },
    editConfigurationFile() {
      this.$refs.CreateEditConfigurationFileRef.editConfigurationFile(this.configurationFile);
    },
    bubbleEmit() {
      this.getConfigurationFile().then(() => {
        this.$emit('configurationfile-updated');
      });
    },
  },
  created() {
    this.getConfigurationFile();
  },
};
</script>

<style></style>
