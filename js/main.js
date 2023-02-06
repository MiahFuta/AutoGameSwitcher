let main;

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

class Main {

    run() {

        this.hide_all();

        auth.inspect_url();

    }

    init() {

        let last_game = settings.get('game');

        if (last_game !== null) {

            console.log(last_game);
            settings.delete('game');
            location.href = location.protocol + '//' + location.host + location.pathname + '?game=' + last_game;

        } else {

            var params = {};
            var url = new URL(window.location.href);
            var searchParams = new URLSearchParams(url.search);

            for (var pair of searchParams.entries()) {
                params[pair[0]] = pair[1];
            }

            if (params.game !== undefined) {

                game.set_game(params.game);

            } else {

                if (main.is_obs()) {
                    $('#container').css('display', '');
                    $('#setup-info').css('display', '');

                    let setup_html = `<strong> User Configuration Error!</strong><br>`;
                    setup_html += `<div id='spacer'></div>`;
                    setup_html += `Please Delete this Browser Source and Configure it from your Web Browser!`;
                    $('#setup-info').html(setup_html);

                } else {
                    game.get_game();
                }

            }

        }
        
    }

    is_obs() {

		let agent = navigator.userAgent;

		if (agent.includes('OBS')) return true;
		if (agent.includes('StreamlabsDesktop')) return true;

		return false;

	}

    hide_all() {

        $('#container').css('display', 'none');
        $('#title-info').css('display', 'none');
        $('#setup-info').css('display', 'none');
        $('#game-info').css('display', 'none');
        $('#browser-info').css('display', 'none');
        $('#extra-info').css('display', 'none');

    }

    show_all() {

        $('#container').css('display', '');
        $('#title-info').css('display', '');
        $('#game-info').css('display', '');
        $('#browser-info').css('display', '');
        $('#extra-info').css('display', '');
        
    }

}

main = new Main();
main.run();
