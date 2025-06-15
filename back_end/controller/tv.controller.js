import { fetchFromTMDB } from "../services/tmdb.service.js";


export async function getTrendingTV(req, res) {
    try {
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US");

    
        const randomTV = data.results[Math.floor(Math.random() * data.results.length)];

        res.json({ success: true, content: randomTV });
    } catch (error) {
        console.error("Error fetching trending TV:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getTrailersTV(req,res) {
    const { id } = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
        res.json({success:true,trailers:data.results})
    }catch(error){
        if(error.message.includes("404")){
            return res.status(404).send(null);

        }
         res.status(500).json({success:false,message:"Lỗi cục bộ server!"});

    }
}

export async function getTVDetails(req,res) {
    const { id } = req.params;

    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}language=en-US`);
        res.status(200).json({success:true,content:data})
    }catch(error){
        if(error.message.includes("404")){
            return res.status(404).send(null);

        }
        res.status(500).json({success:false,message:"Lỗi cục bộ server!"});
    }
}

export async function getSimilarTV(req,res) {
    const { id } = req.params;

    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
        res.status(200).json({success:true,similar:data.results})
    }catch(error){
        res.status(500).json({success:false,message:"Lỗi cục bộ server!"});
    }
}

export async function getCategoryTV(req,res) {
    const { category } = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
        res.status(200).json({success:true,content:data.results})

    }catch(error){
        res.status(500).json({success:false,message:"Lỗi cục bộ server!"});

    }
}