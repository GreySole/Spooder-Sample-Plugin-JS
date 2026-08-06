const path = window.location.pathname;
const pluginMatch = path.match(/\/plugin\/([^\/]+)/);
const pluginName = pluginMatch ? pluginMatch[1] : '';
console.log('PLUGIN NAME', pluginName); // e.g., "vibesandvisuals"

function validateToken(token) {
  return fetch('/twitch/viewer/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ access_token: token }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Token validation response:', data);
      if (data.status !== 'ok') {
        const twitchAuthURL = new URL(
          `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${window.publicData.clientId}&scope=&redirect_uri=${document.location.origin}&state=${pluginName}`,
        );
        document.body.innerHTML = `
          <div style="font-family:Arial; color:white; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center;">
            
            ${buildSpooderPet().outerHTML}
            <h2>${window.publicData.botName}@${window.publicData.homeChannel}</h2>
            <h1>Hold up!</h1>
            <p>We need you to login to Twitch. This is just to get your profile for user experience and save data.</p>
            <button style="padding: 0.75em 2em; background: #444; color: white; border: 2px solid white; border-radius: 1em; font-size: 1.2em; cursor: pointer;">
                <a href="${twitchAuthURL}" style="color: inherit; text-decoration: none; display: block;">Login to Twitch</a>
            </button>
          </div>
        `;
      } else {
        window.userData = data.data;
      }
    });
}

function buildSpooderPet() {
  const spooderPet = window.publicData.spooderpet;
  const spooderPetSpans = [];

  for (let p in spooderPet) {
    spooderPetSpans.push(
      `<span style="color:${spooderPet[p].partColor}">${spooderPet[p].partString}</span>`,
    );
  }

  const spooderDiv = document.createElement('div');
  spooderDiv.style.fontSize = '3rem';
  spooderDiv.className = 'spooderpet';
  spooderDiv.innerHTML = spooderPetSpans.join('');
  return spooderDiv;
}

function getPublicData() {
  return fetch('/public/data')
    .then((res) => res.json())
    .then((data) => {
      console.log('Public data:', data);
      window.publicData = data;
      validateToken();
    });
}

getPublicData();
