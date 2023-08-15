migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  collection.updateRule = "host.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
