//META{"name":"MessageLogger","website":"https://metalloriff.github.io/toms-discord-stuff/","source":"https://github.com/Metalloriff/BetterDiscordPlugins/blob/master/MessageLogger.plugin.js"}*//

class MessageLogger {
	
	getName() { return "MessageLogger"; }
	getDescription() { return "Записыв все отправленные сообщения, редактирование сообщений и удаление сообщений на указанных серверах, всех неизмененных серверах или всех серверах, а также в прямых сообщениях.."; }
	getVersion() { return "1.14.17"; }
	getAuthor() { return "Metalloriff | Руссифицировал Razor"; }
	getChanges() {
		return {
			"1.10.7" :
			`
			- Теперь вы можете просматривать черный / белый список каналов.
			- Добавлена настройка «показ удаленных сообщений и истории редактирования сообщений в чате».
			- Ссылки теперь кликабельны в журнале.
			`,
			"1.11.7" :
			`
			- Добавлены всплывающие подсказки к удаленным и отредактированным сообщениям чата.
			- Исправлена ошибка, из-за которой ссылки в журнале не были кликабельными.
			- Ссылки теперь отображаются в отредактированных сообщениях чата.
			- Упоминания теперь отображаются в журнале и отредактированных сообщениях чата.
			- Исправлена ошибка, при которой история редактирования не форматировалась в журнале.
			- Теги канала теперь отображаются в журнале и отредактированных сообщениях чата.
			- Emojis теперь показывают в журнале и отредактированных сообщениях чата.
			- Исправлено открытие журнала, обычно открываемое фильтром после alt-tabbing из Discord. (Требуется перезагрузка. Была либ проблема.)
			- Использование привязок клавиш при открытом окне журнала снова закроет его.
			- Исправлена ошибка, при которой старые отредактированные и удаленные сообщения не переходили в состояние удаления / редактирования в чате.
			- Удаленные и отредактированные сообщения теперь будут удаляться / редактироваться так, как они это делали изначально, когда плагин выгружается.
			- Исправлено только одно изображение на сообщение, отображаемое в журнале.
			- Добавлена настройка «показывать количество новых удаленных сообщений при входе в канал» вместе с отредактированными сообщениями.
			`,
			"1.12.7" :
			`
			- Исправлены непрочитанные удаленные / отредактированные сообщения, никогда не читаемые.
			- Удаленные изображения и упоминания теперь отображаются серым цветом, если не наведены, что делает очевидным их удаление.
			- Исправлена ошибка, при которой сообщения бота регистрировались независимо от настроек.
			- Исправлено заполнение регистратора при нажатии «загрузить еще». Все, что я могу сказать об этой ошибке, это обратиться к этому мему: <a href="https://i.imgur.com/x5bXdOq.png"> https://i.imgur.com/x5bXdOq.png < / а>
			- Теперь вы можете создавать черные / белые списки DM.
			- Исправлена ошибка приглушения каналов.
			- Редактирование отредактированного сообщения теперь устанавливает правильное сообщение.
			`,
			"1.12.9" :
			`
			- Исправлены рандомные краши. Спасибо Discord!
			- Исправлены отредактированные и удаленные сообщения, не отображаемые в DM.
			- Незначительное улучшение производительности.
			`,
			"1.13.13" :
			`
			- Отредактированные сообщения и сообщения журнала теперь форматируются правильно! Ахуеть!
			- Исправлена кнопка очистки.
			`,
			"1.14.13":
			`
			- Исправлено контекстное меню DM.
			- Добавлена настройка «всегда регистрировать выбранный канал».
			- Добавлена настройка «всегда регистрировать дмс».
			`
		};
	}

	load() {}

	start() {
        let libLoadedEvent = () => {
            try{ this.onLibLoaded(); }
            catch(err) { console.error(this.getName(), "Ошибка, плагин не может быть запущен!", err); try { this.stop(); } catch(err) { console.error(this.getName() + ".stop()", err); } }
        };

		let lib = document.getElementById("NeatoBurritoLibrary");
		if(!lib) {
			lib = document.createElement("script");
			lib.id = "NeatoBurritoLibrary";
			lib.type = "text/javascript";
			lib.src = "https://rawgit.com/Metalloriff/BetterDiscordPlugins/master/Lib/NeatoBurritoLibrary.js";
			document.head.appendChild(lib);
		}
		this.forceLoadTimeout = setTimeout(libLoadedEvent, 30000);
        if(typeof window.NeatoLib !== "undefined") libLoadedEvent();
		else lib.addEventListener("load", libLoadedEvent);
	}

