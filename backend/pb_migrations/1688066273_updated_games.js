migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4kht3r2w",
    "name": "host",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "uz48bre8pclxacb",
      "cascadeDelete": false,
      "minSelect": null,
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
    "id": "4kht3r2w",
    "name": "host",
    "type": "relation",
    "required": true,
    "unique": true,
    "options": {
      "collectionId": "uz48bre8pclxacb",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
