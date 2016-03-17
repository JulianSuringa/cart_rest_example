# Cart REST API example

Example implementation of a REST API. Built with node.js, Express, SQLite, and Sequelize.

## Installation
```bash
# make sure sqlite3 is installed on your system
# On Mac OS X (homebrew):
$ brew install sqlite3
# On Ubuntu/Debian
$ sudo apt-get install sqlite3

# Clone the repo and install dependencies
$ git clone https://github.com/alexpls/cart_rest_example
$ cd cart_rest_example
$ npm install
```

## API Endpoints
This is a RESTful API which exposes basic CRUD methods. All communication
with the server (requests and responses) must be in JSON.
```
Shopping Carts

GET     /shopping_carts                              Get a list of all shopping carts
POST    /shopping_carts                              Create a new shopping cart
GET     /shopping_carts/[cart_id]                    Get a specific shopping cart
PUT     /shopping_carts/[cart_id]                    Update a shopping cart
DELETE  /shopping_carts/[cart_id]                    Delete a shopping cart


Shopping Cart Items

GET     /shopping_carts/[cart_id]/items              Get a list of all shopping cart items
POST    /shopping_carts/[cart_id]/items              Create a new shopping cart item
GET     /shopping_carts/[cart_id]/items/[item_id]    Get a specific shopping cart item
PUT     /shopping_carts/[cart_id]/items/[item_id]    Update a shopping cart item
DELETE  /shopping_carts/[cart_id]/items/[item_id]    Delete a shopping cart item
```

## Usage
Starting the server:
```bash
# To start the server make sure you're in the 'cart_rest_example'
# root directory and run:
$ bin/www

# You may specify a custom port as an environment variable:
$ PORT=8080 bin/www
```

Once your server is running you can start making requests to it:

**Create your first cart**
```bash
$ curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "my first cart"}' \
  http://localhost:3000/shopping_carts
```

```json
{
    "createdAt": "2016-03-17T10:27:12.983Z",
    "id": 1,
    "name": "my first cart",
    "updatedAt": "2016-03-17T10:27:12.983Z"
}
```

**Create an item in your new cart**
```bash
$ curl -X POST -H "Content-Type: application/json" \
  -d '{"description": "an item"}' \
  http://localhost:3000/shopping_carts/1/items
```

```json
{
    "ShoppingCartId": 1,
    "createdAt": "2016-03-17T10:28:06.524Z",
    "id": 1,
    "description": "an item",
    "updatedAt": "2016-03-17T10:28:06.524Z"
}
```

**Change the description of your new item**
```bash
$ curl -X PUT -H "Content-Type: application/json" \
  -d '{"description": "new description"}' \
  http://localhost:3000/shopping_carts/1/items/1
```

```json
{
    "ShoppingCartId": 1,
    "createdAt": "2016-03-17T10:28:06.524Z",
    "id": 1,
    "description": "new description",
    "updatedAt": "2016-03-17T10:28:26.053Z"
}
```

**Create another item in your cart**
```bash
$ curl -X POST -H "Content-Type: application/json" \
  -d '{"description": "second item"}' \
  http://localhost:3000/shopping_carts/1/items
```

```json
{
    "ShoppingCartId": 1,
    "createdAt": "2016-03-17T10:28:59.249Z",
    "id": 3,
    "description": "second item",
    "updatedAt": "2016-03-17T10:28:59.249Z"
}
```

**Get a list of all carts, including their items**
```bash
$ curl http://localhost:3000/shopping_carts?include_items=1
```

```json
[
    {
        "ShoppingCartItems": [
            {
                "ShoppingCartId": 1,
                "createdAt": "2016-03-17T10:28:06.524Z",
                "id": 1,
                "description": "new description",
                "updatedAt": "2016-03-17T10:28:26.053Z"
            },
            {
                "ShoppingCartId": 1,
                "createdAt": "2016-03-17T10:28:44.680Z",
                "id": 2,
                "description": "second item",
                "updatedAt": "2016-03-17T10:28:44.680Z"
            },
            {
                "ShoppingCartId": 1,
                "createdAt": "2016-03-17T10:28:59.249Z",
                "id": 3,
                "description": "second item",
                "updatedAt": "2016-03-17T10:28:59.249Z"
            }
        ],
        "createdAt": "2016-03-17T10:27:12.983Z",
        "id": 1,
        "name": "my first cart",
        "updatedAt": "2016-03-17T10:27:12.983Z"
    }
]
```

## Running the test suite
```bash
# Make sure you're in the cart_rest_example root directory and run:
$ npm install --dev
$ npm install -g mocha
$ mocha
```

```
shopping cart items routes
  GET /shopping_carts/:id/items

      ✓ returns a list of cart items (43ms)
  GET /shopping_carts/:cart_id/items/:item_id

      ✓ returns JSON for the given item
  POST /shopping_carts/:id/items

      ✓ creates a new item for the given cart
  DELETE /shopping_carts/:cart_id/items/:item_id

      ✓ deletes the given item
  PUT /shopping_carts/:cart_id/items/:item_id

      ✓ updates the given cart item

shopping cart routes
  GET /shopping_carts

      ✓ returns a JSON array of shopping carts
  GET /shopping_carts/:id

      ✓ returns JSON for a specific cart

      ✓ returns 404 for a non-existing cart
  POST /shopping_carts

      ✓ creates a new cart with the given name
  PUT /shopping_carts/:id

      ✓ updates a cart

      ✓ does not update the cart's id
  DELETE /shopping_carts/:id

      ✓ deletes the shopping cart with the given id


12 passing (438ms)
```
