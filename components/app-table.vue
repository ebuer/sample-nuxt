<template>
  <div class="app-page">
    <v-card v-if="ready">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn large rounded @click="$router.push(`/${localKey}/create`)">create
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-title>
        {{ info.title }}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="tableItems"
        :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <div class="d-flex" style="min-width: 70px">
            <v-icon
              class="mr-2"
              @click="$router.push(`${setUrl(item)}`)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              @click="confirmDelete(item)"
            >
              mdi-delete
            </v-icon>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ready: false,
      headers: [],
      info: {
        title: ''
      },
      search: '',
      tableItems: [],
      localKey: null,
    }
  },
  methods: {
    init(info, localStorageKey, headers) {
      const self = this;
      const json = self.$getJson(localStorageKey)
      const data = info.categories !== undefined ? self.$getCatDataArray(localStorageKey, info.categories) : self.$getDataArray(localStorageKey);
      self.info = info;
      self.headers = JSON.parse(JSON.stringify(headers));


      self.headers.push({
        text: 'Actions',
        value: 'actions',
        sortable: false,
      })


      self.tableItems = data;
      self.localKey = localStorageKey;
      self.ready = true;
    },
    setUrl(item) {
      const self = this;
      const slugUrl = item.categorySlug !== undefined ? item.idSlug + '?cat=' + item.categorySlug : item.idSlug;
      return `/${self.localKey}/update/${slugUrl}`
    },
    refreshTable() {
      const self = this;
      // self.tableItems = self.$getDataArray(self.localKey);
      self.tableItems = self.info.categories !== undefined ? self.$getCatDataArray(self.localKey, self.info.categories) : self.$getDataArray(self.localKey);
      self.$forceUpdate()
    },
    confirmDelete(item) {
      const self = this;
      const json = self.$getJson(self.localKey)

      const isCatItem = item.categorySlug !== undefined;

      const deleteJsonItem = isCatItem ? json[item.categorySlug][item.idSlug] : json[item.idSlug]

      if (deleteJsonItem !== undefined) {
        self.$swal({
          title: `${self.localKey}: Delete Item - ${self.getName(json, isCatItem, item)}`,
          text: "Do you want to delete this item?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            if (isCatItem) {
              self.$removeCatItem(self.localKey, item.categorySlug, item.idSlug)
            } else {
              self.$removeItem(self.localKey, item.idSlug)
            }
            self.refreshTable()
            self.$swal({
              position: 'top-end',
              icon: 'success',
              title: `${self.localKey} : ${item.idSlug} has been deleted.`,
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
      }
    },
    getName(json, isCat, item) {
      try {
        const name = isCat ? json[item.categorySlug][item.idSlug].name : json[item.idSlug].name
        if (name === undefined) throw {};
        return name
      } catch (e) {
        // return isCat ? json[item.categorySlug][item.idSlug].idSlug : json[item.idSlug].idSlug
        return item.idSlug
      }
    }
  }
}
</script>
