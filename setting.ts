import { PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';

export class Settings extends PluginSettingTab {
    private plugin: TickTickPlugin;

    constructor(app: App, plugin: TickTickPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        this.containerEl.empty();

        this.pluginMetadata();
        this.authorizationCode();
        // Add other settings here...
    }

    pluginMetadata() {
        // Add your plugin metadata here...
    }

    authorizationCode() {
        const desc = document.createDocumentFragment();
        desc.createEl("span", null, (span) => {
            span.innerText =
                "To get the authorization code, please click ";

            span.createEl("a", null, (link) => {
                link.href = `https://ticktick.com/oauth/authorize?client_id=${YOUR_CLIENT_ID}&redirect_uri=${YOUR_REDIRECT_URI}&response_type=code&scope=${YOUR_SCOPE}`;
                link.innerText = "here!";
            });
        });

        new Setting(this.containerEl)
            .setName("TickTick Authorization Code")
            .setDesc(desc)
            .addTextArea(async (text) => {
                text.setValue(await this.app.vault.adapter.read(getAuthorizationCodePath(this.app.vault)));
                text.onChange(async (value) => {
                    await this.app.vault.adapter.write(getAuthorizationCodePath(this.app.vault), value);
                });
            });
    }

    // Add other methods here...
}
