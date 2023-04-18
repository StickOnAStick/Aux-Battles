migrate((db) => {
  const collection = new Collection({
    "id": "7543pk08zyvn9ks",
    "created": "2023-03-16 05:45:21.844Z",
    "updated": "2023-03-16 05:45:21.844Z",
    "name": "games",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "da8hholi",
        "name": "players",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "oizux278",
        "name": "type",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Local",
            "Online"
          ]
        }
      },
      {
        "system": false,
        "id": "xafu95te",
        "name": "pack",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "maplmwed82yw6c1",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [
            "id"
          ]
        }
      },
      {
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
      },
      {
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
      },
      {
        "system": false,
        "id": "dm4mbxly",
        "name": "round",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": 25
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7543pk08zyvn9ks");

  return dao.deleteCollection(collection);
})
