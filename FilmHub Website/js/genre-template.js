var queryString = window.location.search.substring(7);

var genre;

FirebaseManager.loadGenres().then(function(genres) {
    for(var i = 0; i < genres.length; i++){
        if(genres[i] == queryString)
            genre = genres[i];
    }
    document.title = genre;
    document.getElementById("genre-name").innerHTML = "Search for your favorite " + genre + " movies";
});


FirebaseManager.loadAllMovies().then(function(movies) {
    var movieGrid = document.getElementById("portfolio-grid");
    for(var i = 0; i < movies.length; i++){
        for(var j = 0; j < movies[i].getGenre().length; j++){
            if(movies[i].getGenre()[j].getName() == genre){
                var item = document.createElement("div");
                item.className = "item movie col-sm-6 col-md-4 col-lg-4 mb-4";
        
                //Creates link to more information about the movie on the movies page
                var pageLink = document.createElement("a");
                pageLink.href = "movie-template.html?mov=" + i;
                pageLink.className = "item-wrap fancybox";
        
                var work_info = document.createElement("div");
                work_info.className = "work-info"
        
                //Adds movie title
                var title = document.createElement("h3");
                title.innerHTML = movies[i].getTitle();
        
                //Adds movie image
                var img = document.createElement("img");
                img.className = "img-fluid";
                img.src = movies[i].getPoster();
        
                //Appends all movies 
                item.appendChild(pageLink);
                pageLink.appendChild(work_info);
                work_info.appendChild(title);
                pageLink.appendChild(img);
        
                movieGrid.appendChild(item);
            }
        }
    }
});



