import { createStore, applyMiddleware } from 'redux'
import { v4 } from 'uuid'
import thunk from 'redux-thunk'
import {
  REHYDRATE_STATE,
  ADD_PRIVATE_KEY,
  SET_PRIVATE_KEYS,
  ADD_PUBLIC_KEY,
  SET_PUBLIC_KEYS
} from './actionTypes'
import localStorageMiddleware from './localStorageMiddleware'

const KEY = 'hydrogen'

export const addPrivateKey = data => ({
  type: ADD_PRIVATE_KEY,
  data: {
    userId: '', 
    privateKey: '',
    keyId: '',
    fingerprint: '',
    ...data
  }
})

export const addPublicKey = data => ({
  type: ADD_PUBLIC_KEY,
  data: {
    publicKey: '',
    userId: '',
    keyId: '',
    fingerprint: '',
    ...data
  }
})

export const saveState = () => (dispatch, getState) => {
  const state = getState()
  window.localStorage.setItem(KEY, JSON.stringify(state))
}

export const updatePrivateKey = (data) => (dispatch, getState) => {
  const state = getState()
  const privateKeys = { ...state.privateKeys }
  privateKeys[data.fingerprint] = data
  dispatch({
    type: SET_PRIVATE_KEYS,
    data: privateKeys
  })
}

export const updatePublicKey = (data) => (dispatch, getState) => {
  const state = getState()
  const publicKeys = { ...state.publicKeys }
  publicKeys[data.fingerprint] = data
  dispatch({
    type: SET_PUBLIC_KEYS,
    data: publicKeys
  })
}

export const deletePrivateKey = fingerprint => (dispatch, getState) => {
  const state = getState()
  const privateKeys = { ...state.privateKeys }
  delete privateKeys[fingerprint]
  dispatch({
    type: SET_PRIVATE_KEYS,
    data: privateKeys
  })
}

export const deletePublicKey = fingerprint => (dispatch, getState) => {
  const state = getState()
  const publicKeys = { ...state.publicKeys }
  delete publicKeys[fingerprint]
  dispatch({
    type: SET_PUBLIC_KEYS,
    data: publicKeys
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
  privateKeys: {},
  publicKeys: {}
}

function rootReducer (state = initialState, action) {
  switch (action.type) {
    case REHYDRATE_STATE:
      return {
        ...state,
        ...action.data
      }
    case ADD_PRIVATE_KEY:
      return {
        ...state,
        privateKeys: {
          ...state.privateKeys,
          [action.data.fingerprint]: action.data
        }
      }
    case ADD_PUBLIC_KEY:
      return {
        ...state,
        publicKeys: {
          ...state.publicKeys,
          [action.data.fingerprint]: action.data
        }
      }
    case SET_PUBLIC_KEYS:
      return {
        ...state,
        pubicKeys: action.data
      }
    case SET_PRIVATE_KEYS:
      return {
        ...state,
        privateKeys: action.data
      }
    default:
      return { ...state }
  }
}

export const store = createStore(rootReducer, initialState, applyMiddleware(thunk, localStorageMiddleware))
