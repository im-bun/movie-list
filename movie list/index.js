let like_movie_list = []
let genre_lit = {}
let page = 1

function generate_random_color(){
	return Math.floor(Math.random()*16777215).toString(16)
}



function get_genre_lit(){
	fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=121c924e69f594653b30a1b4d3efd60b&language=en-US")
	.then(res=>res.json())
	.then(data=> {
		let genres = data.genres
		for (let i of genres){
			genre_lit[i.id] = i.name
		}

		})
	.catch(err => {
        console.log(err);
    });
}


function get_movie_list(page=1,list){
	console.log(list)
	document.body.innerHTML = ''
	let loader = document.createElement("div")
	loader.innerHTML="Loading..."
	loader.className="loader"
	
	let nav = document.createElement("nav")
	nav.setAttribute("style","border-bottom:1px solid lightgray; display:flex;height:50px")

	let logo = document.createElement("img")
	logo.setAttribute("src","THE_MOVIE_DB.png")
	logo.setAttribute("width","50px")

	let popular_movie_list = document.createElement("div")
	popular_movie_list.className = "nav-item"
	popular_movie_list.innerHTML = "Popular Movie List"
	popular_movie_list.addEventListener("click",()=>{get_movie_list(1,"popular_movie_list")} )
	popular_movie_list.setAttribute("style", `${list === "popular_movie_list"?"border-bottom: 2px solid red;":""}`)

	let liked_movie = document.createElement("div")
	liked_movie.className = "nav-item"
	liked_movie.id = "like_movie"
	liked_movie.innerHTML="Liked Movie"
	liked_movie.addEventListener("click",()=>{display_movies(like_movie_list,"liked_movie")})
	liked_movie.setAttribute("style", `${list === "liked_movie"?"border-bottom: 2px solid red;":""}`)

	let badge = document.createElement("span")
	badge.className="badge"
	badge.innerHTML=`${like_movie_list.length}`
	liked_movie.appendChild(badge)

	let configure = document.createElement("div")
	configure.innerHTML = "Configure"
	configure.className="nav-item"
	


	nav.appendChild(logo)
	nav.appendChild(popular_movie_list)
	nav.appendChild(liked_movie)
	nav.appendChild(configure)

	document.body.appendChild(nav)
	document.body.appendChild(loader);

	fetch(`https://api.themoviedb.org/3/discover/movie?api_key=121c924e69f594653b30a1b4d3efd60b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`)
	.then((x) => new Promise(resolve => setTimeout(resolve(x), 10000)))
	.then(res=>res.json())
	.then(data=>display_movies(data.results,list))
	.catch(err => {
        console.log(err);
    });

}

function unlike_movie(i){
	like_movie_list.splice(i,1)  
	display_movies(like_movie_list,"liked_movie")
}

function add_movie(obj){
	if(!like_movie_list.includes(obj))
		like_movie_list.push(obj)
	let temp = document.querySelector(".badge")
	temp.innerHTML=like_movie_list.length
}

