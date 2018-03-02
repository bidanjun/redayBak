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

class counter {
    constructor(initialState={
        counter:0,
        another:{hide:{counter:0}}
    }) {
        this.state=initialState;
    }

    increase(){
        this.state.counter ++;
    }
    increaseAnother(){
        this.state.another.hide.counter ++;
    }
}

// 将一个或多个类的属性和方法，映射到组件的state
// 在此过程中，组件需注册其setState函数
// 这里定义几个map，这几个map一起作为参数给mapToState
// mapToState依次处理所有参数，将类实例的属性和函数，传递给组件
// 必要的话，还可以定义componentDidMount/unMount事件
// 要注意：每个model仅仅绑定一个组件，如果有两个平行组件，则提升到上一级。

// mapTostate不处理组件的属性。

// mapToProp 前提是组件已经绑定了setState
// 与mapToState类似，但只是绑定到属性。

// 另外一种用法是将其注册到单例的store
// 使用id访问，然后简单的使用mapToState和mapToProp来解决。
describe('class based state', () => {
    it('two instance of class should have separately state', () => {
        let counterFirst = new counter();
        let counterSecond = new counter();

        counterFirst.increase();
        expect(counterFirst.state.counter).toBe(1);
        expect(counterSecond.state.counter).toBe(0);

        counterFirst.increaseAnother();
        expect(counterFirst.state.another.hide.counter).toBe(1);
        expect(counterSecond.state.another.hide.counter).toBe(0);
    });

});