

class FirebaseManager {

    constructor() {

    }

    /**
     * Loads the profile of the specified user from Firebase and stores it's
     * information in the session storage for later use
     * @param {User} userToLoad The user to get the informaiton for
     */
    static loadUserProfile(userToLoad) {             

        console.log(userToLoad.uid)
        // Makes a reference to the database
        var database = firebase.database().ref("users/" + userToLoad.uid);
        database.once('value').then(function(snapshot) {
            // Checks if the data exists    
                console.log(userToLoad.uid)

            if(snapshot.val() != null) {
                // Stores the respective information in the session storage
                sessionStorage.setItem('userName', snapshot.val().name);
                sessionStorage.setItem('isAdmin', snapshot.val().isAdmin); 
                sessionStorage.setItem('uid', userToLoad.uid);
                sessionStorage.setItem('email', userToLoad.email);
                // Gets the list of favorite movies
                var movies = snapshot.val().favoriteMovies;
                // Stores the movie list in the session storage
                sessionStorage.setItem('favoriteMovies', movies);
                // Goes back to the main page
                console.log("SDSDSDSD")
                window.location.replace("index.html"); 
            }
        });
    }

    /**
     * Saves the profile of the current user to Firebase
     */
    static saveUserProfile(uid) {
        // Updates the values in the firebase database
        console.log("Here with uid: " + uid)
        firebase.database().ref("users/" + uid).update({ 
            name : sessionStorage.getItem('userName'),
            favoriteMovies : [],
            isAdmin : sessionStorage.getItem('isAdmin')}, function(error) {
            if(error) {
                alert("There was an issue saving some of your information")
            } else {
                window.location.replace("index.html"); 
            }
        })
    
    }

    /**
     * Changes the users name to the one specified
     * @param {String} newName The new name of the user
     */
    static updateName(newName) {
        // Gets the uid of the user
        var uid = sessionStorage.getItem('uid')
        if(uid == null) // Checks if there's a valid uid
            return
        sessionStorage.setItem('userName', newName) // Changes the name in the sessionStorage
        // Updates the value on firebase
        firebase.database().ref("users/" + uid).update( {
            name : newName
        })
    }

    /**
     * Changes the admin status to the one specified
     * @param {Boolean} isAdmin 
     */
    static updateAdmin(isAdmin) {
        // Gets the uid of the user
        var uid = sessionStorage.getItem('uid')
        if(uid == null) // Checks if there's a valid uid
            return
        sessionStorage.setItem('isAdmin', isAdmin) // Changes the isAdmin status in the sessonStorage
        // Updates the value on firebase
        firebase.database().ref("users/" + uid).update( {
            isAdmin : isAdmin
        })
    }

    static updatePassword(newPassword) {
        return new Promise((success, fail) => {
            firebase.auth().currentUser.updatePassword(newPassword).then(() => {
                success(true) // Update succeded
            }, (error) => {
                success(false) // Update failed
            })
        })
        
    }

