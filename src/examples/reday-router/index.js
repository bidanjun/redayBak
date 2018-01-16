import React from 'react'
import { store } from '../../reday';

import HashRouter from '../../router'

const HomePage = ()=>(<h2> Home Page </h2>)
const BlogPage = ()=>(<h2> Blog Page </h2>)

let routerList={
    '/': HomePage,
    '/Home': HomePage,
    '/Blog':BlogPage
};

export default (props) => {
  return (
    <div >
      <h2>Router Example</h2>

      <button onClick={e => store.router.goto('/Home')} children='Home' />
      <button onClick={e => store.router.goto('/Blog')} children='Blog' />
      <button onClick={e => store.router.goto('/Post')} children='NotFound' />
      <div>
        <HashRouter routes={routerList} />
      </div>

    </div>
  )
}

