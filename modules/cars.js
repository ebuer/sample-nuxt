const localStorageKey = 'cars'

const info = {
  title: 'Cars'
}

const headers = [
  {
    text: 'Car Brand',
    value: 'carbrand',
    type: 'string',
    sortable: true,
  },
  {
    text: 'Model Year',
    value: 'additionalinfo.modelyear',
    type: 'string',
    sortable: true,
  },
  {
    text: 'Engine type',
    value: 'additionalinfo.enginetype',
    type: 'string',
    sortable: true,
  },
  {
    text: 'Fuel type',
    value: 'additionalinfo.fueltype',
    type: 'string',
    sortable: true,
  },
  {
    text: 'Vehicle color',
    value: 'additionalinfo.vehiclecolor',
    type: 'string',
    sortable: true,
  },
]

const form = [
  {
    type: 'text',
    name: 'slug',
    label: 'Slug',
    required: true,
    useForSlug: true,
    onlyEnable: true,
  },
  {
    type: 'dropdown',
    name: 'carbrand',
    label: 'Car brand',
    required: true,
    items: [
      {
        label: 'Mercedes',
        value: 'Mercedes',
      },
      {
        label: 'BMW',
        value: 'BMW',
      },
      {
        label: 'Volkswagen',
        value: 'Volkswagen',
      },
    ],
  },
  {
    type: 'object',
    name: 'additionalinfo',
    label: 'Additional Info',
    required: false,
    subItems: [
      {
        key: 'modelyear',
        text: 'Model Year',
        type: 'number',
        default: 0
      },
      {
        key: 'enginetype',
        text: 'Engine type',
        type: 'text',
      },
      {
        key: 'fueltype',
        text: 'Fuel type',
        type: 'text',
      },
      {
        key: 'vehiclecolor',
        text: 'Vehicle color',
        type: 'text',
      },
    ],
  },
]

export {localStorageKey, headers, form, info}


