import assert from 'assert';
import feathers from '@feathersjs/feathers';
import memory from 'feathers-memory';
import seeder from '../lib';

describe('feathers-seeder', () => {
  describe('basic', () => {
    it('can seed a basic in-memory service', done => {
      const SINGLE = {
        path: 'single',
        template: {
          name: '{{name.firstName}} {{name.lastName}}',
          profileMedium: `{{internet.avatar}}`,
          password: '{{internet.password}}'
        }
      };
      const MULTIPLE = {
        path: 'multiple',
        count: 24,
        template: {
          username: '{{internet.userName}}'
        }
      };
      const RANDOM = {
        path: 'random',
        count: 10,
        templates: [{
          username: '{{internet.userName}}'
        }, {
          password: '{{internet.password}}'
        }]
      };
      const ALL = {
        path: 'all',
        randomize: false,
        templates: [{
          username: '{{internet.userName}}',
          age: 34,
          updatedAt: new Date(),
          active: true,
          location: {
            lat: 45.3455656,
            lng: -45.2656565
          }
        }, {
          username: '{{internet.userName}}',
          age: 33,
          updatedAt: new Date(),
          active: false,
          location: {
            lat: 45.3455656,
            lng: -45.2656565
          }
        }]
      };

      const services = [];
      services.push(SINGLE, MULTIPLE, RANDOM,ALL);

      const app = feathers()
        .use(`/${SINGLE.path}`, memory({ multi: true }))
        .use(`/${MULTIPLE.path}`, memory({ multi: true }))
        .use(`/${RANDOM.path}`, memory({ multi: true }))
        .use(`/${ALL.path}`, memory({ multi: true }))
        .configure(seeder({
          services
        }));

      app.seed().then(() => {
        app.service(`${SINGLE.path}`).find().then(items => {
          assert.equal(items.length, 1);
          assert.ok(items[0].profileMedium);
          assert.ok(items[0].name);
          assert.ok(items[0].password);
          console.log(`Seeded ${items.length}`);
        }).catch(done);

        app.service(`${MULTIPLE.path}`).find().then(items => {
          assert.equal(items.length, MULTIPLE.count);
          console.log(`Seeded ${items.length}`);
        }).catch(done);

        app.service(`${RANDOM.path}`).find().then(items => {
          assert.equal(items.length, RANDOM.count);
          console.log(`Seeded ${items.length}`);
        }).catch(done);

        app.service(`${ALL.path}`).find().then(items => {
          assert.equal(items.length, ALL.templates.length);
          console.log(`Seeded ${items.length}`);
        }).catch(done);

        done();
      }).catch(done);
    });
  });
});
