import React from 'react'
import { store,HashRouter,makeRouter } from '../../reday';


const HomePage = ()=>(<h2> Home Page </h2>)
const BlogPage = ({id})=>(<h2> Blog Page {id} </h2>)

const OtherHomePage = ()=>(<h2>Other Home Page </h2>)
const OtherBlogPage = ({id})=>(<h2>Other Blog Page {id} </h2>)

let routerList={
    '/': HomePage,
    '/Home': HomePage,
    '/Blog/:id':BlogPage
};

let otherRouter={
  '/other/home':OtherHomePage,
  '/other/blog/:id':OtherBlogPage
}

// 对于默认的router，只要使用默认的HashRouter，提供routes，则store.router就是默认的，一般执行goto转移。
//这里另行定义一个Router，占据某个区域，此刻store中可以保存另一个router
const OtherRouter=makeRouter('otherRouter',store); //另一个Router

export default (props) => {
  return (
    <div >
      <h2>Router Example</h2>

      <button onClick={e => store.router.goto('/Home')} children='Home' />
      <button onClick={e => store.router.goto('/Blog/1')} children='Blog' />
      <button onClick={e => store.router.goto('/Post')} children='NotFound' />
      <div>
        <HashRouter routes={routerList} />
      </div>

      <button onClick={e => store.otherRouter.goto('/other/home')} children='other Home' />
      <button onClick={e => store.otherRouter.goto('/other/blog/1')} children='other Blog' />
      <button onClick={e => store.otherRouter.goto('/other/post')} children='other NotFound' />    
      <div>
        <OtherRouter routes={otherRouter} />
      </div>

    </div>
  )
}

