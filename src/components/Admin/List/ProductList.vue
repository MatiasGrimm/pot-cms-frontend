<template>
  <v-container fluid>
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
        <readonly-checkbox :value="item.isDisabled" />
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn icon @click="editProduct(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <createEditProduct @update-procut-list="getProducts()" ref="createEditProductRef" />
  </v-container>
</template>
  
<script>
import apiService from '@/services/apiService.js';
import ReadonlyCheckbox from '@/components/ReadonlyCheckbox.vue';
import createEditProduct from '../Dialogs/CreateEditProductDialog.vue';

export default {
  name: 'ProductList',
  components: { ReadonlyCheckbox, createEditProduct },
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
      {
        text: '',
        value: 'actions',
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
    showDetails(item) {
      console.log('Show details for ', item);
    },
    editProduct(item) {
      this.$refs.createEditProductRef.editProduct(item);
    },
    addProduct() {
      this.$refs.createEditProductRef.createProduct();
    },
  },
  created() {
    this.getProducts();
  },
};
</script>