migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ppuaxujp",
    "name": "chatroom",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "u13yz13uttp5zaa",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ymbqzauu",
    "name": "spotApiKey",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "pattern": "^\\w+$"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ppuaxujp",
    "name": "chatroom",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "u13yz13uttp5zaa",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ymbqzauu",
    "name": "spotBotID",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^\\w+$"
    }
  }))

  return dao.saveCollection(collection)
})
