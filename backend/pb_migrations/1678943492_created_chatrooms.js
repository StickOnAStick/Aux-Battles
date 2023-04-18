migrate((db) => {
  const collection = new Collection({
    "id": "u13yz13uttp5zaa",
    "created": "2023-03-16 05:11:32.904Z",
    "updated": "2023-03-16 05:11:32.904Z",
    "name": "chatrooms",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "5scrgxrj",
        "name": "users",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "vvpyhsti",
        "name": "messages",
        "type": "json",
        "required": false,
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
  const collection = dao.findCollectionByNameOrId("u13yz13uttp5zaa");

  return dao.deleteCollection(collection);
})
