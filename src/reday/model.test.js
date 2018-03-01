import Counter from '../demo/counter';

describe('Model', () => {
  it('proxy should instead the origin object', () => {
     const leftCounter=new Counter('leftCounter');
     expect(leftCounter.fieldId).toBe('leftCounter');
     expect(leftCounter.initialState).toBe(0);

  })
})