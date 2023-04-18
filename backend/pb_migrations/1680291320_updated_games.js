migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // remove
  collection.schema.removeField("da8hholi")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wdkgvpdv",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "en6nq0yj",
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
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "da8hholi",
    "name": "players",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("wdkgvpdv")

  // remove
  collection.schema.removeField("en6nq0yj")

  return dao.saveCollection(collection)
})
