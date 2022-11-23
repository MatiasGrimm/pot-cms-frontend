<template>
    <div>
        <v-row no-gutters justify="space-between" align="center">
          <v-btn large depressed tile @click="addStaff()">
            <v-icon left>mdi-plus</v-icon>
            Add Staff
          </v-btn>
          <v-col cols="4">
            <search-text-field v-model="search" />
          </v-col>
          <v-checkbox @change="getStaff" v-model="showAll" label="Show disabled" />
        </v-row>
        <v-data-table @click:row="showDetails" :headers="headers" :items="staffList" v-if="!detailsView" :search="search">
          <template #[`item.isDisabled`]="{ item }">
            <readonly-checkbox :value="!item.isDisabled" />
          </template>
        </v-data-table>
    </div>
  </template>
  
  <script>
  import apiService from '@/services/apiService.js';
  import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';
 
  
  export default {
    name: 'StaffList',
    components: { ReadonlyCheckbox },
    data: () => ({
      staffList: [],
      showAll: false,
      loading: true,
      search: null,
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Number',
          value: 'number',
        },
        {
          text: 'Disabled',
          value: 'isDisabled',
        },
      ],
    }),
    computed: {
      detailsView() {
        return this.$route.params.Id;
      },
    },
  
    methods: {
      async getStaffList() {
        this.loading = true;
  
        this.staffList = await apiService.getStaffList(this.showAll);
  
        this.loading = false;
      },
      showDetails() {
        // this.$router.push({ name: 'UserDetails', params: { Id: user.id } });
        console.log("No Details yet");
      },
      addStaff() {
        // this.$refs.CreateEditUserRef.createUser();
        console.log("Nope")
      },
    },
    created() {
      this.getStaffList();
    },
  };
  </script>