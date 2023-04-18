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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lxs9vytn",
    "name": "reviews",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "u13yz13uttp5zaa",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "messages",
        "users"
      ]
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
      "pattern": "^\\w+$"
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
      "pattern": "^\\w+$"
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lxs9vytn",
    "name": "reviews",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "u13yz13uttp5zaa",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "messages",
        "users"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
