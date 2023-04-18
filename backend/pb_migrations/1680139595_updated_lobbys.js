migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jud5e3ov",
    "name": "guests",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "uz48bre8pclxacb",
      "cascadeDelete": true,
      "minSelect": 1,
      "maxSelect": 20,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jud5e3ov",
    "name": "guests",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "uz48bre8pclxacb",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 20,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
