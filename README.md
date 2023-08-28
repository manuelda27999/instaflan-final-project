# Instaflan

## Intro 

Instaflan is a project created with the aim of copying the functionalities of the social network Instagram, in order to set new goals that force me to improve my skills as a developer.

![](https://media3.giphy.com/media/iKPQgXxAJtJSg/giphy.gif?cid=ecf05e47fju38v1cjppwjkvsg4jp6wnr22fbk4b76hfr5aph&ep=v1_gifs_search&rid=giphy.gif&ct=g)

## Funcional Description 
The application will allow users to register and log in, they will be able to upload images with a description that other users can comment on and save to their favorite posts. Users will be able to follow each other, view other users' profiles and talk to each other. 
### Use Cases
 
- List posts
- Create, edit and delete post 
- Toggle favorite post 
- Follow and unfollow user
- See who are your followers and followers
- View profiles and view posts and favorite posts of profile
- View users you do not follow
- See posts from users you do not follow
- Search users
- Send messages between users, edit messages and delete messages
- Coment posts
- Notifications if someone interacts with your profile or your posts

### UI Design

link to [Figma](https://www.figma.com/file/cKuNiquDcIFG0LMrnLExJs/Untitled?type=design&node-id=1-8&mode=design&t=GrcaVAMisTuAwv59-0)

## Modules

Client module

- [app](../instaflan-fullstack/app/README.md): handles the client view and makes requests to the api

Server module

- [api](../instaflan-fullstack/api/README.md): handles client requests in the app by making requests to the database

## Data Model

User

- id (object id, required, unique)
- name (string, required)
- image (string)
- description (string)
- email(string, required, unique)
- password(string, required, min-length 8)
- favorite posts(array of post id, required)
- following users(array of user id, required)
- favorite posts(array of post id, required)
- notifications(array of notification, required)

Post 

- id (object id, required, unique)
- author (user id, ref user)
- image (string, required)
- text (string, required)
- date (date, required, auto)
- likes (number, required)
- comments (array of comment)

Comment

- id(object id, required, unique)
- author (object id, ref user, required)
- date (date, auto, required)
- text (string, required)

Chat 

- id(object id, required, unique)
- users (array of object id, ref user)
- messages (array of message)
- date (date, required, auto)
- unreadFor (array of object id, ref user, required)

Message

- id(object id, required, unique)
- author (object id, ref user, required)
- date (date, auto, required)
- text (string, required)
- edited (boolean, required)
- deleted (boolean, required)

## Planning

link to [Trello](https://trello.com/invite/b/ib6A8LV1/ATTI13b23ff609078db4e730d667498a206d090546C4/instaflan)