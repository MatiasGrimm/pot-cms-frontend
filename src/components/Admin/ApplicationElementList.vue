<template>
  <div>
    <div v-if="!detailsView">
      <div v-if="applicationElements">
        <v-row no-gutters justify="space-between" align="center">
          <v-btn large depressed tile @click="createApplicationElement">
            <v-icon left>mdi-application-cog-outline </v-icon>
            Add Element
          </v-btn>
          <v-col cols="4">
            <search-text-field v-model="search" />
          </v-col>
          <v-checkbox @change="getApplicationElements" v-model="showAll" label="Show disabled" />
        </v-row>
        <v-data-table @click:row="showDetails" :headers="headers" :items="applicationElements" :search="search" v-bind="$util.dataTableAttributes()">
          <template #[`item.installerType`]="{ item }"> {{ getInstallerType(item.installerType) }} </template>
          <template #[`item.platform`]="{ item }"> {{ getPlatform(item.platform) }} </template>
          <template #[`item.disabled`]="{ item }">
            <readonly-checkbox :value="!item.disabled" />
          </template>
          <template #[`item.detectionMethod`]="{ item }"> {{ getDetectionMethod(item.detectionMethod) }} </template>
          <template #[`item.elementName`]="{ item }">
            <router-link :to="{ name: 'ApplicationElementDetails', params: { Id: item.id } }">{{ item.elementName }}</router-link>
          </template>
        </v-data-table>
        <create-edit-application-element ref="CreateEditApplicationElementRef" @applicationelement-updated="getApplicationElements" />
      </div>
    </div>
    <application-elements-details @applicationelement-updated="getApplicationElements" v-else />
  </div>
</template>

<script>
import apiService from '@/services/apiService.js';
import CreateEditApplicationElement from './Dialogs/CreateEditApplicationElement.vue';
import ApplicationElementsDetails from './Details/ApplicationElementsDetails.vue';
import ReadonlyCheckbox from '../ReadonlyCheckbox.vue';

export default {
  components: { CreateEditApplicationElement, ApplicationElementsDetails, ReadonlyCheckbox },
  name: 'ApplicationElementList',
  computed: {
    detailsView() {
      return this.$route.params.Id;
    },
  },
  data: () => ({
    applicationElements: null,
    showAll: false,
    isLoading: false,
    search: null,
    headers: [
      {
        text: 'Element Name',
        value: 'elementName',
      },
      {
        text: 'Filename',
        value: 'filename',
      },
      {
        text: 'Installer Type',
        value: 'installerType',
      },
      {
        text: 'Enabled',
        value: 'disabled',
      },
      {
        text: 'Platform',
        value: 'platform',
      },
      {
        text: 'Detection Method',
        value: 'detectionMethod',
      },
      {
        text: 'Order',
        value: 'order',
      },
    ],
  }),
  methods: {
    getDetectionMethod(detectionMethod) {
      if (!detectionMethod) return 'Null';

      switch (detectionMethod.type) {
        case 1:
          return 'MsiProductCode';
        case 2:
          return 'File';
        case 3:
          return 'Directory';
        case 4:
          return 'RegistryKey';
        case 5:
          return 'RegistryValue';
        default:
          return 'None';
      }
    },
    getPlatform(id) {
      switch (id) {
        case 1:
          return 'X86';
        case 2:
          return 'X64';
        case 3:
          return 'Both';
        default:
          return 'None';
      }
    },
    getInstallerType(id) {
      switch (id) {
        case 1:
          return 'MSI';
        case 2:
          return 'Executable';
        case 3:
          return 'SqlExecutable';
        default:
          return 'None';
      }
    },
    async getApplicationElements() {
      this.isLoading = true;
      this.applicationElements = await apiService.getApplicationElements(this.showAll);
      this.isLoading = false;
    },
    showDetails(applicationElement) {
      this.$router.push({ name: 'ApplicationElementDetails', params: { Id: applicationElement.id } });
    },
    createApplicationElement() {
      this.$refs.CreateEditApplicationElementRef.createApplicationElement();
    },
  },
  created() {
    this.getApplicationElements();
  },
};
</script>

<style></style>
