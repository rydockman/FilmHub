class Movie {

    constructor(title, director, actors, dateOfRelease, genres, poster, rank) { // The Movie class has six distinct values set immediately
        this.firebase = new FirebaseManager(); // Any classes that utilize firebase will always have this line in their constructor
        this.title = title;
        this.director = director; // From previous testing director being passed in is always instance of the Director class
        this.thumbsUp = 0; // thumbsUp and thumbsDown will be used to calculate the movie rating
        this.thumbsDown = 0; // Users will only be allowed to add 1 onto these, and will have a toggle-like effect when switching or removing rating
        this.actors = actors; // This is an array of Actor classes being passed in
        this.dateOfRelease = dateOfRelease; // Similar case with director, dateOfRelease will always be an instance of the Date class
        this.genres = genres; // This is an array of Genre classes being passed in
        this.poster = poster; // We start with null as 
        this.rank = rank; // Rank is used as the movie's unique id in order to load the proper information on movie-template.html
    }

    getRank(){
        return this.rank;
    }
    getTitle() { // All get methods are opertaing under the assumption that the variable being returned is of the appropriate type
        return this.title;
    }

    setTitle(title) {
        if(title instanceof String) // Want to make sure the type of this.title remains as a String
            this.title = title;
    }

    getDirector() {
        return this.director;
    }

    setDirector(director) {
        if(director instanceof Director) // this.director CANNOT be anything but an instance of the Director class
            this.director = director;
    }

    getRelease() {
        return this.dateOfRelease;
    }

    setRelease(dateOfRelease) {
        if(dateOfRelease instanceof Date) // this.dateOfRelease CANNOT be anything but an instance of the Date class
            this.dateOfRelease = dateOfRelease;
    }

    thumbUp() { // These functions are used to edit values in the getRating function
        this.thumbsUp += 1;
    }

    setThumbUp(thumbUp) {
        this.thumbsUp = thumbUp
    }

    thumbDown() { // Each will add one onto their respective rating and be used to determine the rating
        this.thumbsDown += 1;
    }

    setThumbDown(thumbDown) {
        this.thumbsDown = thumbDown
    }

    getRating() {
        if(this.thumbsDown == 0 && this.thumbsUp > 0) { // This helps avoid a divide by 0 error, if thumbsUp has a value no matter what the rating will be 100%
            return 1;
        } else if (this.thumbsUp == 0) { // If there's no positive ratings, the rating will always be 0%
            return 0;
        }
        else return (this.thumbsUp/(this.thumbsUp + this.thumbsDown)).toFixed(2); // This is used only if both variables are > 0, and helps set up the ratio, the result will never be > 1
    }

    getActor() {
        return this.actors;
    }

    addActor(actor) { // Adding to the actors array
        if(actor instanceof Actor) { // Can ONLY add Actor class to the array
            for (var i = 0; i < this.actors.length; i++) {
                if (actor.getName().localeCompare(this.actors[i].getName()) == 0) { // Go through and make sure the actor is not already in the array
                    return false; // If they are, break away from the function immediately
                }
            }   
            this.actors.push(actor); // If not, push onto the array
            return true;
        }
        else return false; // If an Actor class wasn't passed in, the function automatically fails
    }

    removeActor(actor) { // Removing from the actors array
        if(actor instanceof Actor) { // this.actors ONLY has Actor classes, no point in searching if one isn't passed in
            for (var i = 0; i < this.actors.length; i++) {
                if (actor.getName().localeCompare(this.actors[i].getName()) == 0) { // Go through and see if the actor is in the array
                    this.actors.splice(i, 1); // If they are, splice the entry out and return success
                    return true;
                }
            }
            return false; // If they aren't in the array, the function fails
        }
        else return false; // If an Actor class wasn't passed in, the function automatically fails
    }

    uploadPoster(image) { // Handled in firebaseManager.js
         this.firebase.uploadMoviePoster(this, image);
    }

    getPoster() { // Handled in firebaseManager.js
        return this.poster
    }

    addGenre(genre) { // Adding to the genres array
        if(genre instanceof Genre) { // Can ONLY add Genre class to the array
            for (var i = 0; i < this.genres.length; i++) {
                if (genre.getName().localeCompare(this.genres[i].getName()) == 0) { // Go through and make sure the genre is not already in the array
                    return false; // If they are, break away from the function immediately
                }
            }   
            this.genres.push(genre); // If not, push onto the array
            return true;
        }
        else return false; // If a Genre class wasn't passed in, the function automatically fails
    }

    removeGenre(genre) { // Removing from the genres array
        if(genre instanceof Genre) { // this.genres ONLY has Genre classes, no point in searching if one isn't passed in
            for (var i = 0; i < this.genres.length; i++) {
                if (genre.getName().localeCompare(this.genres[i].getName()) == 0) { // Go through and see if the genre is in the array
                    this.genres.splice(i, 1); // If it is, splice the entry out and return success
                    return true;
                }
            }
            return false; // If it isn't in the array, the function fails
        }
        else return false; // If a Genre class wasn't passed in, the function automatically fails
    }

    getGenre() {
        return this.genres;
    }

}