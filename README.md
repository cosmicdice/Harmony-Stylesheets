# Harmony Stylesheets

This project aims to provide the missing theme manager from Toon Boom Harmony.

## Description

It currently works by using the setStyleSheet method on Qt windows to apply a group of [QSS](https://doc.qt.io/qt-6/stylesheet-reference.html) files (Qt's flavour of CSS).

This applies the QSS on top of Harmony's original stylesheets. Not every styling properties (eg: shadows) are accessible with this method, but this is non destructive and requires no program reload.

Ironically, custom windows/dialogs created by scripts at runtime (this one included) are not themable as of this version.

## Getting Started

### Installing
First, you need to locate your Harmony user scripts folder.

The content of this repository should be added in a separate 'Stylesheets' folder in the ```[version]-scripts/packages``` folder corresponding to your Harmony version.

* Windows: ``` C:\Users\[username]\AppData\Roaming\Toon Boom Animation\Toon Boom Harmony [Edition]\[version]-scripts\package\Stylesheets ```
* macOS: ```/Users/[username]/Library/Preferences/Toon Boom Animation/Toon Boom Harmony [Edition]/[version]-scripts/packages/Stylesheets```

* Linux: ```/home/[username]/Toon Boom Animation/Toon Boom Harmony [Edition]/[version]-scripts/packages/Stylesheets```

For example, for me (on macOS and Harmony Premium 25), it looks like this:
``` /Users/antoni/Library/Preferences/Toon Boom Animation/Toon Boom Harmony Premium/2500-scripts/packages/Stylesheets ```

### The Stylesheets dialog

In Harmony, open the 'Windows' Menu, then add the 'Stylesheets' Toolbar to your workspace. You should be able to open the Stylesheets manager dialog from the toolbar.

<img height="250" alt="Screenshot 2025-10-17 at 15 50 58" src="https://github.com/user-attachments/assets/0c063ae7-96dc-442a-95a4-cbdba8c4ca75" />
<img height="250" alt="Screenshot 2025-10-17 at 13 43 23" src="https://github.com/user-attachments/assets/95d5615a-98ae-4ab0-bd24-bc53a3aab13e" />

From there you can manage the qss files applied to your workspaces by drag and dropping or double clicking on an item. Click on the Apply button to see the changes and save them in the configuration file.

The order matters as the QSS files are concatenated from top to bottom before being applied. Last file's stylings take precedence.

Keep in mind that the original styling applied by Harmony is different based on wether you're running the dark or light theme. All files can be applied regardless but may not look as intended if you're running the "wrong" base theme.

Feel free to experiment and create happy accidents.

To go back to the original look, remove everything from the 'Applied' column and click on Apply.

## Help

### Adding a stylesheet

Installed QSS files are found inside the installed package under ```[version]-scripts/packages/Stylesheets/stylesheets/```

You can access this folder with your prefered file explorer or using the "Open stylesheets folder..." button from the Harmony Stylesheets dialog.

### Creating stylesheets

The files I include here were built based on my own limited knowledge of CSS, [QSS documentation](https://doc.qt.io/qt-6/stylesheet-reference.html) and inspired by existing Harmony and Qt stylesheets.

You can test and change your QSS files without reloading Harmony or the manager dialog as long as they existed in the ```stylesheets``` folder before you opened the dialog. Just click on apply again after saving your files.

There is currently no validation before applying the files, if you don't see your changes, this may mean there is an issue with one of the applied files.

You don't have to make one big QSS file with everything as you can apply several. You can use this to make debugging easier or make smaller changes/fixes.

You can use CSS file validation as QSS is based on CSS2, but keep in mind that some things may not work as intended as they are a bit different.

I may create a tutorial once I have more experience with theming Harmony.

### Original Harmony stylesheets

The original Harmony stylesheets are located in the main installation folder under ```xxx/resources/stylesheets``` and are loaded according to your dark/light setting and OS on Harmony startup. It is useful to access them to see how and what styles are applied, but please think twice before changing them directly.

If you want to play with them (or older versions of them), it is recommended to copy them to this packages's ```stylesheets``` folder.

They cannnot be included in this project for licensing reasons.

### Manual/scripting configuration

The current configuration to apply on Harmony reload is stored inside the ```config.json``` file in the package's root.
You may change it manually, but make sure the files you're refering to exist in the stylesheets folder.

If you want to remove themes manually, the config file should at least look like this to be loaded properly:

``` {"apply":[]} ```

### You broke my professional program!

Sorry! The goal of this project is to be painless and non-destructive but it is still possible, especially on older versions. You can remove this package by simply deleting the ```packages/Stylesheets``` folder you installed this in and restarting Harmony.

If you are not sure what happened or what to do, ask your local TD or Harmony expert. If they are busy, look grumpy when you ask them or if you are the Harmony expert, send me an email.

Please keep in mind this is provided AS IS and is not an official or commercially supported product.

### Storyboard Pro

This package is currently untested with Storyboard Pro. Some of this may work with it as they are similar programs, but I don't currently have a license to test it.

## Included Stylesheets

### Mu.dark (and its colorful siblings)
A flat dark theme replacement with Harmony's greyish look.

Also, a handful of color variations provided by [@rickrigs](https://github.com/rickrigs).

<img height="500" alt="Screenshot 2025-10-17 at 17 53 39" src="https://github.com/user-attachments/assets/20b53f55-798a-4682-bf1c-a57abe1f3955" />

<img height="500" alt="colors" src="https://github.com/user-attachments/assets/a7b0f790-7c03-4d79-83f3-0a6ea0262c3e" />



## Contributing

Feel free to make a PR to this project to add a feature, fix an issue or contribute a new stylesheet.

You can also file an issue on the github repo if you are not comfortable making a PR or to report a bug.

If I don't credit you properly following a change you made, please let me know.

Also, please make sure to properly credit yourself and license your QSS files if you want them packaged with this project.

## Authors

* Antoni Galmiche - [@cosmicdice](https://github.com/cosmicdice) - [email](mailto:antoni.galmiche@gmail.com)

## Contributors

* Henrique Viudes Liria - [@rickrigs](https://github.com/rickrigs) - [rickrigs.com](https://www.rickrigs.com/)

## Version History

* 0.1 - Initial Release
* 0.2 - Mu-xxx with full color replacement

## License

This project is licensed under the Mozilla Public License Version 2.0 License - see the LICENSE file for details.

## Acknowledgments

Thank you to the good people of the [official Toon Boom Discord](https://discord.gg/toonboom) and [OpenHarmony Discord](https://discord.gg/qdHu3FqK) for code inspiration, testing and their interest in this project.

Thank you to the [Toon Boom](https://www.toonboom.com/) team for leaving gaps in the market for us.

Inspiration, code snippets, etc.
* [OpenHarmony](https://github.com/cfourney/OpenHarmony)
* [Kitsu publisher plugin](https://github.com/cgwire/kitsu-publisher-next/tree/main/connectors/harmony)
* [GTRONICK's QSS repository](https://github.com/GTRONICK/QSS)
