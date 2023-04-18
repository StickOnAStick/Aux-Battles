migrate((db) => {
  const collection = new Collection({
    "id": "1dt8x2g2a2qg6oo",
    "created": "2023-03-16 05:14:05.489Z",
    "updated": "2023-03-16 05:14:05.489Z",
    "name": "lobbys",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "opocsakf",
        "name": "players",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "boc5hmpz",
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
        "id": "gyoz0s19",
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
      },
      {
        "system": false,
        "id": "whn4tcn9",
        "name": "pass",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": "^\\w+$"
        }
      },
      {
        "system": false,
        "id": "op2j7y0u",
        "name": "packs",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("1dt8x2g2a2qg6oo");

  return dao.deleteCollection(collection);
})
