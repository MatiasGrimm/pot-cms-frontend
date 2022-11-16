<template>
  <v-card color="transparent" v-bind="$attrs" v-on="$listeners" class="d-flex flex-column" tile>
    <v-container fluid no-gutters dense :style="'background-color: rgba(0, 0, 0, 0.9); color: white'">
      <slot name="header"></slot>
      <v-divider />
    </v-container>
    <v-container fluid fill-height class="d-block" :style="'background-color: rgba(0, 0, 0, 0.8); color: white; min-height:100vh'">
      <!-- :style="'background-color: rgba(0, 0, 0, 0.8);'" -->
      <v-container fluid :style="'color: white'">
        <slot></slot>
      </v-container>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: 'overlay',
  computed: {},
};
</script>
