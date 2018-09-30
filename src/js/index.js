import Search from './models/Search';

/* Global State of The App
* - Search Object 
* - Current Recipe Object
* - Shopping List Object
* - Liked Recipes 
*/
// const state = {};

const controlSearch = async () => {
    //1) Get query from view 
    const query = 'Pizza';

    if (query) {
    //2) New search object and add to state
    state.search = new Search(query);

    //3) Prepare UI for results

    //4) Search for Recipes 
    try{
        await state.search.getResults(); //Here we use await, because we need the results FIRST before we can display to UI.
    
        //5) Render results on UI
        console.log(state.search.result);
    } catch(error){
        console.log(error);
        }
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

