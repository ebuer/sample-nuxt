<template>
  <div class="app-page">
    <app-form ref="app-form" />
  </div>
</template>

<script>

import {localStorageKey, form} from '@/modules/cars'

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
      const slug = self.$route.params.slug
      if(!slug) self.$router.push('/');
      self.$refs['app-form'].initForm(localStorageKey, form, slug)
    }
  }
}
</script>
