"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var premid_1 = require("premid");
var presence = new Presence({ clientId: '1505219461152636949' });
var browsingTimestamp = Math.floor(Date.now() / 1000);
presence.on('UpdateData', function () { return __awaiter(void 0, void 0, void 0, function () {
    var pathname, releaseTitle, presenceData, termsModal, contactModal, isLive, videoPlayer, videoTitle, paused, video, timestamps, container, viewMode, musicContainer, trackTitle, artist, coverUrl, spotifyLink, paused;
    var _a;
    return __generator(this, function (_b) {
        pathname = document.location.pathname;
        releaseTitle = (_a = document.querySelector('[data-premid-release-title]')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-premid-release-title');
        presenceData = {
            type: 3, // ActivityType.Watching
            largeImageKey: 'https://i.imgur.com/0Qraju1.png',
            largeImageText: 'okiso.net',
            startTimestamp: browsingTimestamp,
            buttons: [
                { label: 'Visit okiso.net', url: "https://okiso.net".concat(pathname === '/' ? '' : pathname) },
                { label: 'Join Discord', url: 'https://discord.gg/okiso' },
            ],
        };
        // ─── Global Overrides ───
        if (releaseTitle) {
            presenceData.details = 'Viewing Release';
            presenceData.state = "\uD83C\uDFB5 ".concat(releaseTitle);
        }
        // ─── Home Page ───
        else if (pathname === '/') {
            termsModal = document.querySelector('[data-premid-modal="terms"]');
            contactModal = document.querySelector('[data-premid-modal="contact"]');
            if (termsModal) {
                presenceData.details = 'Reading Content Terms';
                presenceData.state = 'Legal & Guidelines';
            }
            else if (contactModal) {
                presenceData.details = 'Viewing Contact Info';
                presenceData.state = 'Business & Collaborations';
            }
            else {
                isLive = document.querySelector('[data-premid-live="true"]');
                if (isLive) {
                    presenceData.details = 'Watching Live Broadcast';
                    presenceData.state = '🔴 LIVE on Twitch';
                    presenceData.smallImageKey = premid_1.Assets.Live;
                    presenceData.smallImageText = 'Live';
                    delete presenceData.startTimestamp;
                }
                else {
                    videoPlayer = document.querySelector('[data-premid-title]');
                    if (videoPlayer) {
                        videoTitle = videoPlayer.getAttribute('data-premid-title');
                        paused = videoPlayer.getAttribute('data-premid-paused') === 'true';
                        presenceData.details = videoTitle || 'Watching a Video';
                        presenceData.smallImageKey = paused ? premid_1.Assets.Pause : premid_1.Assets.Play;
                        presenceData.smallImageText = paused ? 'Paused' : 'Playing';
                        if (!paused) {
                            video = document.querySelector('[data-premid-title] video');
                            if (video) {
                                timestamps = (0, premid_1.getTimestampsFromMedia)(video);
                                presenceData.startTimestamp = timestamps[0];
                                presenceData.endTimestamp = timestamps[1];
                            }
                        }
                        presenceData.state = paused ? '⏸ Paused' : '▶ Playing';
                    }
                    else {
                        presenceData.details = 'Browsing';
                        presenceData.state = 'Home Page';
                    }
                }
            }
        }
        // ─── Discography ───
        else if (pathname === '/releases') {
            container = document.querySelector('[data-premid-page="releases"]');
            viewMode = container === null || container === void 0 ? void 0 : container.getAttribute('data-premid-view');
            presenceData.details = viewMode === 'orbit' ? 'Exploring 3D Audio Archive' : 'Browsing Discography';
            presenceData.state = viewMode === 'orbit' ? 'Interactive 3D Mode' : 'List View';
        }
        // ─── Upcoming Page ───
        else if (pathname === '/upcoming') {
            presenceData.details = 'Browsing';
            presenceData.state = 'Upcoming Releases';
        }
        // ─── Fallback ───
        else {
            presenceData.details = document.title || 'Browsing';
            presenceData.state = 'okiso.net';
        }
        musicContainer = document.getElementById('spotify-embed-container-data');
        trackTitle = musicContainer === null || musicContainer === void 0 ? void 0 : musicContainer.getAttribute('data-premid-track-title');
        if (trackTitle) {
            artist = musicContainer === null || musicContainer === void 0 ? void 0 : musicContainer.getAttribute('data-premid-track-artist');
            coverUrl = musicContainer === null || musicContainer === void 0 ? void 0 : musicContainer.getAttribute('data-premid-cover-url');
            spotifyLink = musicContainer === null || musicContainer === void 0 ? void 0 : musicContainer.getAttribute('data-premid-link');
            paused = (musicContainer === null || musicContainer === void 0 ? void 0 : musicContainer.getAttribute('data-premid-paused')) === 'true';
            // Override the main details if they are listening to music
            presenceData.type = 2; // ActivityType.Listening
            presenceData.details = paused ? "Paused: ".concat(trackTitle) : "Listening to ".concat(trackTitle);
            presenceData.state = "by ".concat(artist || 'OKISO');
            presenceData.smallImageKey = paused ? premid_1.Assets.Pause : 'logo';
            presenceData.smallImageText = paused ? 'Paused' : 'okiso.net';
            if (coverUrl) {
                presenceData.largeImageKey = coverUrl;
                presenceData.largeImageText = trackTitle;
            }
            if (spotifyLink) {
                presenceData.buttons = [
                    { label: 'Listen on Spotify', url: spotifyLink },
                    { label: 'Join Discord', url: 'https://discord.gg/okiso' },
                ];
            }
            delete presenceData.startTimestamp; // Remove browsing timestamp so it doesn't look like a long song
        }
        if (presenceData.details) {
            presence.setActivity(presenceData);
        }
        else {
            presence.setActivity();
        }
        return [2 /*return*/];
    });
}); });
