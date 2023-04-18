migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("if4e5cck0rgob3b")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qlzpjghi",
    "name": "winner",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "avatar"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("if4e5cck0rgob3b")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qlzpjghi",
    "name": "winner",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "name",
        "avatar"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
