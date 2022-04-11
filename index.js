'use strict';

const ImmutableObjectHistory = function (
  cache = {
    get: (key = '') => cache.get(key),
    set: (key = '', value = {}) => cache.set(key, value),
  }
) {
  const cacheClient = cache;

  if (!cacheClient || arguments.length === 0) {
    throw new Error('Please provide a cache client.');
  }

  if (
    !cacheClient.get ||
    !cacheClient.set ||
    typeof cacheClient.get !== 'function' ||
    typeof cacheClient.set !== 'function'
  ) {
    throw new Error('Please provide a valid cache client.');
  }

  const get = async (key) => {
    const values = await list(key);
    const lastValue = merge(values);
    return Object.freeze(lastValue);
  };

  const set = (key, value) => {
    const setValue = async (value) => {
      const history = [...(await list(key))];
      const currentTimestamp = Date.now();
      const currentDate = new Date(currentTimestamp).toISOString();

      const newValue = {
        value: value,
        timestamp: currentTimestamp,
        date: currentDate,
        index: history.length,
      };

      history.push(newValue);
      await cacheClient.set(key, JSON.stringify(history));

      return Object.freeze(await get(key));
    };

    if (value) {
      return setValue(value);
    }
    return setValue;
  };

  const list = async (key) => {
    let history;
    try {
      history = await cacheClient.get(key);
      history = JSON.parse(history) || [];
    } catch (error) {
      history = [];
    }

    return Object.freeze(history);
  };

  const listAll = async (key) => {
    let history;
    try {
      const historyList = await list(key);
      history = historyList.map((el, idx) => {
        el.item =
          idx === 0
            ? { ...el.value }
            : { ...historyList[idx - 1].item, ...el.value };
        return el;
      });
    } catch (error) {
      history = [];
    }

    return Object.freeze(history);
  };

  const at = (key) => {
    return async (index = -1) => {
      let history;
      try {
        history = await cacheClient.get(key);
        history = JSON.parse(history) || [];
      } catch (error) {
        history = [];
      }
      if (index < -1 || index >= history.length) {
        return undefined;
      }

      index = index === -1 ? history.length - 1 : index;
      const historyToIndex = history.slice(0, index + 1);
      const value = merge(historyToIndex);
      const item = historyToIndex.pop();
      item.item = value;
      return Object.freeze(item);
    };
  };

  const merge = (list = []) => {
    const merged = list.reduce((previous, current) => {
      return { ...previous, ...current.value };
    }, {});
    return Object.freeze(merged);
  };

  return {
    get,
    set,
    at,
    list,
    listAll,
  };
};

module.exports = ImmutableObjectHistory;
