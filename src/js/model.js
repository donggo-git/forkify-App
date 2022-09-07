export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: []
}
import { API_URL, RES_PER_PAGE } from './config'
import { getJSON, sendJSON } from './helper';

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
        state.search.page = 1
    }
    catch (err) {
        console.error(err)
        throw err;
    }
}

const createRecipeObject = function (data) {
    const { recipe } = data?.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.sourceurl,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })

    }
}

export const loadRecipe = async function (recipeID) {
    try {
        const data = await getJSON(`https://forkify-api.herokuapp.com/api/v2/recipes/${recipeID}`)
        state.recipe = createRecipeObject(data)


        if (state.bookmarks.some(bookmark => bookmark.id === recipeID))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false
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

export const updateServing = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings
    });

    state.recipe.servings = newServings
}

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookMark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe)
    //mark current recipe
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
    persistBookmarks()
}
export const deleteBookMark = function (recipeID) {
    const index = state.bookmarks.findIndex(el => el.id === recipeID)
    state.bookmarks.splice(index, 1)

    if (recipeID == state.recipe.id) state.recipe.bookmarked = false
    persistBookmarks()
}

const init = function () {
    const storage = localStorage.getItem('bookmarks')
    if (storage) state.bookmarks = JSON.parse(storage)
}
init()

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(
            entry => entry[0].startsWith('ingredient') && entry[1] !== ""
        ).map(ing => {
            const ingArr = ing.replaceAll(" ", '').split(',')
            if (ingArr.length !== 3) {
                throw new Error('Wrong ingredients format, please use the correct format')
            }
            return { quantity: quantity ? +quantity : null, unit, description }
        })
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            serving: +newRecipe.serving,
            ingredients,
        }
        const data = await sendJSON(`${API_URL}?key=SOMEKEY`, recipe)
        state.recipe = createRecipeObject(data)
        addBookMark(state.recipe)
    } catch (err) {
        throw err
    }


}