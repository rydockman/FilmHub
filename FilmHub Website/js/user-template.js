async function SetUserDetails() {
    document.title = sessionStorage.getItem('userName') + " - Profile Page";

    document.getElementById("user-name").innerHTML = sessionStorage.getItem('userName');
    document.getElementById("email").innerHTML = sessionStorage.getItem('email');

    FirebaseManager.loadAllMovies().then(async function (movies) {
        var movs = movies
        var movieGrid = document.getElementById("portfolio-grid");
        for(var i = 0; i < movies.length; i++) {
            await FirebaseManager.isFavoriteMovie(i, sessionStorage.getItem('uid')).then(async function(success) {
                if(success) {
                    var item = document.createElement("div");
                    item.className = "item movie col-sm-6 col-md-4 col-lg-4 mb-4";
                    
                    //Creates link to more information about the movie on the movies page
                    var pageLink = document.createElement("a");
                    pageLink.href = "movie-template.html?mov=" + movs[i].getRank();
                    pageLink.className = "item-wrap fancybox";
            
                    var work_info = document.createElement("div");
                    work_info.className = "work-info"
            
                    //Adds movie title
                    var title = document.createElement("h3");
                    title.innerHTML = movs[i].getTitle();
            
                    //Adds movie image
                    var img = document.createElement("img");
                    img.className = "img-fluid";
                    img.src = movs[i].getPoster();
            
                    //Appends all movies 
                    item.appendChild(pageLink);
                    pageLink.appendChild(work_info);
                    work_info.appendChild(title);
                    pageLink.appendChild(img);
            
                    movieGrid.appendChild(item);
                }
            });
        }
    }); // end of loadAllMovies
}