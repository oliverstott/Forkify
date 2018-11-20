import Search from './models/Search';
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

