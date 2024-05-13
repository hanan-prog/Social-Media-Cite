CREATE TABLE user (
  user_id INT AUTO_INCREMENT,
  user_name VARCHAR(40) NOT NULL UNIQUE,
  user_password TEXT NOT NULL,
  PRIMARY KEY(user_id)
);



CREATE TABLE posts (
  post_id INT AUTO_INCREMENT,
  post_data VARCHAR(60) NOT NULL,
  like_count INT,
  user_id int,
  PRIMARY KEY(post_id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);
