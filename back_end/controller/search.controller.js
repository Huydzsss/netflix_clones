import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(req, res) {
    const { query } = req.params;

    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`);
        if (data.results.length === 0) {
            return res.status(404).send(null);
        }
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: data.results[0].id,
                    image: data.results[0].profile_path,
                    title: data.results[0].name,
                    searchType: "person",
                    createdAt: Date.now()
                }
            }
        });
        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        console.log("Lỗi ở controller searchPerson!", error.message);
        res.status(500).json({ success: false, message: "Lỗi ở server cục bộ!" });
    }
}

export async function searchMovie(req, res) {
    const { query } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`);
        if (data.results.length === 0) {
            return res.status(404).send(null);
        }
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: data.results[0].id,
                    image: data.results[0].poster_path,
                    title: data.results[0].name, 
                    searchType: "movie",
                    createdAt: Date.now()
                }
            }
        });
        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        console.log("Lỗi ở controller searchMovie!", error.message);
        res.status(500).json({ success: false, message: "Lỗi ở server cục bộ!" });
    }
}

export async function searchTV(req, res) {
    const { query } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`);
        if (data.results.length === 0) {
            return res.status(404).send(null);
        }
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: data.results[0].id,
                    image: data.results[0].poster_path,
                    title: data.results[0].name,
                    searchType: "tv",
                    createdAt: Date.now()
                }
            }
        });
        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        console.log("Lỗi ở controller searchTV!", error.message);
        res.status(500).json({ success: false, message: "Lỗi ở server cục bộ!" });
    }
}

export async function getSearchHistory(req, res) {
    try {
        res.status(200).json({ success: true, content: req.user.searchHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi ở server cục bộ!" });
    }
}

export async function removeItemFromHistory(req,res) {
   const { id } = req.params;
  
   try {
    await User.findByIdAndUpdate(req.user._id,{
        $pull:{
            searchHistory:{id:id},
        }
    })
    res.status(200).json({ success: true, message:"Xóa thành công khỏi lịch sử tìm kiếm" });

   } catch (error) {
    console.log("Lỗi không thể xóa ở lịch sử tìm kiếm!",error.message);
    res.status(500).json({ success: false, message: "Lỗi ở server cục bộ!" });
   }
}