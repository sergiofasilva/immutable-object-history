'use strict';
const ImmutableObjectHistory = (cache = new Map()) => {
  this.cache = this.cache || cache;
  const get = async (key) => {
    let history = await this.cache.get(key);
    try {
      history = JSON.parse(history) || [];
    } catch (error) {
      history = [];
    }
    const lastItem = getByIndex(history)();

    return Object.freeze({ ...lastItem.item });
  };
  const set = (key, item) => {
    const setItem = async (item) => {
      let history = await this.cache.get(key);

      try {
        history = JSON.parse(history) || [];
      } catch (error) {
        history = [];
      }
      const lastItem = getByIndex(history)();

      const newItem = {
        ...lastItem.item,
        ...item,
      };
      const newValue = {
        item: newItem,
        timestamp: Date.now(),
        date: new Date().toISOString(),
        index: history.length,
      };

      history.push(newValue);
      await this.cache.set(key, JSON.stringify(history));

      return Object.freeze(newItem);
    };

    if (item) {
      return setItem(item);
    }
    return setItem;
  };
  const list = async (key) => {
    let history = await this.cache.get(key);
    try {
      history = JSON.parse(history) || [];
    } catch (error) {
      history = [];
    }

    return Object.freeze(history);
  };

  const at = (key) => {
    return async (index = -1) => {
      let history = await this.cache.get(key);
      try {
        history = JSON.parse(history) || [];
      } catch (error) {
        history = [];
      }

      const itemByIndex = getByIndex(history)(index);
      return Object.freeze(itemByIndex);
    };
  };
  const getByIndex = (history) => {
    return (index = -1) =>
      history.length ? Object.freeze(history.at(index)) : Object.freeze({});
  };

  return {
    get,
    set,
    at,
    list,
  };
};

module.exports = ImmutableObjectHistory;
