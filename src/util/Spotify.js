let accessToken;
const clientId =  'd5b751c4c5ac4f9e88cd7c63d67275c2';
const redirectUri = "http://localhost:3000/"


const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location.assign(`https://accounts.spotify.com/authorize?client_id=${clientId}&`+
            `response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`)
        }
    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();
        let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        {headers: {Authorization: `Bearer ${accessToken}`}});
        let jsonResponse = await response.json();
            if (!jsonResponse.tracks) {
                return [];
            }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                })
            );
    },

    async savePlaylist (playlistName, trackUris) {
        if (!playlistName || !trackUris) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;

        let response = await fetch(`https://api.spotify.com/v1/me`, {headers: headers});
        let jsonResponse = await response.json();
        userId = jsonResponse.id;
        let postResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
        {
            headers: headers, 
            method: 'POST', 
            body: JSON.stringify({name: playlistName})
        });
        let jsonPostResponse = await postResponse.json();
        const playlistId = jsonPostResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}`+
        `/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris})
        });
    }
}

export default Spotify;