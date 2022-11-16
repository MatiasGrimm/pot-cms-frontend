<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentSqlScript">
      <v-alert v-if="errorCreation" class="error white--text" icon="mdi-alert"> Error creating script </v-alert>
      <v-alert v-if="errorUpload" class="error white--text" icon="mdi-alert"> Error uploading script </v-alert>
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit SQL script' : 'Add new SQL script' }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="show = false">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editSqlScriptRef">
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="currentSqlScript.description" dense label="Description"></v-textarea>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :rules="[rules.required]" :disabled="!uploadFile" v-model="currentSqlScript.filename" dense label="Filename"></v-text-field>
            </v-col>
            <v-col cols="6" md="6">
              <v-file-input
                @change="currentSqlScript.filename = uploadFile ? uploadFile.name : null"
                :rules="[rules.required]"
                v-model="uploadFile"
                dense
                label="File"
              ></v-file-input>
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field :rules="[rules.required]" v-model="currentSqlScript.order" dense label="Order"></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="sqlScriptEnabled" label="Enabled" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="show = false" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentSqlScript"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update script' : 'Add script' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import apiService from '@/services/apiService.js';

export default {
  name: 'CreateEditSqlScript',
  data: () => ({
    show: false,
    errorCreation: null,
    errorUpload: null,
    isValid: false,
    isSaving: false,
    currentSqlScript: {},
    uploadFile: null,
    rules: {
      required: (value) => !!value || 'Field cannot be empty.',
    },
  }),
  computed: {
    isEditing() {
      return this.currentSqlScript?.id ? true : false;
    },
    sqlScriptEnabled: {
      get() {
        return !this.currentSqlScript.disabled;
      },
      set(val) {
        this.currentSqlScript.disabled = !val;
      },
    },
  },
  methods: {
    createSqlScript() {
      this.show = true;
      this.uploadFile = null;
      this.currentSqlScript = {
        filename: null,
        order: null,
        description: null,
        disabled: false,
      };
    },
    editSqlScript(sqlScript) {
      this.show = true;
      this.currentSqlScript = _.cloneDeep(sqlScript);
      this.uploadFile = new File([sqlScript.content], sqlScript.filename, {
        type: 'application/text',
      });
    },
    async saveCurrentSqlScript() {
      this.isSaving = true;

      if (this.uploadFile.name != this.currentSqlScript.filename) {
        this.uploadFile = this.renameFile(this.uploadFile, this.currentSqlScript.filename);
        this.setFileInfo();
      }
      let createdId;
      try {
        createdId = await apiService.createOrEditSqlScript(this.currentSqlScript);
      } catch (e) {
        this.errorCreation = e.message;
      }
      try {
        await apiService.uploadSqlScriptFile(this.uploadFile, createdId);
      } catch (e) {
        this.errorUpload = e.message;
      }

      this.show = false;
      this.$emit('sqlScript-updated');
      this.isSaving = false;
    },
    setFileInfo() {
      this.currentSqlScript.filename = this.uploadFile?.name;
    },
    renameFile(originalFile, newName) {
      return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
    },
  },
};
</script>

<style></style>
