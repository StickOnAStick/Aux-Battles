migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uz48bre8pclxacb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "prypvyzb",
    "name": "token",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uz48bre8pclxacb")

  // remove
  collection.schema.removeField("prypvyzb")

  return dao.saveCollection(collection)
})
