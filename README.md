#  Vider - share experiences

## Project description:

Sometimes on a boring evening we find ourselves trying to find some good tips for movies and we don’t want the pure mainstream recommendation, we want tips - if possible- from someone that knows our taste. And since we usually never remember our friend’s last week recommendation, we thought vider could help.

On this website you can share and check anytime for recommendations on books and movies with the people that know you the most. Your friends! Every recommendation posted is shared in private groups where you can have total control of who can access it, and openly speak your heart and mind.


## User stories:

#### Must Have
- a user can create an account 
- a user can sign in
- a user has a profile
- a user can edit it’s profile

- a user can create a group
- a user can edit the group
- a user can invite other users to a group

- a member can create a movie 
- a member can edit a movie

- a group has a dashboard with information about the group and a movie section
- a member can see details of a movie

### Nice to have
- profile: 
  - history/timeline
  - email confirmation
  - have a list of avatars a user can choose
  - user can delete it’s account
  - users have a list of favorites
  - users can communicate to each others (messaging)

- group: 
  - timeline/history
  - have several sections (tv-shows, books, events, ...) with a preview on the groups page
  - more detailed sections (movie => movie, tv-show,   documentary, …)
  - users can choose between or create own categories for a  group
  - a member can sort or filter movies

- movie: 
  - a member can rate a movie with stars
  - comments
  - users can mark a movie as a favorite
  - a member can see a movie index page
  - import movie informations from external api’s

- memberships:
  - user roles (admin, member)	
  - admin can manage group memberships
  
## Model Schemas:

``` 
User = {
    name: {
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: String,
    quote: String,
    groups: [
        group: ObjectId
    ],
    timestamps
} 
``` 

``` 
Group = {
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    members: [
        user: ObjectId,
    ],
    movies: [
        movie: ObjectId
    ],
    timestamps
}
``` 

``` 
Movie = {
    title: {
        type: String, 
        required: true
    },
    plot: String,
    genre: String,
    year: Number,
    director: String,
    cast: String,
    trailer: String,
    rating: Decimal,
    picture: String,
    group: ObjectId,
    timestamps
}
``` 
	
## Model relationships:

```
--------                ---------
| User | -(n)------(n)- | Group |
--------                --------- 
                            |
                           (1)
                            |
                            |
                           (n)
                            |
                        ---------
                        | Movie |
                        ---------
```

## Route planning:

### public routes

#### session handling
-  get ‘/’ => landing page with signin form 
-  post ‘/signin’ => signin in and create session
-  get ‘/signup’ => get signup form
-  post ‘/signup’ => create user and session
-  post ‘/logout’ => delete session

### user private routes

#### view and edit user profile

- get ‘/profile/’ => show profile and groups 
- get ‘/profile/edit’ => edit user information - form 
- patch ‘/profile/update’ => update user - information

#### create a group

- get ‘/groups/new’ => new group form
- post ‘/groups/:groupId/create’ => create group and add members


### user and group private routes

#### view and edit a group

- get ‘/group/:groupId’ => show group information and - sections
- get ‘/groups/:groupId/edit’ => edit group form and add/remove members
- post ‘/groups/:groupId/update’ => update group
 
#### create and manage movies

- get ‘/group/:groupId/movies’ => index all movies of a - group
- get ‘/group/:groupId/movies/:movieId’ => show movie - details
- get ‘/group/:groupId/movies/new’ => new movie form
- post ‘/group/:groupId/movies/create’ => create movie
- get ‘/group/:groupId/movies/:movieId/edit’ => edit - movie form
- patch ‘/group/:groupId/movies/:movieId/update’ => - update movie

## Links

- [Kanban Board](https://trello.com/b/dytYvKCT/vider)

- [Git Repository](https://github.com/lemade3k-ironhack/vider/)

- [Wireframes](https://whimsical.com/landing-page-DbwFU6dBziLKxGmLH5nNw3)

