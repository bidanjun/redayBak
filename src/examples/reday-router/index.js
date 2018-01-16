import React from 'react'
import { store } from '../../reday';

import HashRouter from '../../router'

const HomePage = ()=>(<h2> Home Page </h2>)

let routerList={
    '/': HomePage,
    '/Home': HomePage,
};

export default (props) => {
  return (
    <div >
      <h2>Router Example</h2>

      <button onClick={e => store.router.setState(()=> ({url :'/Home'}) )} children='Home' />
      <button onClick={e => store.router.setState(()=> ({url :'/Post'}) )} children='NotFound' />
      <div>
        <HashRouter routes={routerList} />
      </div>

    </div>
  )
}

