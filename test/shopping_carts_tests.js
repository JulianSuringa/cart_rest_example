describe('shopping cart routes', function() {
  var cart;
  var ShoppingCart;

  beforeEach(function(done) {
    ShoppingCart = models.ShoppingCart;

    ShoppingCart.destroy({truncate: true}).then(function() {
      ShoppingCart.create({
        name: 'test cart'
      }).then(function(newCart) {
        cart = newCart;
        done();
      });
    });
  });

  describe('GET /shopping_carts', function() {
    it('returns a JSON array of shopping carts', function(done) {
      ShoppingCart.create({
        name: 'another test cart'
      }).then(function() {
        request(server)
          .get('/shopping_carts')
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.be(2);
            done();
          });
      });
    });
  });

  describe('GET /shopping_carts/:id', function() {
    it('returns JSON for a specific cart', function(done) {
      request(server)
        .get('/shopping_carts/' + cart.id)
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body.id).to.be(cart.id);
          expect(res.body.name).to.be(cart.name);
          done();
        });
    });

    it('returns 404 for a non-existing cart', function(done) {
      request(server)
        .get('/shopping_carts/2398482634')
        .expect(404)
        .end(function(err, res) {
          expect(res.status).to.be(404);
          done();
        });
    });
  })

  describe('POST /shopping_carts', function() {
    it('creates a new cart with the given name', function(done) {
      ShoppingCart.count().then(function(beforeCount) {
        request(server)
          .post('/shopping_carts')
          .send({ name: 'posted cart' })
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.name).to.be('posted cart');
            ShoppingCart.count().then(function(afterCount) {
              expect(afterCount).to.be(beforeCount+1);
              done();
            });
          });
      });
    });
  });

  describe('PUT /shopping_carts/:id', function() {
    it('updates a cart', function(done) {
      request(server)
        .put('/shopping_carts/' + cart.id)
        .send({ name: 'a new name' })
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body.name).to.be('a new name');

          // make sure the update has persisted to the db
          ShoppingCart.findById(cart.id).then(function(updatedCart) {
            expect(updatedCart.name).to.be('a new name');
            done();
          });
        });
    });

    it('does not update the cart\'s id', function(done) {
      request(server)
        .put('/shopping_carts/' + cart.id)
        .send({ id: 736 })
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          ShoppingCart.findById(cart.id).then(function(notUpdatedCart) {
            if (notUpdatedCart) { done(); }
          });
        });
    });
  });

  describe('DELETE /shopping_carts/:id', function() {
    it('deletes the shopping cart with the given id', function(done) {
      ShoppingCart.count().then(function(beforeCount) {
        request(server)
          .delete('/shopping_carts/' + cart.id)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            ShoppingCart.count().then(function(afterCount) {
              expect(afterCount).to.be(beforeCount-1);
              done();
            });
          });
      });
    });
  });
});
