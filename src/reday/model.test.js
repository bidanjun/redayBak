import Counter from '../examples/reday-counter/counter.state';

describe('Model', () => {
  it('proxy should instead the origin object', () => {
     const leftCounter=new Counter('leftCounter');
     expect(leftCounter.fieldId).toBe('leftCounter');
     expect(leftCounter.initialState).toBe(0);

  })
})