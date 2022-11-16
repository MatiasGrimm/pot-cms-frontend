<template>
  <v-dialog v-model="show" max-width="650" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card v-if="currentApplicationElement">
      <v-row no-gutters>
        <v-card-title>{{ isEditing ? 'Edit application element' : 'Add new application element' }}</v-card-title>
        <v-btn depressed v-if="$vuetify.breakpoint.mobile" class="ml-auto mr-4 mt-4" icon @click="show = false">
          <v-icon dark>mdi-close-thick</v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-form v-model="isValid" ref="editApplicationElementRef">
          <v-row>
            <v-col cols="12">
              <v-text-field :rules="[rules.required]" v-model="currentApplicationElement.elementName" dense label="Element Name"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :rules="[rules.required]" v-model="currentApplicationElement.filename" dense label="Filename"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="currentApplicationElement">
              <v-file-input @change="fileToUploadSelected" :rules="isEditing ? [] : [rules.required]" v-model="uploadFile" dense label="File"></v-file-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="currentApplicationElement.installerType" dense :items="installerTypes" label="Installer type" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="currentApplicationElement.platform" @change="isX64" dense :items="elementPlatforms" label="Platform" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :rules="[rules.required]" v-model="currentApplicationElement.order" dense label="Order"></v-text-field>
            </v-col>
            <v-col cols="6" md="3">
              <v-switch class="mt-0" v-model="currentApplicationElement.isArchive" dense label="File is an archive" />
            </v-col>
            <v-col cols="6" md="3">
              <v-switch class="mt-0" v-model="currentApplicationElement.isMandatory" dense label="Mandatory" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="currentApplicationElement.installCommand" dense label="Install Command"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="currentApplicationElement.uninstallCommand" dense label="Uninstall Command"></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-switch class="mt-0" v-model="applicationElementEnabled" label="Enabled" />
            </v-col>
          </v-row>
          <v-row v-if="currentApplicationElement.detectionMethod">
            <v-col cols="12">
              <div class="mb-4">Set how the element should be detected as installed on target PCs:</div>
              <v-select v-model="currentApplicationElement.detectionMethod.type" dense :items="detectionMethods" label="Detection method" />
            </v-col>
            <v-col cols="12" v-if="currentApplicationElement.detectionMethod.type == 1">
              <v-text-field :rules="[rules.required]" v-model="currentApplicationElement.detectionMethod.productCode" dense label="Product Code"></v-text-field>
            </v-col>
            <v-col cols="12" :md="showDetectionMethodTargetValue ? 6 : 12" v-else>
              <v-text-field
                :rules="[rules.required]"
                v-model="currentApplicationElement.detectionMethod.path"
                dense
                :label="detectionMethodPathLabel"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="showDetectionMethodTargetValue">
              <v-text-field
                :rules="[rules.required]"
                v-model="currentApplicationElement.detectionMethod.targetValue"
                dense
                :label="detectionMethodTargetValueLabel"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="currentApplicationElement.detectionMethod.type !== 1">
              <v-switch
                v-model="currentApplicationElement.detectionMethod.isX64"
                :label="`Detect as ${currentApplicationElement.detectionMethod.isX64 ? '64-bit' : '32-bit'} application`"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-block d-md-flex">
        <v-btn depressed :block="$vuetify.breakpoint.mobile" @click="show = false" class="my-4">Cancel</v-btn>
        <v-btn
          depressed
          :block="$vuetify.breakpoint.mobile"
          @click="saveCurrentApplicationElement"
          color="success"
          class="ml-0 ml-md-4 my-4"
          :loading="isSaving"
          :disabled="!isValid"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Update Application Element' : 'Add Application Element' }}
        </v-btn>
      </v-card-actions>
      <div>
        <v-progress-linear v-show="uploadProgress" :value="uploadProgress" height="15" striped color="green darken-1">
          <strong>{{ progressBar }}</strong>
        </v-progress-linear>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import apiService from '@/services/apiService.js';
import MsiDatabase from '@/services/msiService';
import { convertBlobToBuffer } from '@/plugins/util';

