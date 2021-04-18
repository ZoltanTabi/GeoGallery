import { labelReducer } from './reducers/labelReducer'
import { photoReducer } from './reducers/photoReducer'
import { combineReducers } from 'redux'
import { searchTermReducer } from './reducers/searchTermReducer';

export const rootReducer = combineReducers({
	labelState: labelReducer,
	photoState: photoReducer,
	searchTermState: searchTermReducer
})

export type RootState = ReturnType<typeof rootReducer>;
