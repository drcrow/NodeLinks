const bcryptjs = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (pass) => {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(pass, salt);
    return hash;
}

helpers.matchPaswword = async (pass, hash) => {
    try{
        await bcryptjs.compare(pass, hash);
    }catch(e){
        console.log(e);
    }

}

module.exports = helpers;