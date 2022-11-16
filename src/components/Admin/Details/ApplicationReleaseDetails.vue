<template>
  <div>
    <div v-if="applicationRelease">
      <v-row>
        <v-col cols="12" sm="auto">
          <h1 class="text-left">{{ applicationRelease.publicName }}</h1>
          <h3 class="text-left">Application: {{ applicationRelease.applicationName }}</h3>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn :block="$vuetify.breakpoint.mobile" depressed class="align-self-center mt-2 ml-md-4 mb-3 mb-md-0" @click="editApplicationRelease">
            <v-icon left>mdi-pencil-outline</v-icon>
            Edit
          </v-btn>
        </v-col>
      </v-row>

      <v-simple-table dense class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ applicationRelease.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Application:</td>
            <td>
              <router-link :to="{ name: 'ApplicationDetails', params: { Id: applicationRelease.applicationId } }">
                {{ applicationRelease.applicationName }}
              </router-link>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Display name:</td>
            <td>{{ applicationRelease.publicName }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Version:</td>
            <td>{{ applicationRelease.version }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Description:</td>
            <td>{{ applicationRelease.description }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Prerelease:</td>
            <td>
              <readonly-checkbox :value="applicationRelease.prerelease" enabledTitle="Yes" disabledTitle="No" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Enabled:</td>
            <td>
              <readonly-checkbox :value="applicationRelease.enabled" enabledTitle="Yes" disabledTitle="No" />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">Last updated:</td>
            <td><last-updated-field :item="applicationRelease" /></td>
          </tr>
        </tbody>
      </v-simple-table>

      <div class="mt-8">
        <v-row no-gutters>
          <h3>Release elements</h3>
          <v-col cols="1" v-if="!editingElements">
            <v-btn @click="editElements" depressed class="ml-4">
              <v-icon left>mdi-pencil-outline</v-icon>
              Edit</v-btn
            >
          </v-col>
          <v-col v-if="editingElements">
            <v-btn class="ml-4" @click="editingElements = false" depressed>Cancel</v-btn>
            <v-btn @click="saveCurrentApplicationRelease" color="success" class="ml-4" depressed>Save</v-btn>
          </v-col>
        </v-row>
        <v-data-table
          :show-select="editingElements"
          :items="editingElements ? applicationElements : applicationRelease.elements"
          item-key="id"
          :headers="elementHeaders"
          v-bind="$util.dataTableAttributes()"
          sort-by="order"
          @click:row="showElement"
          :loading="(editingElements && !applicationElements) || isSaving"
          v-model="applicationRelease.elements"
        >
          <template #[`item.filename`]="{ item }">
            <router-link :to="{ name: 'ApplicationElementDetails', params: { Id: item.id } }">{{ item.elementName }}</router-link>
          </template>
          <template #[`item.isMandatory`]="{ item }">
            <readonly-checkbox :value="item.isMandatory" enabledTitle="Is mandatory" disabledTitle="Not mandatory" />
          </template>
          <template #[`item.platform`]="{ item }">
            {{ $util.formatPlatform(item.platform) }}
          </template>
          <template #[`item.installerType`]="{ item }">
            {{ $util.formatInstallerType(item.installerType) }}
          </template>
        </v-data-table>
      </div>

      <div class="mt-8" v-if="applicationRelease.sqlScripts && applicationRelease.sqlScripts.length">
        <h3>SQL scripts</h3>
        <v-data-table
          :items="applicationRelease.sqlScripts"
          item-key="id"
          :headers="sqlScriptHeaders"
          v-bind="$util.dataTableAttributes()"
          @click:row="showSqlScript"
        >
          <template #[`item.filename`]="{ item }">
            <router-link :to="{ name: 'SQLDetails', params: { Id: item.id } }">{{ item.filename }}</router-link>
          </template>
        </v-data-table>
      </div>
    </div>
    <create-edit-application-release ref="CreateEditApplicationReleaseRef" @applicationrelease-updated="bubbleEmit" />
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditApplicationRelease from '@/components/Admin/Dialogs/CreateEditApplicationRelease.vue';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';

export default {
  components: { CreateEditApplicationRelease, ReadonlyCheckbox },
  name: 'applicationReleaseDetails',
  data: () => ({
    loading: true,
    isSaving: false,
    editingElements: false,
    applicationElements: [],
    applicationRelease: {},
    elementHeaders: [
      {
        text: 'Order',
        value: 'order',
      },
      {
        text: 'Name',
        value: 'filename',
      },
      {
        text: 'Mandatory',
        value: 'isMandatory',
      },
      {
        text: 'Platform',
        value: 'platform',
      },
      {
        text: 'Installer type',
        value: 'installerType',
      },
      {
        text: 'Install Command',
        value: 'installCommand',
      },
    ],
    sqlScriptHeaders: [
      {
        text: 'Name',
        value: 'filename',
      },
      {
        text: 'Description',
        value: 'description',
      },
      {
        text: 'Order',
        value: 'order',
      },
    ],
  }),
  methods: {
    async getApplicationRelease() {
      this.loading = true;
      this.applicationRelease = await apiService.getApplicationReleaseById(this.$route.params.Id);
      this.loading = false;
    },
    editApplicationRelease() {
      this.$refs.CreateEditApplicationReleaseRef.editApplicationRelease(this.applicationRelease);
    },
    editElements() {
      this.editingElements = true;
      this.getElements();
    },
    async getElements() {
      this.applicationElements = await apiService.getApplicationElements();
    },
    async saveCurrentApplicationRelease() {
      this.isSaving = true;
      await apiService
        .createOrEditApplicationRelease(this.applicationRelease)
        .then(() => {
          this.show = false;
          this.$emit('applicationrelease-updated');
        })
        .finally(() => {
          this.isSaving = false;
          this.editingElements = false;
        });
    },
    showElement(element) {
      if (!this.editingElements) this.$router.push({ name: 'ApplicationElementDetails', params: { Id: element.id } });
    },
    showSqlScript(sqlScript) {
      this.$router.push({ name: 'SQLDetails', params: { Id: sqlScript.id } });
    },
    bubbleEmit() {
      this.getApplicationRelease().then(() => {
        this.$emit('applicationrelease-updated');
      });
    },
  },
  created() {
    this.getApplicationRelease();
  },
};
</script>

<style></style>
