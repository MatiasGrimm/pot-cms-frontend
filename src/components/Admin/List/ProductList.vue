<template>
    <div>
        <v-row no-gutters justify="space-between" align="center">
          <v-btn large depressed tile @click="addProduct()">
            <v-icon left>mdi-plus</v-icon>
            Add Product
          </v-btn>
          <v-col cols="4">
            <search-text-field v-model="search" />
          </v-col>
          <v-checkbox @change="getProducts" v-model="showAll" label="Show disabled" />
        </v-row>
        <v-data-table @click:row="showDetails" :headers="headers" :items="products" v-if="!detailsView" :search="search">
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
    name: 'ProductList',
    components: { ReadonlyCheckbox },
    data: () => ({
      products: [],
      showAll: false,
      loading: true,
      search: null,
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Description',
          value: 'description',
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
      async getProducts() {
        this.loading = true;
  
        this.products = await apiService.getProducts(this.showAll);
  
        this.loading = false;
      },
      showDetails() {
        // this.$router.push({ name: 'UserDetails', params: { Id: user.id } });
        console.log("No Details yet");
      },
      addProduct() {
        // this.$refs.CreateEditUserRef.createUser();
        console.log("Nope")
      },
    },
    created() {
      this.getProducts();
    },
  };
  </script>