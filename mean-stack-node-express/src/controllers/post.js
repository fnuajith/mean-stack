const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host"); 
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/src/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save()
    .then(result => {
        res.status(201).json({
            post: result
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Could not create post!'
        });
    });
};

exports.updatePost = (req, res, next) => {
    const postId = req.body.id;
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host"); 
        imagePath = url + "/src/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: postId, creator: req.userData.userId}, post)
      .then(result => {
        if (result.n > 0) {
            res.status(200).json({
                post: post
            });
        } else {
            res.status(401).json({
                message: 'You are not authorized to update the post!'
            });
        }
      })
      .catch(error => {
        res.status(500).json({
            message: 'Could not update the post!'
        });
      });
};

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize; // Using '+' to convert string to number
    const currentPage = +req.query.page; // Using '+' to convert string to number
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(posts => {
            fetchedPosts = posts;
            return Post.count();
        })
        .then((count) => {
            res.status(200).json({
            posts: fetchedPosts,
            maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Could not retrieve posts!'
            });
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.id;
    Post.findById(postId)
    .then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: "Post not found"
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Could not retrieve post"
        });
    });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.id;
    Post.deleteOne({
        _id: postId,
        creator: req.userData.userId
    }).then((result) => {
        if (result.n > 0) {
            res.status(200).json({
                message: "Post deleted"
            });
        } else {
            res.status(401).json({
                message: 'You are not authorized to delete the post!'
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Could not delete the post!'
        });
    });
};