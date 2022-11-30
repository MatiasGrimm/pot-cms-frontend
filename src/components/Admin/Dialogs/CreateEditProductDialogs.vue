<template>
  <v-navigation-drawer stateless temporary fixed width="40vvw" v-model="show" right>
    <v-card tile elevation="0" style="height: 100vh; width: 40vw">
      <v-card-title>
        {{ isEditing ? currentProduct.Name : 'Opret nyt produkt' }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid" ref="createEditUserRef">
          <v-row no-gutters>
            <v-col cols="12" md="6">Navn:*</v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="currentProduct.Name" hide-details="auto" :autofocus="!isEditing" outlined :rules="[rules.required]" dense />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <r-btn :block="$vuetify.breakpoint.mobile" class="mr-lg-4 mb-2" @click="show = false">Annuller</r-btn>
        <r-btn :block="$vuetify.breakpoint.mobile" class="mr-lg-4 mb-2" @click="show = false">
          <v-icon left>mdi-check</v-icon>
          {{ isEditing ? 'Gem ændringer' : 'Opret' }}
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
    isValid: false,
    rules: {
      required: (value) => !!value || 'Skal indeholde tekst',
    },
  }),
  computed: {
    isEditing: {
      get() {
        return this.currentProduct.Name != '';
      },
    },
  },
  methods: {
    close() {
      this.$emit('product-updated');
      this.show = false;
      this.$refs.createEditUserRef.reset();
    },
    editProduct(product) {
      this.show = true;
      this.currentProduct = _.clonedeep(product);
    },
    createProduct() {
      this.currentProduct = {
        name: '',
        description: '',
        isDisabled: false,
        salesHistories: null,
      };
      this.show = true;
    },
  },
  created() {},
};
</script>

<style>
</style>