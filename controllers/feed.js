exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "My First Post",
        content: "This is the first post on my rest api.",
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "Post created successfully",
    post: { id: new Date().getDate(), title: title, content: content },
  });
};
