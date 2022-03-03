'use strict';
let cacheClient;
const ImmutableObjectHistory = function (
  cache = {
    get: (key = '') => cache.get(key),
    set: (key = '', value = {}) => cache.set(key, value),
  }
) {
  cacheClient = !cacheClient
    ? arguments.length === 0
      ? new Map()
      : cache
    : cacheClient;

  const get = async (key) => {
    const lastItem = await at(key)(-1);
    return Object.freeze({ ...lastItem.item });
  };
  const set = (key, item) => {
    const setItem = async (item) => {
      const history = [...(await list(key))];
      const lastItem = history.length ? history.at(-1).item : {};
      const currentTimestamp = Date.now();
      const currentDate = new Date(currentTimestamp).toISOString();

      const newItem = {
        ...lastItem,
        ...item,
      };

      const newValue = {
        item: newItem,
        timestamp: currentTimestamp,
        date: currentDate,
        index: history.length,
      };

      history.push(newValue);
      await cacheClient.set(key, JSON.stringify(history));

      return Object.freeze(newItem);
    };

    if (item) {
      return setItem(item);
    }
    return setItem;
  };
  const list = async (key) => {
    let history = await cacheClient.get(key);
    try {
      history = JSON.parse(history) || [];
    } catch (error) {
      history = [];
    }

    return Object.freeze([...history]);
  };

  const at = (key) => {
    return async (index = -1) => {
      let history = await cacheClient.get(key);
      try {
        history = JSON.parse(history) || [];
      } catch (error) {
        history = [];
      }

      const itemByIndex = getByIndex(history)(index);
      return itemByIndex && Object.freeze({ ...itemByIndex });
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
