import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
 Global State of The App
* - Search Object 
* - Current Recipe Object
* - Shopping List Object
* - Liked Recipes 
*/
const state = {};

const controlSearch = async () => {
    //1) Get query from view 
    const query = searchView.getInput();

    if (query) {
    //2) New search object and add to state
    state.search = new Search(query);

    //3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    //4) Search for Recipes 
    
        await state.search.getResults(); //Here we use await, because we need the results FIRST before we can display to UI.
    
    //5) Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/*
RECIPE CONTROLLER
*/
const controlRecipe = () => {
    //get ID from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id) {
    //Prepare UI for changes

    //Create new recipe object 

    //Get recipe data 

    //Calculate servings and time

    //Render Recipe
    }
}
window.addEventListener('hashChange', controlRecipe);