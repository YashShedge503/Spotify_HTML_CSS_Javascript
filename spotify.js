console.log("Lets write javascript");

let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage
//console.log(secondsToMinutesSeconds(123)); // Output: "02:03"

async function getsongs()
{
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  //console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  //show all the songs in the playlist
  //let songUL = document.querySelector(".songlist").getElementsByClassName("ul")[0];
  //songUL.innerHTML = "";
//   let songUL = document.querySelector(".songlist").getElementsByClassName("ul")[0];
//  if (songUL) {
//   songUL.innerHTML = "";
//   // Rest of your code for modifying songUL.innerHTML
// } else {
//   console.error("Unable to find songUL element");
// }


//attach an event listener to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
  e.addEventListener("click", element => {
    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
  });
});

return songs
}
  
  

const playmusic = (track, pause = false) => {
  //let audio = new Audio("/songs/" + track)
  currentsong.src = "/songs/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// async function displayalbums(){
//   console.log("displaying albums")
//   let a = await fetch(`/songs/`);
//   let response = await a.text();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let anchors = div.getElementsByTagName("a")
//   let cardcontainer = document.querySelector(".cardcontainer")
//   let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//       const e = array[index];

//     if(e.href.includes("/songs")){
//       let folder = e.href.split("/").slice(-2)[0]
//       //Get that met data of the folder
//       let a = await fetch(`/songs/${folder}/info.json`);     
//       let response = await a.json();
//       console.log(response)
//       cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
//       <div class="play">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="28px" height="28px"
//               padding="4px">
//               <!-- Circular background -->
//               <circle cx="14" cy="15" r="14" fill="#1fdf64" stroke="#000000" stroke-width="1" />

//               <!-- Play button icon -->
//               <path d="M9 6L20 15L9 24V6Z" fill="#000000" />
//           </svg>
//       </div>
//       <img src="/songs/${folder}/cover.jpeg" alt="">
//       <h2>${response.title}</h2>
//       <p>${response.description}</p>
//       </div>`
//     }
//   }

//   //load the playlist whnever card is clicked
//   Array.from(document.getElementsByClassName("card")).forEach(e => {
//     //console.log(e)
//     e.addEventListener("click", async item => {
//       console.log("Fetching songs")
//       //console.log(item, item.currentTarget.dataset)
//       songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
//       playmusic(songs[0])
//     })
//   })
// }

async function main() {

  //let currentsong = new Audio();
  //Get the list of all songs
  let songs = await getsongs()
  ////playmusic(songs[0], true);

  //Display all the albums on the page
  ///await displayalbums()
  
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="music.svg" alt="">
                       <div class="info">
                        <div> ${song.replaceAll("%20", "")}</div>
                        <div>Yash</div>
                       </div>
                       <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="play.svg" alt="">
                       </div> </li>`;
  }

  


  //attach an event listner to play next and previous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } 
    else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  //Listen for time update event
  currentsong.addEventListener("timeupdate", () => {
    //console.log(currentsong.currenttime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currenttime )} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =(currentsong.currenttime / currentsong.duration) * 100 + "%";
  });

  //add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currenttime = (currentsong.duration * percent) / 100;
  });

  //add an event listner to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //add event listner to close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // add an event listner to previous and next
  previous.addEventListener("click", () => {
    console.log("previous clicked");
    console.log(currentsong);
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentsong.pause();
    console.log("next clicked");

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
    //console.log(songs, index)
  });

  //add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/100");
      currentsong.volume = parseInt(e.target.value) / 100;
    })

  //add event listner to mute the track
  document.querySelector(".volume > img").addEventListener("click", e=>{
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentsong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentsong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
  }) 


}

main();
