migrate((db) => {
  const collection = new Collection({
    "id": "if4e5cck0rgob3b",
    "created": "2023-03-16 05:49:33.483Z",
    "updated": "2023-03-16 05:49:33.483Z",
    "name": "gameResults",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mztdly0y",
        "name": "game",
        "type": "relation",
        "required": true,
        "unique": true,
        "options": {
          "collectionId": "7543pk08zyvn9ks",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "id"
          ]
        }
      },
      {
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
      },
      {
        "system": false,
        "id": "llvhz0sc",
        "name": "players",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 25,
          "displayFields": [
            "id",
            "username",
            "avatar"
          ]
        }
      },
      {
        "system": false,
        "id": "xrsxjo2u",
        "name": "roundResults",
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
  const collection = dao.findCollectionByNameOrId("if4e5cck0rgob3b");

  return dao.deleteCollection(collection);
})
