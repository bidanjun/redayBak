import {Model} from '../../reday';

export default class counter extends Model {
  constructor(initialState = {
    counter: 0,
    another: { hide: { counter: 0 } }
  }) {
    super(initialState)
  }

  dec = () => {
    this.state.counter--;
    this.dispatch({ counter: this.state.counter });
  }
  inc = () => {
    this.state.counter++;
    this.dispatch({ counter: this.state.counter });
  }
  decDeep = () => {
    this.state.another.hide.counter--;
    this.dispatch({ another: { hide: { counter: this.state.another.hide.counter } } })
  }
  incDeep = () => {
    this.state.another.hide.counter++;
    //return ({another:this.state.another}) //比下面的方式简单点,但不够精确，因为将带上another的其它字段
    //return ({ another: { hide: { counter: this.state.another.hide.counter } } })
    this.dispatch({ another: { hide: { counter: this.state.another.hide.counter } } })
  }
}

export const counterLeft = new counter();
export const counterRight = new counter();