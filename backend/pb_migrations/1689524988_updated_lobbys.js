migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "liawvh6o",
    "name": "gameStart",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // remove
  collection.schema.removeField("liawvh6o")

  return dao.saveCollection(collection)
})
