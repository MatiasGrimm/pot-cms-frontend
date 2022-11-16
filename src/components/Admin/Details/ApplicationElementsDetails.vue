<template>
  <div>
    <div v-if="applicationElement">
      <v-row>
        <v-col cols="12" sm="auto">
          <h1 class="text-left">{{ applicationElement.elementName }}</h1>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editApplicationElement">
            <v-icon left>mdi-pencil-outline</v-icon>
            Edit
          </v-btn>
        </v-col>
      </v-row>

      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ applicationElement.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Element name:</td>
            <td>{{ applicationElement.elementName }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">File name:</td>
            <td>{{ applicationElement.filename }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Order:</td>
            <td>{{ applicationElement.order }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">File size:</td>
            <td>{{ applicationElement.fileSize }} bytes</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Install Command:</td>
            <td>
              <pre>{{ applicationElement.installCommand }}</pre>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Uninstall Command:</td>
            <td>
              <pre>{{ applicationElement.uninstallCommand }}</pre>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Installer Type:</td>
            <td>{{ $util.formatInstallerType(applicationElement.installerType) }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Platform:</td>
            <td>{{ $util.formatPlatform(applicationElement.platform) }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Enabled:</td>
            <td>
              <readonly-checkbox :value="!applicationElement.disabled" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Mandatory:</td>
            <td>
              <readonly-checkbox :value="applicationElement.isMandatory" enabledTitle="Is mandatory" disabledTitle="Not mandatory" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Content is an archive:</td>
            <td>
              <readonly-checkbox :value="applicationElement.isArchive" enabledTitle="Is an archive" disabledTitle="Not an archive" />
            </td>
          </tr>

          <tr v-if="applicationElement.detectionMethod">
            <td class="font-weight-bold">Detection Method:</td>
            <td>
              <div><strong>Type:</strong> {{ $util.formatDetectionMethod(applicationElement.detectionMethod.type) }}</div>
              <div v-if="applicationElement.detectionMethod.type === 1">
                <strong>Product Code:</strong> {{ applicationElement.detectionMethod.productCode }}
              </div>
              <div v-else>
                <strong>Path:</strong> {{ applicationElement.detectionMethod.path }}, <strong>target:</strong>
                {{ applicationElement.detectionMethod.targetValue }}
              </div>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Last updated:</td>
            <td><last-updated-field :item="applicationElement" /></td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <create-edit-application-element ref="CreateEditApplicationElementsRef" @applicationelement-updated="bubbleEmit" />
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditApplicationElement from '../Dialogs/CreateEditApplicationElement.vue';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';

export default {
  components: { CreateEditApplicationElement, ReadonlyCheckbox },
  name: 'ApplicationElementDetails',
  data: () => ({
    loading: true,
    applicationElement: {},
  }),
  methods: {
    async getApplicationElement() {
      this.loading = true;
      this.applicationElement = await apiService.getApplicationElementById(this.$route.params.Id);
      this.loading = false;
    },
    editApplicationElement() {
      this.$refs.CreateEditApplicationElementsRef.editApplicationElement(this.applicationElement);
    },
    async bubbleEmit() {
      await this.getApplicationElement();
      this.$emit('applicationelement-updated');
    },
  },
  created() {
    this.getApplicationElement();
  },
};
</script>

<style></style>
