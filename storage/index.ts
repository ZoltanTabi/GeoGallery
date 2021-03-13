import { labelReducer } from './reducers/labelReducer'
import { photoReducer } from './reducers/photoReducer'
import { combineReducers } from 'redux'

export const rootReducer = combineReducers({
	labelState: labelReducer,
	photoState: photoReducer
})

export type RootState = ReturnType<typeof rootReducer>;
