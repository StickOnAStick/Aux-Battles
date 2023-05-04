migrate((db) => {
  const collection = new Collection({
    "id": "ycipksrczi2rk73",
    "created": "2023-05-04 03:21:59.065Z",
    "updated": "2023-05-04 03:21:59.065Z",
    "name": "usersOrGuests",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "iuz9vgvf",
        "name": "user",
        "type": "relation",
        "required": false,
        "unique": true,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "0aliwzjp",
        "name": "guest",
        "type": "relation",
        "required": false,
        "unique": true,
        "options": {
          "collectionId": "uz48bre8pclxacb",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
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
  const collection = dao.findCollectionByNameOrId("ycipksrczi2rk73");

  return dao.deleteCollection(collection);
})
