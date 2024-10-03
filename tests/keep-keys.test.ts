import { expect, test } from 'vitest';
import Differify, { DIFF_MODES } from "../src/differify"

let A = {};
let B = {};

A = {
    name: 'Fabian',
    age: 18,
    nested: {
        id: 1,
        roles: ['admin', 'user'],
    },
    hobbies: [
        { points: 10, desc: 'football soccer' },
        { points: 9, desc: 'programming' },
    ],
};

B = {
    name: 'Judith',
    age: 18,
    nested: {
        id: 2,
        roles: ['user'],
    },
    hobbies: [
        { points: 10, desc: 'dance' },
        { points: 9, desc: 'programming' },
    ],
};

let ResIdKey = {
    "_": {
        "name": {
            "original": 'Fabian',
            "current": 'Judith',
            "status": 'MODIFIED',
            "changes": 1
        },
        "age": {
            "original": 18,
            "current": 18,
            "status": 'EQUAL',
            "changes": 0
        },
        "nested": {
            "_": {
                "id": {
                    "original": 1,
                    "current": 2,
                    "status": 'KEPT',
                    "changes": 0
                },
                "roles": {
                    "_": [
                        {
                            "original": 'admin',
                            "current": 'user',
                            "status": 'MODIFIED',
                            "changes": 1
                        },
                        {
                            "original": 'user',
                            "current": null,
                            "status": 'DELETED',
                            "changes": 1
                        }
                    ],
                    "changes": 2,
                    "status": 'MODIFIED'
                }
            },
            "changes": 3,
            "status": 'MODIFIED'
        },
        "hobbies": {
            "_": [
                {
                    "_": {
                        "points": {
                            "original": 10,
                            "current": 10,
                            "status": 'EQUAL',
                            "changes": 0
                        },
                        "desc": {
                            "original": 'football soccer',
                            "current": 'dance',
                            "status": 'MODIFIED',
                            "changes": 1
                        }
                    },
                    "changes": 1,
                    "status": 'MODIFIED'
                },
                {
                    "_": {
                        "points": {
                            "original": 9,
                            "current": 9,
                            "status": 'EQUAL',
                            "changes": 0
                        },
                        "desc": {
                            "original": 'programming',
                            "current": 'programming',
                            "status": 'EQUAL',
                            "changes": 0
                        }
                    },
                    "changes": 0,
                    "status": 'EQUAL'
                }
            ],
            "changes": 1,
            "status": 'MODIFIED'
        }
    },
    "changes": 5,
    "status": 'MODIFIED'
}

test('KeepKeys: Config keepKeys', () => {
    let differify = new Differify({
        mode: {
            object: DIFF_MODES.DIFF, array: DIFF_MODES.DIFF
        },
        keepKeys: ["id"]
    });

    const diff = differify.compare(A, B);
    expect(diff).toStrictEqual(ResIdKey);
})
test('KeepKeys: Compare', () => {
    let differify = new Differify({
        mode: {
            object: DIFF_MODES.DIFF, array: DIFF_MODES.DIFF
        },
    });

    const diff = differify.compare(A, B, ['id']);
    expect(diff).toStrictEqual(ResIdKey);
})

let ResMultiKey = {
    "_": {
        "name": {
            "original": 'Fabian',
            "current": 'Judith',
            "status": 'MODIFIED',
            "changes": 1
        },
        "age": {
            "original": 18,
            "current": 18,
            "status": 'EQUAL',
            "changes": 0
        },
        "nested": {
            "_": {
                "id": {
                    "original": 1,
                    "current": 2,
                    "status": 'KEPT',
                    "changes": 0
                },
                "roles": {
                    "original": ['admin', 'user'],
                    "current": ['user'],
                    "changes": 0,
                    "status": 'KEPT'
                }
            },
            "changes": 3,
            "status": 'MODIFIED'
        },
        "hobbies": {
            "_": [
                {
                    "_": {
                        "points": {
                            "original": 10,
                            "current": 10,
                            "status": 'EQUAL',
                            "changes": 0
                        },
                        "desc": {
                            "original": 'football soccer',
                            "current": 'dance',
                            "status": 'MODIFIED',
                            "changes": 1
                        }
                    },
                    "changes": 1,
                    "status": 'MODIFIED'
                },
                {
                    "_": {
                        "points": {
                            "original": 9,
                            "current": 9,
                            "status": 'EQUAL',
                            "changes": 0
                        },
                        "desc": {
                            "original": 'programming',
                            "current": 'programming',
                            "status": 'EQUAL',
                            "changes": 0
                        }
                    },
                    "changes": 0,
                    "status": 'EQUAL'
                }
            ],
            "changes": 1,
            "status": 'MODIFIED'
        }
    },
    "changes": 5,
    "status": 'MODIFIED'
}
test('KeepKeys: Compare multi keys', () => {
    let differify = new Differify({
        mode: {
            object: DIFF_MODES.DIFF, array: DIFF_MODES.DIFF
        },
    });

    const diff = differify.compare(A, B, ['id', 'roles']);
    expect(diff).toStrictEqual(ResMultiKey);
})

let ResFilter = {
    name: 'Judith',
    nested: {
        id: 2,
    },
    hobbies: [
        {
            desc: 'dance'
        }
    ]
}

test('KeepKeys: filter', () => {
    let differify = new Differify({
        mode: {
            object: DIFF_MODES.DIFF, array: DIFF_MODES.DIFF
        },
    });

    let diff = differify.compare(A, B, ['id']);
    expect(diff).toStrictEqual(ResIdKey);
    const filter = { ...differify.filterDiffByStatus(diff, "MODIFIED"), ...differify.filterDiffByStatus(diff, "KEPT") };
    expect(filter).toStrictEqual(ResFilter);
})
