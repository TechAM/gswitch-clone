import {combineReducers} from 'redux'

import {CROSS_FINISH_LINE} from '../actions'

const initialState = {
    gameOver: false,
    winner: null
}

const reducer = (state=initialState, action) => {
    switch(action.type){
        case CROSS_FINISH_LINE:
            return {
                ...state,
                gameOver: true,
                winner: action.playerId
            }
        default:
            return state
    }
}