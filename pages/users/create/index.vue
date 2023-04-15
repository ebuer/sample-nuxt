<template>
  <div class="app-page">
    <app-form ref="app-form" />
  </div>
</template>

<script>

import {localStorageKey, form} from '@/modules/users'

export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this;
      // const json = self.$getJson(localStorageKey)
      // const data = self.$getDataArray(localStorageKey);
      self.$refs['app-form'].initForm(localStorageKey, form)
    }
  }
}
</script>
