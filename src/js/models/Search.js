import axios from 'axios'; 
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '20635de61d3406296dde993f2f4329f4'; 
        const url = 'https://www.food2fork.com/api/search';
        try{
            const res = await axios(`${proxy}${url}?key=${key}&q=${this.query}`);
            this.result = res.data.recipes; 
            // console.log(this.result);
        } catch(error){
            console.log(error);
        }
    }  
}



   
