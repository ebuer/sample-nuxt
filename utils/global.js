export default ({app, store}, inject) => {


  const getQuestJson = () => {
    const getJson = localStorage.getItem('questJson');
    return getJson ? JSON.parse(getJson) : {}
  }

  const createQuest = (slug, item) => {

    const json = getQuestJson();

    json[slug] = item

    localStorage.setItem('questJson', JSON.stringify(json))
  }

  const editQuest = (slug, item) => {

    const json = getQuestJson();

    json[slug] = item

    localStorage.setItem('questJson', JSON.stringify(json))

  }

  const removeQuest = (slug) => {
    const json = getQuestJson();
    delete json[slug];
    localStorage.setItem('questJson', JSON.stringify(json))
  }


  const getJson = (localKey) => {
    const getJson = localStorage.getItem(localKey);
    return getJson ? JSON.parse(getJson) : {}
  }

  const getDataArray = (localKey) => {
    const json = getJson(localKey);
    const toArray = Object.keys(json);
    const finalArray = [];
    if (toArray.length > 0) {
      toArray.forEach(itemKey => {
        const item = json[itemKey];
        item.idSlug = itemKey;
        finalArray.push(item)
      })
    }

    return finalArray
  }

  const getCatDataArray = (localKey, categories) => {

    const finalArray = [];

    const json = getJson(localKey);
    categories.forEach(cat => {
      const catJson = json[cat.key];
      if (catJson !== undefined) {
        const arr = Object.keys(json[cat.key])
        arr.forEach(itemKey => {
          const item = catJson[itemKey];
          item.idSlug = itemKey;
          item.categorySlug = cat.key
          item.category = cat.text
          finalArray.push(item)
        })
      }
    })

    return finalArray
  }

  const removeItem = (localKey, slug) => {
    const json = getJson(localKey);
    delete json[slug];
    localStorage.setItem(localKey, JSON.stringify(json))
  }

  const removeCatItem = (localKey, cat, slug) => {
    const json = getJson(localKey);
    delete json[cat][slug];
    localStorage.setItem(localKey, JSON.stringify(json))
  }

  const saveJson = (localKey, itemSlug, data) => {
    const json = getJson(localKey);
    json[itemSlug] = data
    localStorage.setItem(localKey, JSON.stringify(json))
  }

  const saveCatJson = (localKey, catSlug, itemSlug, data) => {
    const json = getJson(localKey);
    if (json[catSlug] === undefined) json[catSlug] = {}
    json[catSlug][itemSlug] = data
    localStorage.setItem(localKey, JSON.stringify(json))
  }


  inject('getQuestJson', getQuestJson)
  inject('createQuest', createQuest)
  inject('editQuest', editQuest)
  inject('removeQuest', removeQuest)
  inject('getJson', getJson)
  inject('getDataArray', getDataArray)
  inject('getCatDataArray', getCatDataArray)
  inject('removeItem', removeItem)
  inject('removeCatItem', removeCatItem)
  inject('saveJson', saveJson)
  inject('saveCatJson', saveCatJson)
}
