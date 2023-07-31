migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("maplmwed82yw6c1")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rk4nhgpz",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 40,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tttekmki",
    "name": "desc",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 140,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("maplmwed82yw6c1")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rk4nhgpz",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 30,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tttekmki",
    "name": "desc",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 300,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
