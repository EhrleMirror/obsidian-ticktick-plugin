import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

const CLIENT_ID = '';
const REDIRECT_URI = '';


// Remember to rename these classes and interfaces!

import Settings from './setting';

interface TickTickPluginSettings {
    authorizationCode: string;
}

const DEFAULT_SETTINGS: TickTickPluginSettings = {
    authorizationCode: '',
}

export default class TickTickPlugin extends Plugin {
    settings: TickTickPluginSettings;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new Settings(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}


class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: TickTickPlugin;

	constructor(app: App, plugin: TickTickPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
async function getAccessToken() {
    // Redirect the user to the TickTick authorization page
    const authUrl = `https://ticktick.com/oauth/authorize?client_id=${CLIENT_ID}&scope=tasks:write&response_type=code&redirect_uri=${REDIRECT_URI}`;
    window.open(authUrl);

    // Listen for the redirect with the authorization code
    window.onmessage = async (event) => {
        if (event.origin !== window.location.origin) {
            return;
        }

        // Extract the authorization code from the event data
        const authCode = event.data;

        // Exchange the authorization code for an access token
        const response = await fetch('https://ticktick.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${authCode}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`
        });

        const data = await response.json();

        // Store the access token securely
        this.settings.accessToken = data.access_token;
        await this.saveSettings();
    };
}
