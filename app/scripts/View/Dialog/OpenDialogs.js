var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Dialog;
        (function (Dialog) {
            var ENABLE_MODAL = (process.platform !== 'darwin');
            var ENABLE_PSEUDO_MODAL = (process.platform === 'darwin');
            function openInitSetup(initData, handler) {
                Dialog.startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_init_setup.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.WINDOW_INIT_SETUP;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController = new Dialog.DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(detail);
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_SHOWED) {
                        if (typeof handler.dialogShowed === 'function') {
                            handler.dialogShowed(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.SUBMIT) {
                        if (typeof handler.submit === 'function') {
                            handler.submit(detail, dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        Dialog.endPseudoModal();
                    }
                });
                var options = {
                    width: 1024,
                    height: 670,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: $.i18n.t('wizard.connect.header'),
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openInitSetup = openInitSetup;
            function openDeviceSearch(initData, handler) {
                Dialog.startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_device_search.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.WINDOW_DEVICE_SEARCH;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController = new Dialog.DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(detail);
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_SHOWED) {
                        if (typeof handler.dialogShowed === 'function') {
                            handler.dialogShowed(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_RELAY) {
                        if (typeof handler.dialogRelay === 'function') {
                            handler.dialogRelay(detail);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        Dialog.endPseudoModal();
                    }
                });
                var winWidth = 865;
                if (process.platform === 'win32') {
                    winWidth += 15;
                }
                var options = {
                    width: winWidth,
                    height: 620,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    title: $.i18n.t('searchDp.title'),
                    resizable: false,
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openDeviceSearch = openDeviceSearch;
            function openSetting(initData, handler) {
                Dialog.startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_setting.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.WINDOW_SETTING;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController = new Dialog.DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(JSON.stringify(detail));
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_SHOWED) {
                        if (typeof handler.dialogShowed === 'function') {
                            handler.dialogShowed(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.SUBMIT) {
                        if (typeof handler.submit === 'function') {
                            handler.submit(detail, dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_RELAY) {
                        if (typeof handler.dialogRelay === 'function') {
                            handler.dialogRelay(detail);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        Dialog.endPseudoModal();
                    }
                });
                var options = {
                    width: 583,
                    height: 670,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: $.i18n.t('config.title'),
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openSetting = openSetting;
            function openSoftwareUpdateFound(initData, handler) {
                var dialogURL = CDP.Framework.toUrl("/index_software_update.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.WINDOW_SOFTWARE_UPDATE_FOUND;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController = new Dialog.DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    switch (message) {
                        case Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT:
                            ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                            break;
                        case Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_SHOWED:
                            if (typeof handler.dialogShowed === 'function') {
                                handler.dialogShowed(dialogController);
                            }
                            break;
                        case Dialog.IpcMessage.MAIN_TO_PARENT.SUBMIT:
                            if (typeof handler.submit === 'function') {
                                handler.submit(detail, dialogController);
                            }
                            break;
                        case Dialog.IpcMessage.MAIN_TO_PARENT.CANCEL:
                            if (typeof handler.canceled === 'function') {
                                handler.canceled(dialogController);
                            }
                            break;
                        case Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED:
                            if (typeof handler.closed === 'function') {
                                handler.closed();
                            }
                            ipc.removeAllListeners(channel);
                            break;
                        default:
                            console.error('Unsupported Message: ' + message + '\n' + detail);
                    }
                });
                var height = 600;
                if (process.platform === 'darwin') {
                    height = 584;
                }
                var options = {
                    width: 800,
                    height: height,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: $.i18n.t('update.title'),
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openSoftwareUpdateFound = openSoftwareUpdateFound;
            function openSoftwareUpdateProgress(initData, handler) {
                var dialogURL = CDP.Framework.toUrl("/index_software_update_progress.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.WINDOW_SOFTWARE_UPDATE_PROGRESS;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController = new Dialog.DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    switch (message) {
                        case Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT:
                            ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                            break;
                        case Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_SHOWED:
                            if (typeof handler.dialogShowed === 'function') {
                                handler.dialogShowed(dialogController);
                            }
                            break;
                        case Dialog.IpcMessage.MAIN_TO_PARENT.CANCEL:
                            if (typeof handler.canceled === 'function') {
                                handler.canceled(dialogController);
                            }
                            break;
                        case Dialog.IpcMessage.MAIN_TO_PARENT.GET_PROGRESS:
                            if (typeof handler.getProgress === 'function') {
                                handler.getProgress(dialogController);
                            }
                            break;
                        case Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED:
                            if (typeof handler.closed === 'function') {
                                handler.closed();
                            }
                            ipc.removeAllListeners(channel);
                            break;
                        default:
                            console.error('Unsupported Message: ' + message + '\n' + detail);
                    }
                });
                var height = 225;
                if (process.platform === 'darwin') {
                    height = 209;
                }
                var options = {
                    width: 500,
                    height: height,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: $.i18n.t('update.progress.title'),
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openSoftwareUpdateProgress = openSoftwareUpdateProgress;
            function openAbout(initData, handler) {
                Dialog.startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_about.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.WINDOW_ABOUT;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController = new Dialog.DialogController(dialogName, channel);
                console.log(JSON.stringify(initData));
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(JSON.stringify(detail));
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_SHOWED) {
                        if (typeof handler.dialogShowed === 'function') {
                            handler.dialogShowed(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        Dialog.endPseudoModal();
                    }
                });
                var options = {
                    width: 660,
                    height: 500,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: $.i18n.t('appInfo.title'),
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openAbout = openAbout;
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=OpenDialogs.js.map