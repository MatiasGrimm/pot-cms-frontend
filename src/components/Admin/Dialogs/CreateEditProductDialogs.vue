<template>
  <v-navigation-drawer stateless temporary fixed width="40vvw" v-model="show" right>
    <v-card tile elevation="0" style="height: 100vh; width: 40vw">
      <v-card-title>
        {{ isEditing ? currentProduct.Name : 'Eow lak dig ' }}
      </v-card-title>
      <v-card-text> </v-card-text>
      <v-card-actions>
        <r-btn :block="$vuetify.breakpoint.mobile" class="mr-lg-4 mb-2" @click="show = false">Annuller</r-btn>
        <r-btn :block="$vuetify.breakpoint.mobile" class="mr-lg-4 mb-2" @click="show = false">
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Gem ændringer din fucking ælling' : 'Opret' }}
        </r-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import _ from 'lodash';
import RBtn from '@/components/RBtn.vue';

export default {
  components: { RBtn },
  name: 'createEditProduct',
  data: () => ({
    show: false,
    currentProduct: null,
  }),
  computed: {
    isEditing: {
      get() {
        return this.currentProduct != null;
      },
    },
  },
  methods: {
    close() {
      this.$emit('product-updated');
      this.show = false;
    },
    editProduct(product) {
      this.show = true;
      this.currentProduct = _.clonedeep(product);
    },
    createProduct() {
      this.show = true;
    },
  },
  created() {},
};
</script>

<style>
</style>