migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // remove
  collection.schema.removeField("boc5hmpz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ukczhrvs",
    "name": "gameType",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "boc5hmpz",
    "name": "type",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Local",
        "Online"
      ]
    }
  }))

  // remove
  collection.schema.removeField("ukczhrvs")

  return dao.saveCollection(collection)
})
