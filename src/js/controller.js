import * as model from './model'
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

if (module.hot) {
  module.hot.accept();
}



const controlRecipe = async function () {
  //debugger
  ///try {
  const recipeID = window.location.hash.slice(1);
  if (recipeID === '') return
  recipeView.renderSpinner()

  //0) Update results view to mark selected search result
  resultView.update(model.getSearchResultsPage())
  //console.log(recipeID)
  //1) loading recipe
  await model.loadRecipe(recipeID)
  //console.log(model.state.recipe)
  //console.log(recipeView)
  //console.log(resultView)
  //2) rendering recipe

  recipeView.render(model.state.recipe)
  //}
  /**catch (err) {
    recipeView.renderError("We couldn't find your recipe")
  }*/
}


const controlSearchResults = async function () {
  try {
    resultView.renderSpinner()

    //1) Get search query
    const query = searchView.getQuey();
    if (!query) return;
    //2) Load search result
    await model.loadSearchResult(query)
    //3) Render results
    resultView.render(model.getSearchResultsPage(1))
    //4) render initial pagination buttons
    paginationView.render(model.state.search)
  }
  catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  //1)render new result
  console.log(goToPage)
  resultView.render(model.getSearchResultsPage(goToPage))
  //2)render new pagination
  paginationView.render(model.state.search)
}

const controlServing = function (newServings) {
  //update the recipe serving (in state)
  model.updateServing(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  //1) add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe)
  else model.deleteBookMark(model.state.recipe)
  //2) Update recipe view
  recipeView.update(model.state.recipe)
  //3) Render bookmark
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = function () {

}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark)
  recipeView.addHandlerRender(controlRecipe)
  recipeView.addHandlerUpdateServing(controlServing)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()
