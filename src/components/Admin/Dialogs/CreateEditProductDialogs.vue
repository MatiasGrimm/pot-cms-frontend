<template>
  <v-navigation-drawer stateless temporary fixed width="40vvw" v-model="show" right>
    <v-card tile v-if="currentProduct" elevation="0" style="height: 100vh; width: 40vw">
      <v-card-title>
        {{ isEditing ? name : 'Opret nyt produkt' }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid" ref="createEditUserRef">
          <v-row no-gutters>
            <v-col cols="12" md="3" align-self="center">Navn:*</v-col>
            <v-col>
              <v-text-field v-model="currentProduct.name" :autofocus="!isEditing" outlined :rules="[rules.required]" dense />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3" align-self="center">Beskrivelse:*</v-col>
            <v-col>
              <v-textarea outlined dense class="mt-2 mb-0" label="Beskrivelse" v-bind="$attrs" :rules="[]" v-model="currentProduct.description" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3" align-self="center">Aktivt:*</v-col>
            <v-col>
              <v-switch color="green" class="mt-0 pt-0" v-model="isActive" dense hide-details />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-row no-gutters>
          <r-btn :block="$vuetify.breakpoint.mobile" class="mr-lg-4 mb-2" @click="close()">Annuller</r-btn>
          <r-btn :block="$vuetify.breakpoint.mobile" class="mr-lg-4 mb-2" @click="saveProduct()">
            <v-icon left>mdi-check</v-icon>
            {{ isEditing ? 'Gem ændringer' : 'Opret' }}
          </r-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import apiService from '@/services/apiService.js';
import _ from 'lodash';
import RBtn from '@/components/RBtn.vue';

export default {
  components: { RBtn },
  name: 'createEditProduct',
  data: () => ({
    name: '',
    show: false,
    currentProduct: {},
    isValid: false,
    rules: {
      required: (value) => !!value || 'Skal indeholde tekst',
    },
  }),
  computed: {
    isActive: {
      get() {
        return !this.currentProduct.isDisabled;
      },
      set(val) {
        this.currentProduct.isDisabled = !val;
      },
    },
    isEditing: {
      get() {
        return this.currentProduct?.id ? true : false;
      },
    },
  },
  methods: {
    close() {
      this.$refs.createEditUserRef.reset();
      this.$emit('update-procut-list');
      this.show = false;
    },
    details(product) {
      this.show = true;
      this.currentProduct = _.cloneDeep(product);
      console.log(this.currentProduct);
    },
    editProduct(product) {
      this.show = true;
      this.currentProduct = _.cloneDeep(product);
      this.name = this.currentProduct.name;
      console.log(this.name);
    },
    createProduct() {
      this.currentProduct = {
        name: null,
        description: null,
        isDisabled: false,
        salesHistories: null,
      };
      this.show = true;
    },
    async saveProduct() {
      let response = await apiService.createOrEditProduct(this.currentProduct);
      if (response.id != null) {
        this.close();
      }
    },
  },
  created() {},
};
</script>

<style>
</style>