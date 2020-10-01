var queryString = window.location.search.substring(5);
this.queryInt = parseInt(queryString);
var rank = -1;

FirebaseManager.loadMovie(this.queryInt).then(function(movie) {
    document.title = movie.getTitle();
    document.getElementById("movie-name").innerHTML = movie.getTitle();
    document.getElementById("movie-description").innerHTML = movie.getRelease();
    document.getElementsByTagName("img")[0].src = movie.getPoster();
    document.getElementById("rating").innerHTML = "Rating: " + (movie.getRating()*100) + "%";

    document.getElementById("movie-genre").innerHTML = "Genre(s): ";
    for(var i = 0; i < movie.getGenre().length; i++){
        document.getElementById("movie-genre").innerHTML += '<a href="genre-template.html?genre=' + movie.getGenre()[i].getName() + '">' + movie.getGenre()[i].getName() + ', </a>';
    }
    document.getElementById("movie-genre").innerHTML = document.getElementById("movie-genre").innerHTML.substring(0, document.getElementById("movie-genre").innerHTML.length - 6);

    document.getElementById("movie-direct").innerHTML = "Director: " + movie.getDirector().getName();

    document.getElementById("movie-cast").innerHTML = "Cast: ";
    for(var i = 0; i < movie.getActor().length; i++){
        document.getElementById("movie-cast").innerHTML += movie.getActor()[i].getName() + ", ";
    }
    document.getElementById("movie-cast").innerHTML = document.getElementById("movie-cast").innerText.substring(0, document.getElementById("movie-cast").innerText.length - 1);
    rank = this.queryInt

    // Checks if there is someone signed in
    if(sessionStorage.getItem('uid') != null) {
        var movieName = document.getElementById("movie-name").innerHTML // Gets the movie name
        // Checks to see if the user thumbed up the movie
        FirebaseManager.didUserThumbUpForMovie(movieName).then(function(success) {
            if(success) {
                // If true, it updates the page to reflect it
                document.getElementById('thUP').innerHTML = "You've thumbed up this movie!"
                document.getElementById('thDown').innerHTML = "Thumb down this movie"
            } else {
                // Checks to see if the user thumbed down the movie
                FirebaseManager.didUserThumbDownForMovie(movieName).then(function(success) {
                    if(success) {
                        // If true, it updates the page to reflect it
                        document.getElementById('thDown').innerHTML = "You've thumbed down this movie!"
                        document.getElementById('thUP').innerHTML = "Thumb up this movie"
                    }
                })
            }
        })
        
        
        
    }

    var randomRelatedGenre = Math.floor(Math.random() * Math.floor(movie.getGenre().length));
    var genre =  movie.getGenre()[randomRelatedGenre].getName();
    var movieName = movie.getTitle();

    FirebaseManager.loadAllMovies().then(function(movies) {
        var movieGrid = document.getElementById("portfolio-grid");
        var qualifyingMoviesList = [];
        for(var i = 0; i < movies.length; i++){
            for(var j = 0; j < movies[i].getGenre().length - 1; j++){
                if(movies[i].getGenre()[j].getName() == genre && movies[i].getTitle() != movieName){
                    qualifyingMoviesList.push(movies[i]);
                }
            }
        }
        
        for(var i = 0; i < 3; i++){
            var randomMovieFromRelated = Math.floor(Math.random() * Math.floor(qualifyingMoviesList.length));
            var item = document.createElement("div");
            item.className = "item movie col-sm-6 col-md-4 col-lg-4 mb-4";
            
            //Creates link to more information about the movie on the movies page
            var pageLink = document.createElement("a");
            pageLink.href = "movie-template.html?mov=" + qualifyingMoviesList[randomMovieFromRelated].getRank();
            pageLink.className = "item-wrap fancybox";
    
            var work_info = document.createElement("div");
            work_info.className = "work-info"
    
            //Adds movie title
            var title = document.createElement("h3");
            title.innerHTML = qualifyingMoviesList[randomMovieFromRelated].getTitle();
    
            //Adds movie image
            var img = document.createElement("img");
            img.className = "img-fluid";
            img.src = qualifyingMoviesList[randomMovieFromRelated].getPoster();
    
            //Appends all movies 
            item.appendChild(pageLink);
            pageLink.appendChild(work_info);
            work_info.appendChild(title);
            pageLink.appendChild(img);
    
            movieGrid.appendChild(item);
        }
    });
});

