var game;

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
                    game_string += `<strong>To automatically switch to this game...</strong><br><br>`;
                    game_string += `Create a Browser Source in OBS with the settings found below.`;
                    game_string += `<div id='spacer'></div>`;
                    game_string += `<strong>To switch to a different game than the one listed above...</strong><br><br>`;
                    game_string += `Set your stream to the game you want to switch to, on Twitch, then reload this page.<br>`;
                    game_string += `You will then get a new Browser Source URL that, when loaded, will switch to that game.<br>`;
                    game_string += `Use that URL and create a new Browser Source in the scene that will trigger the game change.`;

                    $('#game-info').html(game_string);

                    let browser_url = location.protocol + '//' + location.host + location.pathname + '?game=' + game_id;

                    let browser_string = `<strong>OBS Browser Source Settings</strong><br><br>`;
                    browser_string += `<input id="readOnlyField" type="text" readonly value="${browser_url}"><br><br>`;
                    browser_string += `<button onclick="copyToClipboard()">Copy Browser Source URL to Clipboard</button><br><br>`;
                    browser_string += `<strong>ENABLE &nbsp &rarr; &nbsp</strong> Shutdown source when not visible.<br><br>`;
                    browser_string += `<strong>ENABLE &nbsp &rarr; &nbsp</strong> Refresh browser when scene becomes active.`;

                    $('#browser-info').html(browser_string);

                    let extra_string = `When adding the Browser Source in OBS, set the name of the Browser Source to something like...<br><br>`;
                    extra_string += `<strong>" Scene Switch - ${game_name} "</strong><br><br>`;
                    extra_string += `That will allow you to easily keep track of which game each Browser Source will switch you to.`;
                    extra_string += `<div id='spacer'></div>`;
                    extra_string += `Use the same Browser Source in different scenes to set the same game in different scenes.<br>`;
                    extra_string += `Set different games for all of your scenes by making different Browser Sources for each scene.`;

                    $('#extra-info').html(extra_string);

                    main.show_all();

				}

			};

		});

    }

    set_game(id) {

        if (id === undefined || id === null) return;

        let url = 'https://api.twitch.tv/helix/channels?';
		let url_data = 'broadcaster_id=' + settings.get('channel_id');

        let send_data = JSON.stringify({
            game_id: id
        });

		let reply = twitch.patch(url, url_data, send_data);

		reply.then((response) => {

            if (response.ok) {

                console.log('Game Updated!');

                let message = `<strong>Game Updated!</strong><br><br>`;
                message += `Hide this Browser Source in OBS behind your other scenes!`;

                this.post_status(message);

            } else {

                console.log('Game Update Failed!');

                let message = `<strong>Game Update Failed!</strong><br><br>`;
                message += `Refresh this Browser Source to try again!`;

                this.post_status(message);

            }

		});

    }

    post_status(message) {

        $('#container').css('display', '');
        $('#game-info').css('display', '');

        message += `<div id='spacer'></div>`;
        message += `<strong>Make sure these Browser Source Settings are Enabled!</strong><br><br>`;
        message += `<strong>&rarr; &nbsp</strong> Shutdown source when not visible.<strong>&nbsp &larr;</strong> <br><br>`;
        message += `<strong>&rarr; &nbsp</strong> Refresh browser when scene becomes active.<strong>&nbsp &larr;</strong> `;

        let game_html = `${message}`;
        $('#game-info').html(game_html);

    }

}

game = new SwitchGames();
