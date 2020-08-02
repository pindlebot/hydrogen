import { SUBSCRIBED_ACTIONS } from './actionTypes'

export default (store) => next => action => {
  const result = next(action)
  if (SUBSCRIBED_ACTIONS.includes(action.type)) {
    window.localStorage.setItem('hydrogen', JSON.stringify(store.getState()))
  }
  return result
}