function display_movies(data,list){
	// console.log(list)
	// let loader = document.querySelector(".loader")
	// document.body.removeChild(loader)
	document.body.innerHTML=""
	let nav = document.createElement("nav")
	nav.setAttribute("style","border-bottom:1px solid lightgray; display:flex;height:50px")

	let logo = document.createElement("img")
	logo.setAttribute("src","THE_MOVIE_DB.png")
	logo.setAttribute("width","50px")

	let popular_movie_list = document.createElement("div")
	popular_movie_list.className = "nav-item"
	popular_movie_list.innerHTML = "Popular Movie List"
	popular_movie_list.addEventListener("click",()=>{get_movie_list(1,"popular_movie_list")} )
	popular_movie_list.setAttribute("style", `${list === "popular_movie_list"?"border-bottom: 2px solid red;":""}`)

	let liked_movie = document.createElement("div")
	liked_movie.className = "nav-item"
	liked_movie.innerHTML="Liked Movie"
	liked_movie.addEventListener("click",()=>{display_movies(like_movie_list,"liked_movie")})
	liked_movie.setAttribute("style", `${list === "liked_movie"?"border-bottom: 2px solid red;":""}`)

	let badge = document.createElement("span")
	badge.className="badge"
	badge.innerHTML=`${like_movie_list.length}`
	liked_movie.appendChild(badge)

	let configure = document.createElement("div")
	configure.className="nav-item"
	configure.innerHTML = "Configure"
	configure.addEventListener("click",()=>{display_movies(like_movie_list,"configure")})
	configure.setAttribute("style", `${list === "configure"?"border-bottom: 2px solid red;":""}`)
	


	nav.appendChild(logo)
	nav.appendChild(popular_movie_list)
	nav.appendChild(liked_movie)
	nav.appendChild(configure)

	document.body.appendChild(nav)

	let title = document.createElement("h1")
	title.innerHTML = `${list==="popular_movie_list"?"The Movie List":`${list==="liked_movie"?"Liked Movies":"Configure"}`}`
	title.style= "font-size:60px; text-align:center"
	document.body.appendChild(title)

	let modal = document.createElement("div")
	modal.className="modal"
	
	document.body.appendChild(modal)



	if (list!=="configure")
		{
		let container = document.createElement("div")
		container.setAttribute("style","display:flex; justify-content:row ;flex-wrap:wrap")
		for (let i = 0;i<data.length;i++){
			let div = document.createElement("div")
			div.className = "movie"
	
			let movie = document.createElement("div")
			movie.style = "width:200"
		
			let movie_title = document.createElement("p")
			movie_title.setAttribute("style","width:200px;height:40px")
			let text = document.createTextNode(data[i].original_title)
			movie_title.appendChild(text)
	
			let img = document.createElement("img")
			img.className="image "
			img.setAttribute("width","200px")
			img.setAttribute("src",`https://image.tmdb.org/t/p/original/${data[i].poster_path}` );
			img.setAttribute("alt",data[i].original_title)
	
	
			// img.setAttribute("draggable",true)
			// img.addEventListener("ondragstart",drag)
			// img.addEventListener("ondragover",allowDrop)
			// img.addEventListener("drop",drop)
	
			img.addEventListener("click",()=>{pop_up_modal(data[i])})
	
			let mid = document.createElement("div")
			mid.className="middle"
	
			let like_button = document.createElement("button")
			like_button.className = "like_button"
			like_button.innerHTML=`${list === "liked_movie"?"Unlike":"Like"}`
			like_button.addEventListener("click",()=>{list === "liked_movie"? unlike_movie(i):add_movie(data[i])})
	
			mid.appendChild(like_button)
	
			movie.appendChild(img)
			movie.appendChild(movie_title)
			movie.appendChild(mid)
	
			div.appendChild(movie)
			container.appendChild(div);
		}
		document.body.appendChild(container)
	
		if(list==="popular_movie_list"){
			let footer = document.createElement("footer")
			footer.style="display:flex;justify-content:space-evenly"
	
			let page_number = document.createElement("p")
			page_number.innerHTML= `Page ${page}`
			page_number.style="font-size:16px"
	
			let prev_page = document.createElement("button")
			prev_page.className="like_button"
			prev_page.innerHTML="Prev"
			if(page===1){
				prev_page.setAttribute("disabled",true)
				prev_page.className="disabled_button"
	
			}
			prev_page.addEventListener("click",()=>{get_movie_list(--page,"popular_movie_list")})
	
			let next_page = document.createElement("button")
			next_page.className="like_button"
			next_page.innerHTML="Next"
			next_page.addEventListener("click",()=>{get_movie_list(++page,"popular_movie_list")})
	
	
			footer.appendChild(prev_page)
			footer.appendChild(page_number)
			footer.appendChild(next_page)
			document.body.appendChild(footer)	
		}}
		else{

			console.log("figure")
			let container = document.createElement("div")
			container.setAttribute("style","display:flex; flex-direction:column;align-items:center;text-align:center")

			for (let i = 0;i<data.length;i++){

				let movie_title = document.createElement("p")
				movie_title.className="configure_title"
				movie_title.id=i
				// movie_title.setAttribute("style","width:200px;height:40px")
				let text = document.createTextNode(data[i].original_title)
				movie_title.appendChild(text)
				container.appendChild(movie_title)
			}

			document.body.appendChild(container)
			var allDraggableElements = document.querySelectorAll('.configure_title')
			dragAndDropModule(allDraggableElements);

		}


// 	if(list==="congigure"){
// 		var allDraggableElements = document.querySelectorAll('.configure_title')
// 		dragAndDropModule(allDraggableElements);
// };
}

