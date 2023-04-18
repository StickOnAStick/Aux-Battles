migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  collection.createRule = "@request.data.players.id ~ @collection.users.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  collection.createRule = null

  return dao.saveCollection(collection)
})
