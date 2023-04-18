migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
