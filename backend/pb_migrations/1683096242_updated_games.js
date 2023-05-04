migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // add
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yud3bz1c",
    "name": "activeGuests",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "uz48bre8pclxacb",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 2,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // remove
  collection.schema.removeField("4kht3r2w")

  // remove
  collection.schema.removeField("yud3bz1c")

  return dao.saveCollection(collection)
})
