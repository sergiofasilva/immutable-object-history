'use strict';
const ImmutableObjectHistory = require('../index');
const mRedis = require('./local/redis.cjs');
const assert = require('assert/strict');

const { get, set, list, listAll, at } = ImmutableObjectHistory(new Map());

describe('ImmutableObjectHistory', function () {
  let key;
  let userV1;
  let userV2;
  let userV3;
  let userState1, userState2, userState3;
  let getuserState1, getuserState2, getuserState3;
  let list1, list2, list3;
  let listAll1, listAll2, listAll3;
  let atEmpty, at0, at1, at2, at3, at4, atMinus1, atMinus2;

  let userSetLast, userGetLast;

  before(async function () {
    userV1 = { id: 1, name: 'Name', age: 24 };
    userV2 = { age: 25, genre: 'male' };
    userV3 = { age: 26 };
    key = `user:${userV1.id}`;
    await mRedis.del('user:1');
    userState1 = await set(key, userV1);
    getuserState1 = await get(key);
    list1 = await list(key);
    listAll1 = await listAll(key);

    userState2 = await set(key)(userV2);
    getuserState2 = await get(key);
    list2 = await list(key);
    listAll2 = await listAll(key);

    userState3 = await set(key, userV3);
    getuserState3 = await get(key);
    list3 = await list(key);
    listAll3 = await listAll(key);

    atEmpty = await at(key)();
    at0 = await at(key)(0);
    at1 = await at(key)(1);
    at2 = await at(key)(2);
    at3 = await at(key)(3);
    at4 = await at(key)(4);
    atMinus1 = await at(key)(-1);
    atMinus2 = await at(key)(-2);

    userSetLast = await set(key, { lastKey: 'lastValue' });
    userGetLast = await get(key);
  });

  describe('set', function () {
    describe('set state 1', function () {
      it("should return { id: 1, name: 'Name', age: 24 }", () => {
        assert.deepEqual(userState1, { id: 1, name: 'Name', age: 24 });
      });
    });
    describe('set state 2', function () {
      it("should return { id: 1, name: 'Name', age: 25, genre: 'male' }", () => {
        assert.deepEqual(userState2, {
          id: 1,
          name: 'Name',
          age: 25,
          genre: 'male',
        });
      });
    });
    describe('set state 3', function () {
      it("should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        assert.deepEqual(userState3, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
    });
  });

  describe('get', function () {
    describe('get state 1', function () {
      it("should return { id: 1, name: 'Name', age: 24 }", () => {
        assert.deepEqual(getuserState1, {
          id: 1,
          name: 'Name',
          age: 24,
        });
      });
    });
    describe('get state 3', function () {
      it("should return { id: 1, name: 'Name', age: 25, genre: 'male' }", () => {
        assert.deepEqual(getuserState2, {
          id: 1,
          name: 'Name',
          age: 25,
          genre: 'male',
        });
      });
    });
    describe('get state 3', function () {
      it("should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        assert.deepEqual(getuserState3, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
    });
  });

  describe('list', function () {
    describe('list length', function () {
      it('list1 should have length 1', () => {
        assert.deepEqual(list1.length, 1);
      });
      it('list2 should have length 2', () => {
        assert.deepEqual(list2.length, 2);
      });
      it('list3 should have length 3', () => {
        assert.deepEqual(list3.length, 3);
      });
      it("list3 last item should be equal to { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        assert.deepEqual(list3[list3.length - 1].value, {
          age: 26,
        });
      });
      it('"at" funtion with -1 argument is equal with "at" function without arguments', () => {
        assert.deepEqual(atMinus1, atEmpty);
      });
    });
  });

  describe('listAll', function () {
    describe('list length', function () {
      it('listAll1 should have length 1', () => {
        assert.deepEqual(listAll1.length, 1);
      });
      it('listAll2 should have length 2', () => {
        assert.deepEqual(listAll2.length, 2);
      });
      it('listAll3 should have length 3', () => {
        assert.deepEqual(listAll3.length, 3);
      });
    });
    describe('listAll item', function () {
      it("Last listAll1 item should return { id: 1, name: 'Name', age: 24 }", () => {
        assert.deepEqual(listAll1[listAll1.length - 1].item, {
          id: 1,
          name: 'Name',
          age: 24,
        });
      });
      it("Last listAll3 item should return { id: 1, name: 'Name', age: 25, genre: 'male' }", () => {
        assert.deepEqual(listAll2[listAll2.length - 1].item, {
          id: 1,
          name: 'Name',
          age: 25,
          genre: 'male',
        });
      });
      it("Last listAll3 item should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        assert.deepEqual(listAll3[listAll3.length - 1].item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
      it('First listAll3 element value property should return {id: 1, age: 24, name: "Name" }', () => {
        assert.deepEqual(listAll3[0].value, {
          id: 1,
          age: 24,
          name: 'Name',
        });
      });
      it('Second listAll3 element value property should return { age: 26, gender: "male" }', () => {
        assert.deepEqual(listAll3[1].value, {
          age: 25,
          genre: 'male',
        });
      });
      it('Third listAll3 element value property should return { age: 26 }', () => {
        assert.deepEqual(listAll3[2].value, {
          age: 26,
        });
      });
      it("listAll element should return an object with keys 'timestamp', 'item', 'value', 'date', 'index'", () => {
        assert.equal(
          ['timestamp', 'item', , 'value', 'date', 'index'].every((key) =>
            Object.keys(listAll3[listAll3.length - 1]).includes(key)
          ),
          true
        );
      });
      it('listAll element should return an object with 5 keys', () => {
        assert.equal(Object.keys(listAll3[listAll3.length - 1]).length, 5);
      });
    });
  });

  describe('at', function () {
    describe('at empty', function () {
      it("item should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        assert.deepEqual(atEmpty.item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
    });
    describe('at 0', function () {
      it("item should return { id: 1, name: 'Name', age: 24 }", () => {
        assert.deepEqual(at0.item, {
          id: 1,
          name: 'Name',
          age: 24,
        });
      });
    });
    describe('at 1', function () {
      it("item should return { id: 1, name: 'Name', age: 25, genre: 'male' }", () => {
        assert.deepEqual(at1.item, {
          id: 1,
          name: 'Name',
          age: 25,
          genre: 'male',
        });
      });
    });
    describe('at 2', function () {
      it("item should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        assert.deepEqual(at2.item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
    });
    describe('at 3', function () {
      it('should return undefined', () => {
        assert.deepEqual(at3, undefined);
      });
    });
    describe('at 4', function () {
      it('should return undefined', () => {
        assert.deepEqual(at4, undefined);
      });
    });
    describe('at -2', function () {
      it('should return undefined', () => {
        assert.deepEqual(atMinus2, undefined);
      });
    });
    describe('at -1', function () {
      it("item should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        assert.deepEqual(atMinus1.item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
      it("should return an object with keys 'timestamp', 'item', 'date', 'index'", () => {
        assert.equal(
          ['timestamp', 'item', 'date', 'index'].every((key) =>
            Object.keys(atMinus1).includes(key)
          ),
          true
        );
      });
      it('should return an object with 5 keys', () => {
        assert.equal(Object.keys(atMinus1).length, 5);
      });
    });
  });

  describe('Last set equal last get', function () {
    it('should return undefined', () => {
      assert.deepEqual(userSetLast, userGetLast);
    });
  });

  describe('Immutability', function () {
    it('list is immutable and push should return an error', () => {
      try {
        list3.push({ newKey: 'newValue' });
      } catch (error) {
        assert(error instanceof Error);
      }
    });
    it('listAll is immutable and push should return an error', () => {
      try {
        listAll3.push({ newKey: 'newValue' });
      } catch (error) {
        assert(error instanceof Error);
      }
    });
    it('set return object is immutable', () => {
      try {
        userState3['newKey'] = 'newValue';
      } catch (error) {
        assert(error instanceof Error);
      }
    });
    it('get return object is immutable', () => {
      try {
        getuserState3.newKey = 'newValue';
      } catch (error) {
        assert(error instanceof Error);
      }
    });
    it('at return object is immutable', () => {
      try {
        atMinus1['newKey'] = 'newValue';
      } catch (error) {
        assert(error instanceof Error);
      }
    });
  });
});
