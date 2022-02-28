'use strict';
const ImmutableObjectHistory = require('../index');
const { get, set, list, at } = ImmutableObjectHistory();

const assert = require('assert/strict');
//const assert = require('assert');
describe('ImmutableObjectHistory', function () {
  let key;
  let userV1;
  let userV2;
  let userV3;
  let userState1, userState2, userState3;
  let getuserState1, getuserState2, getuserState3;
  let list1, list2, list3;
  before(async function () {
    userV1 = { id: 1, name: 'Name', age: 24 };
    userV2 = { age: 25, genre: 'male' };
    userV3 = { age: 26 };
    key = `user:${userV1.id}`;
    userState1 = await set(key, userV1);
    getuserState1 = await get(key);
    list1 = await list(key);

    userState2 = await set(key)(userV2);
    getuserState2 = await get(key);
    list2 = await list(key);

    userState3 = await set(key, userV3);
    getuserState3 = await get(key);
    list3 = await list(key);
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
        assert.deepEqual(list3[list3.length - 1].item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
    });
  });
});
