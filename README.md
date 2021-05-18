# FilmHub
This project was created with the intention of being a database for movies and films where users can browse these films by different search criteria in an interesting and meaningful way to learn more about specific films.

# My Contribution
My contribution to this project was the front-end work using Javascript, HTML, and CSS. We did use a website template for a basis to work off of, but everything other than the template is my own code. I also contributed in scraping data including movie titles, images, descriptions, genres, etc.. from IMDB using Python and Selenium (This script is not included in this repo)

# Images and Descriptions
- This image shows off the home screen which displays all the different categories that our website allows you to search by. All categories displays every type of data on the site.
<img width="1209" alt="Screen Shot 2021-05-17 at 9 48 26 PM" src="https://user-images.githubusercontent.com/14820909/118579377-f7122300-b75b-11eb-8004-160a35573a2a.png">

- This is a demonstration of when you select just the movies options.
<img width="1209" alt="Screen Shot 2021-05-17 at 9 48 43 PM" src="https://user-images.githubusercontent.com/14820909/118579397-01ccb800-b75c-11eb-8fd8-3f169750d288.png">

- Selecting the categories option displays every category of movies in the database. 
- I am quite proud of this feature and it works by collecting a list of all of the categories for every movie in the database. It then removes duplicates and it creates a Javascript canvas and draws on the name of each category as well as adding a link to the genre-template page with the appropriate genre tag. (This script can be found in FilmHub Website/js/add-genres.js)
<img width="1209" alt="Screen Shot 2021-05-17 at 9 48 53 PM" src="https://user-images.githubusercontent.com/14820909/118579405-072a0280-b75c-11eb-8816-5003a4600638.png">

- After you click on a genre category image, it redirects you to genre-template.html and using the URL variables it displays all the movies in that genre.
<img width="1209" alt="Screen Shot 2021-05-17 at 9 49 58 PM" src="https://user-images.githubusercontent.com/14820909/118579419-0d1fe380-b75c-11eb-9744-0b3fd32dc13a.png">

- When you click on a movie, it redirects you to movie-template.html and using the URL variables it displays all the database information about the selected movie.
<img width="1209" alt="Screen Shot 2021-05-17 at 9 50 32 PM" src="https://user-images.githubusercontent.com/14820909/118579426-114c0100-b75c-11eb-8709-28b8836cedd4.png">

- At the bottom I created a Javascript file that selects similar movies by genre. In this example, The Godfather: Part II, is a crime and drama movie so it selects 3 movies from either category
<img width="1209" alt="Screen Shot 2021-05-17 at 9 50 39 PM" src="https://user-images.githubusercontent.com/14820909/118579428-127d2e00-b75c-11eb-97ff-79be90b0ee75.png">
