import { createStore, applyMiddleware } from 'redux'
import { v4 } from 'uuid'
import thunk from 'redux-thunk'
import {
  REHYDRATE_STATE,
  ADD_KEY_PAIR,
  SET_KEY_PAIR
} from './actionTypes'
import localStorageMiddleware from './localStorageMiddleware'

const KEY = 'crypt'

export const addKeyPair = data => ({
  type: ADD_KEY_PAIR,
  data: {
    id: v4(),
    userId: '', 
    privateKey: '',
    publicKey: '',
    ...data
  }
})

export const saveState = () => (dispatch, getState) => {
  const state = getState()
  window.localStorage.setItem(KEY, JSON.stringify(state))
}

export const updateKeyPair = (data) => (dispatch, getState) => {
  const state = getState()
  const index = state.keyPairs.findIndex(k => k.id === data.id)
  if (index < 0) {
    throw new Error('not found')
  }
  const keyPairs = [...state.keyPairs]
  keyPairs[index] = data
  dispatch({
    type: SET_KEY_PAIR,
    data: keyPairs
  })
}

export const deleteKeyPair = id => (dispatch, getState) => {
  const state = getState()
  const index = state.keyPairs.findIndex(k => k.id === id)
  if (index < 0) {
    return
  }

  const copy = [...state.keyPairs]
  copy.splice(index, 1)
  dispatch({
    type: SET_KEY_PAIR,
    data: copy
  })
}

export const rehydrateState = () => (dispatch, getState) => {
  let serializedState = window.localStorage.getItem(KEY)
  if (!serializedState) {
    window.localStorage.setItem(KEY, JSON.stringify(initialState))
    return
  }
  let state

  try {
    state = JSON.parse(serializedState)
  } catch (err) {
    console.error(err)
    return
  }

  dispatch({
    type: REHYDRATE_STATE,
    data: state
  })
}

export const initialState = {
  keyPairs: []
}

function rootReducer (state = initialState, action) {
  switch (action.type) {
    case REHYDRATE_STATE:
      return {
        ...state,
        ...action.data
      }
    case ADD_KEY_PAIR:
      return {
        ...state,
        keyPairs: state.keyPairs.concat([action.data])
      }
    case SET_KEY_PAIR:
      return {
        ...state,
        keyPairs: action.data
      }
    default:
      return { ...state }
  }
}

export const store = createStore(rootReducer, initialState, applyMiddleware(thunk, localStorageMiddleware))
