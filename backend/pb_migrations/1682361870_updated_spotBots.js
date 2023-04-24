migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("874fxt9w4552usx")

  // remove
  collection.schema.removeField("nazeysxd")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rxevsgky",
    "name": "activeGames",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 50
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pcc17a8e",
    "name": "key",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": 1,
      "max": 100,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("874fxt9w4552usx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nazeysxd",
    "name": "active",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("rxevsgky")

  // remove
  collection.schema.removeField("pcc17a8e")

  return dao.saveCollection(collection)
})
