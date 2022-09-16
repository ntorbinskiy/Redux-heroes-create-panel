import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const heroAdapter = createEntityAdapter();

// const initialState = {
// 	heroes: [],
// 	heroesLoadingStatus: 'idle'
// }
const initialState = heroAdapter.getInitialState();

export const fetchHeroes = createAsyncThunk(
	'heroes/fetchHeroes',
	async () => {
		const { request } = useHttp();
		return await request("http://localhost:3001/heroes");

	}

)
const heroesSlice = createSlice({
	name: 'heroes',
	initialState,
	reducers: {

		heroCreated: (state, action) => {
			heroAdapter.addOne(state, action.payload)
		},
		heroDeleted: (state, action) => {
			heroAdapter.removeOne(state, action.payload);
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchHeroes.pending, state => { state.heroesLoadingStatus = 'loading' })
			.addCase(fetchHeroes.fulfilled, (state, action) => {
				state.heroesLoadingStatus = "idle";
				heroAdapter.setAll(state, action.payload);
			})
			.addCase(fetchHeroes.rejected, state => {
				state.heroesLoadingStatus = "error";
			})
			.addDefaultCase(() => { })
	}
});

const { actions, reducer } = heroesSlice;

export default reducer;
export const { selectAll } = heroAdapter.getSelectors(state => state.heroes);
export const {
	heroesFetching,
	heroesFetched,
	heroesFetchingError,
	heroCreated,
	heroDeleted } = actions;