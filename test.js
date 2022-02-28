const ImmutableObjectHistory = require('./index');
const call = require('./test/call');
const immutableObjectHistory = ImmutableObjectHistory();

async function run() {
    // await mRedis.del('hash:call:1111');
    const call1StateA = { 'uuid': '1111', 'key1': 'a', 'state': 'a' };
    const call1StateB = { 'uuid': '1111', 'key2': 'b', 'state': 'b', 'xpto': 'cenas' };
    const _call1ASetv1 = await call(call1StateA);
    const _call1BSet2 = await call(call1StateB);
    const _call1AGet = await call({ uuid: '1111' });
    console.log('V1:', _call1ASetv1);
    console.log('V2:', _call1BSet2);
    console.log('Get:', _call1AGet);
    console.log('call1 history', await _call1ASetv1.list());
    console.log('stateHistory call1 history', await immutableObjectHistory.list('hash:call:1111'));
    console.log('call1 detail last', await _call1ASetv1.at());
    console.log('call1 detail 0', await _call1ASetv1.at(0));
    console.log('call1 detail 1', await _call1ASetv1.at(1));
    console.log('call1 detail 2', await _call1ASetv1.at(2));
    console.log('stateHistory call1 detail 0', await immutableObjectHistory.at('hash:call:1111')(0));
}


async function init(){
    await run();
    process.exit();
}

init();