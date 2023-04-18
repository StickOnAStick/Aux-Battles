migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // add
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "43oxbb34",
    "name": "players",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 20,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo")

  // remove
  collection.schema.removeField("jud5e3ov")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "43oxbb34",
    "name": "players",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 20,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
