migrate((db) => {
  const collection = new Collection({
    "id": "874fxt9w4552usx",
    "created": "2023-03-16 05:50:13.875Z",
    "updated": "2023-03-16 05:50:13.875Z",
    "name": "spotBots",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jv6pldll",
        "name": "endPoint",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": "^\\w+$"
        }
      },
      {
        "system": false,
        "id": "nazeysxd",
        "name": "active",
        "type": "bool",
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
  const collection = dao.findCollectionByNameOrId("874fxt9w4552usx");

  return dao.deleteCollection(collection);
})