// Checks if the given movie is in the user's favorites
FirebaseManager.isFavoriteMovie(this.queryInt, sessionStorage.getItem('uid')).then(function(result) {
    // Checks the result
    if(result) {
        // If true, it changes the button text 
        document.getElementById('add').innerHTML = "Remove from Favorite Movie List"
    }
})


function toggleFavorites() {
     // Checks if there is a user signed in 
     if(sessionStorage.getItem('uid') == null) {
        // Alerts the user they need a valid account
        window.alert("You must be signed in to perform this action!")
        return
    }
    FirebaseManager.isFavoriteMovie(this.queryInt, sessionStorage.getItem('uid')).then(function(result) {
        // Checks the result
        if(result) {
            removeFromFavorites()
        } else {
            addToFavorites()
        }
    }) 
}

// Adds the given movie to the user's favorites
function addToFavorites() {
    // Loads the movie
    FirebaseManager.loadMovie(this.queryInt).then(function(success) {
        // Adds the movie to the favorites list
        FirebaseManager.addFavoriteMovie(success, sessionStorage.getItem('uid'))
        // Changes the button text
        document.getElementById('add').innerHTML = "Remove from Favorite Movie List"
    });
    
}

// Adds the given movie to the user's favorites
function removeFromFavorites() {
    // Loads the movie
    FirebaseManager.loadMovie(this.queryInt).then(function(success) {
        // Adds the movie to the favorites list
        FirebaseManager.removeFavoriteMovie(success, sessionStorage.getItem('uid'))
        // Changes the button text
        document.getElementById('add').innerHTML = "Add to Favorite Movie List"
    });
    
}

function thumbsUp() {
    // Checks if there is a user signed in 
    if(sessionStorage.getItem('uid') == null) {
        // Alerts the user they need a valid account
        window.alert("You must be signed in to perform this action!")
        return
    }
    // Gets the movie name
    var movieName = document.getElementById("movie-name").innerHTML
    // Checks to make sure the user didn't already thumb up the movie
    FirebaseManager.didUserThumbUpForMovie(movieName).then(function(success) {
        if(success) {
            // Stops the process if they did
            return
        }
        // Checks if the user had already thumbed down the movie
        FirebaseManager.didUserThumbDownForMovie(movieName).then(function(success) {
            if(success) {
                // If true, it removes that thumb down
                FirebaseManager.removeUserThumbDownForMovie(movieName)
                FirebaseManager.decrementMovieThumbsDown(rank)
            }

            // Sets that the user thumed up on firebase
            FirebaseManager.setUserThumbUpForMovie(movieName)
            // Increases the movie thumbs up
            FirebaseManager.incrementMovieThumbsUp(rank)
            // Changes the button text to reflect this change
            document.getElementById('thUP').innerHTML = "You've thumbed up this movie!"
            document.getElementById('thDown').innerHTML = "Thumb down this movie"
        })
    })
    
   
}

function thumbsDown() {
    // Checks to make sure the user is signed into a valid account
    if(sessionStorage.getItem('uid') == null) {
        // Informs the user they need a valid account
        window.alert("You must be signed in to perform this action!")
        return
    }
    // Gets the movie name
    var movieName = document.getElementById("movie-name").innerHTML
    // Checks if the user already thumbed down the movie
    FirebaseManager.didUserThumbDownForMovie(movieName).then(function(success) {
        if(success) {
            // If true, it stops the process 
            return
        }
        // Checks if the user thumbed up the movie already
        FirebaseManager.didUserThumbUpForMovie(movieName).then(function(success) {
            if(success) {
                // If true, it removes the thumb up
                FirebaseManager.removeUserThumbUpForMovie(movieName)
                FirebaseManager.decrementMovieThumbsUp(rank)
            }

            // Sets that the user thumbed down the movie on firebase
            FirebaseManager.setUserThumbDownForMovie(movieName)
            // Increments the movie thumbs down counter on firebase
            FirebaseManager.incrementMovieThumbsDown(rank)
            // Updates the buttons to reflect this change
            document.getElementById('thDown').innerHTML = "You've thumbed down this movie!"
            document.getElementById('thUP').innerHTML = "Thumb up this movie"
        })

    })
    


}

