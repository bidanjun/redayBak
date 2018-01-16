
## 次序问题

正常情况下我们应该
compose(use,make)(comp)
先make然后再use
但这样会出错。。。。我们只能颠倒过来
次序是：makeState hoc=>useState hoc=>useState create component=>makeState create component
这里很奇怪,compose里面的hoc确实是后面的先执行
但组件创建次序，怎么是反过来的？
