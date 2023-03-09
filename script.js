document.addEventListener('DOMContentLoaded', load);

var login = document.querySelector('.login');
var main = document.querySelector('.main');
var save = document.querySelector('.save');
const input = document.querySelector('.input');
var user = null;
var called = false;
var first = null;

let Followers;
if (localStorage.getItem("Followers") === null) {
  first = true;
  Followers = [];
} else {
  Followers = JSON.parse(localStorage.getItem("Followers"));
}

save.addEventListener('click', log_in)

function log_in() {
  localStorage.setItem('user', input.value);
  main.style.display = 'grid';
  load();
}

function load() {
  const user = localStorage.getItem('user');
  if (user != null) {
    login.style.display = 'none';
    fetch('https://api.github.com/users/' + user)
      .then(res => res.json())
      .then(u_info => {
        total = u_info.followers;
        fetch('https://api.github.com/users/' + user + '/followers?per_page=' + total)
          .then(res => res.json())
          .then(data => {
            var i = 0;
            var followers = [];
            while (i < total) {
              followers.push(data[i].login);
              i++;
            };
            console.log(followers, Followers);
            i = 0;
            while (i < total) {
              if (Followers.includes(followers[i]) == false) {
                create_card(followers[i], 'Followed');
                Followers.push(followers[i]);
              }
              else if (followers.includes(Followers[i]) == false && Followers[i] != null) {
                create_card(Followers[i], 'UnFollowed');
                Followers.splice(Followers.indexOf(Followers[i]), 1);
              }
              i++;
              localStorage.setItem("Followers", JSON.stringify(Followers));
            };
            if (called == false) {
              main.innerHTML += `
                <div class='dialog'>
                  <p>You've Got No New Updates<br><br>Visit Again Later!</p>
                </div>
              `
            }
            if (first == true) {
              main.innerHTML += `
                <div class='dialog'>
                  <p>User & Followers List Has Been Saved For Later Use<br><br>Visit Again Later</p>
                </div>
              `
            }
          })
      });
  }
  else {
    main.style.display = 'none';
  };
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
