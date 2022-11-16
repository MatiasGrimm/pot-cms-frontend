<template>
  <div v-if="item">
    {{ $util.formatDate(item.updated, true) }}
    <span v-if="item.updatedById"> by
      <router-link :to="{ name: 'UserDetails', params: { Id: item.updatedById } }">
        {{ resolvedUserName }}
      </router-link>
    </span>
  </div>
</template>
<script>
import apiService from '@/services/apiService.js';

export default {
  name: 'last-updated-field',
  data: () => ({
    resolvedUser: null,
  }),
  computed: {
    resolvedUserName() {
      return this.resolvedUser?.email ?? this.item?.updatedById;
    }
  },
  props: {
    item: Object
  },
  watch: {
    item: {
      immediate: true,
      handler() {
        this.fetchUser();
      }
    }
  },
  methods: {
    async fetchUser() {
      if (this.item?.updatedById) {
        this.resolvedUser = await apiService.getUserById(this.item.updatedById);
      }
    }
  }
}
</script>