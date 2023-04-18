migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "73viaukj",
    "name": "games",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 99999
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6svaonny",
    "name": "won",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 99999
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ootghori",
    "name": "packs",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wbu2y5bk",
    "name": "spotifyId",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^\\w+$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nz9bvfha",
    "name": "topGenre",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^\\w+$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kqg8qu7k",
    "name": "topArtist",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^\\w+$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fkhcgypv",
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
    "id": "nn7veima",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "users_name",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("73viaukj")

  // remove
  collection.schema.removeField("6svaonny")

  // remove
  collection.schema.removeField("ootghori")

  // remove
  collection.schema.removeField("wbu2y5bk")

  // remove
  collection.schema.removeField("nz9bvfha")

  // remove
  collection.schema.removeField("kqg8qu7k")

  // remove
  collection.schema.removeField("fkhcgypv")

  // remove
  collection.schema.removeField("nn7veima")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "users_name",
    "name": "name",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
