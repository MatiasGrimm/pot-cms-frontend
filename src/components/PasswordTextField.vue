<template>
  <v-text-field
    :value="value"
    @input="$emit('update', $event)"
    :type="showPassword ? 'text' : 'password'"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #append>
      <v-btn tabindex="-1" @click="showPassword = !showPassword" icon>
        <v-icon>{{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>
<script>
export default {
  name: 'password-text-field',
  props: ['value'],
  data: () => ({
    showPassword: false,
  }),
};
</script>
