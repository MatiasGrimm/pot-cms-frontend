<template>
  <v-icon :title="value ? enabledTitle : disabledTitle">
    {{ value ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
  </v-icon>
</template>
<script>
export default {
  name: 'readonly-checkbox',
  props: {
    value: Boolean,
    enabledTitle: {
      type: String,
      default: 'Enabled'
    },
    disabledTitle: {
      type: String,
      default: 'Disabled'
    }
  }
}
</script>
