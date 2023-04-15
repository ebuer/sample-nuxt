<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list nav dense>
        <div v-for="(link, i) in links" :key="i">

          <v-list-item
            v-if="!link.subLinks"
            :to="link.to"
            class="v-list-item"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-title v-text="link.text" />
          </v-list-item>

          <v-list-group
            v-else
            :key="link.text"
            no-action
            class="sub-menu"
            :prepend-icon="link.icon"
            :value="false"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </template>

            <v-list-item
              v-for="sublink in link.subLinks"
              :to="sublink.to"
              :key="sublink.text"
              :class="[$route.fullPath === sublink.to ? 'active-sub' : '']"
            >
              <v-list-item-icon>
                <v-icon>{{ sublink.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ sublink.text }}</v-list-item-title>

            </v-list-item>

          </v-list-group>

        </div>

      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: true,
      drawer: true,
      links: [
        {
          to     : '/',
          icon   : 'mdi-view-dashboard',
          text   : 'Dashboard',
        },
        {
          icon: 'mdi-account-group',
          text: 'Users',
          to: '/users'
        },
        {
          icon: 'mdi-account-group',
          text: 'Cars',
          to: '/cars'
        },
        {
          icon: 'mdi-code-json',
          text: 'Show Json',
          to: '/json',
          subLinks : [
            {
              text : 'Users',
              to    : '/json?type=users',
            },
            {
              text : 'Cars',
              to    : '/json?type=cars',
            }
          ]
        },
      ],
      miniVariant: false,
    }
  }
}
</script>

<style lang="scss">
.v-application--is-ltr .v-list--dense.v-list--nav .v-list-group--no-action > .v-list-group__items > .v-list-item {
  padding: 0 8px;
}
.sub-menu {
  .v-list-item--active:not(.active-sub) {
    color: white !important;
    background: transparent !important;
    &:before {
      opacity: 0 !important;
    }
  }
}
</style>
