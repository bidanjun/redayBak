import Model from './model';

describe('Model', () => {

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
    
    let sub= new Counter('model',initialState);
    
    beforeEach(() => {
        
    });

    it('could be created', () => {
        expect(sub).toBeInstanceOf(Model);
        expect(sub.id).toBe('model');
    });

    it('could increase',()=>{
        sub.increase();
        expect(sub.state.counter).toBe(1);
        sub.increase();
        expect(sub.state.counter).toBe(2);

    });

    it('could render',()=>{
        sub.render();
        expect(sub.state.counter).toBe(2);
    });

});