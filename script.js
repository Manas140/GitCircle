document.addEventListener('DOMContentLoaded', load);
  
const login = document.querySelector('.login');
const main = document.querySelector('.main');
const save = document.querySelector('.save');
const input = document.querySelector('.input');
let called = false;
let first = false;

let Followers;
if (localStorage.getItem("Followers") === null) {
  first = true;
  Followers = [];
} else {
  Followers = JSON.parse(localStorage.getItem("Followers"));
}

save.addEventListener('click', log_in)
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    save.click();
  }
}); 

function log_in() {
  fetch('https://api.github.com/users/' + input.value)
    .then( res => { 
      if ( !res.ok ) {
        return Promise.reject(res.status);
      }
      else {
        localStorage.setItem('user', input.value);
        load();
      }
    })
    .catch(err => { err(err); })
}

function load() {
  const user = localStorage.getItem('user')
  if (user != null) {
    login.style.display = 'none';
    main.style.display = 'grid';
    update(user)
  }
}

async function update(user) {
  let page_num = 1;
  let start = false;

  while (true) {
    const response = await fetch('https://api.github.com/users/' + user + '/followers?page=' + page_num + '&per_page=100') 
    if (!response.ok) {
      err(response.status);
      break;
    }
    
    const data = await response.json();
    if ( data.length == 0 ) { 
      break;
    }

    const followers = [];
    for (let i = 0; i < data.length; i++) {
      followers.push(data[i].login);
    }

    let i = 0;
    while (followers.length >= i) {
      if (Followers.includes(followers[i]) == false && followers[i] != null) {
        create_card(followers[i], 'Followed');
        Followers.push(followers[i]);
      }
      else if (followers.includes(Followers[i]) == false && Followers[i] != null) {
        create_card(Followers[i], 'UnFollowed');
        Followers.splice(Followers.indexOf(Followers[i]), 1);
      }
      localStorage.setItem("Followers", JSON.stringify(Followers));
      start = true;
      i++;
    }
    page_num += 1;
  }

  if (start == true && called == false ) {
    main.innerHTML = `
      <div class='dialog'>
        <p>You've Got No New Updates<br><br>Visit Again Later!</p>
      </div>
    `
  }
  else if (start == true && first == true) {
    main.innerHTML = `
      <div class='dialog'>
        <p>User & Followers List Has Been Saved For Later Use<br><br>Visit Again Later!</p>
      </div>
    `
  }
}

function err(err) {
  login.style.display = 'none';
  main.style.display = 'grid';
  main.innerHTML = `
    <div class='dialog'>
      <p>Error: ${err}, Please Try Again Later<br><br>Though If Issue Persists Please Report It.</p>
    </div>
  `;
}

function create_card(name, status) {
  if (first != true) {
    main.innerHTML += `
      <a href="https://github.com/${name}" target='_blank' class='card'>
        <img src="https://github.com/${name}.png" alt="./pfp">
        <div>
          <h2>${name}</h2>
          <p>${status} You</p>
        </div>
      </a>
    `;
  }
  called = true
}
