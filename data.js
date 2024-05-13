const mysql = require("mysql-await");


var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  dateStrings: true,      // added the following to format dates correctly
  host: "127.0.0.1",// this will work
  user: "",         // add user login information 
  database: "",     // add database login 
  password: "", // this is where the password for the database would go 
});




async function getPosts() {
  const sql = "SELECT * FROM posts ORDER BY post_id DESC";
  let posts = [];
  try {
    let results = await connPool.awaitQuery(sql);
    results.forEach(row => {
      const post = {
        id: row.post_id,
        content: row.post_data,
        likes: row.like_count,
      };
      posts.push(post);
    });
    return posts;
  } catch (exception) {
    console.log(exception);
    return [];
  }
}

async function addPost(data) {
  const sql = "INSERT INTO posts SET ?";
  try {
    await connPool.awaitQuery(sql, data);
    return true;
  } catch (exception) {
    console.log(exception);
    return false;
  }
}

async function updatePost(data) {
  const sql = "UPDATE posts SET post_data = ? WHERE post_id = ?";
  try {
    await connPool.awaitQuery(sql, [data.content, data.id]);
    return true;
  } catch (exception) {
    console.log(exception);
    return false;
  }
}

async function deletePost(id) {
  const sql = "DELETE FROM posts WHERE post_id = ?";
  try {
    await connPool.awaitQuery(sql, [id]);
    return true;
  } catch (exception) {
    console.log(exception);
    return false;
  }
}

// given a post id, increments the likes associated with the post by 1
async function likePost(id) {
  const sql = "UPDATE posts SET like_count = like_count + 1 WHERE post_id = ?";
  try {
    await connPool.awaitQuery(sql, [id]);
    return true;
  } catch (exception) {
    console.log(exception);
    return false;
  }
}

async function getUser(username) {
  const sql = "SELECT * FROM user WHERE user_name = ?";
  try {
    let results = await connPool.awaitQuery(sql, [username]);
    return results[0];
  } catch (exception) {
    console.log(exception);
    return {};
  }
}


async function getMostLiked() {
  const sql = "SELECT * FROM posts ORDER BY like_count DESC";
  let posts = [];
  try {
    let results = await connPool.awaitQuery(sql);
    results.forEach(row => {
      const post = {
        id: row.post_id,
        content: row.post_data,
        likes: row.like_count,
      };
      posts.push(post);
    });
    return posts;
  } catch (exception) {
    console.log(exception);
    return [];
  }
}

// encrypts user password and adds user to database if username is not taken. 
// returns true if successful, false otherwise
async function addUser(data) {
  try {
    const sql = "INSERT INTO user SET ?";
    await connPool.awaitQuery(sql, [data]);
    return true;
  } catch (exception) {
    console.log(exception);
    return false;
  }
}



module.exports = {getPosts, addPost, updatePost, deletePost, addUser, likePost, getUser, getMostLiked}


