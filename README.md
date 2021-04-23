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

- a group has a dashboard with information about the group and a movie section (preview)
- a member can see a movie index page
- a member can sort or filter movies
- a member can see details of a movie
- a member can rate a movie with stars

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
  - have several sections (tv-shows, books, events, ...)
  - more detailed sections (movie => movie, tv-show,   documentary, …)
  - users can choose between or create own categories for a   - group

- movie-details: 
  - comments
  - users can mark a movie as a favorite

- create movie:
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
    year: Date,
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

-  get ‘/’ => landing page with new signin form

// sessions

-  get ‘/signup’ => new signup form 
-  post ‘/signup’ => create account
-  get ‘/signin’ => new signin form
-  post ‘/signin’ => create session
-  post ‘/logout’ => delete session


// User profile
// private: only user has access

- get ‘/profile/:userId’ => show profile and groups 
- get ‘/profile/:userId/edit’ => edit user information - form 
- patch ‘/profile/:userId/update’ => update user - information

// Manage groups

- get ‘/profile/:userId/groups/new’ => new group form
- post ‘/profile/:userId/groups/create’ => create group
- get ‘/profile/:userId/groups/:groupId/edit’ => edit - group form
- post ‘/profile/:userId/groups/:groupId/update’ => - update group

// Manage memberships
// private: only group has access 

- get ‘/group/:groupId’ => show group information and - sections
- post ‘groups/:groupId/members/:userId/add’ => add User - to group

 
// Manage groups content
// private: only group has access 

- get ‘/group/:groupId/movies’ => index all movies of a - group
- get ‘/group/:groupId/movies/:movieId’ => show movie - details
- get ‘/group/:groupId/movies/new’ => new movie form
- post ‘/group/:groupId/movies/create’ => create movie
- get ‘/group/:groupId/movies/:movieId/edit’ => edit - movie form
- patch ‘/group/:groupId/movies/:movieId/update’ => - update movie

## links

- [Trello](https://trello.com/b/dytYvKCT/vider)

- [Github](https://github.com/lemade3k-ironhack/vider/)

- [Wireframe](https://whimsical.com/landing-page-DbwFU6dBziLKxGmLH5nNw3)

