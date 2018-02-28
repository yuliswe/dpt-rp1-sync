var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var ENDPORTNUMBER = 65535;
                var DRAGANDDROPPATH = '/draganddrop/';
                var PORTCONFLICT = 'EADDRINUSE';
                var HOST = 'http://localhost:';
                var DragExternalServer = (function (_super) {
                    __extends(DragExternalServer, _super);
                    function DragExternalServer() {
                        _super.apply(this, arguments);
                        this.transferTasks_ = null;
                        this.currentPortNumber = 8080;
                        this.urlInfos = {};
                        this.downloadURLGeneratedCount = 0;
                    }
                    DragExternalServer.prototype.start = function (options) {
                        this.transferTasks_ = {};
                        var http = require('http');
                        this.server = http.createServer(this.handleRequest.bind(this));
                        this.listen(this.server, this.currentPortNumber, options);
                        this.server.on('error', this.serverErrorHandler.bind(this, options));
                        this.downloadListener();
                    };
                    DragExternalServer.prototype.issueDownloadUrl = function (entryId) {
                        if (typeof entryId !== 'string' || entryId === '') {
                            throw new Error('entryId must be non-empty string');
                        }
                        ++this.downloadURLGeneratedCount;
                        var downloadUrl = HOST + this.currentPortNumber + DRAGANDDROPPATH + this.downloadURLGeneratedCount;
                        this.urlInfos[downloadUrl] = entryId;
                        return downloadUrl;
                    };
                    DragExternalServer.prototype.cancelDownloadUrl = function (downloadUrl) {
                        if (typeof downloadUrl !== 'string' || downloadUrl === '') {
                            throw new Error('downloadUrl must be non-empty string');
                        }
                        if (downloadUrl in this.urlInfos) {
                            delete this.urlInfos[downloadUrl];
                        }
                    };
                    DragExternalServer.prototype.getStatuses = function () {
                        var transferProgress = [];
                        for (var downloadUrl in this.transferTasks_) {
                            var downloader = this.transferTasks_[downloadUrl][0];
                            transferProgress.push({
                                transfered: downloader.getCurrentBytesTransferred(),
                                total: downloader.getCurrentBytesTotal(),
                                entryId: this.transferTasks_[downloadUrl][1],
                                downloadUrl: downloadUrl,
                            });
                        }
                        return transferProgress;
                    };
                    DragExternalServer.prototype.end = function () {
                        this.server.close(this.serverCloseHandler.bind(this));
                    };
                    DragExternalServer.prototype.cancelAllDownloadTasks = function (options) {
                        var promiseArray = [];
                        for (var downloadUrl in this.transferTasks_) {
                            var downloader = this.transferTasks_[downloadUrl][0];
                            promiseArray.push(this.cancelTask(downloader));
                        }
                        Promise.all(promiseArray).then(function (values) {
                            if (typeof values === 'undefined') {
                                throw new Error('resolve values does not passed');
                            }
                            for (var i = 0; i < values.length; i++) {
                                if (values[i] !== true) {
                                    if (options && options.error) {
                                        options.error(values[i]);
                                    }
                                    return;
                                }
                            }
                            if (options && options.success) {
                                options.success();
                            }
                        });
                    };
                    DragExternalServer.prototype.downloadListener = function () {
                        var _this = this;
                        var currentWindow = require('electron').remote.getCurrentWindow();
                        currentWindow.webContents.session.on('will-download', function (event, item, webContents) {
                            try {
                                var downloadUrl = item.getURL();
                                if (!_this.transferTasks_.hasOwnProperty(downloadUrl)) {
                                    return;
                                }
                                item.on('updated', function (event, state) {
                                    if (state === 'interrupted') {
                                        _this.downloadItemErrorHandler(downloadUrl);
                                    }
                                });
                                item.once('done', function (event, state) {
                                    if (state === 'completed') {
                                        if (_this.transferTasks_.hasOwnProperty(downloadUrl)) {
                                            var eventParam = {
                                                entryId: _this.transferTasks_[downloadUrl][1],
                                                downloadUrl: downloadUrl };
                                            delete _this.transferTasks_[downloadUrl];
                                            _this.trigger('downloadSuccess', eventParam);
                                        }
                                    }
                                    else {
                                        _this.downloadItemErrorHandler(downloadUrl);
                                    }
                                });
                            }
                            catch (error) {
                                console.error(error);
                            }
                        });
                    };
                    DragExternalServer.prototype.downloadItemErrorHandler = function (downloadUrl) {
                        if (typeof downloadUrl !== 'string' || downloadUrl === '') {
                            throw new Error('downloadUrl must be non-empty string');
                        }
                        if (this.transferTasks_.hasOwnProperty(downloadUrl)) {
                            var eventParam = {
                                entryId: this.transferTasks_[downloadUrl][1],
                                downloadUrl: downloadUrl };
                            var downloader = this.transferTasks_[downloadUrl][0];
                            delete this.transferTasks_[downloadUrl];
                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_EXTERNAL_DOWNLOAD_INTERRUPTED, 'Explorer or Finder failed to download the file');
                            this.trigger('downloadError', err, eventParam);
                            downloader.cancelAllTasks(function () {
                            });
                        }
                    };
                    DragExternalServer.prototype.cancelTask = function (downloader) {
                        return new Promise(function (resolve, reject) {
                            downloader.cancelAllTasks(function (error) {
                                if (error) {
                                    console.error('cancelAllTasks failed', error);
                                    resolve(error);
                                    return;
                                }
                                resolve(true);
                            });
                        });
                    };
                    DragExternalServer.prototype.serverCloseHandler = function (err) {
                        if (typeof err !== 'undefined') {
                            console.log('server is already closed', err);
                        }
                        else {
                            console.log('server is closed successfully');
                        }
                        this.currentPortNumber = 8080;
                        this.urlInfos = {};
                        this.downloadURLGeneratedCount = 0;
                        this.transferTasks_ = null;
                    };
                    DragExternalServer.prototype.serverErrorHandler = function (options, e) {
                        if (typeof e === 'undefined') {
                            throw new Error('Server error object does not passed');
                        }
                        if (e.code !== PORTCONFLICT) {
                            console.log('http server error:' + e);
                            return;
                        }
                        if (this.currentPortNumber > ENDPORTNUMBER - 1) {
                            var error = DPMW.mwe.genError(DPMW.mwe.E_MW_PORTFWDR_PORT_UNAVAILABLE, 'All ports are used!');
                            if (options && options.error) {
                                options.error(error);
                            }
                            return;
                        }
                        this.listen(this.server, ++this.currentPortNumber, options);
                    };
                    DragExternalServer.prototype.listen = function (server, port, options) {
                        if (typeof server === 'undefined') {
                            throw new Error('Serverobject does not passed');
                        }
                        if (typeof port !== 'number' || port < 0 || port > ENDPORTNUMBER - 1) {
                            throw new Error('port is wrong');
                        }
                        server.listen(port, function () {
                            console.log('http server listens on port: ' + port);
                            if (options && options.success) {
                                options.success();
                            }
                        });
                    };
                    DragExternalServer.prototype.handleRequest = function (request, response) {
                        var entryId = this.filterRequest(request);
                        if (typeof entryId === 'string' && entryId !== '') {
                            var url = request.url;
                            var downloadUrl = HOST + this.currentPortNumber + url;
                            response.writeHead(200, { 'Content-Type': 'application/pdf' });
                            var eventParam = {
                                entryId: entryId,
                                downloadUrl: downloadUrl };
                            this.trigger('downloadStart', eventParam);
                            var downloader = DPMW.appCtrl.currentDevice.downloadDocumentAsBinary(entryId, {
                                progress: this.progressHandler.bind(this, response, downloadUrl),
                                error: this.downloadErrorHandler.bind(this, response, downloadUrl)
                            });
                            this.transferTasks_[downloadUrl] = [downloader, entryId];
                        }
                        else {
                            request.connection.destroy();
                        }
                    };
                    DragExternalServer.prototype.progressHandler = function (response, downloadUrl, buffer, last) {
                        if (typeof response === 'undefined') {
                            throw new Error('a response should not be undefined.');
                        }
                        if (typeof downloadUrl !== 'string' || downloadUrl === '') {
                            throw new Error('downloadUrl must be non-empty string');
                        }
                        if (typeof buffer !== 'object') {
                            throw new Error('buffer should be Unit8Array');
                        }
                        if (typeof last !== 'boolean') {
                            throw new Error('last should be boolean');
                        }
                        if (last) {
                            response.end(buffer);
                            if (this.transferTasks_.hasOwnProperty(downloadUrl)) {
                                var eventParam = {
                                    entryId: this.transferTasks_[downloadUrl][1],
                                    downloadUrl: downloadUrl };
                                delete this.transferTasks_[downloadUrl];
                            }
                            this.trigger('downloadSuccess', eventParam);
                        }
                        else {
                            response.write(buffer);
                        }
                    };
                    DragExternalServer.prototype.downloadErrorHandler = function (response, downloadUrl, err) {
                        if (typeof response === 'undefined') {
                            throw new Error('a response should not be undefined.');
                        }
                        if (typeof downloadUrl !== 'string' || downloadUrl === '') {
                            throw new Error('downloadUrl must be non-empty string');
                        }
                        if (typeof err === 'undefined') {
                            throw new Error('error object does not passed');
                        }
                        if (this.transferTasks_.hasOwnProperty(downloadUrl)) {
                            var eventParam = {
                                entryId: this.transferTasks_[downloadUrl][1],
                                downloadUrl: downloadUrl };
                            delete this.transferTasks_[downloadUrl];
                            this.trigger('downloadError', err, eventParam);
                        }
                        var errCode = err.mwCode;
                        if (errCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                            response.writeHead(504, { 'Content-Type': 'application/pdf' });
                        }
                        else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR
                            || errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS || errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                            response.writeHead(502, { 'Content-Type': 'application/pdf' });
                        }
                        else if (errCode === DPMW.mwe.E_MW_CANCELLED || errCode === DPMW.mwe.E_MW_FILE_REMOTE_MODIFIED) {
                            response.writeHead(503, { 'Content-Type': 'application/pdf' });
                        }
                        else {
                            response.writeHead(500, { 'Content-Type': 'application/pdf' });
                        }
                        response.end();
                    };
                    DragExternalServer.prototype.filterRequest = function (request) {
                        if (typeof request === 'undefined') {
                            throw new Error('a request should not be undefined in filterRequest function.');
                        }
                        var remoteAddress = request.connection.remoteAddress;
                        if (remoteAddress === '::1' || remoteAddress === '::ffff:127.0.0.1' || remoteAddress === '127.0.0.1') {
                            if (!request.url.match('^' + DRAGANDDROPPATH)) {
                                return null;
                            }
                            var url = request.url;
                            var downloadUrl = HOST + this.currentPortNumber + url;
                            var entryId = this.urlInfos[downloadUrl];
                            if (!entryId) {
                                return null;
                            }
                            else {
                                this.cancelDownloadUrl(downloadUrl);
                                return entryId;
                            }
                        }
                        return null;
                    };
                    return DragExternalServer;
                }(Backbone.EventsAdopter));
                Handler.DragExternalServer = DragExternalServer;
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DragExternalServer.js.map