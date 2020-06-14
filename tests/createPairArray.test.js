import createPairArray from '../utils/createPairArray';


test('from array of length 2 creates array of length 4', () => {
    const people = ["Mary", "Ann"];
    expect(createPairArray(people)).toHaveLength(4)
})