export default {
  name: 'CreateEditApplicationElement',
  data: () => ({
    show: false,
    currentApplicationElement: {},
    isValid: false,
    isUploading: false,
    uploadProgress: 0,
    elementStatus: null,
    isSaving: false,
    isLoading: false,
    uploadFile: null,
    createdElementId: null,
    applications: [],
    rules: {
      required: (value) => !!value || value === 0 || 'Field cannot be empty.',
    },
    installerTypes: null,
    detectionMethods: null,
    elementPlatforms: null,
  }),
  computed: {
    isEditing() {
      return this.currentApplicationElement?.id ? true : false;
    },
    progressBar() {
      if (this.uploadProgress < 100) {
        return `${Math.ceil(this.uploadProgress)}%`;
      }
      return 'Upload Complete';
    },
    applicationElementEnabled: {
      get() {
        return !this.currentApplicationElement.disabled;
      },
      set(val) {
        this.currentApplicationElement.disabled = !val;
      },
    },
    detectionMethodPathLabel() {
      switch (this.currentApplicationElement.detectionMethod.type) {
        case 4:
        case 5:
          return 'Registry path';

        default:
          return 'Detection path';
      }
    },
    detectionMethodTargetValueLabel() {
      switch (this.currentApplicationElement.detectionMethod.type) {
        case 4:
        case 5:
          return 'Registry value name';

        case 2:
          return 'Detection file name';

        default:
          return 'Detection name';
      }
    },
    showDetectionMethodTargetValue() {
      return this.currentApplicationElement.detectionMethod.type == 2 || this.currentApplicationElement.detectionMethod.type == 5;
    },
  },
  methods: {
    async editApplicationElement(applicationElement) {
      this.show = true;
      this.uploadProgress = 0;
      this.uploadFile = null;
      this.currentApplicationElement = _.cloneDeep(applicationElement);
      this.$refs.editApplicationElementRef.resetValidation();
    },
    async createApplicationElement() {
      this.show = true;
      this.uploadProgress = 0;
      this.uploadFile = null;

      this.currentApplicationElement = {
        installerType: 1,
        platform: 1,
        fileSize: null,
        fileHash: null,
        isMandatory: false,
        filename: null,
        elementName: '',
        order: null,
        isArchive: false,
        installCommand: null,
        uninstallCommand: null,
        disabled: false,
        detectionMethod: {
          type: 1,
          path: null,
          targetValue: null,
          isX64: false,
          productCode: null,
        },
      };
      this.$refs.editApplicationElementRef?.resetValidation();
    },
    setFileInfo() {
      this.currentApplicationElement.filename = this.uploadFile?.name;
      this.currentApplicationElement.fileSize = this.uploadFile?.size;
    },
    async fileToUploadSelected() {
      this.setFileInfo();

      if (this.uploadFile) {
        if (this.uploadFile.name.toLowerCase().endsWith('.msi')) {
          try {
            const database = new MsiDatabase(await convertBlobToBuffer(this.uploadFile));

            this.currentApplicationElement.detectionMethod.type = 1;
            this.currentApplicationElement.detectionMethod.productCode = database.properties.ProductCode;
            this.currentApplicationElement.elementName = `${database.properties.ProductName} ${database.properties.ProductVersion}`;
            this.currentApplicationElement.installerType = 1;
          }
          catch (e) {
            console.error(e);
          }
        }
      }
    },
    isX64() {
      if (this.currentApplicationElement) {
        this.currentApplicationElement.detectionMethod.isX64 = this.currentApplicationElement.platform === 2 || this.currentApplicationElement.platform === 3;
      }
    },
    async saveCurrentApplicationElement() {
      try {
        this.isSaving = true;

        this.createdElementId = await apiService.createOrEditApplicationElement(this.currentApplicationElement);

        if (this.uploadFile) {
          console.log(this.uploadFile.name, this.currentApplicationElement.filename);
          if (this.uploadFile.name != this.currentApplicationElement.filename) {
            this.uploadFile = this.renameFile(this.uploadFile, this.currentApplicationElement.filename);
            this.setFileInfo();
          }

          this.isUploading = true;
          this.elementStatus = 'Uploading 0%';

          await apiService
            .uploadApplicationElementFile(this.uploadFile, this.createdElementId, (e) => {
              if (e.loaded === e.total) {
                this.isUploading = false;
                this.elementStatus = 'Upload completed';
              } else {
                this.uploadProgress = (e.loaded / e.total) * 100;
                this.elementStatus = `Uploading ${Math.round(this.uploadProgress)}%`;
              }
            })
            .then(() => {
              this.show = false;
              this.$emit('applicationelement-updated');
            })
            .finally(() => {
              this.isSaving = false;
            });
        } else {
          this.show = false;
          this.$emit('applicationelement-updated');
          this.isSaving = false;
        }
      } catch (e) {
        this.show = true;
        this.errorMessage = e?.response?.data?.title ?? e;
      }
    },

    renameFile(originalFile, newName) {
      return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
    },
  },
  created() {
    this.installerTypes = [1, 2, 3, 4].map((value) => ({ value, text: this.$util.formatInstallerType(value) }));
    this.detectionMethods = [1, 2, 3, 4, 5].map((value) => ({ value, text: this.$util.formatDetectionMethod(value) }));
    this.elementPlatforms = [1, 2, 3].map((value) => ({ value, text: this.$util.formatPlatform(value) }));
  },
};
</script>
