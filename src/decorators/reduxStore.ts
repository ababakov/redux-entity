import { CrudEntity } from '../crud-entity';
import { BaseModel } from '../models/state';
import { CompoundHandler } from '../normalization/compound';
import { isClass } from '../utils';


type BaseEntityClass = typeof CrudEntity
interface Dictionary<T> {
  [key: string]: T;
}

export function reduxStore<TModel>(EntityClass:BaseEntityClass): BaseEntityClass {
  class ResultCrudClass<TModel extends BaseModel> extends EntityClass<TModel> {
    types: { [key: string]: string } = {}

    reducer() {
      const { permit } = this.options;

      const list = this.registry
        .reduce((acc, { key, Reducer: r }) => {
          if (permit && permit.indexOf(key) < 0) return acc;

          const type = this.name + '.' + key;

          this.types[key] = type;

          // function could be passed to resolve target reducer
          const Reducer = !r.name ? r(this.options) : r;

          const found = acc.find((i) => i.Reducer === Reducer);

          if (found) {
            found.type.push(type);
            return acc;
          }

          return [...acc, { type: [type], Reducer }];
        }, [])
        .map(({ type, Reducer }) => {
          // TODO: make it better - check for BaseRequestActionReducer prototype
          if (isClass(Reducer)) {
            const r = new Reducer({ type, ...this.options.defaultOptions });
            return r.handle.bind(r);
          } else {
            return (state, action) => (type.indexOf(action.type) >= 0 ? Reducer(state, action) : null);
          }
        });

      const sideEffects = (this.options.sideEffects || []).map((Reducer) => {
        if (isClass(Reducer)) {
          const r = new Reducer({ ...this.options.defaultOptions });
          return r.handle.bind(r);
        } else {
          return Reducer;
        }
      });

      const r = new CompoundHandler({
        initialState: this.options.state,
        reducers: [...list, ...sideEffects],
      });

      const result = r.handle.bind(r);

      return this.configure ? this.configure(result) : result;
    }
  };

  //@ts-ignore
  return ResultCrudClass
}
