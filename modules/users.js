const localStorageKey = 'users'

const info = {
  title: 'Users'
}

const headers = [
  {
    text: 'Name',
    value: 'name',
    type: 'string',
    sortable: true,
  },
  {
    text: 'Text',
    value: 'surname',
    type: 'string',
    sortable: true,
  },
  {
    text: 'Age',
    value: 'age',
    type: 'string',
    sortable: true,
  },
  {
    text: 'Birthplace',
    value: 'birthplace',
    type: 'string',
    sortable: true,
  }
]

const form = [
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    required: true,
    useForSlug: true,
    onlyEnable: true,
  },
  {
    type: 'text',
    name: 'surname',
    label: 'Surname',
    required: true,
  },
  {
    type: 'number',
    name: 'age',
    label: 'Age',
    required: true,
  },
  {
    type: 'dropdown',
    name: 'birthplace',
    label: 'Birthplace',
    required: true,
    items: [
      {
        label: 'Germany',
        value: 'Germany',
      },
      {
        label: 'USA',
        value: 'USA',
      },
      {
        label: 'Turkey',
        value: 'Turkey',
      },
    ],
  },
]

export {localStorageKey, headers, form, info}


