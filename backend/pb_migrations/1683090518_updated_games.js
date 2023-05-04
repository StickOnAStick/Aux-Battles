migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // remove
  collection.schema.removeField("lb5bcxib")

  // remove
  collection.schema.removeField("r486qttl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lbxbvncz",
    "name": "activePlayers",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lb5bcxib",
    "name": "activePlayers",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 2,
      "displayFields": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r486qttl",
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

  // remove
  collection.schema.removeField("lbxbvncz")

  return dao.saveCollection(collection)
})
