'use strict';
import ImmutableObjectHistory from '../index.mjs';
const { get, set, list, at } = ImmutableObjectHistory();

import assert, { deepEqual, equal } from 'assert/strict';

describe('ImmutableObjectHistory', function () {
  let key;
  let userV1;
  let userV2;
  let userV3;
  let userState1, userState2, userState3;
  let getuserState1, getuserState2, getuserState3;
  let list1, list2, list3;
  let atEmpty, at0, at1, at2, at3, atMinus1;

  let userSetLast, userGetLast;

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

    atEmpty = await at(key)();
    at0 = await at(key)(0);
    at1 = await at(key)(1);
    at2 = await at(key)(2);
    at3 = await at(key)(3);
    atMinus1 = await at(key)(-1);

    userSetLast = await set(key, { lastKey: 'lastValue' });
    userGetLast = await get(key);
  });

  describe('set', function () {
    describe('set state 1', function () {
      it("should return { id: 1, name: 'Name', age: 24 }", () => {
        deepEqual(userState1, { id: 1, name: 'Name', age: 24 });
      });
    });
    describe('set state 2', function () {
      it("should return { id: 1, name: 'Name', age: 25, genre: 'male' }", () => {
        deepEqual(userState2, {
          id: 1,
          name: 'Name',
          age: 25,
          genre: 'male',
        });
      });
    });
    describe('set state 3', function () {
      it("should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        deepEqual(userState3, {
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
        deepEqual(getuserState1, {
          id: 1,
          name: 'Name',
          age: 24,
        });
      });
    });
    describe('get state 3', function () {
      it("should return { id: 1, name: 'Name', age: 25, genre: 'male' }", () => {
        deepEqual(getuserState2, {
          id: 1,
          name: 'Name',
          age: 25,
          genre: 'male',
        });
      });
    });
    describe('get state 3', function () {
      it("should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        deepEqual(getuserState3, {
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
        deepEqual(list1.length, 1);
      });
      it('list2 should have length 2', () => {
        deepEqual(list2.length, 2);
      });
      it('list3 should have length 3', () => {
        deepEqual(list3.length, 3);
      });
      it("list3 last item should be equal to { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        deepEqual(list3[list3.length - 1].item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
      it('"at" funtion with -1 argument is equal with "at" function without arguments', () => {
        deepEqual(atMinus1, atEmpty);
      });
    });
  });

  describe('at', function () {
    describe('at empty', function () {
      it("item should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        deepEqual(atEmpty.item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
    });
    describe('at 0', function () {
      it("item should return { id: 1, name: 'Name', age: 24 }", () => {
        deepEqual(at0.item, {
          id: 1,
          name: 'Name',
          age: 24,
        });
      });
    });
    describe('at 1', function () {
      it("item should return { id: 1, name: 'Name', age: 25, genre: 'male' }", () => {
        deepEqual(at1.item, {
          id: 1,
          name: 'Name',
          age: 25,
          genre: 'male',
        });
      });
    });
    describe('at 2', function () {
      it("item should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        deepEqual(at2.item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
    });
    describe('at 3', function () {
      it('should return undefined', () => {
        deepEqual(at3, undefined);
      });
    });
    describe('at -1', function () {
      it("item should return { id: 1, name: 'Name', age: 26, genre: 'male' }", () => {
        deepEqual(atMinus1.item, {
          id: 1,
          name: 'Name',
          age: 26,
          genre: 'male',
        });
      });
      it("should return an object with keys 'timestamp', 'item', 'date', 'index'", () => {
        equal(
          ['timestamp', 'item', 'date', 'index'].every((key) => Object.keys(atMinus1).includes(key)),
          true
        );
      });
      it('should return an object with 4 keys', () => {
        equal(Object.keys(atMinus1).length, 4);
      });
    });
  });

  describe('Last set equal last get', function () {
    it('should return undefined', () => {
      deepEqual(userSetLast, userGetLast);
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
