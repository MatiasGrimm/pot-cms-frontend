<template>
  <v-text-field outlined dense prepend-inner-icon="mdi-magnify" placeholder="Search" hide-details v-bind="$attrs" v-on="$listeners" />
</template>
<script>
export default {
  name: 'search-text-field'
}
</script>