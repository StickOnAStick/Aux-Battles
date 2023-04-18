migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  collection.createRule = ""
  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
