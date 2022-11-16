<template>
  <div>
    <div v-if="!detailsView">
      <v-row no-gutters>
        <v-btn large depressed tile @click="addSqlScript">
          <v-icon left>mdi-script-text-outline</v-icon>
          Add Script
        </v-btn>
        <v-checkbox @change="getSqlScripts" v-model="showAll" class="ml-auto" label="Show disabled" />
      </v-row>
      <v-data-table @click:row="showDetails" :headers="headers" :items="sqlScripts" v-bind="$util.dataTableAttributes()">
        <template #[`item.filename`]="{ item }">
          <router-link :to="{ name: 'SQLDetails', params: { Id: item.id } }">{{ item.filename }}</router-link>
        </template>
      </v-data-table>
    </div>
    <sql-script-details @sqlScript-updated="getSqlScripts" v-else />
    <create-edit-sql-script ref="CreateEditSqlScriptRef" @sqlScript-updated="getSqlScripts" />
  </div>
</template>

<script>
import apiService from '@/services/apiService';
import CreateEditSqlScript from './Dialogs/CreateEditSqlScript.vue';
import SqlScriptDetails from './Details/SqlScriptDetails.vue';

export default {
  components: { CreateEditSqlScript, SqlScriptDetails },
  name: 'SqlScriptList',

  data: () => ({
    sqlScripts: [],
    showAll: false,
    isLoading: false,

    headers: [
      {
        text: 'Filename',
        value: 'filename',
      },
      {
        text: 'Description',
        value: 'description',
      },
    ],
  }),
  computed: {
    detailsView() {
      return this.$route.params.Id;
    },
  },
  methods: {
    async getSqlScripts() {
      this.loading = true;
      this.sqlScripts = await apiService.getSqlScripts(this.showAll);
      this.loading = false;
    },

    addSqlScript() {
      this.$refs.CreateEditSqlScriptRef.createSqlScript();
    },
    showDetails(sqlScript) {
      this.$router.push({ name: 'SQLDetails', params: { Id: sqlScript.id } });
    },
  },

  created() {
    this.getSqlScripts();
  },
};
</script>

<style></style>
