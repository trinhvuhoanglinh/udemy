const connection = require('../../services/mysql');
const config = require('../../config');


const all = async (req, res, next) => {

    const genres = await connection.query('SELECT * FROM genres')
    genres.subGenres = await connection.query('SELECT subgenres._id, subgenres.name FROM subgenres INNER JOIN genres ON subgenres.genre = genres._id');
    console.log(genres);
    res.send(genres);
    
//     const genres = await connection.query('SELECT * FROM genres');
//     const subGenres = await connection.query('SELECT * FROM subgenres');

//     for (let i = 0; i < genres.length; i++) {
//         const genre = genres[i];
//         genre.subgenres = [];
//         for (let j = 0; j < subGenres.length; j++) {
//             const subGenre = subGenres[j];
//             if (subGenre.genre === genre._id) {
//                 genre.subgenres.push(subGenre);
//             }
//         }
//     }

//     res.send(genres);
}

module.exports = {
    all,


}