import BaseRequestActionReducer from './BaseRequestActionReducer'

export default class DeleteAllRequestActionReducer extends BaseRequestActionReducer {

  success(state, action) {
    if(action.response && action.response.result) {
      let {db, list} = state
      action.response.result.forEach(id => {
        if(db[id]) {
          delete db[id]
        }
        const index = list.findIndex(i => i.id == id)
        if(index >= 0) {
          list.splice(index, 1)
        }
      })
      return {
        ...super.success(state, action),
        db,
        list,
      }
    } else 
      return {
        ...super.success(state, action),
      }
  }
}