import * as model from './model'
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';

if (module.hot) {
  module.hot.accept();
}



const controlRecipes = async function () {

  try {
    const recipeID = window.location.hash.slice(1);
    recipeView.renderSpinner()
    if (recipeID === '') return
    //console.log(recipeID)
    //1) loading recipe
    await model.loadRecipe(recipeID)
    //console.log(model.state.recipe)
    //console.log(recipeView)
    //console.log(resultView)
    //2) rendering recipe

    recipeView.render(model.state.recipe)
  }
  catch (err) {
    recipeView.renderError("We couldn't find your recipe")
  }
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
  recipeView.render(model.state.recipe)
  //update the recipe view

}

const init = function () {
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServing(controlServing)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}
init()
