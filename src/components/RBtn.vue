<template>
  <v-btn class="px-4" v-bind="attributes" v-on="$listeners">
    <slot />
  </v-btn>
</template>
<script>
export default {
  name: 'r-btn',
  props: {
    soft: Boolean,
    action: Boolean,
    creation: Boolean,
    delete: Boolean,
    text: Boolean,
  },
  computed: {
    attributes() {
      return {
        color: this.soft ? null : this.action ? 'activeButton' : this.creation ? 'success' : this.delete ? 'error' : this.text ? 'info' : 'null',
        class: this.action ? 'white--text' : null,
        depressed: false,
        elevation: this.$vuetify.theme.dark && !this.text ? 2 : 0,
        text: this.text,
        ...this.$attrs,
      };
    },
  },
};
</script>