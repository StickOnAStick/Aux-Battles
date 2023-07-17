migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("maplmwed82yw6c1")

  collection.updateRule = null
  collection.deleteRule = null

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "goudvte5",
    "name": "creator",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("maplmwed82yw6c1")

  collection.updateRule = ""
  collection.deleteRule = ""

  // remove
  collection.schema.removeField("goudvte5")

  return dao.saveCollection(collection)
})
