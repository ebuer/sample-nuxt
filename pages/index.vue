<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <NuxtLogo />
        <VuetifyLogo />
      </v-card>
      <v-card>
        <v-card-title class="headline">
          Welcome to the localstorage sample panel
        </v-card-title>
        <v-card-text>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores earum explicabo laudantium! Architecto, aspernatur deserunt ea eligendi eveniet exercitationem laborum placeat quaerat quas quisquam recusandae repellendus tempora ut, veniam voluptatem?</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>