    static isUser(email, password) {
        return new Promise((success, fail) => {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
                var uid = result.user.uid
                if(sessionStorage.getItem('uid').localeCompare(uid) == 0) {
                    success(true)
                } else {
                    firebase.auth().signOut()
                    success(false)
                }
            }).catch(error => {
                success(false)
            })
        })
    }

    /**
     * Changes the users favorite movies to the one specified
     * @param {[Movie]} favoriteMovies 
     */
    static updateFavoriteMovies(favoriteMovies) {
        // Gets the uid of the user
        var uid = sessionStorage.getItem('uid')
        if(uid == null) // Checks if there's a valid uid
            return
        var ranks = [] // Stores the ranks of the given movie 
        // Puts the ranks of the new favorite movies list into the rank aarray
        favoriteMovies.forEach(element =>
            ranks.push(element.rank)
        )
        // Updates the value on firebase
        firebase.database().ref("users/" + uid).update( {
            favoriteMovies : ranks
        })
    }
    
    /**
     * Check's if the given movie rank is in the users favorite
     * @param {Number} rank The rank of the given movie 
     * @param {String} useruid The uid of the user
     */
    static isFavoriteMovie(rank, useruid) {
        // Returns a promise containing the result
        return new Promise((resFunc, rejFunc) => {
            // Reads the users information on the database
            firebase.database().ref("users/" + useruid).once('value').then(function(snapshot) {
                // Checks if the data snapshot exists
                if(snapshot.val() != null) {
                    // Checks to make sure the user has a favorite movies list
                    if(snapshot.val().favoriteMovies != null) {
                        // Explores the elemnents of the favorite movies function
                        snapshot.val().favoriteMovies.forEach(element => {
                            // Checks if the current rank is equal to the one given 
                            if(element == rank) {
                                resFunc(true) // If true, returns the result to the user
                            }
                        })
                        resFunc(false) // Couldn't find it, returns false to the user
                    } else {
                        resFunc(false) // Couldn't find it, returns false to the user
                    }
                } else {
                    resFunc(false) // Couldn't find it, returns false to the user
                }
            })
        })
    }

    /**
     * Adds the specified movie to the user's favorite movie list
     * @param {Movie} movie The movie to add 
     * @param {String} useruid The user's uid
     */
    static addFavoriteMovie(movie, useruid) {
        // Reads the data from firebase
        firebase.database().ref("users/" + useruid).once('value').then(function(snapshot) {
            // Checks if the snapshot is valid
            if(snapshot.val() != null) {
                // Check's if the user has a favorites movie list
                if(snapshot.val().favoriteMovies != null) {
                    let newmovies = snapshot.val().favoriteMovies // Stores the users current list
                    newmovies.push(movie.rank) // Adds the new rank 
                    // Saves the new informatiom to firebase
                    firebase.database().ref("users/" + useruid).update( { favoriteMovies : newmovies });
                } else {
                    // Saves the new information to firebase
                    firebase.database().ref("users/" + useruid).update( { favoriteMovies : [movie.rank] });
                }
            }
        });
    }

    /**
     * Removes the specified movie to the user's favorite movie list
     * @param {Movie} movie The movie to add 
     * @param {String} useruid The user's uid
     */
    static removeFavoriteMovie(movie, useruid) {
        // Reads the data from firebase
        firebase.database().ref("users/" + useruid).once('value').then(function(snapshot) {
            // Checks if the snapshot is valid
            if(snapshot.val() != null) {
                // Checks if the user has a favorite movie list
                if(snapshot.val().favoriteMovies != null) {
                    let newmovies = snapshot.val().favoriteMovies // Stores the users favorite movie list
                    newmovies.splice(newmovies.indexOf(movie.rank), 1) // Removes the specified movie
                    // Updates the value on firebase
                    firebase.database().ref("users/" + useruid).update( { favoriteMovies : newmovies });
                }
            }
        });
    }

    /**
     * Creates a new user profile based on the given email, password and name
     * @param {String} email The email of the new user
     * @param {String} password The password of the new user
     * @param {String} name The name of the new user
     */
    static createUser(email, password, name) {
        // Creates a new firebase user with the given email and password
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
            // Saves the information to the session storage
            sessionStorage.setItem('userName', name);
            sessionStorage.setItem('isAdmin', false);
            sessionStorage.setItem('uid', result.user.uid);
            sessionStorage.setItem('email', email); 
            sessionStorage.setItem('favoriteMovies', [])
            // Saves the new user information to the database
            FirebaseManager.saveUserProfile(result.user.uid);
            // Goes back to the main page
        }).catch(function(error) {
            var errorMessage = error.message;
            // Alerts the user of the error
            window.alert(errorMessage);
        });

    }

    /**
     * Attempts to login the user with the specified email and password
     * @param {String} email The email of the user
     * @param {String} password The password of the user
     */
    static loginUser(email, password) {
        console.log(firebase.auth())
        // Attempts to login with the specified email and passworrd
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
            // Pulls the information and loads the profile from firebase
            console.log("HERER2E")

            FirebaseManager.loadUserProfile(new User(result.user.uid, "", "", email));
        }).catch(function(error) {
            console.log("HERER3E")
            var errorMessage = error.message;
            // Alerts the user of the error
            window.alert(errorMessage);
        });
    }

    /**
     * Attempts to logout the user of the current account
     */
    logoutUser() {
        // Attempts to logout of the current account
        firebase.auth().signOut().then(function() {
            // Removes the users information from the session storage
            sessionStorage.setItem('userName', null);
            sessionStorage.setItem('isAdmin', null); 
            sessionStorage.setItem('uid', null);
            sessionStorage.setItem('email', null); 
            window.alert("You have signed out successfully");
        }).catch(function(error) {
            // Alerts the user of the error
            window.alert(error.message);
        });
    }

    /**
     * Changes the admin-status of the given user
     * @param {User} user The user to give/remove admin access
     * @param {Boolean} isAd True if the user is to become an admin, false otherwise
     */
    makeAdmin(user, isAd) {
        // Updates the session storage
        sessionStorage.setItem('isAdmin', isAd);
        // Updates firebase
        firebase.database().ref("users").child(user.uid).update( { isAdmin : user.isAdmin} )
    }

    /**
     * Loads the movie with the specified rank
     * @param {Number} rank 
     * @return A Promise with the specified movie
     */
    static loadMovie(rank) {
        return new Promise((success, fail) => {
            var database = firebase.database();
            // Pulls the movie information from the database
            database.ref("items/" + rank).once('value').then(function(snapshot) {
                // Checks to make sure the snapshot value is valid
                if(snapshot.val() != null) {
                    var actors = [] // Stores the actor objects of the movie
                    // Creates an array of actors from the snapshot data
                    snapshot.val().cast.forEach(element => {
                        actors.push(new Actor(element, new Date()));
                    })
                    var genres = [] // Stores the genre objects of the movie
                    // Creates an array of genres from the snapshot data
                    snapshot.val().genre.forEach(element => {
                       genres.push(new Genre(element)) 
                    })
                    // Stores all of the information in the movie reference
                    var movie = new Movie(snapshot.val().title, new Director(snapshot.val().director, new Date()), actors, snapshot.val().year, genres, snapshot.val().image, rank);
                    
                    // Checks the thumbsup rating
                    if(snapshot.val().thumbsup != null) {
                        movie.setThumbUp(snapshot.val().thumbsup)
                    } 

                    // Checks the thumbsdown rating 
                    if(snapshot.val().thumbsdown != null) {
                        movie.setThumbDown(snapshot.val().thumbsdown)
                    }
                    
                    // Returns a promise to the user
                    success(movie)
                }
            
            })
        })
    }

    /**
     * Updates the movie poster on Firebase
     * @param {Movie} movie The movie to update
     * @param {String} image The new image URL
     */
    uploadMoviePoster(movie, image) {
        var database = firebase.database();
        // Updates the image reference on firebase
        database.ref("items").child(movie.rank).update( { image : image})
    }   

    /**
     * Loads all of the movies in the database
     */
    static loadAllMovies() {
        // Returns a promise to the user
        return new Promise((success, fail) => {
            var movies = [] // Stores the movie objects
            // Reads the movie information from the database
            firebase.database().ref("items").once('value').then(function (snapshot) {
                var i = [] 
                // Checks if the snapshot is valid
                if(snapshot.val() != null) {
                    // Explores the movies located in the snapshot
                    for(i = 0; i < snapshot.val().length; i++) {
                        // Loads the movie with the specified rank i
                        FirebaseManager.loadMovie(i).then(function(movie) {
                            movies.push(movie) // Adds the movie to the movies list
                            // Checks if this was the last movie to be added
                            if(movie.rank+1 == snapshot.val().length) {
                                success(movies) // Returns the movie list to the user
                            }
                        })
                    }
                }
            });
        })
    }

    /**
     * Loads a movie with the specified name
     * @param {String} name The name of the movie
     */
    static loadMovieWithName(name) {
        // Returns a promise to the user
        return new Promise((success, fail) => {
            // Loads all of the movies
            this.loadAllMovies().then(function(movies) {
                // Explores all of the movies loaded
                for(var i = 0; i < movies.length; i++) {
                    // Checks to see if the movie name is equal
                    if(movies[i].getTitle() == name) {
                        success(movies[i]) // Returns the movie to the user
                        return // Ends the function
                    }
                }
                fail("Unable to find movie in database") // Reported if there is no movie with that reference
            })

        })
        
    }

    /**
     * Adds the specified movie to the genre page
     * @param {String} movie The movie name
     * @param {Genre} genre  The genre to add the movie to
     */
    static addMovieToGenre(movie, genre) {
        // Returns a promise to the user
        return new Promise((success, fail) => {
            // Loads the specified movie with the name=
            this.loadMovieWithName(movie).then(function(mmovie) {
                // Explores the movies current genres
                for(var i = 0; i < mmovie.getGenre().length; i++) {
                    // Checks if the given genre is equal to the one specified
                    if(mmovie.getGenre()[i] == genre) {
                        success(false) // Returns false since that movie is already in that genre
                    }
                }
                mmovie.addGenre(genre) // Adds the genre to the movie list
                // Updates the value on firebase
                firebase.database().ref('items/' + mmovie.rank).update({ genre : mmovie.getGenre()})
                success(true) // Returns a success to the user
            })
        })
        
    }
        
    /**
     * Checks to see if the given genre name is valid
     * @param {String} genre The genre name to check
     */
    static isGenre(genre) {
        // Returns a new promise to the user
        return new Promise((success, fail) => {
            // Loads all of the movies
            FirebaseManager.loadAllMovies().then(function(movies) {
                // Explores all of the movies
                for(var i = 0; i < movies.length; i++) {
                    // Explores the genre of each movie
                    for(var i2 = 0; i2 < movies[i].getGenre().length; i2++) {
                        // Checks to see if the given genre exists in the movie
                        if(movies[i].getGenre()[i2].getName() == genre) {
                            success(true) // Returns true since it's shown that the given genre exists
                            return // Stops the function
                        }
                    }
                    
                }
                success(false) // Returns false since the genre couldn't be found
            })
        })
        
    }

    /**
     * Checks if the given movie name is an existing movie name
     * @param {String} movie The movie name to check
     */
    static isMovie(movie) {
        // Returns a promise to the user
        return new Promise((success, fail) => {
            // Loads all of the movies
            FirebaseManager.loadAllMovies().then(function(movies) {
                // Explores all of the movies
                for(var i = 0; i < movies.length; i++) {
                    // Checks if the given title equals the title specified
                    if(movies[i].getTitle() == movie) {
                        success(true) // Returns true since it found the movie title
                        return // End the function
                    }
                }
                success(false) // Returns false since it couldn't find the movie title
            })
        })
    }

    /**
     * Loads all of the genres found in the database
     */
    static loadGenres() {
        // Returns a new promise to the user
        return new Promise((success, fail) => {
            var genres = [] // Stores the Genre objects
            // Reads all of the movie information
            firebase.database().ref("items").once('value').then(function(snapshot) {
                // Explores all of the movies
                for(var i = 0; i < snapshot.val().length; i++) {
                    var info = snapshot.val()[i] // Stores the movie info
                    var genre = info.genre; // Stores the movie's genre array
                    // Explores the genre's
                    for(var i2 = 0; i2 < genre.length; i2++) {
                        // Checks to see if the given genre is already in the genres array
                        if(genres.indexOf(genre[i2]) == -1) {
                            genres.push(genre[i2]) // Adds the entry to the genres array
                        }
                    }
                    // Checks if this is the last movie to be evaluated
                    if(i+1 == snapshot.val().length) {
                        success(genres) // Returns the genre array to the user
                    }
                }  
            })
        })
    }

    /**
     * Checks if the user already thumbedUp for the given movie title
     * @param {String} movie The movie title
     */
    static didUserThumbUpForMovie(movie) {
        // Returns a new promise to the user 
        return new Promise((success, fail) => {
            // Stores the user's uid
            var uid = sessionStorage.getItem('uid')
            // Reads the information of the user's thumbed_up movies
            firebase.database().ref("users/" + uid + "/movies_thumbup").once('value').then(function(snapshot){
                // Stores all of the movie information
                var movies = snapshot.val()
                // Explores all of the movies
                for(var i = 0; i < movies.length; i++) {
                    // Checks if the movie title is equal to the one specified
                    if(movies[i] == movie) {
                        success(true) // Retuns true to the user since it was found in the list
                        return // Stops the function
                    }
                }
                success(false) // Returns false to the user since it was not found
            }).catch(function(error) {
                console.log(error.message) 
                success(false) // Returns false to the user since an error was thrown
            })
        })
    }

    /**
     * Checks if the user already thumbedDown for the given movie title
     * @param {String} movie The movie title
     */
    static didUserThumbDownForMovie(movie) {
        // Returns a new promise to the user
        return new Promise((success, fail) => {
            // Stores the user's uid
            var uid = sessionStorage.getItem('uid')
            // Reads the information of the user's thumbed_down movies
            firebase.database().ref("users/" + uid + "/movies_thumbdown").once('value').then(function(snapshot){
                // Stores all of the movie information
                var movies = snapshot.val()
                // Explores all of the movies
                for(var i = 0; i < movies.length; i++) {
                    // Checks if the movie title is equal 
                    if(movies[i] == movie) {
                        success(true) // Returns true since the movie was found in this list
                        return // Stops the function
                    }
                }
                success(false) // Retrns false since it wasn't found
            }).catch(function(error) {
                success(false) // Returns false since it wasn't found
            })
        })
    }

    /**
     * Adds the movie to the user thumbs up list
     * @param {String} movie 
     */
    static setUserThumbUpForMovie(movie) {
        // Returns a new promise
        return new Promise((success, fail) => {
            // Stores the user's uid
            var uid = sessionStorage.getItem('uid')
            // Reads the users thumb's up page 
            firebase.database().ref("users/" + uid + "/movies_thumbup").once('value').then(function(snapshot) {
                // Stores the movie list in an array
                var movies = snapshot.val()
                // Explores the movie list
                for(var i = 0; i < movies.length; i++) {
                    // Checks if the movie title is within the lsit
                    if(movies[i] == movie) {
                        success(false) // Returns false since the movie is already in it
                        return // Stops the function
                    }
                }
                movies.push(movie) // Adds the movie to the list
                // Updates the value on firebase
                firebase.database().ref("users/" + uid).update({ movies_thumbup : [movies]})
                success(true) // Returns true since it was able to be added
                return // Stops the function
            }).catch(function(error) {
                // Creates a new list to send to firebase
                firebase.database().ref("users/" + uid).update({ movies_thumbup : [movie]})
                success(true) // Returns true since it was able to be added
                return // Stops the function
            }) 
        })
    }
    
    /**
     * Tries to remove the remove the specified movie from the thumbsup list 
     * @param {String} movie The movie title
     */
    static removeUserThumbUpForMovie(movie) {
        // Returns a new promise to the user
        return new Promise((success, fail) => {
            // Stores the uid
            var uid = sessionStorage.getItem('uid')
            // Reads the users thumbsup information  
            firebase.database().ref("users/" + uid + "/movies_thumbup").once('value').then(function(snapshot) {
                var movies = snapshot.val() // Stores the movie list from firebase
                var newmovies = [] // Stores the new movies
                // Explores the users current movie list 
                for(var i = 0; i < movies.length; i++) {
                    // Checks if the given movie titles are equal
                    if(movies[i] == movie) {
                    } else {
                        newmovies.push(movies[i]) // If not, it adds it to the new movie list
                    }
                }
                // It updates firebase with the new movies 
                firebase.database().ref("users/" + uid).update({ movies_thumbup : newmovies})
                success(true) // Returns true if the update was successfull
                return
            }).catch(function(error) {
                success(false) // Returns false since there was an error
                return
            }) 
        })
    }

    /**
     * Adds the specified movie to the users thumbdown list
     * @param {String} movie The movie title
     */
    static setUserThumbDownForMovie(movie) {
        // Returns a new promise to the user
        return new Promise((success, fail) => {
            // Stores the uid 
            var uid = sessionStorage.getItem('uid')
            // Reads the users thumbdown information
            firebase.database().ref("users/" + uid + "/movies_thumbdown").once('value').then(function(snapshot) {
                var movies = snapshot.val() // Stores the movies list from firebase
                // Explores the movie list
                for(var i = 0; i < movies.length; i++) {
                    // Checks if the given movie list are equal
                    if(movies[i] == movie) {
                        success(false) // Returns false since the movie is already in the lis
                        return // Stops the function
                    }
                }
                movies.push(movie) // Adds the movie to the thumbdown list
                // Updates the value on firebase
                firebase.database().ref("users/" + uid).update({ movies_thumbdown : [movies]})
                success(true) // Returns true since adding it succededs
                return
            }).catch(function(error) {
                // Updates the value on firebase with a new list containing the movie name
                firebase.database().ref("users/" + uid).update({ movies_thumbdown : [movie]})
                success(true) // Returns true since adding it succededs
                return
            }) 
        })
    }

    /**
     * Tries to remove the movie title from the users thumbdown list
     * @param {String} movie 
     */
    static removeUserThumbDownForMovie(movie) {
        // Returns a new promise from the user
        return new Promise((success, fail) => {
            // Stores the uid
            var uid = sessionStorage.getItem('uid')
            // reads the users thumbdown information
            firebase.database().ref("users/" + uid + "/movies_thumbdown").once('value').then(function(snapshot) {
                var movies = snapshot.val() // Stores the movie list read from firebase
                var newMovies = [] // Stores the updated movie list
                // Explores the current movie list 
                for(var i = 0; i < movies.length; i++) {
                    // Checks to see if the two given movie titles are similar
                    if(movies[i] == movie) {
                    } else {
                        newMovies.push(movies[i]) // Adds the movie title to the new movie list 
                    }
                }
                // Updates the movie list on Firebase
                firebase.database().ref("users/" + uid).update({ movies_thumbdown : newMovies})
                success(true) // Returns true since the update was successful
                return 
            }).catch(function(error) {
                console.log(error) // Logs the error
                success(false) // Returns false since the update was unsuccessful
                return
            }) 
        })
    }

    /**
     * Increments the thumbsup counter on the movie with the specified rank
     * @param {Number} rank The rank of the movie
     */
    static incrementMovieThumbsUp(rank) {
        // Reads the current thumbsup value
        firebase.database().ref("items/" + rank + "/thumbsup").once('value').then(function(snapshot) {
            var val = snapshot.val() // Stores the current value
            val++; // Increments by 1
            // Updates the count on firebase
            firebase.database().ref("items/" + rank).update({ thumbsup : val} )
        }).catch(function(error) {
            // Creates  a new counter with a count of 1
            firebase.database().ref("items/" + rank).update({ thumbsup : 1} )
        })
    }

    /**
     * Decrements the thumbsup counter on the movie with the specified rank
     * @param {Number} rank The rank of the movie
     */
    static decrementMovieThumbsUp(rank) {
        // Reads the current thumbsup value
        firebase.database().ref("items/" + rank + "/thumbsup").once('value').then(function(snapshot) {
            var val = snapshot.val() // Stores the current value
            Math.max(val--, 0); // Decrements by 1, ensuring the value won't go below zero
            // Updates the count on firebase
            firebase.database().ref("items/" + rank).update({ thumbsup : val} )
        }).catch(function(error) {
            // Creates a new counter with a count of 0
            firebase.database().ref("items/" + rank).update({ thumbsup : 0} )
        })
    }

    /**
     * Increments the thumbsdown counter on the movie with the specified rank
     * @param {Number} rank  The rank of the movie
     */
    static incrementMovieThumbsDown(rank) {
        // Reads the current thumbsdown value
        firebase.database().ref("items/" + rank + "/thumbsdown").once('value').then(function(snapshot) {
            var val = snapshot.val() // Stores the current value
            val++; // Increments the counter by one
            // Updates the value on firebase
            firebase.database().ref("items/" + rank).update({ thumbsdown : val} )
        }).catch(function(error) {
            // Creates a new counter with a count of 1
            firebase.database().ref("items/" + rank).update({ thumbsdown : 1} )
        })
    }

    /**
     * Decrements the thumbsdown counter on the movie with the specified rank
     * @param {Nuumber} rank The rank of the movie
     */
    static decrementMovieThumbsDown(rank) {
        // Reads the current thumbsdown value
        firebase.database().ref("items/" + rank + "/thumbsdown").once('value').then(function(snapshot) {
            var val = snapshot.val() // Stores the current value
            Math.max(val--, 0); // Decrements the counter by one, ensuring it won't go below zero
            // Updates the value on firebase
            firebase.database().ref("items/" + rank).update({ thumbsdown : val} )
        }).catch(function(error) {
            // Creates a new counter with a count of 0
            firebase.database().ref("items/" + rank).update({ thumbsdown : 0} )
        })
    }

    /**
     * Puts a movie request on the database with the specified information
     * @param {String} title 
     * @param {String} director 
     * @param {String} actors 
     * @param {Date} date 
     * @param {String} poster 
     */
    static requestMovieWithInfo(title, director, actors, date, poster) {
        // Returns a new promise
        return new Promise((success, fail) => {
            // Adds the new request to the database
            if(actors.length == 0) {
                actors.push("None")
            }
            firebase.database().ref('requests').push({
                title : title,
                director : director,
                actors : actors,
                date : date,
                poster : poster
            }, function(error) {
                if(!error) {
                    // Returns true to the user since it was successful
                    success(true)
                } else {
                    // Returns false to the user since it was unsuccessful
                    success(false)
                }
            }) 
        }) 
    }

    /**
     * Loads all of the movie requests
     */
    static loadMovieRequests() {
        // Returns a new promise to the ser
        return new Promise((success, fail) => {
            // Reads all of the data from the database
            firebase.database().ref('requests').once('value').then(function(snapshot) {
                // Checks to make sure it exists
                console.log(snapshot.val())
                if(snapshot != null && snapshot.val() != null) {
                    var movies = [] // Stores all of the information
                    var keys = Object.keys(snapshot.val()) // Stores the keys from the database
                    console.log(keys.length)
                    // Explores the list of movies
                    for(var i = 0; i < keys.length; i++) {
                        var key = keys[i] // Gets the current key
                        var element = snapshot.val()[key] // Gets the information based on the key
                        var actors = []
                        for(var i2 = 0; i2 < element.actors.length; i2++) {
                            actors.push(new Actor(element.actors[i2], new Date()))
                        }
                        if(actors.length == 0) {
                            actors.push(new Actor("None", new Date()))
                        }
                        var mov = new Movie(element.title, new Director(element.director), actors, element.date, [], element.poster, 0)
                        console.log(element)
                        movies.push(mov)
                        
                    }
                    console.log(movies)
                    success(movies) // Retuns the movies to the user
                } else {
                    success([]) // Returns an empty list since it doesn't exist
                }
            })
        })
    }

    /**
     * Adds the specified new movie to the database
     * @param {Movie} movie 
     */
    static addNewMovie(movie) {
        // Returns a promise to the user
        return new Promise((success, fail) => {
            // Reads the data from the firebase
            firebase.database().ref('items').once('value').then(function(snapshot) {
                // Updates the movie with it's new location based on the next available spot in the database
                var actor = []
                for(var i = 0; i < movie.getActor().length; i++) {
                    actor.push(movie.getActor()[i].name)
                }

                firebase.database().ref('items/' + snapshot.val().length).update({
                    title : movie.getTitle(),
                    image : movie.getPoster(),
                    cast : actor,
                    director : movie.getDirector().getName(),
                    rank : snapshot.val().length,
                    genre : movie.getGenre(),
                    year : movie.getRelease(),
                    genre : ["None"]
                })
                success(true)
            })
        })
    }

    /**
     * Removes the movie with the title from thr request list
     * @param {String} title The movie title
     */
    static removeMovieFromRequestList(title) {
        // Returns a new promise
        return new Promise((success, fail) => {
            // Gets all of the movies with that name
            firebase.database().ref('requests').orderByChild('title').equalTo(title).once('value').then(function(snapshot) {
                // Checks if there are movies with that name
                if(snapshot.val() != null) {        
                    // Gets all of the keys
                    var keys = Object.keys(snapshot.val())
                    // Removes all of the information of the movie(s) with that name
                    for(var i = 0; i < keys.length; i++) {
                        firebase.database().ref('requests/' + keys[i]).set({null : null})
                    }
                    // Returns true to the user
                    success(true)
                } else {
                    // Returns false to the user
                    success(false)
                }
            })
        })
    }
}