function pop_up_modal(obj){
	console.log(obj)
	let modal = document.querySelector(".modal")
	modal.innerHTML=""

	document.addEventListener('keydown', function(e) {
    let keyCode = e.keyCode;
    
    if (keyCode === 27) {//keycode is an Integer, not a String
      modal.style="display:none"
    }})

	modal.style=`display:block;`
	let content = document.createElement("div")
	content.className = "modal-content"
	content.style=`background:linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("https://image.tmdb.org/t/p/original/${obj.backdrop_path}");background-size: cover; `
	let modal_img = document.createElement("img")
	modal_img.className = "modal_img"
	modal_img.setAttribute("src",`https://image.tmdb.org/t/p/original/${obj.poster_path}`)


	let col2 = document.createElement("div")
	col2.style="display:flex;flex-direction:column;width:100%; margin-left:20px"
	let modal_title = document.createElement("p")
	modal_title.setAttribute("style","font-size:40px;margin:0;color:white")
	modal_title.innerHTML=`${obj.original_title}`

	let close = document.createElement("span")
	close.className="close"
	close.innerHTML="&times"
	close.style="color:white"
	close.addEventListener("click",()=>{modal.style="display:none"})

	let temp = document.createElement("div")
	temp.style="display:flex;justify-content:space-between"
	temp.appendChild(modal_title)
	temp.appendChild(close)

	let description = document.createElement("p")
	description.style="color:white;margin:0"
	description.innerHTML=`Overview: ${obj.overview}`

	let genre = document.createElement("div")
	genre.style="display:flex;flex-wrap:wrap"

	for (let i of obj.genre_ids){
		let tag = document.createElement("div")
		tag.innerHTML=genre_lit[i]
		tag.className= "w3-tag w3-padding w3-round-large  w3-center"
		tag.style=`color:white; background-color:#${generate_random_color()}; margin:5px`

		genre.appendChild(tag)
	}

	let screen=document.createElement("div")
	screen.style="background-color:white;opacity:0.8;height:200px;padding-up:5px"
	screen.innerHTML="I didn't find any data realted to screen"



	col2.appendChild(temp)
	col2.appendChild(genre)
	col2.appendChild(description)
	col2.appendChild(screen)


	content.appendChild(modal_img)
	content.appendChild(col2)


	modal.appendChild(content)
	// col2.appendChild(genre)


}




get_genre_lit()
console.log(1)
get_movie_list(page,"popular_movie_list")
var allDraggableElements = document.querySelectorAll('.configure_title');
dragAndDropModule(allDraggableElements);


function dragAndDropModule(draggableElements){
	console.log(draggableElements)

    var elemYoureDragging = null
        , dataString        = 'text/html'    
        , elementDragged = null  
        , draggableElementArray = Array.prototype.slice.call(draggableElements) //Turn NodeList into array
        , dragonDrop = {}; //Put all our methods in a lovely object 

        // Change the dataString type since IE doesn't support setData and getData correctly. 
        dragonDrop.changeDataStringForIe = (function () {
            var userAgent = window.navigator.userAgent,
                msie = userAgent.indexOf('MSIE '),       //Detect IE
                trident = userAgent.indexOf('Trident/'); //Detect IE 11

            if (msie > 0 || trident > 0) {
                dataString = 'Text';
                return true;
            } else {
                return false;
            }
        })();

        
        dragonDrop.bindDragAndDropAbilities = function(elem) {
          elem.setAttribute('draggable', 'true');
          elem.addEventListener('dragstart', dragonDrop.handleDragStartMove, false);
          elem.addEventListener('dragenter', dragonDrop.handleDragEnter, false);
          elem.addEventListener('dragover',  dragonDrop.handleDragOver, false);
          elem.addEventListener('dragleave', dragonDrop.handleDragLeave, false);
          elem.addEventListener('drop',      dragonDrop.handleDrop, false);
          elem.addEventListener('dragend',   dragonDrop.handleDragEnd, false);
        };

        dragonDrop.handleDragStartMove = function(e) {
			

			elementDragged = this;

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData("text", this.id);
        };

        dragonDrop.handleDragEnter = function(e) {
          if(elementDragged !== this) {
            this.style.border = "2px dashed #3a3a3a";
          }
        };

        dragonDrop.handleDragOver = function(e) {   
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';     
        };

        dragonDrop.handleDragLeave = function(e) {
          this.style.border = "2px solid transparent";
        };

        dragonDrop.handleDrop = function(e) {
         if(elementDragged !== this) {
            var data = e.dataTransfer.getData("text");
            swap(like_movie_list,data,this.id)
          }
          this.style.border = "2px solid transparent";
          e.stopPropagation();
          console.log("ye")
          display_movies(like_movie_list,'configure')
          return false;
        };

        dragonDrop.handleDragEnd = function(e) {
          this.style.border = "2px solid transparent";
        };

        // Actiavte Drag and Dropping on whatever element
        draggableElementArray.forEach(dragonDrop.bindDragAndDropAbilities);
  };
function swap(list,x, y){
    var z = list[y];
    list[y] = list[x];
    list[x] = z;
}

swap(2, 5);







