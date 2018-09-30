import axios from 'axios'; 

const proxy = 'https://cors-anywhere.herokuapp.com/';
const key = '20635de61d3406296dde993f2f4329f4'; 
const url = 'https://www.food2fork.com/api/search';

    async function getResults(query){
        const res = await axios(`${proxy}${url}?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
} 

getResults('pizza');