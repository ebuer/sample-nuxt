<template>
  <div class="app-page">
    <div style="position: sticky; top: 76px; z-index: 99">
      <v-toolbar stiky>
        <v-btn @click="copy">Copy</v-btn>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div   v-bind="attrs"
                   v-on="on">
              <v-checkbox
                :disabled="strView"
                class="ml-4 mt-5"
                v-model="editable"
                label="editable"
              ></v-checkbox>
            </div>
          </template>
          <span>By double click you can edit value fields</span>
        </v-tooltip>
        <v-checkbox
          class="ml-4 mt-5"
          v-model="strView"
          label="String View"
        ></v-checkbox>
        <v-spacer></v-spacer>
        <v-btn @click="safeCopy()">Safe Copy To Localstorage</v-btn>
      </v-toolbar>
    </div>
<!--    <div class="d-flex align-items-center">-->
<!--      <v-btn @click="copy">Copy</v-btn>-->
<!--   -->
<!--    </div>-->


    <div v-show="!strView">
      <vue-json-pretty
        v-model="jsonData"
        showIcon
        :showLine="false"
        showDoubleQuotes
        showKeyValueSpace
        collapsedOnClickBrackets
        setPathCollapsible
        :highlightSelectedNode="false"
        :itemHeight="25"
        :editable="editable"
        editableTrigger="dblclick"
        :deep="4"
        @change="save"/>
    </div>
    <div v-show="strView">
      <br>
      <pre>
         {{ JSON.stringify(jsonData, null, 5) }}
        </pre>
    </div>
    <v-snackbar
      v-model="copied"
    >
      Copied
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="copied = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jsonData: {},
      localKey: null,
      editable: false,
      copied: false,
      strView: false,
    }
  },
  watch: {
    '$route.query'(val) {
      this.initJson(val.type)
    },
    'jsonData'(val) {
      if(this.editable) this.save(val)
    },
    'strView'(val) {
      this.editable = false
    }
  },
  mounted() {
    const self = this;
    const query = self.$route.query
    self.initJson(query.type)
  },
  methods: {
    initJson(key = 'questJsom') {
      const self = this;
      self.localKey = key
      self.jsonData = self.$getJson(key)
    },
    save(json) {
      const self = this;
      self.jsonData = json
      localStorage.setItem(self.localKey, JSON.stringify(self.jsonData))
    },
    copy() {
      const self = this;
      const el = document.createElement('textarea');
      el.value = JSON.stringify(self.jsonData, null, 5);
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
      self.copied = true
    },
    safeCopy() {
      const self = this;
      localStorage.setItem('safeCopy_' + self.localKey, JSON.stringify(self.jsonData))
    }
  }
}
</script>

<style lang="scss">
.vjs-tree-node.is-highlight, .vjs-tree-node:hover {
  background: transparent !important;
}

.vjs-value input {
  color: white !important;
}

//pre {
//  //background: gray;
//  white-space: normal;
//}
//
//pre code {
//  white-space: pre;
//}
</style>
