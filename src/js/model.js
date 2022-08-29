export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    }
}
import { API_URL, RES_PER_PAGE } from './config'
import { getJSON } from './helper';

export const loadSearchResult = async function (query) {
    try {
        state.search.query = query

        const data = await getJSON(`${API_URL}?search=${query}`)

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
            }
        })
    }
    catch (err) {
        console.error(err)
        throw err;
    }
}

export const loadRecipe = async function (recipeID) {
    try {
        const data = await getJSON(`https://forkify-api.herokuapp.com/api/v2/recipes/${recipeID}`)
        const { recipe } = data?.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.sourceurl,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients

        }
    }
    catch (err) {
        throw err
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end)
}