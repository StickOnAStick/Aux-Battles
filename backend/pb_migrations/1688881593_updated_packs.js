migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("maplmwed82yw6c1")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_unique_p7pvf4jq` ON `packs` (`packData`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p7pvf4jq",
    "name": "packData",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "goudvte5",
    "name": "creator",
    "type": "relation",
    "required": false,
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

  collection.indexes = [
    "CREATE UNIQUE INDEX \"idx_unique_p7pvf4jq\" on \"packs\" (\"packData\")"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p7pvf4jq",
    "name": "packData",
    "type": "json",
    "required": true,
    "unique": true,
    "options": {}
  }))

  // update
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
})
