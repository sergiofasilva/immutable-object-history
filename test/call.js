const ImmutableObjectHistory = require('../index');
const { get, set, list, at } = ImmutableObjectHistory();

const call = async (obj) => {
    const { uuid } = obj;
    let _call;
    if (!uuid) {
        throw new Error('Invalid call uuid.');
    }

    // const tes = set();
    // const tes1 = await tes();
    
    // const tesa = set(2);
    // const tesa1 = await tesa();

    // const tesb = set([1,2]);
    // const tesb1 = await tesb();

    // const tesc = set({'a':'vv'});
    // const tesc1 = await tesc();

    const key = `hash:call:${uuid}`;
    
    if (Object.keys(obj).length === 1 && obj.uuid) {
        _call = await get(key);
    }
    // const setObj = set(key);
    // _call = _call || await setObj(obj);
    _call = await set(key, obj);
    // _call = await set(key)(obj);

    const newCallObject = {
        ..._call,
        list: list.bind(key, key),
        at: at.bind(_call, key)(),
    };
    return Object.freeze(newCallObject);
};

module.exports = call;
