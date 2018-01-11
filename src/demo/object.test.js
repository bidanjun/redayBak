//utility function, tests if provided item is a key-value object and not an array
export const isObject = item => typeof item === 'object' && item !== null && !Array.isArray(item);

// utility function, clones key-value objects
export const clone = item => {
  if (isObject(item)) {
    return JSON.parse(JSON.stringify(item));
  }
  return {};
};

// utility function, recursively merges key-value objects
export const merge = (target, modifier) => {
  if (isObject(modifier)) {
    const runner = (target, modifier) => {
      return Object.keys(modifier).reduce((accum, key) => {
        if (isObject(modifier[key]) && isObject(target[key])) {
          accum[key] = runner(target[key], modifier[key]);
        } else if (modifier[key] !== undefined) {
          accum[key] = modifier[key];
        }
        return accum;
      }, target);
    };
    return runner(clone(target), modifier);
  }
  return clone(target);
};

	
describe('makeModel', () => {


    it('setPrototypeOf could not deep clone', () => {
        let state = {
            counter:0,
            another:{hide:{counter:0}}
        }

        let action = {
            increase(){
                this.counter ++;
            },
            increaseAnother(){
                this.another.hide.counter ++;
            }
        }
	
        Object.setPrototypeOf(action,clone(state)); //将state附加到action里        
		action.increase();
        expect(action.counter).toBe(1);
        expect(state.counter).toBe(0); //这意味着state的元素拷贝过去，而非引用。

        action.increaseAnother();
        expect(action.another.hide.counter).toBe(1);
        expect(state.another.hide.counter).toBe(0); 
    
        let action1=Object.create(action);

		// 说明Object.create不可行,新创建的action1加1，则原来的action同样加1
        action1.increaseAnother();
        expect(action1.another.hide.counter).toBe(2);
        expect(action.another.hide.counter).toBe(2);

    });

});