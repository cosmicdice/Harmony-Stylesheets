/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const packageFolder = specialFolders.userScripts + '/packages/Stylesheets'
const stylesheetsDirectory = packageFolder + "/stylesheets";

const defaultConfig = {
  "apply": []
}

function readConfig() {
  const configFile = new File(packageFolder + "/config.json");
  var configString = "";
  if (!configFile.exists) {
    MessageLog.error("Stylesheets - No config.json found, use default configuration.");
    return defaultConfig;
  }
  configFile.open(FileAccess.ReadOnly);
  configString = configFile.read();
  configFile.close();
  try {
    const config = JSON.parse(configString);
    return config;
  } catch (error) {
    MessageLog.error("Stylesheets - Error while parsing config.json: " + error);
  }
  MessageLog.trace("Stylesheets - Using default configuration.");
  return defaultConfig;
}

function writeConfig(config) {
	configString = JSON.stringify(config);
	const configFile = new File(packageFolder + "/config.json");
	configFile.open(FileAccess.WriteOnly);
	configFile.write(configString);
	configFile.close();
}

function listStylesheets() {
	const stylesheetDir = new Dir(stylesheetsDirectory);
	return stylesheetDir.entryList("*.qss");
}

function readStylesheet(stylesheetPath) {
  const stylesheetFile = new File(stylesheetPath);
  var stylesheet = "";
  if (!stylesheetFile.exists) {
    MessageLog.error("Stylesheets - Qss file not found: " + stylesheetPath);
    return stylesheet;
  }
  stylesheetFile.open(FileAccess.ReadOnly);
  stylesheet = stylesheetFile.read();
  stylesheetFile.close();
  return stylesheet;
}

function applyStylesheet(qssString) {
  const mainWindows = QApplication.topLevelWidgets().filter(function (widget) {
    return widget instanceof QMainWindow && !widget.parentWidget();
  });
  mainWindows.forEach(function (window) { window.setStyleSheet(qssString) });
}

function openExplorerOnPath(path) {
	var command = "";
	if (about.windowsArch) 	command = "explorer.exe \"" + stylesheetsDirectory.replaceAll("/","\\") + "\"";
	if (about.macArch) 		command = "open \"" + stylesheetsDirectory + "\"";
	if (about.linuxArch)		command = "xdg-open \"" + stylesheetsDirectory + "\"";
	print(command);
	openProcess = new Process2(command);
	openProcess.launchAndDetach();
}

function showStylesheetDialog() {
	const config = readConfig();
	const dialog = new QDialog();
	dialog.setWindowTitle ("Stylesheets");
	dialog.setFixedSize(new QSize(450, 400));
	
	const mainLayout = new QBoxLayout(QBoxLayout.TopToBottom);

	const columns = new QBoxLayout(QBoxLayout.LeftToRight);
	const leftLayout = new QBoxLayout(QBoxLayout.TopToBottom);
	const rightLayout = new QBoxLayout(QBoxLayout.TopToBottom);
	columns.addLayout(leftLayout, 0);
	columns.addLayout(rightLayout, 0);

	stylesheets = listStylesheets();
	
	const availableList = new QListWidget();
	availableList.dragDropMode = QAbstractItemView.DragDrop;
	availableList.defaultDropAction  = Qt.MoveAction

	const appliedList = new QListWidget();
	appliedList.dragDropMode = QAbstractItemView.DragDrop;
	appliedList.defaultDropAction  = Qt.MoveAction

  // Populate lists
	for (var i = 0; i< stylesheets.length; i++) {
		var newItem = new QListWidgetItem(stylesheets[i]);
		if (config.apply.indexOf(stylesheets[i]) !== -1){
			appliedList.addItem(newItem)
		} else {
			availableList.addItem(newItem);
		}	
	}
	
	availableList.itemDoubleClicked.connect(function (item) {
		const takenItem = availableList.takeItem(availableList.currentRow);
		appliedList.addItem(takenItem);
	});
	appliedList.itemDoubleClicked.connect(function (item) {
		const takenItem = appliedList.takeItem(appliedList.currentRow);
		availableList.addItem(takenItem);
	});

	leftLayout.addWidget(new QLabel("Available:"), 0, Qt.AlignLeft);
	leftLayout.addWidget(availableList, 0, Qt.AlignLeft);
	rightLayout.addWidget(new QLabel("Applied (top to bottom):"), 0, Qt.AlignLeft); 
	rightLayout.addWidget(appliedList, 0, Qt.AlignLeft);
	mainLayout.addLayout(columns, 0);

	// Buttons
	const buttonLayout = new QBoxLayout(QBoxLayout.LeftToRight);

	var openExplorerButton = new QPushButton("Open stylesheets folder...");
	openExplorerButton.clicked.connect(function(){openExplorerOnPath(stylesheetsDirectory)});
	buttonLayout.addWidget(openExplorerButton, 0, Qt.AlignLeft);
	
	var applyButton = new QPushButton("Apply");
	applyButton.clicked.connect(function(){
		const stylesheetNames = appliedList.findItems("*", Qt.MatchWildcard).map(function(item){return item.text()});
		const newConfig = JSON.parse(JSON.stringify(defaultConfig)); // copy defaultConfig object
		newConfig.apply = stylesheetNames;
		writeConfig(newConfig);
		stylesheetContents = stylesheetNames.map(function(name) {
			return readStylesheet(stylesheetsDirectory + "/" + name);
		});
		const finalStylesheet = stylesheetContents.join(" ");
		applyStylesheet(finalStylesheet);
	});
	buttonLayout.addWidget(applyButton, 0, Qt.AlignRight);

	mainLayout.addLayout(buttonLayout, 0);
	

	dialog.setLayout(mainLayout);
	dialog.exec();
}


function createToolbar() {
  var showDialogAction = {
    id: "org.harmony-stylesheets.ShowStylesheetsManagerDialog",
    text: "Show Stylesheet Manager",
    icon: "palette.png",
    checkable: false,
    isEnabled: true,
    isChecked: false,
    onPreferenceChanged: function () { },
    onTrigger: function () {
      showStylesheetDialog();
    }
  };
  ScriptManager.addAction(showDialogAction);

  var toolbar = new ScriptToolbarDef({
    id: "org.harmony-stylesheets.StylesheetsToolbar",
    text: "Stylesheets",
    customizable: false
  });

  toolbar.addButton({
    text: showDialogAction.text,
    icon: showDialogAction.icon,
    checkable: showDialogAction.checkable,
    action: showDialogAction.id
  });
  ScriptManager.addToolbar(toolbar);
}

function configure(packageFolder, packageName) {
  MessageLog.trace("Stylesheets - Applying styles from config.json");
  var config = readConfig();
  const stylesheetNames = config.apply;
  stylesheetContents = stylesheetNames.map(function (name) {
    return readStylesheet(stylesheetsDirectory + "/" + name);
  });
  finalStylesheet = stylesheetContents.join(" ");
  applyStylesheet(finalStylesheet);
  MessageLog.trace("Stylesheets - Creating toolbar");
  createToolbar();
}

exports.configure = configure;
