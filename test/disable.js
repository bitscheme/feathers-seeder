import assert from 'assert';
import feathers from '@feathersjs/feathers';
import memory from 'feathers-memory';
import seeder from '../lib';

describe('disable', function() {
  it('can be globally disabled', function(done) {
    const app = feathers().use('/dummy', memory({ multi: true }));
    const config =
    {
      disabled: true,
      services:
      [
        {
          count: 1337,
          path: 'dummy',
          template: { hello: 'world' }
        }
      ]
    };

    app.configure(seeder(config)).seed().then(function() {
      app.service('dummy').find().then(function(items) {
        assert.equal(items.length, 0);
        done();
      }).catch(done);
    }).catch(done);
  });

  it('can be disabled on an individual basis', function(done) {
    // /a will be disabled, while /b is enabled.
    const app = feathers()
      .use('/a', memory({ multi: true }))
      .use('/b', memory({ multi: true }));
    const config = {
      services:
      [
        {
          count: 700, // disabled should preside even if count is specified
          disabled: true,
          path: 'a',
          template: { 'this should' : 'not be seeded' }
        },
        {
          count: 10,
          path: 'b',
          template: { Barack: 'Obama' }
        }
      ]
    };

    app.configure(seeder(config)).seed().then(function() {
      app.service('a').find().then(function(items) {
        assert.equal(items.length, 0);
        done();
      }).catch(done);
    }).catch(done);
  });
});
