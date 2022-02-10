const postService =  require('../service/post.service');

exports.addPost = (req, res, next) => {
    //validation area
    const data = {
        description : req.body.description,
        imagePath: req.body.imagePath,
        addedByUserId: req.body.addedByUserId
    };

    postService.addPost(data, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                status: 400,
                success: 0,
                data: 'bad request'
            });
        }
        return res.status(200).send({
            status: 200,
            success: 1,
            data: result
        })
    })
};

exports.getAllPosts = (req, res, next)=>{
    const data = {};

    postService.getAllPosts(data, (error, result)=> {
        if(error) {
            console.log(error);
            return res.status(400).send({
                status: 400,
                success: 0,
                data: 'bad request'
            });
        }
        return res.status(200).send({
            status:200,
            success:1,
            data: result
        })
    });
}