	getSettingsPanel() {
		setTimeout(() => {
			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createToggleGroup("ml-gen-toggles", "Основные настройки", [
				{ title : "Игнорировать заглушенные сервера", value : "ignoreMutedGuilds", setValue : this.settings.ignoreMutedGuilds },
				{ title : "Игнорировать заглушенные каналы", value : "ignoreMutedChannels", setValue : this.settings.ignoreMutedChannels },
				{ title : "Игнорировать ботов", value : "ignoreBots", setValue : this.settings.ignoreBots },
				{ title : "Игнорировать сообщения от тебя", value : "ignoreSelf", setValue : this.settings.ignoreSelf },
				{ title : "Отключить кейбинды", value : "disableKeybind", setValue : this.settings.disableKeybind },
				{ title : "Показать кнопку очистки журнала в верхней его части.", value : "clearButtonOnTop", setValue : this.settings.clearButtonOnTop },
				{ title : "Кэширование всех полученных изображений. (Попытаемся исправить, чтобы показать удаленные изображения, отключите это, если вы заметили снижение скорости интернета)", value : "cacheAllImages", setValue : this.settings.cacheAllImages },
				{ title : "Отображение дат с отметками времени.", value : "displayDates", setValue : this.settings.displayDates },
				{ title : "Отображение удаленных сообщений и истории редактирования сообщений в чате", value : "displayInChat", setValue : this.settings.displayInChat },
				{ title : "Показывать количество новых сообщений при входе в канал", value : "showDeletedCount", setValue : this.settings.showDeletedCount },
				{ title : "Показывать количество новых отредактированных сообщений при входе в канал", value : "showEditedCount", setValue : this.settings.showEditedCount },
				{ title: "Всегда регистрировать выбранный канал, независимо от черного/белого списка", value: "alwaysLogSelected", setValue: this.settings.alwaysLogSelected },
				{ title: "Всегда регистрировать DMs, независимо от черного/белого списка", value: "alwaysLogDM", setValue: this.settings.alwaysLogDM }
			], choice => {
				this.settings[choice.value] = !this.settings[choice.value];
				if(choice.value == "disableKeybind") {
					this.unregisterKeybinds();
					this.registerKeybinds();
				}
				this.saveSettings();
			}), this.getName());

			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createRadioGroup("ml-sort-type", "Направление сортировки", [
				{ title : "Новый - Старый", value : true },
				{ title : "Старый - Новый", value : false }
			], this.settings.reverseOrder, (choiceButton, choice) => {
				this.settings.reverseOrder = choice.value;
				this.saveSettings();
			}, "Подсказка: вы также можете щелкнуть выбранную вкладку, чтобы изменить направление сортировки."), this.getName());

			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createRadioGroup("ml-visibility-type", "Тип лога", [
				{ title : "Все", value : "all" },
				{ title : "Белый список", value : "whitelist" },
				{ title : "Черный лист", value : "blacklist" }
			], this.settings.type, (choiceButton, choice) => {
				this.settings.type = choice.value;
				this.saveSettings();
			}), this.getName());

			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createToggleGroup("ml-toast-toggles", "Отображение всплывающих уведомлений для каждого", [
				{ title : "Просмотр присланных сообщений", value : "sent", setValue : this.settings.toastToggles.sent },
				{ title : "Просмотр отредактированных сообщений", value : "edited", setValue : this.settings.toastToggles.edited },
				{ title : "Просмотр удаленных сообщений", value : "deleted", setValue : this.settings.toastToggles.deleted }
			], choice => {
				this.settings.toastToggles[choice.value] = !this.settings.toastToggles[choice.value];
				this.saveSettings();
			}), this.getName());

			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createNewTextField("Заголовок отправленного сообщения", this.settings.cap, e => {
				if(isNaN(e.target.value)) return NeatoLib.showToast("Вы должны указать число!", "error");
				this.settings.cap = e.target.value;
				this.saveSettings();
			}), this.getName());

			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createNewTextField("Сохраненный заголовок сообщения", this.settings.savedCap, e => {
				if(isNaN(e.target.value)) return NeatoLib.showToast("Вы должны указать число!", "error");
				this.settings.savedCap = e.target.value;
				this.saveSettings();
			}), this.getName());

			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createNewTextField("Журнал загруженных сообщений", this.settings.renderCap, e => {
				if(isNaN(e.target.value)) return NeatoLib.showToast("Вы должны указать число!", "error");
				this.settings.renderCap = e.target.value;
				this.saveSettings();
			}), this.getName());

			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createKeybindInput("Открыть лог", this.settings.openLogKeybind, newBind => {
				if(newBind) {
					this.unregisterKeybinds();
					this.settings.openLogKeybind = newBind;
					this.registerKeybinds();
					this.saveSettings();
				} else NeatoLib.showToast("Кейбинд пуст!", "error");
			}), this.getName());

			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createKeybindInput("Открыть лог отфильтрованный в выбраном канале", this.settings.openLogFilteredKeybind, newBind => {
				if(newBind) {
					this.unregisterKeybinds();
					this.settings.openLogFilteredKeybind = newBind;
					this.registerKeybinds();
					this.saveSettings();
				} else NeatoLib.showToast("Кейбинд пуст!", "error");
			}), this.getName());

			NeatoLib.Settings.pushChangelogElements(this);
		}, 0);

		return NeatoLib.Settings.Elements.pluginNameLabel(this.getName());
	}
	
	saveSettings() {
		NeatoLib.Settings.save(this);
	}

	saveData() {
		this.updateMessages();
		NeatoLib.Data.save(this.getName() + "Дата", "data", {
			deletedMessageRecord : this.deletedMessageRecord,
			editedMessageRecord : this.editedMessageRecord,
			purgedMessageRecord : this.purgedMessageRecord
		});
	}

	onLibLoaded() {
		if(!NeatoLib.hasRequiredLibVersion(this, "0.5.19")) return;

		NeatoLib.Updates.check(this);

		this.settings = NeatoLib.Settings.load(this, {
			displayUpdateNotes : true,
			ignoreMutedGuilds : true,
			ignoreMutedChannels : true,
			ignoreBots : true,
			ignoreSelf : false,
			cap : 1000,
			savedCap : 100,
			reverseOrder : true,
			type : "all",
			list : [],
			toastToggles : {
				sent : false,
				edited : true,
				deleted : true
			},
			desktopToggles : {
				sent : false,
				edited : false,
				deleted : false
			},
			disableKeybind : false,
			displayUpdateNotes : true,
			clearButtonOnTop : false,
			cacheAllImages : true,
			openLogKeybind : {
				primaryKey : "KeyM",
				modifiers : ["ControlLeft"]
			},
			openLogFilteredKeybind : {
				primaryKey : "KeyM",
				modifiers : ["ControlLeft", "AltLeft"]
			},
			renderCap : 15,
			displayDates : true,
			displayInChat : true,
			showDeletedCount : true,
			showEditedCount : true,
			alwaysLogSelected: false,
			alwaysLogDM: true
		});

		this.style = NeatoLib.injectCSS(`
			.ml-item {
				padding: 10px;
			}

			.ml-label {
				color: white;
				font-size: 35px;
			}
			
			.ml-note {
				color: white;
				font-size: 25px;
				opacity: 0.75;
				line-height: 25px;
			}

			.ml-backdrop {
				opacity: 0.85;
				background-color: black;
				z-index: 1000;
				position: fixed;
				contain: strict;
				bottom: 0;
				left: 0;
				top: 0;
				right: 0;
			}

			.ml-scroller-wrapper {
				width: 800px;
				min-height: 800px;
				max-height: 800px;
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: #2f3136;
				border-radius: 5px;
				z-index: 10000;
			}

			.ml-scroller {
				width: 100%;
				max-height: 663px;
				overflow-y: scroll;
				overflow-x: hidden;
			}

			#message-logger-window *::-webkit-scrollbar {
				max-width: 10px;
			}
			
			#message-logger-window *::-webkit-scrollbar-track-piece {
				background: transparent;
				border: none;
				border-radius: 5px;
			}
			
			#message-logger-window *:hover::-webkit-scrollbar-track-piece {
				background: #2F3136;
				border-radius: 5px;
			}
			
			#message-logger-window *::-webkit-scrollbar-thumb {
				background: #1E2124;
				border: none;
				border-radius: 5px;
			}
			
			#message-logger-window *::-webkit-scrollbar-button {
				display: none;
			}

			.ml-label {
				flex: 1 1 auto;
				text-align: center;
				color: white;
				padding-top: 10px;
				font-size: 20px;
			}
			
			.ml-tab-button {
				padding: 10px;
				background-color: rgba(0, 0, 0, 0.3);
				color: white;
				display: inline-block;
				border-radius: 5px;
				margin: 15px 10px;
				cursor: pointer;
				transition: all 0.3s;
				font-size: 15px;
			}

			.ml-tab-button:hover, .ml-filter-help-button:hover {
				background-color: rgba(150, 150, 150, 0.3);
			}

			.ml-tab-button.selected, ml-tab-button:active, .ml-filter-help-button:active {
				background-color: #7289da;
				transform: scale(1.1);
			}

			.ml-edit-timestamp {
				display: inline;
				margin-left: 15px;
				opacity: 0;
				transition: opacity 0.3s;
			}

			.markup:hover .ml-edit-timestamp {
				opacity: 1;
			}

			.ml-filter-field {
				background-color: rgba(0, 0, 0, 0.2);
				border: none;
				border-radius: 5px;
				height: 25px;
				line-height: 25px;
				width: 80%;
				margin-top: 10px;
				color: white;
				padding: 0px 5px;
			}

			.ml-label span {
				vertical-align: middle;
				marign-left: 10px;
			}

			.ml-filter-help-button {
				display: inline-block;
				background-color: rgba(0, 0, 0, 0.2);
				border: none;
				border-radius: 5px;
				height: 25px;
				line-height: 25px;
				width: 8%;
				margin-top: 10px;
				color: white;
				padding: 0px 5px;
				cursor: pointer;
				font-size: 15px;
				transition: all 0.3s;
			}

			.ml-scroller > :last-child {
				margin-bottom: 10px;
			}

			.ml-avatar-wrapper {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin-top: -2px;
				margin-left: 5px;
				margin-right: 5px;
				background-size: cover;
			}

			.ml-username-meta {
				margin-left: 10px;
			}

			.ml-message-group {
				padding: 10px 0;
			}

			#message-logger-window .${NeatoLib.getClass("containerCozy", "container")} {
				padding-top: 5px;
			}

			#message-logger-window .message {
				margin-left: 60px;
			}

			.ml-lmc {
				background-color: rgba(0, 0, 0, 0.3);
				border-radius: 5px;
				color: white;
				text-align: center;
				cursor: pointer;
				padding: 15px;
				margin: 15px;
				transition: background 0.3s;
			}

			.ml-lmc:hover {
				background-color: rgba(150, 150, 150, 0.3);
			}

			.ml-deleted .${NeatoLib.getClass("markup")} {
				color: ${NeatoLib.Colors.DiscordDefaults.red} !important;
			}

			.ml-deleted:not(:hover) img, .ml-deleted:not(:hover) .mention, .ml-deleted:not(:hover) .reactions, .ml-deleted:not(:hover) a {
				filter: grayscale(100%) !important;
			}

			.ml-deleted img, .ml-deleted .mention, .ml-deleted .reactions, .ml-deleted a {
				transition: filter 0.3s !important;
			}

			:not(.ml-edited) > .ml-edited, .ml-edited > .ml-edited:not(:last-child) {
				color: rgba(255, 255, 255, 0.5) !important;
			}

			.ml-deleted :not(.ml-edited) > .ml-edited, .ml-deleted .ml-edited > .ml-edited:not(:last-child) {
				color: rgba(240, 71, 71, 0.5) !important;
			}
		`);

		this.registerKeybinds();

		let data = NeatoLib.Data.load(this.getName() + "Дата", "data", {
			deletedMessageRecord : [],
			editedMessageRecord : [],
			purgedMessageRecord : []
		});

		this.messageRecord = [];
		this.deletedMessageRecord = data.deletedMessageRecord;
		this.editedMessageRecord = data.editedMessageRecord;
		this.purgedMessageRecord = data.purgedMessageRecord;

		this.getUser = NeatoLib.Modules.get("getUser").getUser;
		this.getServer = NeatoLib.Modules.get("getGuild").getGuild;
		this.getChannel = NeatoLib.Modules.get("getChannel").getChannel;

		this.openUserContextMenu = NeatoLib.Modules.get("openUserContextMenu").openUserContextMenu;

		this.muteModule = NeatoLib.Modules.get("isMuted");

		this.filter = "";

		document.addEventListener("contextmenu", this.contextEvent = e => {
			if(e.target.classList.contains(NeatoLib.getClass("guildIcon"))) return this.onGuildContext(e);

			if(NeatoLib.DOM.searchForParentElementByClassName(e.target, NeatoLib.getClass("messageCozy", "message"))) return this.onMessageContext();

			const channel = NeatoLib.ReactData.getProp(NeatoLib.ContextMenu.get(), "channel") || this.getChannel(NeatoLib.ReactData.getProp(NeatoLib.ContextMenu.get(), "channelId"));
			
			if (channel) return this.onChannelContext(channel);
		});

		this.helpMessage = 
		`
		Фильтр помощи:

		 "server: <servername or serverid>" - Фильтровать результаты с указанным именем или идентификатором сервера.
		 "channel: <channelname или channelid>" - Фильтровать результаты с указанным именем канала или идентификатором.
		 "пользователь: <имя пользователя, псевдоним или идентификатор пользователя>" - фильтровать результаты с указанным именем пользователя, псевдонимом или идентификатором пользователя.
		 «message: <search или messageid>» или «content: <search или messageid>» - Фильтрация результатов с указанным содержанием сообщения.
		
		 Разделяйте теги поиска запятыми.
		 Пример: сервер: tom's bd stuff, сообщение: heck
		
		
		Справка по ярлыкам:
		
		«Ctrl + M» (по умолчанию) - открыть журнал сообщений.
		«Ctrl + Alt + M» (по умолчанию) - открыть журнал сообщений с выбранным фильтрованным каналом.
		«Ctrl + S» - сохраняет резервную копию текущих зарегистрированных сообщений.
		«Ctrl + O» - открывает файловый браузер для загрузки резервной копии.
		`;

		this.classes = NeatoLib.getClasses(["contextMenu"]);

		this.localUser = NeatoLib.getLocalUser();

		this.electron = require("electron");

		this.getMessage = NeatoLib.Modules.get(["getMessages", "getMessage"]).getMessage;

		this.transitionTo = NeatoLib.Modules.get("transitionTo").transitionTo;

		this.windowKeyEvent = e => {
			if(e.ctrlKey) {
				if(e.key == "s") {
					NeatoLib.UI.createTextPrompt("ml-save-backup-prompt", "Сохранить файл бэкапа", (name, prompt) => {
						NeatoLib.Data.save(name, "data", {
							messageRecord : this.messageRecord,
							deletedMessageRecord : this.deletedMessageRecord,
							editedMessageRecord : this.editedMessageRecord,
							purgedMessageRecord : this.purgedMessageRecord
						});

						NeatoLib.showToast(`[${this.getName()}]: Бэкап сохранен в "${name}.config.json"`, "success");

						prompt.close();
					}, "ML_BackupData_" + new Date().toDateString().split(" ").join("_") + "_" + new Date().toLocaleTimeString().split(":").join("_").split(" ").join("_"), { placeholder : "Назовите бэкап..." });
				}

				if(e.key == "o") {
					NeatoLib.browseForFile(file => {
						if(!file.name.endsWith(".config.json")) return NeatoLib.showToast(`[${this.getName()}]: This is not a correct backup data file`, "error");

						NeatoLib.UI.createPrompt("ml-load-backup-prompt", "Загрузить файл бэкапа", "Вы уверены, что хотите загрузить бэкап? Все текущие зарегистрированные сообщения могуть быть потеряны.", prompt => {
							let data = NeatoLib.Data.load(file.name.substring(0, file.name.indexOf(".")), "data");
	
							this.messageRecord = data.messageRecord;
							this.deletedMessageRecord = data.deletedMessageRecord;
							this.editedMessageRecord = data.editedMessageRecord;
							this.purgedMessageRecord = data.purgedMessageRecord;
	
							NeatoLib.showToast(`[${this.getName()}]: Файл бэкапа был загружен`, "success");

							this.saveData();

							prompt.close();
						});
					});
				}
			}
		};

		this.prevented = [];

		this.deletedChatMessages = {};
		this.editedChatMessages = {};

		this.unpatchDispatch = NeatoLib.monkeyPatchInternal(NeatoLib.Modules.get("dispatch"), "dispatch", e => {
			const dispatch = e.args[0];

			if(!dispatch) return e.callDefault();

			try {
				if(dispatch.type != "MESSAGE_CREATE" && dispatch.type != "MESSAGE_DELETE" && dispatch.type != "MESSAGE_DELETE_BULK" && dispatch.type != "MESSAGE_UPDATE") return e.callDefault();

				if(!this.settings.displayInChat && dispatch.type != "MESSAGE_CREATE") e.callDefault();

				const channel = NeatoLib.Modules.get("getChannel").getChannel(dispatch.message ? dispatch.message.channel_id : dispatch.channelId), guild = channel && channel.guild_id ? NeatoLib.Modules.get("getGuild").getGuild(channel.guild_id) : null;

				if(!channel) return e.callDefault();

				this.updateMessages(channel.id);
				setTimeout(() => this.updateMessages(channel.id), 500);

				let guildIsMutedReturn = false, channelIsMutedReturn = false;

				if(guild) {
					guildIsMutedReturn = this.settings.ignoreMutedGuilds && this.muteModule.isMuted(guild.id);
					channelIsMutedReturn = this.settings.ignoreMutedChannels && (this.muteModule.isChannelMuted(guild.id, channel.id) || channel.parent_id && this.muteModule.isChannelMuted(channel.parent_id));
				}

				let listed = (guild && this.settings.list.includes(guild.id)) || this.settings.list.includes(channel.id);
				if(this.settings.type == "whitelist" && listed && (!channelIsMutedReturn || this.settings.list.includes(channel.id))) listed = true;
				else if(this.settings.type == "blacklist" && !listed && !guildIsMutedReturn && !channelIsMutedReturn) listed = true;
				else if(this.settings.type == "all" && !guildIsMutedReturn && !channelIsMutedReturn) listed = true;
				else if (this.settings.alwaysLogSelected && this.selectedChannel.id == channel.id) listed = true;
				else if (this.settings.alwaysLogDM && ((dispatch.message && !dispatch.message.guild_id) || (dispatch.channelId && !NeatoLib.Modules.get("getChannel").getChannel(dispatch.channelId).guild_id))) listed = true;
				else listed = false;

				if(!listed) return e.callDefault();

				let author = dispatch.message && dispatch.message.author ? NeatoLib.Modules.get("getUser").getUser(dispatch.message.author.id) : null;
				if(!author) author = ((NeatoLib.Modules.get("_channelMessages")._channelMessages[channel.id] || { _map : {} })._map[dispatch.message ? dispatch.message.id : dispatch.id] || {}).author;

				if(author && author.bot && this.settings.ignoreBots) return e.callDefault();
				if(author && author.id == this.localUser.id && this.settings.ignoreSelf) return e.callDefault();
					
				const timestamp = dispatch.timestamp = this.settings.displayDates ? `${new Date().toLocaleTimeString()}, ${new Date().toLocaleDateString()}` : new Date().toLocaleTimeString();

				if(this.messageRecord.length >= this.settings.cap) this.messageRecord.splice(0, 1);
				if(this.deletedMessageRecord.length >= this.settings.savedCap) this.deletedMessageRecord.splice(0, 1);
				if(this.editedMessageRecord.length >= this.settings.savedCap) this.editedMessageRecord.splice(0, 1);
				if(this.purgedMessageRecord.length >= this.settings.savedCap) this.purgedMessageRecord.splice(0, 1);

				if(dispatch.type == "MESSAGE_DELETE") {
					this.prevented.push(e.callDefault);

					if(this.settings.displayInChat) {
						if(!this.deletedChatMessages[channel.id]) (this.deletedChatMessages[channel.id] = { unseen : 0 })[dispatch.id] = timestamp;
						else this.deletedChatMessages[channel.id][dispatch.id] = timestamp;
						if(!this.selectedChannel || this.selectedChannel.id != channel.id) this.deletedChatMessages[channel.id].unseen++;
					}

					const deleted = this.messageRecord.find(m => m.message.id == dispatch.id);

					if(!deleted || this.deletedMessageRecord.find(m => m.message.id == dispatch.id)) return;

					deleted.timestamp = timestamp;

					if(this.settings.toastToggles.deleted) {
						if(guild && channel) NeatoLib.showToast(`Сообщение удалено на сервере ${guild.name} в канале #${channel.name}.`, "error", { icon : guild.getIconURL(), onClick : () => this.openWindow("deleted") });
						else NeatoLib.showToast("Сообщение удалено из DM.", "error", { icon : this.getAvatarOf(deleted.message.author), onClick : () => this.openWindow("deleted") });
					}

					this.deletedMessageRecord.push(deleted);

					this.saveData();
				} else if(dispatch.type == "MESSAGE_DELETE_BULK") {
					this.prevented.push(e.callDefault);

					if(this.settings.displayInChat && !this.deletedChatMessages[channel.id]) this.deletedChatMessages[channel.id] = { unseen : 0 };

					for(let i = 0; i < dispatch.ids.length; i++) {
						if(this.settings.displayInChat) {
							this.deletedChatMessages[channel.id][dispatch.ids[i]] = timestamp;
							if(!this.selectedChannel || this.selectedChannel.id != channel.id) this.deletedChatMessages[channel.id].unseen++;
						}

						const purged = this.messageRecord.find(x => x.message.id == dispatch.ids[i]);

						if(!purged || this.purgedMessageRecord.find(x => x.message.id == dispatch.ids[i])) return;
						
						purged.timestamp = timestamp;

						this.purgedMessageRecord.push(purged);
					}

					if(this.settings.toastToggles.deleted) {
						if(guild && channel) NeatoLib.showToast(`${dispatch.ids.length} сообщений было удалено на сервере ${guild.name} в канале #${channel.name}.`, "error", { icon : guild.getIconURL(), onClick : () => this.openWindow("deleted") });
					}
						
					this.saveData();
				} else if(dispatch.type == "MESSAGE_UPDATE" && dispatch.message.edited_timestamp) {
					this.prevented.push(e.callDefault);

					if(this.settings.displayInChat) {
						if(!this.editedChatMessages[channel.id]) (this.editedChatMessages[channel.id] = { unseen : 0 })[dispatch.message.id] = [{ message : dispatch.message.content, timestamp : timestamp }];
						else if(!this.editedChatMessages[channel.id][dispatch.message.id]) this.editedChatMessages[channel.id][dispatch.message.id] = [{ message : dispatch.message.content, timestamp : timestamp }];
						else this.editedChatMessages[channel.id][dispatch.message.id].push({ message : dispatch.message.content, timestamp : timestamp });
						if(!this.selectedChannel || this.selectedChannel.id != channel.id) this.editedChatMessages[channel.id].unseen++;
					}

					const last = this.messageRecord.find(m => m.message.id == dispatch.message.id), lastEditedIDX = this.editedMessageRecord.findIndex(m => m.message.id == dispatch.message.id);

					if(!last || !dispatch.message.content || !dispatch.message.content.trim().length && !dispatch.message.attachments.length) return;

					dispatch.editHistory = !last.editHistory ? [{ content : last.message.content, editedAt : timestamp }] : last.editHistory;

					if(lastEditedIDX != -1) {

						dispatch.editHistory.push({ content : this.editedMessageRecord[lastEditedIDX].message.content, editedAt : timestamp });

						last.editHistory = dispatch.editHistory;
						last.message.content = dispatch.message.content;
						last.edited = true;
						
						if(this.settings.toastToggles.edited) {
							if(guild && channel) NeatoLib.showToast(`Сообщение изменено на сервере ${guild.name} в канале #${channel.name}.`, { icon : guild.getIconURL(), onClick : () => this.openWindow("edited") });
							else NeatoLib.showToast("Сообщение отредактировано в DM.", { icon : this.getAvatarOf(last.message.author), onClick : () => this.openWindow("edited") });
						}

						this.editedMessageRecord.splice(lastEditedIDX, 1);

					}

					this.editedMessageRecord.push(dispatch);

					this.saveData();
				} else if(dispatch.type == "MESSAGE_CREATE" && dispatch.message && dispatch.message.state != "SENDING") {
					const existing = this.messageRecord.findIndex(m => m.message.id == dispatch.message.id);

					if(existing != -1) {
						if(this.messageRecord[existing].edited) return e.callDefault();
						this.messageRecord.splice(existing, 1);
					}
		
					if(this.settings.toastToggles.sent) {
						if(guild && channel) NeatoLib.showToast(`Сообщение отправлено в ${guild.name} в канале #${channel.name}.`, "success", { icon : guild.getIconURL(), onClick : () => this.openWindow("sent") });
						else NeatoLib.showToast("Сообщение отправлено в DM.", "success", { icon : this.getAvatarOf(dispatch.message.author), onClick : () => this.openWindow("sent") });
					}
		
					if(this.settings.cacheAllImages) for(let i = 0; i < dispatch.message.attachments.length; i++) new Image().src = dispatch.message.attachments[i].url;

					this.messageRecord.push(dispatch);

					e.callDefault();
				} else e.callDefault();
			} catch(err) {
				console.error(err);
				return e.callDefault();
			}
		});

		this.unpatchEdit = NeatoLib.monkeyPatchInternal(NeatoLib.Modules.get("startEditMessage"), "startEditMessage", e => {
			if(!this.editedChatMessages[e.args[0]] || !this.editedChatMessages[e.args[0]][e.args[1]]) return e.callDefault();

			const edits = this.editedChatMessages[e.args[0]][e.args[1]];
			e.args[2] = edits[edits.length - 1].message;

			return e.callDefault();
		});
		
		if(this.settings.displayUpdateNotes) NeatoLib.Changelog.compareVersions(this.getName(), this.getChanges());

		NeatoLib.Events.attach("switch", this.switchEvent = () => this.switch());

		NeatoLib.Events.onPluginLoaded(this);

		this.switch();
	}

	unregisterKeybinds() {
		NeatoLib.Keybinds.detachListener("ml-open-log-filtered");
		NeatoLib.Keybinds.detachListener("ml-open-log");
	}

	registerKeybinds() {
		if(this.settings.disableKeybind) return;

		NeatoLib.Keybinds.attachListener("ml-open-log-filtered", this.settings.openLogFilteredKeybind, () => {
			if(this.selectedChannel) this.filter = "channel: " + this.selectedChannel.id;
			if(document.getElementById("message-logger-window")) document.getElementById("message-logger-window").remove();
			else this.openWindow("deleted");
		});

		NeatoLib.Keybinds.attachListener("ml-open-log", this.settings.openLogKeybind, () => {
			this.filter = "";
			if(document.getElementById("message-logger-window")) document.getElementById("message-logger-window").remove();
			else this.openWindow("deleted");
		});
	}

	switch() {
		if(this.ready != true || document.getElementsByClassName(NeatoLib.getClass("messages"))[0] == undefined) return;

		this.selectedChannel = NeatoLib.getSelectedTextChannel();

		if(this.settings.showDeletedCount && this.deletedChatMessages[this.selectedChannel.id] && this.deletedChatMessages[this.selectedChannel.id].unseen) {
			NeatoLib.showToast(`Насчитано ${this.deletedChatMessages[this.selectedChannel.id].unseen} удаленных сообщений в ${this.selectedChannel.name ? "#" + this.selectedChannel.name : "DM"}`);
			this.deletedChatMessages[this.selectedChannel.id].unseen = 0;
		}

		if(this.settings.showEditedCount && this.editedChatMessages[this.selectedChannel.id] && this.editedChatMessages[this.selectedChannel.id].unseen) {
			NeatoLib.showToast(`Насчитано ${this.editedChatMessages[this.selectedChannel.id].unseen} отредактированных сообщений в ${this.selectedChannel.name ? "#" + this.selectedChannel.name : "DM"}`);
			this.editedChatMessages[this.selectedChannel.id].unseen = 0;
		}

		const onMessage = e => {
			const messageID = NeatoLib.ReactData.getProps(e.currentTarget.parentElement).message.id;

			if(this.editedMessageRecord.findIndex(x => x.message.id == messageID)) {
				this.filter = "message: " + messageID;
				this.openWindow("edited");
			}
		};

		if(this.messageObserver) this.messageObserver.disconnect();

		this.messageObserver = new MutationObserver(mutations => {
			for(let i = 0; i < mutations.length; i++) {
				if(mutations[i].addedNodes[0] && mutations[i].addedNodes[0].className == "edited") {
					mutations[i].addedNodes[0].addEventListener("click", e => onMessage(e));
				}
			}
		});

		this.messageObserver.observe(document.getElementsByClassName(NeatoLib.getClass("messages"))[0], { childList : true, subtree : true });

		const foundEdited = document.getElementsByClassName(NeatoLib.getClass("edited"));

		for(let i = 0; i < foundEdited.length; i++) foundEdited[i].addEventListener("click", e => onMessage(e));

		setTimeout(() => this.updateMessages(), 100);
		this.updateMessages();
	}

	updateMessages(cid) {
		if(!this.selectedChannel || cid && this.selectedChannel.id != cid) return;
		
		if(!document.getElementsByClassName(NeatoLib.getClass("chat")).length) return;

		setTimeout(() => {
			const messages = document.getElementsByClassName(NeatoLib.getClass("messageCozy", "message"));

			const onClickEditedTag = e => {
				const mid = NeatoLib.ReactData.getProp(e.currentTarget, "message.id");

				if(this.editedMessageRecord.findIndex(x => x.message.id == mid)) {
					this.filter = "message: " + mid;
					this.openWindow("edited");
				}
			};

			for(let i = 0; i < messages.length; i++) {
				const mid = NeatoLib.ReactData.getProp(messages[i], "message.id"), markup = messages[i].getElementsByClassName(NeatoLib.getClass("markup"))[0];
				if(!mid) continue;

				if(this.deletedChatMessages[this.selectedChannel.id] && this.deletedChatMessages[this.selectedChannel.id][mid]) {
					const edits = messages[i].getElementsByClassName("ml-edited");
					for(let i = 0; i < edits.length; i++) if(edits[i].tooltip) edits[i].tooltip.detach();
					messages[i].classList.add("ml-deleted");
					NeatoLib.Tooltip.attach("Deleted at " + this.deletedChatMessages[this.selectedChannel.id][mid].split(",")[0], markup.textContent ? markup : messages[i].getElementsByClassName(NeatoLib.getClass("contentCozy", "content"))[0].lastChild, { side : "left" });
					const images = messages[i].getElementsByTagName("img");
					for(let i = 0; i < images.length; i++) images[i].src = images[i].src.split("?")[0];
					continue;
				}

				if(this.editedChatMessages[this.selectedChannel.id] && this.editedChatMessages[this.selectedChannel.id][mid]) {
					while(markup.getElementsByClassName(NeatoLib.getClass("markup")).length) markup.getElementsByClassName(NeatoLib.getClass("markup"))[0].remove();

					markup.classList.add("ml-edited");
					
					const headerWidth = markup.firstChild.getBoundingClientRect ? markup.firstChild.getBoundingClientRect().width : 0;

					const edit = this.editedChatMessages[this.selectedChannel.id][mid];

					for(let e = 0; e < edit.length; e++) {
						if(!markup.getElementsByClassName(NeatoLib.getClass("edited")).length) {
							markup.insertAdjacentHTML("beforeend", `<time class="${NeatoLib.getClass("edited")}">(edited)</time>`);
							markup.lastElementChild.addEventListener("click", onClickEditedTag);
						}

						const editedMarkup = this.formatMarkup(edit[e].message);
						editedMarkup.classList.add("ml-edited");
						NeatoLib.Tooltip.attach("Edited at " + edit[e].timestamp.split(",")[0], editedMarkup, { side : "left" });
						markup.appendChild(editedMarkup);

						if (headerWidth != 0 && markup.firstChild.className.includes("Compact"))
							editedMarkup.style.marginLeft = (headerWidth + 5) + "px";
					}
				}
			}
		}, 0);
	}

	formatMarkup(content) {
		const markup = document.createElement("div"), react = "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED";

		NeatoLib.Modules.get([react, "render"]).render(
			NeatoLib.Modules.get([react, "createElement"]).createElement("div", { className: NeatoLib.getClass("markup") },
				NeatoLib.Modules.get(["parserFor", "parse"]).parse(content)
			),
			markup
		);

		const hidden = markup.getElementsByClassName(NeatoLib.getClass("spoilerText", "hidden"));

		for (let i = 0; i < hidden.length; i++) {
			hidden[i].classList.remove(NeatoLib.getClass("spoilerText", "hidden"));
		}

		return markup;
	}

	openWindow(type, curCap = this.settings.renderCap) {
		const app = document.getElementsByClassName(NeatoLib.getClass("app"))[0];

		if(document.getElementById("message-logger-window") == undefined) app.insertAdjacentHTML("beforeend", `
		<div id="message-logger-window">
			<div class="ml-backdrop"></div>
			<div class="ml-scroller-wrapper">
				<div class="ml-label">
					<h2>Логгер сообщений</h2>
					<span>Фильтр:</span>
					<input id="ml-filter" class="ml-filter-field" value="${this.filter}"></input>
					<div class="ml-filter-help-button">Помощь</div>
					<div style="text-align:center">
						<div class="ml-tab-button sent">Отправленные сообщения</div>
						<div class="ml-tab-button deleted">Удаленные сообщения</div>
						<div class="ml-tab-button edited">Измененные сообщения</div>
						<div class="ml-tab-button purged">Очищенные сообщения</div>
						<div class="ml-tab-button ghostpings">Гостпинги</div>
					</div>
				</div>
				<div class="ml-scroller" id="message-logger-scroller"></div>
			</div>
		</div>`);

		document.removeEventListener("keydown", this.windowKeyEvent);
		document.addEventListener("keydown", this.windowKeyEvent);

		const tabs = document.getElementsByClassName("ml-tab-button");

		for(let i = 0, l = tabs.length; i < l; i++) {
			tabs[i].onclick = () => {
				if(tabs[i].classList.contains("help")) return;
	
				if(tabs[i].classList.contains("selected")) {
					this.settings.reverseOrder = !this.settings.reverseOrder;
					this.saveSettings();
				}
				
				for(let i = 0, l = tabs.length; i < l; i++) if(tabs[i].classList.contains("selected")) tabs[i].classList.remove("selected");
	
				this.openWindow(tabs[i].classList[1]);
	
				tabs[i].classList.add("selected");
			};
		}

		document.getElementsByClassName("ml-tab-button " + type)[0].classList.add("selected");

		const backdrop = document.getElementsByClassName("ml-backdrop")[0];

		backdrop.onclick = () => {
			this.filter = "";
			document.removeEventListener("keydown", this.windowKeyEvent);
			document.getElementById("message-logger-window").outerHTML = "";
			if(this.updateWindow) clearInterval(this.updateWindow);
		};

		document.getElementsByClassName("ml-filter-help-button")[0].onclick = () => {
			BdApi.getCore().alert("Help", this.helpMessage.split("\n").join("<br><br>"));
			backdrop.click();
		};
		
		const scroller = document.getElementById("message-logger-scroller"), messages = this.getFilteredMessages(type);
		scroller.innerHTML = "";

		if(this.updateWindow) clearInterval(this.updateWindow);

		this.updateWindow = setInterval(() => {
			if(!document.getElementById("ml-filter")) {
				clearInterval(this.updateWindow);
				return;
			}

			this.filter = document.getElementById("ml-filter").value;

			if(this.getFilteredMessages(type).length != messages.length) this.openWindow(type, curCap);
		}, 1000);

		if(!messages.length) return;

		const onGroupContext = (e, i) => {
			e.preventDefault();

			const user = this.getUser(messages[i].message.author.id), channel = this.getChannel(messages[i].message.channel_id), items = [], messageID = e.target.getAttribute("data-message-id");

			if(e.target.tagName == "IMG") {
				const filename = e.target.src.substring(e.target.src.lastIndexOf("/") + 1, e.target.src.lastIndexOf("?") == -1 ? e.target.src.length : e.target.src.lastIndexOf("?"));

				items.push(NeatoLib.ContextMenu.createItem(filename));

				items.push(NeatoLib.ContextMenu.createItem("Сохранить в папку", () => {
					NeatoLib.browseForFile(folder => {
						NeatoLib.downloadFile(e.target.src, folder.path, filename);
					}, { directory : true });
				}));
			}

			if(e.target.classList.contains(NeatoLib.getClass("markup"))) {
				if(messageID) {
					if(channel && this.getMessage(channel.id, messages[i].message.id)) {
						items.push(NeatoLib.ContextMenu.createItem("Переидти в", () => {
							this.transitionTo(`/channels/${messages[i].message.guild_id}/${messages[i].message.channel_id}?jump=${messages[i].message.id}`);
							$backdrop.click();
							this.getContextMenu().style.display = "none";
						}));
					}

					items.push(NeatoLib.ContextMenu.createItem("Удалить из лога", () => {
						let messageA;
						if(type == "sent") messageA = this.messageRecord;
						if(type == "edited") messageA = this.editedMessageRecord;
						if(type == "deleted" || type == "ghostpings") messageA = this.deletedMessageRecord;
						if(type == "purged") messageA = this.purgedMessageRecord;
						let ii = messageA.findIndex(x => x.message.id == messageID);
						if(ii != -1) messageA.splice(ii, 1);
						this.saveData();
						NeatoLib.ContextMenu.close();
						this.openWindow(type, curCap);
					}));
				}

				items.push(NeatoLib.ContextMenu.createItem("Копировать текст", () => {
					this.electron.clipboard.writeText(messages[i].message.content);
					this.getContextMenu().style.display = "none";
					NeatoLib.showToast("Текст скопирован в буфер обмена!", "success");
				}));

				return;
			}
				
			if(items.length) NeatoLib.ContextMenu.create(items, e);

			if(items.length || !user || !channel) return;

			this.openUserContextMenu(e, user, channel);
			
			document.getElementsByClassName(this.classes.item)[0].addEventListener("click", () => backdrop.click());
		};

		let lastMessage, group;

		const populate = i => {
			try {
				if(!messages[i].message.author) return;

				if(group &&lastMessage && lastMessage.author.id == messages[i].message.author.id && lastMessage.channel_id == messages[i].message.channel_id) {
					const message = group.getElementsByClassName("message-text")[0], accessory = group.getElementsByClassName("accessory")[0];

					if(messages[i].editHistory != undefined) for(let ii = 0; ii < messages[i].editHistory.length; ii++) {
						const markup = this.formatMarkup(messages[i].editHistory[ii].content), timestamp = document.createElement("div");
						markup.style = "opacity:0.5";
						timestamp.className = "markup ml-edit-timestamp";
						timestamp.textContent = messages[i].editHistory[ii].editedAt;
						markup.appendChild(timestamp);
						message.appendChild(markup);
					}

					const markup = this.formatMarkup(messages[i].message.content);
					markup.dataset.messageId = messages[i].message.id;
					message.appendChild(markup);

					for(let ii = 0; ii < messages[i].message.attachments.length; ii++) {
						const img = document.createElement("img");
						img.src = messages[i].message.attachments[ii].url;
						img.width = Math.clamp(messages[i].message.attachments[ii].width, 200, 650);
						accessory.appendChild(img);
					}

					return;
				}

				lastMessage = messages[i].message;

				group = this.messageGroupItem(messages[i], type);

				group.addEventListener("contextmenu", e => onGroupContext(e, i));

				scroller.appendChild(group);
			} catch(err) { console.error(err); }
		};

		const cap = Math.clamp(messages.length - 1, 0, curCap);
		
		if(this.settings.reverseOrder) for(let i = messages.length - 1; i > Math.clamp(messages.length - cap, -1, Infinity); i--) populate(i);
		else for(let i = 0; i <= cap; i++) populate(i);

		if(messages.length > curCap) {
			scroller.insertAdjacentHTML("beforeend", `<div id="ml-load-more-button" class="ml-lmc">Загрузить больше</div>`);

			document.getElementById("ml-load-more-button").onclick = () => {
				this.openWindow(type, parseInt(curCap) + parseInt(this.settings.renderCap));
			};
		}

		if(type == "ghostpings") return;

		scroller.insertAdjacentHTML(this.settings.clearButtonOnTop ? "afterbegin" : "beforeend", `<div id="ml-clear-log-button" class="ml-lmc">Очистить</div>`);

		document.getElementById("ml-clear-log-button").onclick = () => {
			NeatoLib.UI.createPrompt("ml-clear-log-prompt", "Очистить лог", `Вы действительно хотите удалить ${type} сообщений?`, prompt => {
				if(type == "sent") this.messageRecord = [];
				if(type == "edited") this.editedMessageRecord = [];
				if(type == "deleted") this.deletedMessageRecord = [];
				if(type == "purged") this.purgedMessageRecord = [];
				this.saveData();
				NeatoLib.showToast("Лог сообщений очищен!", "success");
				this.openWindow(type);
				prompt.close();
			});
		};
	}

	getFilteredMessages(type) {
		let messages;

		if(type == "sent") messages = this.messageRecord.slice(0);
		if(type == "edited") messages = this.editedMessageRecord.slice(0);
		if(type == "deleted") messages = this.deletedMessageRecord.slice(0);
		if(type == "ghostpings") messages = Array.filter(this.deletedMessageRecord, x => Array.from(x.message.mentions, y => y.id).includes(this.localUser.id));
		if(type == "purged") messages = this.purgedMessageRecord.slice(0);
		
		const filters = this.filter.split(",");

		for(let i = 0; i < filters.length; i++) {
			const split = filters[i].split(":");
			if(split.length < 2) continue;

			const filterType = split[0].trim().toLowerCase(), filter = split[1].trim().toLowerCase();

			if(filterType == "server" || filterType == "guild") messages = Array.filter(messages, x => {
				const guild = this.getServer(x.message.guild_id);
				return x.message.guild_id == filter || (guild != undefined && guild.name.toLowerCase().includes(filter));
			});

			if(filterType == "channel") messages = Array.filter(messages, x => {
				const channel = this.getChannel(x.message.channel_id);
				return x.message.channel_id == filter || (channel != undefined && channel.name.toLowerCase().includes(filter.replace("#", "")));
			});

			if(filterType == "message" || filterType == "content") messages = Array.filter(messages, x => x.message.id == filter || x.message.content.toLowerCase().includes(filter));

			if(filterType == "user") messages = Array.filter(messages, x => x.message.author.id == filter || x.message.author.username.toLowerCase().includes(filter) || (x.message.member != undefined && x.message.member.nick != null && x.message.member.nick.toLowerCase().includes(filter)));
		}

		return messages;
	}

	messageGroupItem(data, type) {
		let details = "", server, channel = this.getChannel(data.message.channel_id);
		if(channel) server = this.getServer(channel.guild_id);

		if(type == "sent") details = "Отправлено в";
		if(type == "edited") details = "Последнее редактирование в";
		if(type == "deleted") details = "Удалено из";

		details += server && channel ? ` ${server.name}, #${channel.name} ` : " DM ";

		details += `at ${data.timestamp}`;

		let history = "";

		if(data.editHistory) for(let i = 0; i < data.editHistory.length; i++)  history += `<div class="${NeatoLib.getClass("markup")}" style="opacity:0.5">${this.formatMarkup(data.editHistory[i].content).innerHTML}<div class="${NeatoLib.getClass("markup")} ml-edit-timestamp">${data.editHistory[i].editedAt}</div></div>`;

		let attachments = "";

		if(data.message.attachments.length > 0) {
			for(let i = 0; i < data.message.attachments.length; i++) {
				let img = data.message.attachments[i];
				attachments += `<img src="${img.url}" width="${Math.clamp(img.width, 200, 650)}px">`;
			}
		}

		const element = document.createElement("div");

		element.setAttribute("class", NeatoLib.getClass("containerCozy", "container"));

		const markup = this.formatMarkup(data.message.content).innerHTML;

		element.innerHTML =
		`<div class="${NeatoLib.getClass("containerCozy")} ${NeatoLib.getClass("containerCozy", "container")} ml-message-group">
			<div class="${NeatoLib.getClass("messageCozy")} ${NeatoLib.getClass("messageCozy", "message")}" aria-disabled="false">
				<div class="${NeatoLib.getClass("headerCozy")}">
					<div tabindex="-1" class="ml-avatar-wrapper" role="button">
						<div class="ml-avatar-wrapper" style="background-image:url(${this.getAvatarOf(data.message.author)});padding:0"></div>
					</div>
					<h2 class="${NeatoLib.getClass("headerCozyMeta")} ml-username-meta"><span><strong tabindex="0" class="${NeatoLib.getClass("asianCompactTimeStamp", "username")}" role="button" style="color:white">${data.message.member && data.message.member.nick ? data.message.member.nick : data.message.author.username}</strong></span><time class="${NeatoLib.getClass("timestampCozy")}">${details}</time></h2>
				</div>
				<div class="${NeatoLib.getClass("contentCozy")} ${NeatoLib.getClass("contentCozy", "content")} message">
					<div class="${NeatoLib.getClass("containerCozy")} ${NeatoLib.getClass("containerCozy", "container")} message-text">
						${history}
						<div class="${NeatoLib.getClass("markup")}" data-message-id="${data.message.id}">${markup}</div>
					</div>
					<div class="${NeatoLib.getClass("containerCozy")} ${NeatoLib.getClass("containerCozy", "container")} accessory">${attachments}</div>
				</div>
			</div>
		</div>`;

		return element;
	}

	getAvatarOf(user) {
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
	}

	onChannelContext(channel) {
		const buttons = [];

		buttons.push(NeatoLib.ContextMenu.createItem("Открыть лог тут", () => {
			this.filter = "channel: " + channel.id;
			this.openWindow("deleted");
			NeatoLib.ContextMenu.close();
		}));

		if(this.settings.type != "all") {
			const updateButtonContent = () => {
				buttons[1].firstChild.innerText = (this.settings.list.includes(channel.id) ? "Удалить из " : "Добавить в ") + (this.settings.type == "blacklist" ? "Черный список" : "Белый список");
			};

			buttons.push(NeatoLib.ContextMenu.createItem("...", () => {
				if(this.settings.list.includes(channel.id)) this.settings.list.splice(this.settings.list.indexOf(channel.id), 1);
				else this.settings.list.push(channel.id);

				this.saveSettings();

				updateButtonContent();
			}));

			updateButtonContent();
		}

		document.getElementsByClassName(this.classes.itemGroup)[0].appendChild(NeatoLib.ContextMenu.createSubMenu("Логгер сообщений", buttons));
	}

	onGuildContext(e) {
		const id = e.target.parentElement.href.match(/\d+/)[0], buttons = [];

		buttons.push(NeatoLib.ContextMenu.createItem("Открыть лог тут", () => {
			this.filter = "server: " + id;
			this.openWindow("deleted");
			NeatoLib.ContextMenu.close();
		}));

		if(this.settings.type != "all") {
			const updateButtonContent = () => {
				buttons[1].firstChild.innerText = (this.settings.list.includes(id) ? "Удалить из " : "Добавить в ") + (this.settings.type == "blacklist" ? "Черный список" : "Белый список");
			};

			buttons.push(NeatoLib.ContextMenu.createItem("...", () => {
				if(this.settings.list.includes(id)) this.settings.list.splice(this.settings.list.indexOf(id), 1);
				else this.settings.list.push(id);

				this.saveSettings();

				updateButtonContent();
			}));

			updateButtonContent();
		}

		document.getElementsByClassName(this.classes.itemGroup)[1].appendChild(NeatoLib.ContextMenu.createSubMenu("Логгер сообщений", buttons, { callback : () => {
			this.filter = "";
			this.openWindow("deleted");
			NeatoLib.ContextMenu.close();
		}}));
	}

	onMessageContext() {
		let itemGroups = document.getElementsByClassName(this.classes.itemGroup);

		itemGroups[itemGroups.length - 1].insertAdjacentElement("beforeend", NeatoLib.ContextMenu.createSubMenu("Открыть лог сообщений", [
			NeatoLib.ContextMenu.createItem("Отправленные сообщения", () => { this.openWindow("sent"); NeatoLib.ContextMenu.close(); }),
			NeatoLib.ContextMenu.createItem("Удаленные сообщения", () => { this.openWindow("deleted"); NeatoLib.ContextMenu.close(); }),
			NeatoLib.ContextMenu.createItem("Отредактированные сообщения", () => { this.openWindow("edited"); NeatoLib.ContextMenu.close(); }),
			NeatoLib.ContextMenu.createItem("Гостпинги", () => { this.openWindow("ghostpings"); NeatoLib.ContextMenu.close(); }),
			NeatoLib.ContextMenu.createItem("Настройки плагина", () => { NeatoLib.Settings.showPluginSettings(this.getName()); NeatoLib.ContextMenu.close(); })
		]));
	}

	getContextMenu() {
		return document.getElementsByClassName(this.classes.contextMenu)[0];
	}

	clearLogs() {
		this.messageRecord = [];
		this.deletedMessageRecord = [];
		this.editedMessageRecord = [];
		this.purgedMessageRecord = [];
		this.saveData();
	}
	
	stop() {
		this.unpatchDispatch();
		this.unpatchEdit();

		for(let i = 0; i < this.prevented.length; i++) this.prevented[i]();
		
		document.removeEventListener("contextmenu", this.contextEvent);
		document.removeEventListener("keydown", this.windowKeyEvent);

		if(this.updateWindow) clearInterval(this.updateWindow);

		if(this.messageObserver) this.messageObserver.disconnect();

		NeatoLib.Events.detach("switch", this.switchEvent);

		this.style.destroy();

		this.unregisterKeybinds();
	}
	
}
