migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dm4mbxly",
    "name": "round",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 15
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dm4mbxly",
    "name": "round",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 15
    }
  }))

  return dao.saveCollection(collection)
})
