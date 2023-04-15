<template>
  <div class="app-form">

    <div v-if="ready">
      <v-form
        ref="form"
        v-model="formValid"
        lazy-validation
        @submit.prevent="submit"
        @reset="reset">
        <v-card>
          <v-card-title>
            <span v-if="editMode">Update - {{ localKey }} <small>({{ editSlug }})</small></span>
            <span v-else>Create {{ localKey }}</span>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="slugInput"
              :rules="rules.required"
              :readonly="slugInputReadOnly"
              :disabled="slugInputReadOnly"
              label="Slug"
              required
            ></v-text-field>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs"
                       v-on="on"
                       icon
                       @click="!editMode ? slugInputReadOnly = !slugInputReadOnly : ''">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span v-if="editMode">Yu can edit only on create mode</span>
              <span v-else>You can edit the save slug</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <div v-for="(formItem, formItemIndex) in formData" :key="formItemIndex" v-if="formItem.show">
              <v-row>
                <v-col cols="2">
                  <div v-if="formItem.setEnable" class="d-inline-block">
                    <v-checkbox
                      v-model="formItem.enable"
                      :label="`Enable ${formItem.label}`"
                    ></v-checkbox>
                  </div>
                </v-col>
               <v-col cols="10">
                 <div :class="[!formItem.enable ? 'item-disable' : '']">
                   <div v-if="formItem.type === 'dropdown'">
                     <v-autocomplete
                       v-model="formItem.value"
                       :items="formItem.items"
                       :rules="rules.required"
                       :disabled="formItem.disabled"
                       item-value="value"
                       item-text="label"
                       outlined
                       :label="formItem.label"
                       @change="dropdownAction(formItem)"
                     ></v-autocomplete>
                   </div>
                   <div v-if="formItem.type === 'category'">
                     <v-autocomplete
                       v-model="formItem.value"
                       :items="formItem.items"
                       :rules="rules.required"
                       :disabled="formItem.disabled"
                       item-value="key"
                       item-text="text"
                       outlined
                       label="Category"
                     ></v-autocomplete>
                   </div>
                   <div v-if="formItem.type === 'text' || formItem.type === 'number'">
                     <v-text-field
                       v-model="formItem.value"
                       :type="formItem.type"
                       :disabled="formItem.disabled"
                       :rules="formItem.required || formItem.useForSlug ? rules.required : []"
                       :label="formItem.label"
                       outlined
                       @input="handleInput(formItem.value, formItem)"
                     ></v-text-field>
                   </div>
                   <div v-if="formItem.type === 'checkbox'">
                     <div class="custom-input-field">
                       <div>
                         <span>{{ formItem.label }}</span>
                       </div>
                       <v-switch
                         v-model="formItem.value"
                         :label="formItem.value ? 'Active' : 'Deactive'"
                       ></v-switch>
                     </div>
                   </div>
                   <div v-if="formItem.type === 'multiple-text'">
                     <div class="custom-input-field">
                       <div class="d-flex align-content-start my-3">
                         <span>{{ formItem.label }}</span>
                         <v-btn class="ml-auto" @click="addArrayItem(formItem)" icon outlined>
                           <v-icon>mdi-plus</v-icon>
                         </v-btn>
                       </div>
                       <div class="pl-5">
                         <div v-for="(item, index) in getArray(formItem.value)" :key="index">
                           <!--                      :rules="formItem.required || formItem.useForSlug ? rules.required : []"-->
                           <v-text-field
                             :value="item"
                             :rules="rules.required"
                             :label="`${formItem.label} Item`"
                             @input="changeInput($event, formItem.value, index)"
                             append-icon="mdi-delete"
                             @click:append="removeArrayItem(formItem, index)"
                           ></v-text-field>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-if="formItem.type === 'multiple-object'">
                     <div class="custom-input-field">
                       <div class="d-flex align-content-start my-3">
                         <span>{{ formItem.label }}</span>
                         <v-btn class="ml-auto" @click="addArrayObjectItem(formItem)" icon outlined>
                           <v-icon>mdi-plus</v-icon>
                         </v-btn>
                       </div>
                       <div class="pl-5">
                         <div v-for="(item, index) in getArray(formItem.value)" :key="index">
                           <!--                      :rules="formItem.required || formItem.useForSlug ? rules.required : []"-->
                           <v-row>
                             <v-col cols="5" v-for="(subItem, subItemIndex) in item" :key="subItemIndex">
                               <v-text-field
                                 v-model="item[subItemIndex]"
                                 :rules="rules.required"
                                 :label="`${subItemIndex}`"
                                 @input="changeArrayObjInput(formItem, subItemIndex, item)"
                                 :type="getArrayObjType(formItem, subItemIndex)"
                               ></v-text-field>
                             </v-col>
                             <v-col cols="2">
                               <v-btn @click="removeArrayItem(formItem, index)" icon><v-icon>mdi-delete</v-icon></v-btn>
                             </v-col>
                           </v-row>
                           <!--                      :value="subItem"-->
                           <!--                      @input="changeInput($event, formItem.value, index)"-->
                           <!--                      append-icon="mdi-delete"-->
                           <!--                      @click:append="removeArrayItem(formItem, index)"-->
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-if="formItem.type === 'object'">
                     <div class="custom-input-field">
                       <div class="d-flex align-content-start my-3">
                         <span>{{ formItem.label }}</span>
                         <v-spacer></v-spacer>
                         <v-btn v-if="formItem.addFromApi" class="ml-auto mr-5" @click="selectObjectItem(formItem)" icon
                                outlined>
                           <v-icon>mdi-import</v-icon>
                         </v-btn>
                         <v-btn class="ml-auto" @click="addObjectItem(formItem)" icon outlined>
                           <v-icon>mdi-plus</v-icon>
                         </v-btn>
                       </div>
                       <div class="pl-5">
                         <div v-for="(objectItem, objectItemIndex) in formItem.subItems" :key="objectItemIndex">
                           <v-text-field
                             v-model="formItem.value[objectItem.key]"
                             :type="objectItem.type !== undefined ? objectItem.type : 'text'"
                             :label="objectItem.text !== undefined ? objectItem.text : objectItem.key.toUpperCase()"
                             @input="handleObjectInput(formItem.value[objectItem.key], formItem, objectItem.key)"
                             append-icon="mdi-delete"
                             @click:append="removeObjectItem(formItem, objectItem.key, objectItemIndex)"
                           ></v-text-field>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </v-col>
              </v-row>

            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>

    </div>

  </div>
