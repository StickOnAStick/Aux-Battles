migrate((db) => {
  const collection = new Collection({
    "id": "maplmwed82yw6c1",
    "created": "2023-03-16 05:41:35.994Z",
    "updated": "2023-03-16 05:41:35.994Z",
    "name": "packs",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
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
      },
      {
        "system": false,
        "id": "mcejx8hn",
        "name": "price",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": 0.99,
          "max": 24.99
        }
      },
      {
        "system": false,
        "id": "uuz2siic",
        "name": "rating",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 5
        }
      },
      {
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
      },
      {
        "system": false,
        "id": "p7pvf4jq",
        "name": "packData",
        "type": "json",
        "required": true,
        "unique": true,
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
  const collection = dao.findCollectionByNameOrId("maplmwed82yw6c1");

  return dao.deleteCollection(collection);
})
