<template>
  <div>
    <div v-if="sqlScript">
      <v-row>
        <v-col cols="12" sm="auto">
          <h1 class="text-left">SQL script {{ sqlScript.filename }}</h1>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editSqlScript">
            <v-icon left>mdi-pencil-outline</v-icon>
            Edit
          </v-btn>
        </v-col>
      </v-row>

      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ sqlScript.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Order:</td>
            <td>{{ sqlScript.order }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Description:</td>
            <td>{{ sqlScript.description }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Last updated:</td>
            <td><last-updated-field :item="sqlScript" /></td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-btn :loading="downloading" depressed @click="showContent">
        <v-icon left>mdi-script-text-outline</v-icon>
        View script content
      </v-btn>
    </div>
    <v-dialog fullscreen v-model="contentVisible" v-if="fileContent" class="ma-4">
      <overlay>
        <template #header>
          <v-row no-gutters>
            <v-card-title>{{ sqlScript.filename }}</v-card-title>
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
    <create-edit-sql-script ref="CreateEditSqlScriptRef" @sqlScript-updated="bubbleEmit" />
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditSqlScript from '../Dialogs/CreateEditSqlScript.vue';

export default {
  components: { CreateEditSqlScript },
  name: 'SqlScriptDetails',
  data: () => ({
    loading: true,
    sqlScript: {},
    fileContent: null,
    contentVisible: false,
    downloading: false,
  }),
  methods: {
    async getSqlScript() {
      this.contentVisible = false;
      this.loading = true;
      this.sqlScript = await apiService.getSqlScriptById(this.$route.params.Id);
      this.loading = false;
    },
    async showContent() {
      this.downloading = true;
      this.fileContent = await apiService.getSqlScriptFile(this.sqlScript.id);
      this.downloading = false;
      this.contentVisible = true;
    },
    editSqlScript() {
      this.$refs.CreateEditSqlScriptRef.editSqlScript(this.sqlScript);
    },
    download() {
      const fileURL = window.URL.createObjectURL(new Blob([this.fileContent]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', this.sqlScript.filename);
      fileLink.setAttribute('target', '_blank');
      document.body.appendChild(fileLink);
      fileLink.click();
    },
    bubbleEmit() {
      this.getSqlScript().then(() => {
        this.$emit('sqlScript-updated');
      });
    },
  },
  created() {
    this.getSqlScript();
  },
};
</script>

<style></style>
