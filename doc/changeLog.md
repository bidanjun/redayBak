
## 修改withAsync
1. 不再需要asyncModel
    仅提供了pending,data,error三个属性和run函数，由此强迫所有的model重新处理
2. withAsync不要connect，它仅仅处理了run函数
    将asyncModel的内容移到withAsync即可
3. 概念：执行一个promise，根据pending、data、error的状态，返回不同组件
    如果是载入数据，还可以根据data是否为空，返回不同组件，但这个不属于执行异步操作的范畴
    所以设计上，不需要在这里处理。
    因为我们也可能用来处理保存数据之类
命名为runAsync(promise,error组件,pending组件)