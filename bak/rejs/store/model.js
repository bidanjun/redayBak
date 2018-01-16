// 使用时传入id，即在context中的名字。
// 这意味着同一个model可以有多个实例。
// 
export default class Model {
    constructor(id,initialState) {
        this.id=id; //名字
        this.setState = (state)=>state;  

        // 不能直接使用initialState，否则所有实例使用同一个state
        this.state=Object.assign({},initialState);
        this.render=this.render;
    }
    render=()=>this.setState({[this.id]:this.state});
}