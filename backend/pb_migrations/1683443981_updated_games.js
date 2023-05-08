migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // remove
  collection.schema.removeField("ymbqzauu")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ymbqzauu",
    "name": "spotApiKey",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "pattern": "^\\w+$"
    }
  }))

  return dao.saveCollection(collection)
})
