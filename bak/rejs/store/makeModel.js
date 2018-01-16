import React, { Component } from 'react'
import PropTypes from 'prop-types'

// ！！！问题：在创建model的层面，通常是顶层的层面，我们都订阅了
// 这意味着，任何数据的变化，其实触发全局的重绘，这未必好。哪里用到，哪里订阅，这才对吧？
// 换句话讲，甚至make的时候，连属性都不要给下级组件...如果要用，with即可，同时也订阅了。


// 对于同一个model，支持多个不同id的实例
// 所有model实例，均保存在this.model中，context里面按id获取
// 无需声明各个实例的类型即可使用
// 因此每个model在实例化的时候要提供id的名称，可以继承自model，也可以加入model实例？
const makeModel = (...models) => (Wrapper) => {
    class MakeModel extends Component {
        constructor(props, context) {
            super(props, context)

            this.models = {}; //参数实际上是数组
            this.state ={}
            models.forEach((model) => { 
                this.models[model.id] = model;    
                this.state= Object.assign({}, this.state, { [model.id]: this.models[model.id].state })             
                //为model提供setState
                this.models[model.id].setState=(state)=>this.setState(Object.assign({},this.state,state));                            
            });

            //console.log('make model:this.state=',this.state);
        }



        // 这里有错误：model.id的值为0，因此事实上这里没有订阅，删掉后正常的工作。
        // 但我们要理解：顶层组件，并没有订阅
        componentDidMount() {
            //使用initialState初始化state

        }

        // componentWillUnmount() {
        //     //console.log('this.unsubscribe',this.unsubscribe)
        //     Object.keys(this.unsubscribe).forEach((unsub) => this.unsubscribe[unsub]());
        // }

        getChildContext() {
            let context = {};
            //console.log('models is ',this.models)
            Object.keys(this.models).forEach((id) => {
                //console.log('id is',id)
                context[id] = this.models[id]
            });
            return context;
        }
        // 注意这里的this.context是空，我们不需要这么做
        // 如果被包裹的组件需要这些属性，仍然要先使用withModel
        // 次序是先with再create，要注意！！！ 反过来，则由于不存在context会出错。
        render() {

            // !!!对于Wrapper，我们直接将创建的model作为它的多个属性
            // 这样避免对其本身，使用withModel
            const modelProps = {};
            Object.keys(this.models).forEach((id) => {
                modelProps[id] = this.models[id];
            })
            return (
                <Wrapper {...this.props} {...modelProps} />
            )
        }

    }

    const types = {};
    models.forEach((model) => {
        //console.log('model id is',model.id)
        types[model.id] = PropTypes.object;
    })
    MakeModel.childContextTypes = types;
    //console.log('types is:',types);

    // !!!注意，这里没有将形成的context注入？
    // 那么下级组件，仍然要使用withModel?
    return MakeModel
}

export default makeModel