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

                    let game_string = `<strong>Current Game</strong><br><br>${game_name}`;
                    game_string += `<div id='spacer'></div>`;
                    game_string += `To automatically switch to this game, create a browser source in OBS with the settings found below.`;
                    game_string += `<div id='spacer'></div>`;
                    game_string += `<strong>To switch to a different game than the one listed above...</strong><br><br>`;
                    game_string += `Set your stream to the game you want to switch to on Twitch, then reload this page.<br>`;
                    game_string += `You will then get a new browser source url that, when loaded, will switch to that game.<br>`;
                    game_string += `Use that url to create a new browser source in the scene that will trigger the game change.`;

                    $('#game-info').html(game_string);

                    let browser_url = location.protocol + '//' + location.host + location.pathname + '?game=' + game_id;

                    let browser_string = `<strong>OBS Browser Source Settings</strong><br><br>`;
                    browser_string += `<input id="readOnlyField" type="text" readonly value="${browser_url}"><br><br>`;
                    browser_string += `<button onclick="copyToClipboard()">Copy Browser Source URL to Clipboard</button><br><br>`;
                    browser_string += `<strong>ENABLE &nbsp &rarr; &nbsp</strong> Shutdown source when not visible.<br><br>`;
                    browser_string += `<strong>ENABLE &nbsp &rarr; &nbsp</strong> Refresh browser when scene becomes active.`;

                    $('#browser-info').html(browser_string);

                    let extra_string = `When adding the browser source in OBS, set the name of the browser source to something like...<br><br>`;
                    extra_string += `<strong>" Scene Switch - ${game_name} "</strong><br><br>`;
                    extra_string += `That will allow you to easily keep track of which game each browser source will switch you to.`;
                    extra_string += `<div id='spacer'></div>`;
                    extra_string += `Use the same browser source in different scenes to set the same game in different scenes.<br>`;
                    extra_string += `Set different games for all of your scenes by making different browser sources for each scene.`;

                    $('#extra-info').html(extra_string);

                    game.show_all();

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
                $('body').append('<div>Game Updated!</div><br><br>');
                $('body').append('<div>Hide this browser source in OBS behind your other scenes!</div>');
            } else {
                console.log('Game Update Failed!');
                $('body').append('<div>Game Update Failed!</div><br><br>');
                $('body').append('<div>Refresh this browser source to try again!</div>');
            }
		});

    }

    hide_all() {
        $('#container').css('display', 'none');
        $('#game-info').css('display', 'none');
        $('#browser-info').css('display', 'none');
        $('#extra-info').css('display', 'none');
        $('#copyright').css('display', 'none');
    }

    show_all() {
        $('#container').css('display', '');
        $('#game-info').css('display', '');
        $('#browser-info').css('display', '');
        $('#extra-info').css('display', '');
        $('#copyright').css('display', '');
    }

}

game = new SwitchGames();
game.hide_all();