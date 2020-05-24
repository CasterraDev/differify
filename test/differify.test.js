const Differify = require('../index');

const differify = new Differify();

describe('Testing differify lib: ', () => {
  const getAObject = () => ({
    name: 'Judith',
    age: 33,
    friends: ['Cecilia', 'Stephanie'],
    extras: {
      hobbies: ['Gym', 'Dance'],
    },
    date: new Date(),
  });

  const getBObject = () => ({
    name: 'Fabian',
    age: 36,
    friends: ['Finn', 'Jake'],
    extras: {
      hobbies: ['Football Soccer', 'Programming'],
    },
    date: new Date('12/15/1983 12:00:00'),
  });

  test('testing bad config arguments', () => {
    differify.setConfig({
      mode: { array: null, object: true },
    });
    let config = differify.getConfig();
    expect(config.mode.array).toEqual('DIFF');
    expect(config.mode.object).toEqual('DIFF');
    expect(config.mode.function).toEqual('REFERENCE');
  });

  test('testing case insensitive config arguments', () => {
    differify.setConfig({
      mode: { array: 'diff', object: 'string', function: 'string' },
    });
    const config = differify.getConfig();
    expect(config.mode.array).toEqual('DIFF');
    expect(config.mode.object).toEqual('STRING');
    expect(config.mode.function).toEqual('STRING');
  });

  test('testing empty config', () => {
    differify.setConfig();
    let config = differify.getConfig();
    expect(config.mode.array).toEqual('DIFF');
    expect(config.mode.object).toEqual('DIFF');
    expect(config.mode.function).toEqual('REFERENCE');
  });

  test('testing incomplete config', () => {
    differify.setConfig({
      mode: {},
    });
    let config = differify.getConfig();
    expect(config.mode.array).toEqual('DIFF');
    expect(config.mode.object).toEqual('DIFF');
    expect(config.mode.function).toEqual('REFERENCE');
  });

  test('testing good config', () => {
    differify.setConfig({
      mode: {
        array: 'DIFF',
        object: 'DIFF',
        function: 'STRING',
      },
    });
    let config = differify.getConfig();
    expect(config.mode.array).toEqual('DIFF');
    expect(config.mode.object).toEqual('DIFF');
    expect(config.mode.function).toEqual('STRING');
  });

  test('if no property match, should return null', () => {
    differify.setConfig({
      mode: {
        array: 'DIFF',
        object: 'DIFF',
        function: 'STRING',
      },
    });
    const diff = differify.compare(Object.create(null), getAObject());

    expect(diff._.name.status === 'ADDED').toBeTruthy();
    expect(diff._.name.original).toBe(null);
    expect(diff._.name.current).toBe('Judith');
    expect(diff._.date.status === 'ADDED').toBeTruthy();
    expect(diff._.date.original).toBe(null);
    expect(Object.prototype.toString.call(diff._.date.current)).toBe(
      '[object Date]'
    );
    expect(diff._.age.status === 'ADDED').toBeTruthy();
    expect(diff._.age.original).toBe(null);
    expect(diff._.age.current).toBe(33);
    expect(diff._.friends.status === 'ADDED').toBeTruthy();
    expect(diff._.friends.original).toBe(null);
    expect(Object.prototype.toString.call(diff._.friends.current)).toBe(
      '[object Array]'
    );
  });

  test('empty objects, should return EQUAL', () => {
    differify.setConfig({
      mode: {
        array: 'DIFF',
        object: 'DIFF',
        function: 'STRING',
      },
    });
    const diff = differify.compare({}, {});

    expect(diff.status === 'EQUAL').toBeTruthy();
    expect(diff.changes === 0).toBeTruthy();
    expect(diff._ === null).toBeTruthy();
  });

  test('empty array, should return an empty array', () => {
    differify.setConfig({
      mode: {
        array: 'DIFF',
        object: 'DIFF',
        function: 'STRING',
      },
    });
    const diff = differify.compare([], []);

    expect(
      Object.prototype.toString.call(diff._) === '[object Array]'
    ).toBeTruthy();
    expect(diff._.length).toBe(0);
    expect(diff.status).toBe('EQUAL');
    expect(diff.changes).toBe(0);
  });

  test('diff with no prototyped object', () => {
    differify.setConfig({
      mode: {
        array: 'DIFF',
        object: 'DIFF',
        function: 'STRING',
      },
    });

    let diff = differify.compare(Object.create(null), getAObject());

    expect(diff._.name.status === 'ADDED').toBeTruthy();
    expect(diff._.name.original).toBe(null);
    expect(diff._.name.current).toBe('Judith');
    expect(diff._.date.status === 'ADDED').toBeTruthy();
    expect(diff._.date.original).toBe(null);
    expect(Object.prototype.toString.call(diff._.date.current)).toBe(
      '[object Date]'
    );
    expect(diff._.age.status === 'ADDED').toBeTruthy();
    expect(diff._.age.original).toBe(null);
    expect(diff._.age.current).toBe(33);
    expect(diff._.friends.status === 'ADDED').toBeTruthy();
    expect(diff._.friends.original).toBe(null);
    expect(Object.prototype.toString.call(diff._.friends.current)).toBe(
      '[object Array]'
    );

    diff = differify.compare(getAObject(), Object.create(null));

    expect(diff._.name.status === 'DELETED').toBeTruthy();
    expect(diff._.name.current).toBe(null);
    expect(diff._.name.original).toBe('Judith');
    expect(diff._.date.status === 'DELETED').toBeTruthy();
    expect(diff._.date.current).toBe(null);
    expect(Object.prototype.toString.call(diff._.date.original)).toBe(
      '[object Date]'
    );
    expect(diff._.age.status === 'DELETED').toBeTruthy();
    expect(diff._.age.current).toBe(null);
    expect(diff._.age.original).toBe(33);
    expect(diff._.friends.status === 'DELETED').toBeTruthy();
    expect(diff._.friends.current).toBe(null);
    expect(Object.prototype.toString.call(diff._.friends.original)).toBe(
      '[object Array]'
    );
  });

  test('checking Date diff', () => {
    differify.setConfig({
      mode: {
        array: 'DIFF',
        object: 'DIFF',
        function: 'STRING',
      },
    });
    let a = new Date();
    let b = new Date(1983, 11, 15);

    let diff = differify.compare(a, b);

    expect(diff.status === 'MODIFIED').toBeTruthy();

    const newDate = new Date();
    a = newDate;
    b = newDate;
    diff = differify.compare(a, b);
    expect(diff.status === 'EQUAL').toBeTruthy();
  });

  test('checking Native values diff', () => {
    differify.setConfig({
      mode: {
        array: 'DIFF',
        object: 'DIFF',
        function: 'STRING',
      },
    });

    // NATIVE DIFF
    expect(differify.compare(1, 2).status === 'MODIFIED').toBeTruthy();
    expect(differify.compare(true, false).status === 'MODIFIED').toBeTruthy();
    expect(differify.compare(null, null).status === 'EQUAL').toBeTruthy();
    expect(
      differify.compare(undefined, undefined).status === 'EQUAL'
    ).toBeTruthy();
    expect(differify.compare('a', 'b').status === 'MODIFIED').toBeTruthy();

    const newDate = new Date();
    const a = newDate;
    const b = newDate;
    const diff = differify.compare(a, b);
    expect(diff.status === 'EQUAL').toBeTruthy();
  });

  test('Array comparission with ALL possible configurations', () => {
    // DIFF DIFF
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    const a = ['Hello', 'how', 'are', 'you'];
    const b = ['fine', 'and', 'you'];

    expect(Object.prototype.toString.call(differify.compare([], [])._)).toBe(
      '[object Array]'
    );
    expect(differify.compare([], [])._.length).toBe(0);

    let diff = differify.compare(a, b);

    expect(diff.status === 'MODIFIED').toBeTruthy();
    expect(diff.changes === 4).toBeTruthy();
    expect(diff._[0].status === 'MODIFIED').toBeTruthy();
    expect(diff._[1].status === 'MODIFIED').toBeTruthy();
    expect(diff._[2].status === 'MODIFIED').toBeTruthy();
    expect(diff._[3].status === 'DELETED').toBeTruthy();

    diff = differify.compare(b, a);

    expect(diff.status === 'MODIFIED').toBeTruthy();
    expect(diff.changes === 4).toBeTruthy();
    expect(diff._[0].status === 'MODIFIED').toBeTruthy();
    expect(diff._[1].status === 'MODIFIED').toBeTruthy();
    expect(diff._[2].status === 'MODIFIED').toBeTruthy();
    expect(diff._[3].status === 'ADDED').toBeTruthy();

    // DIFF EQ
    diff = differify.compare(a, a);

    expect(diff.status === 'EQUAL').toBeTruthy();
    expect(diff.changes === 0).toBeTruthy();
    expect(diff._[0].status === 'EQUAL').toBeTruthy();
    expect(diff._[1].status === 'EQUAL').toBeTruthy();
    expect(diff._[2].status === 'EQUAL').toBeTruthy();
    expect(diff._[3].status === 'EQUAL').toBeTruthy();

    // REFERENCE DIFF
    differify.setConfig({ mode: { object: 'DIFF', array: 'REFERENCE' } });
    diff = differify.compare(a, b);
    expect(diff.status === 'MODIFIED').toBeTruthy();
    expect(diff.changes === 1).toBeTruthy();
    expect(diff._ === null).toBeTruthy();

    // REFERENCE EQ
    diff = differify.compare(a, a);
    expect(diff.status === 'EQUAL').toBeTruthy();
    expect(diff.changes === 0).toBeTruthy();

    // STRING DIFF
    differify.setConfig({ mode: { object: 'DIFF', array: 'STRING' } });
    diff = differify.compare(a, b);
    expect(diff.status === 'MODIFIED').toBeTruthy();
    expect(diff.changes === 1).toBeTruthy();
    expect(differify.compare([], [])._ === null).toBeTruthy();

    // STRING EQ
    diff = differify.compare(a, a);
    expect(diff.status === 'EQUAL').toBeTruthy();
    expect(diff.changes === 0).toBeTruthy();
    expect(differify.compare([], [])._ === null).toBeTruthy();
  });

  test('Object comparission with ALL possible configurations', () => {
    // DIFF DIFF
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    let a = getAObject();
    let b = getBObject();

    expect(differify.compare({}, {})._).toBe(null);
    expect(differify.compare({}, {}).status).toBe('EQUAL');
    expect(differify.compare({}, {}).changes).toBe(0);

    let diff = differify.compare(a, b);
    expect(diff.status).toBe('MODIFIED');
    expect(diff.changes).toBe(7);
    expect(diff._.name.status === 'MODIFIED').toBeTruthy();
    expect(diff._.age.status === 'MODIFIED').toBeTruthy();
    diff._.extras._.hobbies._.forEach((i) =>
      expect(i.status === 'MODIFIED').toBeTruthy()
    );
    expect(diff._.date.status === 'MODIFIED').toBeTruthy();

    // DIFF EQ
    a = getAObject();
    b = getAObject();
    b.date = a.date;
    diff = differify.compare(a, b);
    expect(diff.status).toBe('EQUAL');
    expect(diff.changes).toBe(0);
    expect(diff._.name.status === 'EQUAL').toBeTruthy();
    expect(diff._.age.status === 'EQUAL').toBeTruthy();
    diff._.extras._.hobbies._.forEach((i) =>
      expect(i.status === 'EQUAL').toBeTruthy()
    );
    expect(diff._.date.status === 'EQUAL').toBeTruthy();

    // REFERENCE DIFF
    differify.setConfig({ mode: { object: 'REFERENCE', array: 'REFERENCE' } });
    diff = differify.compare(getAObject(), getBObject());
    expect(diff.status === 'MODIFIED').toBeTruthy();
    expect(diff.changes === 1).toBeTruthy();
    expect(differify.compare({}, {}).status === 'MODIFIED').toBeTruthy();

    // REFERENCE EQ
    a = getAObject();
    b = a;
    diff = differify.compare(a, b);
    expect(diff.status === 'EQUAL').toBeTruthy();
    expect(diff.changes === 0).toBeTruthy();

    // STRING DIFF
    differify.setConfig({ mode: { object: 'STRING', array: 'STRING' } });
    diff = differify.compare(getAObject(), getBObject());
    expect(diff.status === 'MODIFIED').toBeTruthy();
    expect(diff.changes === 1).toBeTruthy();
    expect(differify.compare({}, {}).status === 'EQUAL').toBeTruthy();

    // STRING EQ
    a = getAObject();
    b = a;
    diff = differify.compare(a, b);
    expect(diff.changes === 0).toBeTruthy();
    expect(diff.status === 'EQUAL').toBeTruthy();
  });

  test('test output for ALL object modes', () => {
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    const a = getAObject();
    a.date = 1589657835225;
    const b = getBObject();
    b.date = 1589657835225;

    expect(JSON.stringify(differify.compare(a, b))).toBe(
      '{"_":{"name":{"original":"Judith","current":"Fabian","status":"MODIFIED","changes":1},"age":{"original":33,"current":36,"status":"MODIFIED","changes":1},"friends":{"_":[{"original":"Cecilia","current":"Finn","status":"MODIFIED","changes":1},{"original":"Stephanie","current":"Jake","status":"MODIFIED","changes":1}],"status":"MODIFIED","changes":2},"extras":{"_":{"hobbies":{"_":[{"original":"Gym","current":"Football Soccer","status":"MODIFIED","changes":1},{"original":"Dance","current":"Programming","status":"MODIFIED","changes":1}],"status":"MODIFIED","changes":2}},"status":"MODIFIED","changes":2},"date":{"original":1589657835225,"current":1589657835225,"status":"EQUAL","changes":0}},"status":"MODIFIED","changes":6}'
    );

    differify.setConfig({ mode: { object: 'REFERENCE' } });

    expect(JSON.stringify(differify.compare(a, b))).toBe(
      '{"_":null,"status":"MODIFIED","changes":1}'
    );

    differify.setConfig({ mode: { object: 'STRING' } });

    expect(JSON.stringify(differify.compare(a, b))).toBe(
      '{"_":null,"status":"MODIFIED","changes":1}'
    );
  });

  test('test output for ALL array modes', () => {
    const a = [1, 2, 3, 4, 5];
    const b = [1, 2, 4, 6, 8, 10];

    differify.setConfig({ mode: { array: 'DIFF' } });
    expect(JSON.stringify(differify.compare(a, b))).toBe(
      '{"_":[{"original":1,"current":1,"status":"EQUAL","changes":0},{"original":2,"current":2,"status":"EQUAL","changes":0},{"original":3,"current":4,"status":"MODIFIED","changes":1},{"original":4,"current":6,"status":"MODIFIED","changes":1},{"original":5,"current":8,"status":"MODIFIED","changes":1},{"original":null,"current":10,"status":"ADDED","changes":1}],"status":"MODIFIED","changes":4}'
    );

    differify.setConfig({ mode: { array: 'REFERENCE', object: 'REFERENCE' } });

    expect(JSON.stringify(differify.compare(getAObject(), getBObject()))).toBe(
      '{"_":null,"status":"MODIFIED","changes":1}'
    );

    differify.setConfig({ mode: { array: 'STRING', object: 'REFERENCE' } });

    expect(JSON.stringify(differify.compare(getAObject(), getBObject()))).toBe(
      '{"_":null,"status":"MODIFIED","changes":1}'
    );
  });

  test('should merge right changes properly', () => {
    const A = {
      id: 1,
      roles: ['developer'],
      name: 'Person1',
      hobbies: {
        a: 'futbol',
        b: [{ name: 'willy' }],
      },
      birthdate: 440305200000,
    };

    const B = {
      id: 2,
      roles: ['developer', 'admin'],
      name: 'Person2',
      hobbies: {
        a: 'dance',
        b: [{ name: 'willys' }],
      },
      birthdate: 533444400000,
    };
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    let diff = differify.compare(A, B);

    let merged = differify.applyRightChanges(diff);

    expect(merged.id).toBe(2);
    expect(merged.name).toBe('Person2');
    expect(merged.birthdate).toBe(533444400000);
    expect(merged.hobbies.a).toBe('dance');
    expect(Object.prototype.toString.call(merged.hobbies.b)).toBe(
      '[object Array]'
    );
    expect(merged.hobbies.b.length).toBe(1);
    expect(merged.hobbies.b[0].name).toBe('willys');

    diff = differify.compare({ a: 'a', b: 'b', c: 'c' }, { a: 'b', b: 'a' });
    merged = differify.applyRightChanges(diff);

    expect(merged.a).toBe('b');
    expect(merged.b).toBe('a');
    expect(merged.c).toBe('c');

    diff = differify.compare([1, 2, 3, 9], [4, 5, 6]);
    merged = differify.applyRightChanges(diff);

    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged.length).toBe(4);
    expect(merged[0]).toBe(4);
    expect(merged[1]).toBe(5);
    expect(merged[2]).toBe(6);
    expect(merged[3]).toBe(9);

    diff = differify.compare([1, 2], [4, 5, 6]);
    merged = differify.applyRightChanges(diff);

    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged.length).toBe(3);
    expect(merged[0]).toBe(4);
    expect(merged[1]).toBe(5);
    expect(merged[2]).toBe(6);
  });

  test('should merge left changes properly', () => {
    const B = {
      id: 2,
      roles: ['developer', 'admin'],
      name: 'Person2',
      hobbies: {
        a: 'dance',
        b: [{ name: 'willys' }],
      },
      birthdate: 533444400000,
    };

    const A = {
      id: 1,
      roles: ['developer'],
      name: 'Person1',
      hobbies: {
        a: 'futbol',
        b: [{ name: 'willy' }],
      },
      birthdate: 440305200000,
    };

    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    let diff = differify.compare(A, B);

    let merged = differify.applyLeftChanges(diff);

    expect(merged.id).toBe(1);
    expect(merged.name).toBe('Person1');
    expect(merged.birthdate).toBe(440305200000);
    expect(merged.hobbies.a).toBe('futbol');
    expect(Object.prototype.toString.call(merged.hobbies.b)).toBe(
      '[object Array]'
    );
    expect(merged.hobbies.b.length).toBe(1);
    expect(merged.hobbies.b[0].name).toBe('willy');

    diff = differify.compare({ a: 'a', b: 'b', c: 'c' }, { a: 'b', b: 'a' });
    merged = differify.applyLeftChanges(diff);

    expect(merged.a).toBe('a');
    expect(merged.b).toBe('b');
    expect(merged.c).toBe('c');

    diff = differify.compare([1, 2, 3], [4, 5, 6, 7]);
    merged = differify.applyLeftChanges(diff);

    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged.length).toBe(4);
    expect(merged[0]).toBe(1);
    expect(merged[1]).toBe(2);
    expect(merged[2]).toBe(3);
    expect(merged[3]).toBe(7);

    diff = differify.compare([1, 2, 3], [4, 5]);
    merged = differify.applyLeftChanges(diff);

    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged.length).toBe(3);
    expect(merged[0]).toBe(1);
    expect(merged[1]).toBe(2);
    expect(merged[2]).toBe(3);
  });

  test('should merge the difference ONLY', () => {
    const B = {
      id: 1,
      roles: ['developer', 'admin'],
      name: 'Person2',
      birthdate: 533444400000,
      color: 'red',
    };

    const A = {
      id: 1,
      roles: ['developer'],
      name: 'Person1',
      birthdate: 440305200000,
    };

    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    let diff = differify.compare(A, B);

    let merged = differify.applyLeftChanges(diff, true);

    expect(merged.id).toBe(undefined);
    expect(merged.name).toBe('Person1');
    expect(merged.birthdate).toBe(440305200000);
    expect(merged.birthdate).toBe(440305200000);
    expect(merged.color).toBe('red');
    expect(Object.prototype.toString.call(merged.roles)).toBe('[object Array]');
    expect(merged.roles.length).toBe(1);
    expect(merged.roles[0]).toBe('admin');

    diff = differify.compare({ a: 'a', b: 'b', c: 'c' }, { a: 'a', b: 'b' });
    merged = differify.applyLeftChanges(diff, true);

    expect(merged.a).toBe(undefined);
    expect(merged.b).toBe(undefined);
    expect(merged.c).toBe('c');

    diff = differify.compare([1, 2, 3], [1, 2, 3, 4]);
    merged = differify.applyLeftChanges(diff, true);
    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged.length).toBe(1);
    expect(merged[0]).toBe(4);

    diff = differify.compare([1, 2, 3], [1, 4, 3, 2]);
    merged = differify.applyLeftChanges(diff, true);
    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged.length).toBe(2);
    expect(merged[0]).toBe(2);
    expect(merged[1]).toBe(2);

    diff = differify.compare({ a: 'a', b: 'b', c: 'c' }, { a: 'b', b: 'a' });
    merged = differify.applyLeftChanges(diff, true);

    expect(merged.a).toBe('a');
    expect(merged.b).toBe('b');
    expect(merged.c).toBe('c');

    diff = differify.compare([1, 2, 3], [4, 5, 6, 7]);
    merged = differify.applyLeftChanges(diff, true);

    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged.length).toBe(4);
    expect(merged[0]).toBe(1);
    expect(merged[1]).toBe(2);
    expect(merged[2]).toBe(3);
    expect(merged[3]).toBe(7);

    diff = differify.compare([1, 2, 3], [4, 5]);
    merged = differify.applyLeftChanges(diff, true);

    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged.length).toBe(3);
    expect(merged[0]).toBe(1);
    expect(merged[1]).toBe(2);
    expect(merged[2]).toBe(3);

    diff = differify.compare([1, 2], [1, 2]);
    merged = differify.applyLeftChanges(diff, true);

    expect(merged).not.toBe(undefined);
    expect(merged.length).toBe(0);
  });

  test('should return a non null result when the config parameters are DIFF for objects and arrays', () => {
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    let diff = differify.compare(
      { a: 'a', b: 'b', c: 'c' },
      { a: 'b', b: 'a' }
    );
    let merged = differify.applyLeftChanges(diff);
    expect(Object.prototype.toString.call(merged)).toBe('[object Object]');
    expect(merged).not.toBe(null);

    diff = differify.compare([1, 2, 3], [2, 5, 6]);
    merged = differify.applyLeftChanges(diff);
    expect(Object.prototype.toString.call(merged)).toBe('[object Array]');
    expect(merged).not.toBe(null);
  });

  test('should return null if the config is not DIFF for objects and arrays', () => {
    differify.setConfig({ mode: { object: 'REFERENCE', array: 'DIFF' } });
    let diff = differify.compare(
      { a: 'a', b: 'b', c: 'c' },
      { a: 'b', b: 'a' }
    );
    let merged = differify.applyLeftChanges(diff);
    expect(merged).toBe(null);

    differify.setConfig({ mode: { object: 'DIFF', array: 'STRING' } });
    diff = differify.compare({ a: 'a', b: 'b', c: 'c' }, { a: 'b', b: 'a' });
    merged = differify.applyLeftChanges(diff);
    expect(merged).toBe(null);
  });

  test('should return null if wrong diff data is provided', () => {
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    let diff = [];
    let merged = differify.applyLeftChanges(diff);
    expect(merged).toBe(null);

    diff = {};
    merged = differify.applyLeftChanges(diff);
    expect(merged).toBe(null);

    diff = null;
    merged = differify.applyLeftChanges(diff);
    expect(merged).toBe(null);

    diff = null;
    merged = differify.filterDiffByStatus(diff);
    expect(merged).toBe(null);
  });

  test('if no changes between two entities, the left or right apply method, should return the object when called', () => {
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    const A = {
      name: 'Person1',
      extras: {
        something: '1',
        somethingElse: '2',
      },
    };
    const B = {
      name: 'Person1',
      extras: {
        something: '1',
        somethingElse: '2',
      },
    };

    const diff = differify.compare(A, B);
    const merged = differify.applyLeftChanges(diff);
    expect(merged).not.toBe(null);
    expect(merged.name).toBe('Person1');
    expect(Object.prototype.toString(merged.extras)).toBe('[object Object]');
    expect(merged.extras.something).toBe('1');
    expect(merged.extras.somethingElse).toBe('2');
  });

  test('should return the props filtered by status', () => {
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    const A = {
      name: 'Person1',
      extras: {
        something: '1',
        somethingElse: '2',
      },
      member: true,
      doc: 10,
      friends: ['A', 'B', 'C'],
    };
    const B = {
      name: 'Person1',
      extras: {
        something: '1',
        somethingElse: '2',
      },
      member: false,
      badges: 7,
      friends: ['A', 'D', 'C', 'F'],
    };

    const diff = differify.compare(A, B);
    let merged = differify.filterDiffByStatus(diff, 'DELETED');
    expect(merged).not.toBe(null);
    expect(merged.name).toBe(undefined);
    expect(merged.extras).toBe(undefined);
    expect(merged.doc).toBe(10);
    expect(merged.memeber).toBe(undefined);
    expect(merged.friends.length).toBe(0);

    merged = differify.filterDiffByStatus(diff, 'ADDED');
    expect(merged).not.toBe(null);
    expect(merged.name).toBe(undefined);
    expect(merged.extras).toBe(undefined);
    expect(merged.doc).toBe(undefined);
    expect(merged.badges).toBe(7);
    expect(merged.memeber).toBe(undefined);
    expect(merged.friends.length).toBe(1);
    expect(merged.friends[0]).toBe('F');

    merged = differify.filterDiffByStatus(diff, 'MODIFIED');
    expect(merged).not.toBe(null);
    expect(merged.name).toBe(undefined);
    expect(merged.extras).toBe(undefined);
    expect(merged.doc).toBe(undefined);
    expect(merged.badges).toBe(undefined);
    expect(merged.memeber).toBeFalsy();
    expect(merged.friends.length).toBe(1);
    expect(merged.friends[0]).toBe('D');

    merged = differify.filterDiffByStatus(diff, 'EQUAL');
    expect(merged).not.toBe(null);
    expect(merged.name).toBe('Person1');
    expect(Object.prototype.toString(merged.extras)).toBe('[object Object]');
    expect(merged.extras.something).toBe('1');
    expect(merged.extras.somethingElse).toBe('2');
    expect(merged.doc).toBe(undefined);
    expect(merged.badges).toBe(undefined);
    expect(merged.memeber).toBe(undefined);
    expect(merged.friends.length).toBe(2);
    expect(merged.friends[0]).toBe('A');
    expect(merged.friends[1]).toBe('C');
  });

  test('if the input is an Array, must return an array with the elements filtered by status', () => {
    differify.setConfig({ mode: { object: 'DIFF', array: 'DIFF' } });
    const A = ['A', 'B', 'C'];
    const B = ['A', 'D', 'C', 'F'];

    const diff = differify.compare(A, B);
    let merged = differify.filterDiffByStatus(diff, 'ADDED');
    expect(merged).not.toBe(null);
    expect(merged._).toBe(undefined);
    expect(Array.isArray(merged)).toBeTruthy();
    expect(merged.length).toBe(1);
    expect(merged[0]).toBe('F');

    merged = differify.filterDiffByStatus(diff, 'MODIFIED');
    expect(merged).not.toBe(null);
    expect(merged._).toBe(undefined);
    expect(Array.isArray(merged)).toBeTruthy();
    expect(merged.length).toBe(1);
    expect(merged[0]).toBe('D');

    merged = differify.filterDiffByStatus(diff, 'EQUAL');
    expect(merged).not.toBe(null);
    expect(merged._).toBe(undefined);
    expect(Array.isArray(merged)).toBeTruthy();
    expect(merged.length).toBe(2);
    expect(merged[0]).toBe('A');
    expect(merged[1]).toBe('C');

    merged = differify.filterDiffByStatus(
      differify.compare([1, 2], [1]),
      'DELETED'
    );
    expect(merged).not.toBe(null);
    expect(merged._).toBe(undefined);
    expect(Array.isArray(merged)).toBeTruthy();
    expect(merged.length).toBe(1);
    expect(merged[0]).toBe(2);
  });
});
