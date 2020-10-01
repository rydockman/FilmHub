class User {

    constructor(uid, name, username, email){ // The User class has four variables that can be set immediately
        this.uid = uid // uid is the unique identifier for each user in order to load the right information
        this.name = name; // name is used on the display when a user is logged in
        this.username = username; // Same function as name
        this.email = email; // email is used for login purposes
        this.favoriteMovies = []; // favoriteMovies will be able to hold and display a user's favorite movies, this will always instantiate as empty
        this.firebase = new FirebaseManager(); // Any classes that utilize firebase will always have this line in their constructor
        this.isAdmin = false; // isAdmin is used to determine user account privileges
    } // A user's password isn't handled in the User class as the firebaseManager is already handling it

    getName(){ // All get methods are opertaing under the assumption that the variable being returned is of the appropriate type
        return this.name;
    }

    setName(name){
        if(name instanceof String) // Want to make sure this.name remains an instance of a String
            this.name = name;
    }

    getUsername(){
        return this.username;
    }

    setUsername(username){
        if(username instanceof String) // Want to make sure this.username remains an instance of a String
            this.username = username;
    }

    getEmail(){
        return this.email;
    }

    setEmail(email){
        if(email instanceof String) // Want to make sure this.email remains an instance of a String
            this.email = email;
    }

    addFavoriteMovie(movie){ // Add to favoriteMovies array
        if(movie instanceof Movie) { // Can ONLY add Movie class to the array
            for (var i = 0; i < this.favoriteMovies.length; i++) { 
                if (movie.getName().localeCompare(this.favoriteMovies[i].getName()) == 0) { // Go through and make sure the movie is not already in the array
                    return false; // If it is, break away from the function immediately
                }
            }   
            this.favoriteMovies.push(movie); // If not, push onto the array
            return true;
        }
        return false; // If a Movie class wasn't passed in, the function automatically fails
    }

    removeFavoriteMovie(movie){ // Remove from favoriteMovies array
        if(movie instanceof Movie) { // this.favoriteMovies ONLY has Movie classes, no point in searching if one isn't passed in
            for (var i = 0; i < this.favoriteMovies.length; i++) {
                if (movie.getName().localeCompare(this.favoriteMovies[i].getName()) == 0) { // Go through and see if the movie is in the array
                    this.favoriteMovies.splice(i, 1); // If it is, splice the entry out and return success
                    return true;
                }
            }
            return false; // If it isn't in the array, the function fails
        }
        return false; // If a Movie class wasn't passed in, the function automatically fails
    }

    uploadUserPic(image){ // **IN DEVELOPMENT** Will allow user to have profile picture
        imageFile = new File(image);
        this.userPic = imageFile;
        var userRef = storageRef.child(imageFile);
        this.firebase.ref.put(userRef);
    }

    getUserPic() {
        return this.userPic;
    }

    //Following functions allow toggling and checking of admin status
    makeAdmin(){
        this.isAdmin = true;
    }

    removeAdmin(){
        this.isAdmin = false;
    }

    isAdmin(){
        return this.isAdmin;
    }
}