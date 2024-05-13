# Social-Media-Cite
Social Media Site


Features Implemented:
  - User's are able to create a post 
  - User's are able to delete a post
  - User's are able to edit a post
  - Pagination is implemented with a limit of 5 posts per page
  - User's able to see posts ordered by most likes or most recent
  - User Login/Signup 
  - User password is hashed and salted using bcrypt
  - login sessions are tracked using express-session
  - User's are able to like a post if they are signed in
  - User's are able to delete/update any post anyone has created (wasn't able to figure out how to make so they can only edit/delete their own posts)



schema.sql: contains the commands used to create the tables to store user information and posts

data.js: contians functions used by 'server.js' to interact with the database

