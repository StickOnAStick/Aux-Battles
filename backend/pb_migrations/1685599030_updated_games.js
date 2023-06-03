migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // remove
  collection.schema.removeField("yud3bz1c")

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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

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
      "max": 25
    }
  }))

  return dao.saveCollection(collection)
})
