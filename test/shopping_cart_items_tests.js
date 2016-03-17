describe('shopping cart items routes', function() {

  var ShoppingCartItem;

  var cart;
  var item;

  before(function() {
    ShoppingCartItem = models.ShoppingCartItem;
  });

  beforeEach(function(done) {
    models.ShoppingCart.create({
      name: 'my cart',
      ShoppingCartItems: [
        { name: 'my item' },
        { name: 'another item' }
      ]
    }, {
      include: [ ShoppingCartItem ]
    }).then(function(newCart) {
      cart = newCart;
      return newCart.getShoppingCartItems();
    }).then(function(items) {
      item = items[0];
      done();
    });
  });

  describe('GET /shopping_carts/:id/items', function() {
    it('returns a list of cart items', function(done) {
      request(server)
        .get('/shopping_carts/' + cart.id + '/items')
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body.length).to.be(2);
          expect(res.body[0].name).to.be('my item');
          expect(res.body[1].name).to.be('another item');
          done();
        });
    });
  });

  describe('GET /shopping_carts/:cart_id/items/:item_id', function() {
    it('returns JSON for the given item', function(done) {
      request(server)
        .get('/shopping_carts/' + cart.id + '/items/' + item.id)
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body.name).to.be(item.name);
          expect(res.body.id).to.be(item.id);
          done();
        });
    });
  });

  describe('POST /shopping_carts/:id/items', function() {
    it('creates a new item for the given cart', function(done) {
      request(server)
        .post('/shopping_carts/' + cart.id + '/items')
        .send({name: 'test item'})
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body.name).to.be('test item');
          cart.getShoppingCartItems().then(function(items) {
            expect(items.length).to.be(3);
            done();
          });
        });
    });
  });

  describe('DELETE /shopping_carts/:cart_id/items/:item_id', function() {
    it('deletes the given item', function(done) {
      request(server)
        .delete('/shopping_carts/' + cart.id + '/items/' + item.id)
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          cart.getShoppingCartItems().then(function(items) {
            expect(items.length).to.be(1);
            done();
          });
        });
    });
  });

  describe('PUT /shopping_carts/:cart_id/items/:item_id', function() {
    it('updates the given cart item', function(done) {
      request(server)
        .put('/shopping_carts/' + cart.id + '/items/' + item.id)
        .send({name: 'my new name'})
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body.name).to.be('my new name');
          item.reload().then(function(reloadedItem) {
            expect(reloadedItem.name).to.be('my new name');
            done();
          });
        });
    });
  });

});
