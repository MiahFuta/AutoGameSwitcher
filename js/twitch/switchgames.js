var game;

function copyToClipboard() {
    var readOnlyField = document.getElementById("readOnlyField");
    var text = readOnlyField.value;
    navigator.clipboard.writeText(text).then(
        function() {
            alert("URL Copied! Use CTRL+V to Paste!\n\n" + text);
            console.log("Copying to clipboard was successful!");
        },
        function(err) {
            console.error("Failed to copy text: ", err);
        }
    );
}

class SwitchGames {

    get_game() {

        let url = 'https://api.twitch.tv/helix/channels?';
		let url_data = 'broadcaster_id=' + settings.get('channel_id');

		let reply = twitch.get(url, url_data);

		reply.then((response) => {
			if (response['data'] === undefined) {
				console.error(response);
			} else {
				if (response['data'][0] !== undefined) {

					let data = response['data'][0];
                    
                    let game_id = data.game_id;
                    let game_name = data.game_name;

                    console.log('Current Game ID: ' + game_id);
                    console.log('Game Name: ' + game_name);

                    $('body').append('<div><strong>Current Game Name</strong><br><br> ' + game_name + '</div><br><br>');

                    let browser_url =  location.protocol + '//' + location.host + location.pathname + '?game=' + game_id;

                    let message = `To Automatically Switch to this game, create a browser source with the following settings.<br><br><hr><br>
                    <strong>Browser Source URL</strong><br><br>
                    <input id="readOnlyField" type="text" readonly value="${browser_url}"><br><br>
                    <button onclick="copyToClipboard()">Copy to clipboard</button><br><br>
                    Shutdown source when not visible = <strong>ENABLED</strong><br>
                    Refresh browser when scene becomes active = <strong>ENABLED</strong><br><br><hr><br>
                    <strong>If you want to switch to a different game than listed above...</strong><br><br>
                    Set your stream to the game you want to switch to, then reload this page.<br>
                    You will then be given a new browser source url that will automatically switch to that game.`;

                    $('body').append('<div>' + message + '</div>');
				}
			};
		});

    }

    set_game(id) {

        if (id === undefined || id === null) {
            console.log('Game ID = ' + id);
            return;
        }

        let url = 'https://api.twitch.tv/helix/channels?';
		let url_data = 'broadcaster_id=' + settings.get('channel_id');

        let send_data = JSON.stringify({
            game_id: id
        });

		let reply = twitch.patch(url, url_data, send_data);

		reply.then((response) => {
            if (response.ok) {
                console.log('Game Updated!');
                $('body').append('<div>Game Updated!</div>');
            } else {
                // console.log('Game Update Failed!');
                location.href = location.protocol + '//' + location.host + location.pathname
            }
		});

    }

}

game = new SwitchGames();