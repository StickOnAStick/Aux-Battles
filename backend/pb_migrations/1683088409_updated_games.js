migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x8tqrofz",
    "name": "host",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": 14,
      "max": 16,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x8tqrofz",
    "name": "host",
    "type": "text",
    "required": false,
    "unique": true,
    "options": {
      "min": 14,
      "max": 16,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
