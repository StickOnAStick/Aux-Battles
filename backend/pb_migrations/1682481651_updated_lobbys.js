migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "whn4tcn9",
    "name": "pass",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^\\w+$-"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "whn4tcn9",
    "name": "pass",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^\\w+$"
    }
  }))

  return dao.saveCollection(collection)
})
