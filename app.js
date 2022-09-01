const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  imageUrl: String,
});

const Blog = mongoose.model('Blog', blogSchema);

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views/index.html'));
});

// url  to render all created blog posts
app.get('/blog', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views/blogs.html'));
});

app.get('/api/blog', async (req, res) => {
  try {
    let posts = await Blog.find({});
    return res.status(200).send({
      message: 'posts fetched successfully',
      posts,
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
});

//api url to create a new blog data into the db
app.post('/blog', async (req, res) => {
  try {
    const { title, imageUrl, author, body } = req.body;
    const newBlog = await Blog.create({
      title: title,
      imageUrl: imageUrl,
      author: author,
      body: body,
    });
    return res
      .status(200)
      .send({ message: 'blog post created successfully', data: newBlog });
  } catch (err) {
    return res.status(500).send({
      message: err.messsage,
    });
  }
});

//url to render the form to create a new blog post
app.get('/blog/new', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views/new.html'));
});

// to render a single blog post
app.get('/blog/:id', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views/blog.html'));
});

// to render a single blog post
app.get('/blog/:id/edit', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views/edit.html'));
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const post = await Blog.findById(blogId);
    return res.status(200).send({
      message: 'single post fetched',
      post: post,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

//api url to update existing blog post data into the db
app.put('/api/blog/:id', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      author: req.body.author,
      body: req.body.body,
    });
    return res.status(200).send({ message: 'blog post updated successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

//api url to update existing blog post data into the db
app.delete('/api/blog/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.listen(5001, async () => {
  let db = await mongoose.connect('mongodb://localhost/blogapp');
  //   console.log(db);
  console.log('app running on port 5001');
});
