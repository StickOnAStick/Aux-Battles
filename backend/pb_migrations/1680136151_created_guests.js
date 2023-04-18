migrate((db) => {
  const collection = new Collection({
    "id": "uz48bre8pclxacb",
    "created": "2023-03-30 00:29:11.292Z",
    "updated": "2023-03-30 00:29:11.292Z",
    "name": "guests",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cm2axkif",
        "name": "userName",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": 20,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("uz48bre8pclxacb");

  return dao.deleteCollection(collection);
})
