var settings;

class Settings {

	storage;

	constructor() {

		this.storage = this.storage_test();

		if (this.storage_enabled()) {
			this.set('client_id', 'xw94uiekplv5jap40p2lmjm7ete7fp');
			this.set('required_scopes', JSON.stringify([
				'channel:manage:broadcast',
				'user:read:broadcast'
			]));

			this.set('version', '0.0.1');
			this.set('is_valid', false);

		} else {
			logger.error('You MUST Enable Cookies for this Site to Work Correctly!');
		}
	}

	get(name) {
		if (!this.storage_enabled()) return;
		return localStorage.getItem(name);
	}

	set(name, value) {
		if (!this.storage_enabled()) return;
		localStorage.setItem(name, value);
	}

	delete(name) {
		if (!this.storage_enabled()) return;
		localStorage.removeItem(name);
	}

	storage_test() {
		try {
			localStorage.setItem('test', 'test');
			localStorage.removeItem('test');
			return true;
		} catch (e) {
			return false;
		}
	}

	storage_enabled() {
		return this.storage;
	}

}

settings = new Settings();
