import React from 'react';
import ReactDOM from 'react-dom';
import {makeModel,withModel} from './';
import Model from './model';

describe('makeModel', () => {

    let initialState={
        counter:0
    };
    class Counter extends Model {
        increase=()=>{
          this.state.counter ++;
        }
    
        decrease=()=>{
         this.state.counter --;
        }
    }
    
    let sub= new Counter('Counter',initialState);

    let CounterDiv= (props) => <div>{'props.Counter.id'} </div>
    //CounterDiv = makeModel(sub)(withModel('Counter'))(CounterDiv);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<CounterDiv />, div);
      });

});