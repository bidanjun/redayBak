import React from 'react'
import { provider } from '../../reday';

import {HashRouter,Router} from '../../reday/router'

const HomePage = ()=>(<h2> Home Page </h2>)

const mainRouter = new Router({url:'/'},{
    '/': HomePage,
    '/Home': HomePage,
});

const RouterApp = (props) => {
  return (
    <div >
      <h2>Router Example</h2>

      <button onClick={e => props.Router.setUrl('/Home')} children='Home' />
      <p>___ </p>
      <button onClick={e => props.Router.setUrl('/Post')} children='NotFound' />
      <div>
        <HashRouter Router={mainRouter} />
      </div>

    </div>
  )
}

//如果将某个实例的全部状态传递过去：return counterLeft.state就好
//如果多个实例传递...merge它们再返回。
//这里也可以任意的定义计算字段，甚至在不同的model中
const mapStates = fn => {
  mainRouter.setDispatch(fn);
  return ({
    url: mainRouter.state.url
  })
}

const mapProps=()=>({
    Router:mainRouter
  })

export default provider(mapStates, mapProps)(RouterApp)