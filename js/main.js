let main;

class Main {

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
                game.get_game();
            }

        }
        
    }

}

main = new Main();