migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xafu95te",
    "name": "pack",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "maplmwed82yw6c1",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xafu95te",
    "name": "pack",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "maplmwed82yw6c1",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 1,
      "displayFields": [
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
