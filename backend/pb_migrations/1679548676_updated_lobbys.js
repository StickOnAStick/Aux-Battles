migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // remove
  collection.schema.removeField("op2j7y0u")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "screpunk",
    "name": "packs",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "maplmwed82yw6c1",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 20,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "op2j7y0u",
    "name": "packs",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("screpunk")

  return dao.saveCollection(collection)
})
