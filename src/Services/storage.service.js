const  Imagekit  = require("@imagekit/nodejs")

const imagekit = new Imagekit({
    privateKey: 'private_FvFX05pHkJn78FXARKxlvDBwx5c='
})

async function uploadFile(buffer){
    const result = await imagekit.files.upload({
        file: buffer.toString('base64'),
        fileName: "image.jpg"
    })
    return result
    
}

module.exports = uploadFile