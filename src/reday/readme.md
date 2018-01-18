
## hoc的次序问题
compose(use,make)(comp)
先make然后再use
但这样会出错。。。。我们只能颠倒过来
次序是：makeState hoc=>useState hoc=>useState create component=>makeState create component

这里的道理是：函数的执行，确实是按照顺序，compose代码里就这么写的
但组件的创建则不然。
首先，是构造useState组件，然后再构造其内部的makeState组件。
所以hoc函数的执行顺序和对应的组件构造顺序是相反的
我们需要这里理解compose:即，第一个组件先构建，第二个后构建。