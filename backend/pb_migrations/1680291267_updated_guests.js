migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uz48bre8pclxacb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fi7uvfta",
    "name": "currentLobby",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "1dt8x2g2a2qg6oo",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "trxcsu7p",
    "name": "currentGame",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "7543pk08zyvn9ks",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uz48bre8pclxacb")

  // remove
  collection.schema.removeField("fi7uvfta")

  // remove
  collection.schema.removeField("trxcsu7p")

  return dao.saveCollection(collection)
})
