migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("maplmwed82yw6c1")

  collection.updateRule = "id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("maplmwed82yw6c1")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
