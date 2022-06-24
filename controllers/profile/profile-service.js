const connection = require('../../services/mysql');
const config = require('../../config');



const getUserInfo = async (req, res, next) => {

    console.log(req.user_id)
    
}



module.exports = {
    getUserInfo,

}