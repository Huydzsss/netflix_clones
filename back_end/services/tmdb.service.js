import axios from "axios"
import { ENV_VARS } from "../config/envVars.js";
  
//  fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
//     .then(res => res.json())
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

export const fetchFromTMDB = async(url) =>{
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + ENV_VARS.TMDB_API_KEY
        }
      };
    const responsive = await axios.get(url,options);
    if(responsive.status !== 200){
        throw new Error('Lỗi khi ftech data ở TMDB ' + responsive.statusText);
    }

    return responsive.data;
}