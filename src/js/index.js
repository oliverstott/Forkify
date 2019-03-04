import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
 Global State of The App
* - Search Object 
* - Current Recipe Object
* - Shopping List Object
* - Liked Recipes 
*/
const state = {};
window.state = state;

//SEARCH CONTROLLER

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
    try{
        await state.search.getResults(); //Here we use await, because we need the results FIRST before we can display to UI.
    
    //5) Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);

        } catch (err) {
            alert('something wrong with the search');
            clearLoader();
        }
    }
};

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

// RECIPE CONTROLLER

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    //get ID from URL
    if(id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search
        if (state.search) searchView.highlightSelected(id);
        
        //Create new recipe object 
        state.recipe = new Recipe(id);

        try {
        //Get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        //Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        //Render Recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
    } catch (err) {
            alert('error processing recipe');
            console.log(err);
        }
    }
};
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// LIST CONTROLLER

//TESTING 
state.likes = new Likes();


const controlList = () => {
    //Create new list IF there is none yet
    if(!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
       const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}
    //Handle delete and update list item events
    elements.shopping.addEventListener('click', e=> {
        const id = e.target.closest('.shopping__item').dataset.itemid;

        //Handle delete button
        if(e.target.matches('.shopping__delete, .shopping__delete *')) {
            //Delete from state
            state.list.deleteItem(id);
            //Delete from UI
            listView.deleteItem(id);
            //Handle count update
        } else if (e.target.matches('.shopping__count-value')) {
            const val = parseFloat(e.target.value, 10);
            state.list.updateCount(id, val);
        }
    });

//LIKE CONTROLLER

    const controlLike = () => {
        if (!state.likes) state.likes = new Likes();
        const currentID = state.recipe.id;

        //User has not yet liked current recipe 
        if (!state.likes.isLiked(currentID)) {
            //Add like to state
            const newLike = state.likes.addLike(
                currentID, 
                state.recipe.title,
                state.recipe.author,
                state.recipe.img
                );
            
            //Toggle like button
            likesView.toggleLikeBtn(true);
            
            //Add like to UI list
            console.log(state.likes);
        //User has liked current recipe 
    } else {
            //Remove like to state
            state.likes.deleteLike(currentID);
            
            //Toggle like button
            likesView.toggleLikeBtn(false);
           
            //Remove like to UI list
            console.log(state.likes);
        }
    };

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    //Decrease button is clicked
    if (state.recipe.servings > 1) {
        state.recipe.updateServings('dec'); 
        recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredient to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
});

// window.l = new List();
