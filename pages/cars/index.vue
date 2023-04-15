<template>
  <div class="app-page">
    <app-table ref="table" />
  </div>
</template>

<script>

import {info, localStorageKey, headers} from '@/modules/cars'

export default {
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$refs.table.init(info, localStorageKey, headers)
    }
  }
}
</script>
