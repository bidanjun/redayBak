import React from 'react'
import { store,HashRouter } from '../../reday';

const HomePage = ()=>(<h2> Home Page </h2>)
const BlogPage = ({id})=>(<h2> Blog Page {id} </h2>)

let routerList={
    '/': HomePage,
    '/Home': HomePage,
    '/Blog/:id':BlogPage
};

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

    </div>
  )
}

