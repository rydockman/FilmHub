class Genre {

    constructor(name) { // Genre class only takes in a name in its contructor
        this.name = name; // name is additionally used as the genre's identifier
        this.movies = []; // Genre classes will always have movies start as an empty array
    }

    getName() { // All get methods are opertaing under the assumption that the variable being returned is of the appropriate type
        return this.name;
    }

    setName(name) {
        if(name instanceof String) // Want to make sure this.name remains an instance of a String
            this.name = name;
    }

    addMovie(movie) { // Add to movies array
        if(movie instanceof Movie) { // Can ONLY add Movie class to the array
            for (var i = 0; i < this.movies.length; i++) { 
                if (movie.getName().localeCompare(this.movies[i].getName()) == 0) { // Go through and make sure the movie is not already in the array
                    return false; // If it is, break away from the function immediately
                }
            }   
            this.movies.push(movie); // If not, push onto the array
            return true;
        }
        else return false; // If a Movie class wasn't passed in, the function automatically fails
    }

    removeMovie(movie) { // Remove from movies array
        if(movie instanceof Movie) { // this.movies ONLY has Movie classes, no point in searching if one isn't passed in
            for (var i = 0; i < this.movies.length; i++) {
                if (movie.getName().localeCompare(this.movies[i].getName()) == 0) { // Go through and see if the movie is in the array
                    this.movies.splice(i, 1); // If it is, splice the entry out and return success
                    return true;
                }
            }
            return false; // If it isn't in the array, the function fails
        }
        else return false; // If a Movie class wasn't passed in, the function automatically fails
    }

}
