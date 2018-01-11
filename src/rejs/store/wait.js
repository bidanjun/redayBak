
import { Model } from './';

let initialState={
  pending:false,
  resolved:null,
  rejected:null
}

// 这里可以增加参数，加入错误处理和等待组件，或设置两者的默认值。
// 但对于按钮的调用...需要类似loading button，在组件上显示文字或动画。默认改变其label为loading之类。
export default class Wait extends Model{
  constructor(id) {
    super(id,initialState);
  }

  // run函数只在click事件和DidComponet之类中执行
  run = (target) => {
    target.then((res) => {
      this.state.pending = false;
      this.state.resolved = res;
      this.render();
    })
      .catch((err) => {
        this.state.pending = false;
        this.state.rejected = err;
        this.render();
      })
  }
}
