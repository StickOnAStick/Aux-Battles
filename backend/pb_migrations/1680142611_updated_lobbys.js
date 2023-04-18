migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // remove
  collection.schema.removeField("q0kydcto")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ixj3atlu",
    "name": "host",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 0,
      "max": 50,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q0kydcto",
    "name": "host",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "username"
      ]
    }
  }))

  // remove
  collection.schema.removeField("ixj3atlu")

  return dao.saveCollection(collection)
})
