<template>
    <div>
        <v-row no-gutters justify="space-between" align="center">
          <v-btn large depressed tile @click="addLocation()">
            <v-icon left>mdi-plus</v-icon>
            Add Location
          </v-btn>
          <v-col cols="4">
            <search-text-field v-model="search" />
          </v-col>
          <v-checkbox @change="getLocations" v-model="showAll" label="Show disabled" />
        </v-row>
        <v-data-table @click:row="showDetails" :headers="headers" :items="locations" v-if="!detailsView" :search="search">
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
    name: 'LocationList',
    components: { ReadonlyCheckbox },
    data: () => ({
      locations: [],
      showAll: false,
      loading: true,
      search: null,
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Address',
          value: 'address',
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
      async getLocations() {
        this.loading = true;
  
        this.locations = await apiService.getLocations(this.showAll);
  
        this.loading = false;
      },
      showDetails() {
        // this.$router.push({ name: 'UserDetails', params: { Id: user.id } });
        console.log("No Details yet");
      },
      addLocation() {
        // this.$refs.CreateEditUserRef.createUser();
        console.log("Nope")
      },
    },
    created() {
      this.getLocations();
    },
  };
  </script>