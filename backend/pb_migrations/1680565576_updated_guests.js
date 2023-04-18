migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uz48bre8pclxacb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cm2axkif",
    "name": "username",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 20,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uz48bre8pclxacb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cm2axkif",
    "name": "userName",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 20,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
