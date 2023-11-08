exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "My First Post",
        content: "This is the first post on my rest api.",
        imageUrl: "images/vader.jpg",
        creator: {
          name: "Berat",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "Post created successfully",
    post: {
      _id: new Date().getDate(),
      title: title,
      content: content,
      creator: {
        name: "Berat",
      },
      createdAt: new Date(),
    },
  });
};