</template>

<script>

import {randomSlug, convertToSlug} from "@/utils/helpers";

export default {
  data() {
    return {
      hasCategory: false,
      editMode: false,
      editSlug: null,
      ready: false,
      formValid: false,
      formData: [],
      localKey: '',
      slugInput: '',
      slugInputReadOnly: true,
      rules: {
        required: [
          v => !!v || 'Field is required',
          // v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
      },
    }
  },
  methods: {
    initForm(localKey, formData, editSlug = null, category = null) {
      const self = this;

      self.editMode = editSlug !== null;
      self.localKey = localKey;
      self.formData = self.initOptions(JSON.parse(JSON.stringify(formData)));

      self.hasCategory = !!self.formData.find(x => x.type === 'category')

      if (editSlug !== null) {

        const current = category !== null ? self.$getJson(localKey)[category][editSlug] : self.$getJson(localKey)[editSlug];
        if (current !== undefined) {
          self.editSlug = editSlug
          self.setEditData(current, editSlug, category)
        }


      } else {
        self.editMode = false
      }

      if (!self.localKey) {
        console.error('set localStorageKey')
        self.$router.push('/')
      } else {
        self.ready = true
      }

    },
    initOptions(formData) {
      const self = this;
      formData.forEach(item => {
        if (item.type === 'object') {
          item.value = {}
          if (!self.editMode) {
            const filter = item.subItems !== undefined ? item.subItems.filter(x => x.default !== undefined) : []
            filter.forEach(subItem => {
              item.value[subItem.key] = subItem.default
            })
          }

          if (self.editMode && item.addDynamic) {
            setTimeout(() => {
              Object.keys(item.value).forEach(dynamicKey => {
                const dynamicItemVal = item.value[dynamicKey];
                if (!item.subItems.find(x => x.key === dynamicKey)) {
                  item.subItems.push({
                    key: dynamicKey,
                    type: typeof dynamicItemVal === 'number' ? 'number' : 'text',
                    text: dynamicKey.toUpperCase()
                  })
                }
              })
              self.$forceUpdate()
            })
          }
        }
        if (!self.editMode && (item.default !== undefined)) {
          item.value = item.default
        }

        if(item.show === undefined) item.show = true;
        if(!item.onlyEnable && item.setEnable === undefined) item.setEnable = true
        if(item.enable === undefined) item.enable = true

      })
      self.$forceUpdate()
      return formData
    },
    setEditData(obj, editSlug, category = null) {
      const self = this;
      self.formData.forEach(item => {
        if(obj[item.name]) {
          item.value = obj[item.name]
        }else {
          item.enable = false
        }

        if(item.type === 'dropdown') {
          self.dropdownAction(item)
        }

        if(item.useForSlug) {
          item.value = editSlug;
          item.disabled = true;
        }

        if(item.type === 'category' && category !== null) {
          item.value = category;
          item.disabled = true;
        }

      })
      self.slugInput = editSlug
      self.$forceUpdate()
    },
    async submit() {
      const self = this;

      let valid = this.$refs.form.validate();

      let slug = self.slugInput

      if (!valid) return

      if (!self.editMode && !self.hasCategory) {
        const {newSlug, isValid} = await self.checkSlug(self.localKey, slug, valid)
        valid = isValid
        if (newSlug !== null) slug = newSlug
      }

      valid = slug !== '';

      if (valid) {

        // const mapData = self.formData.filter(x => x.value !== undefined)
        const mapData = self.formData.filter(x => x.show).filter(x => x.value !== undefined).filter(x => !x.not_include).filter(x => x.enable)

        const obj = {}

        mapData.forEach(item => obj[item.name] = item.value)

        if (self.hasCategory) {
          let cat = JSON.parse(JSON.stringify(obj.category));
          delete obj.category

          if(!self.editMode) {
            const {newSlug, isValid} = await self.checkCat(self.localKey, slug, cat)
            valid = isValid
            if (newSlug !== null) slug = newSlug
          }
          if (valid) {
            self.$saveCatJson(self.localKey, cat, slug, obj)
          } else {
            return
          }

        } else {
          self.$saveJson(self.localKey, slug, obj)
        }


        setTimeout(() => {
          self.$swal({
            position: 'top-end',
            icon: 'success',
            title: `${self.localKey} - ${self.slugInput} - ${self.editMode ? 'Updated' : 'Added'} Successfully`,
            showConfirmButton: false,
            timer: 1500
          })
          self.$router.push(`/${self.localKey}`)
        }, 500)

      }

    },
    async checkCat(localKey, slug, category) {
      const self = this;
      const json = self.$getJson(localKey)
      const categoryObject = json[category]
      if (categoryObject) {
        if (categoryObject[slug] !== undefined) {
          const text = await self.$swal({
            input: 'text',
            inputLabel: 'This slug has been used on another one. Please update your slug',
            inputValue: slug,
            inputPlaceholder: 'Edit your slug here...',
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) return 'Please insert slug'
              const converted = convertToSlug(value)
              if (categoryObject[converted] !== undefined) return `${converted} -This Slug is used too`
            }
          })
          return {isValid: text.isConfirmed, newSlug: text.value}
        } else {
          return {isValid: true, newSlug: null}
        }
      } else {
        return {isValid: true, newSlug: null}
      }
    },
    async checkSlug(localKey, slug, defaultValid) {
      const self = this;
      const json = self.$getJson(localKey)
      if (json[slug] !== undefined && slug !== '') {
        const text = await self.$swal({
          input: 'text',
          inputLabel: 'This slug has been used on another one. Please update your slug',
          inputValue: slug,
          inputPlaceholder: 'Edit your slug here...',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) return 'Please insert slug'
            const converted = convertToSlug(value)
            if (json[converted] !== undefined) return `${converted} -This Slug is used too`
          }
        })
        return {isValid: text.isConfirmed, newSlug: text.value}
      } else {
        return {isValid: defaultValid, newSlug: null}
      }
    },
    changeArrayObjInput(formItem, subItemIndex, item) {
      const self = this;
      const type = self.getArrayObjType(formItem, subItemIndex)
      item[subItemIndex] = type === 'number' ? parseInt(item[subItemIndex]) : item[subItemIndex]
    },
    getArrayObjType(formItem, subItemIndex) {
      const findType = formItem.set.find(x => x.key === subItemIndex)
      return findType ? findType.type : 'text'
    },
    showAlert() {
      const self = this;
    },
    setSlug(data) {
      const item = data.find(x => x.useForSlug)
      if (item) {
        return convertToSlug(item.value)
      } else {
        return randomSlug(5)
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    handleObjectInput(val, formItem, objectKey) {
      const self = this;

      const objectItem = formItem.subItems.find(x => x.key === objectKey);
      if (!objectItem) return;

      if (objectItem.type === 'number' && val !== '') {
        formItem.value[objectKey] = parseInt(val)
      }
      self.$forceUpdate()
    },
    handleInput(val, formItem) {
      const self = this;
      if (formItem.useForSlug && !self.editMode) {
        self.slugInput = convertToSlug(val)
      }
      if (formItem.type === 'number' && val !== '') {
        formItem.value = parseInt(val)
      }
      self.$forceUpdate()
    },
    getArray(val) {
      return val !== undefined && (Array.isArray(val)) ? val : []
    },
    changeInput(val, formItemValue, index) {
      formItemValue[index] = val
      this.$forceUpdate()
    },
    addArrayItem(formItem) {
      const self = this;
      if (formItem.value !== undefined && Array.isArray(formItem.value)) {
        formItem.value.push('')
      } else {
        formItem.value = ['']
      }
      self.$forceUpdate()
    },
    addArrayObjectItem(formItem) {
      const self = this;
      const obj = {}
      formItem.set.forEach(val => {
        obj[val.key] = '';
      })

      if (formItem.value !== undefined && Array.isArray(formItem.value)) {
        formItem.value.push(obj)
      } else {
        formItem.value = [obj];
      }

      self.$forceUpdate()
    },
    async addObjectItem(formItem) {
      const self = this;
      const text = await self.$swal({
        input: 'text',
        inputLabel: 'Please insert key name for the object',
        inputValue: '',
        inputPlaceholder: 'Insert your key here...',
        showCancelButton: true,
        html:
          '<input type="radio" style="margin: 0 5px;" name="type" value="number" checked="checked">Number' +
          '<input type="radio" style="margin: 0 5px;" name="type" value="text">Text',
        inputValidator: (value) => {
          if (!value) return 'Please insert key'
          const converted = convertToSlug(value)
          if (formItem.subItems.find(x => x.key === converted)) return `${converted} -This Key is used too`
        }
      })
      if (text.isConfirmed) {
        formItem.subItems.push({
          key: text.value,
          type: document.querySelector('input[name="type"]:checked').value,
          text: text.value.toUpperCase()
        })
        self.$forceUpdate()
      }
    },
    async selectObjectItem(formItem) {
      const self = this;

      try {
        const getItems = self.$getJson(formItem.addFromApi.localKey);
        const useKeyForLabel = formItem.addFromApi.label !== undefined ? formItem.addFromApi.label : '';
        // const useKeyForValue = '' //TODO

        const options = {}

        Object.keys(getItems).forEach(x => {
          options[x] = useKeyForLabel !== '' ? getItems[x][useKeyForLabel] : x
        })

        const select = await self.$swal({
          title: 'Select ' + formItem.addFromApi.localKey,
          input: 'select',
          inputOptions: options,
          html:
            '<input type="radio" style="margin: 0 5px;" name="type" value="number" checked="checked">Number' +
            '<input type="radio" style="margin: 0 5px;" name="type" value="text">Text',
          inputPlaceholder: 'Select a item',
          showCancelButton: true,
          inputValidator: (value) => {
            if (value === '' || value === undefined) return 'Please select item';
          }
        })

        if (select.isConfirmed) {
          formItem.subItems.push({
            key: select.value,
            type: document.querySelector('input[name="type"]:checked').value,
            text: select.value.toUpperCase()
          })
          self.$forceUpdate()
        }

      } catch (e) {
        console.error('selectObjectItem error', e)
        return ''
      }
    },
    removeArrayItem(formItem, index) {
      const self = this;
      formItem.value.splice(index, 1)
      self.$forceUpdate()
    },
    removeObjectItem(formItem, key, keyIndex) {
      const self = this;
      formItem.subItems.splice(keyIndex, 1)
      delete formItem.value[key]
      self.$forceUpdate()
    },
    dropdownAction(formItem) {
      const self = this;
      const findSub = formItem.items.find(x => x.value === formItem.value)
      if(findSub && (findSub.action !== undefined)) {
        findSub.action.forEach(action => {
          if(action['showFormElements'] !== undefined) self.showFormElements(action['showFormElements'])
        })
      }
    },
    showFormElements(array) {
      const self = this;
      self.formData.forEach(item => {
        item.show = array.includes(item.name) || array.includes('all');
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-input-field {
  border-radius: 4px;
  padding: 0 12px;
  //padding-left: 8px;
  border-collapse: collapse;
  border-color: rgba(255, 255, 255, 0.24);
  border-style: solid;
  border-width: 1px;
  margin-bottom: 27px;
  transition-duration: 0.15s;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    border-color: currentColor;
  }
}
</style>

<style lang="scss">
.item-disable {
  pointer-events: none !important;
   .v-input__slot, .custom-input-field {
    pointer-events: none !important;
    position: relative !important;
     background-color: #80808069 !important;
    //&:after {
      //content: '' !important;
      //position: absolute !important;
      //inset: 0 !important;
      //background-color: #80808069 !important;
    //}
  }
  .custom-input-field {
    .v-input__slot {
      background-color: transparent !important;
    }
  }
}
</style>
