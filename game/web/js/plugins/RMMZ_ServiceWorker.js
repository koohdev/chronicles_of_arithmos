/*:
 * @target MZ
 * @plugindesc Automatically registers an offline service worker for web and Vercel deployments.
 * 
 * 
 * @help RMMZ_ServiceWorker.js
 * 
 * Place your 'sw.js' file in the root folder of your project 
 * (the same folder as index.html). This plugin will register it 
 * automatically at game launch so you don't have to edit index.html 
 * after every deployment export.
 */

(() => {
    'use strict';

    // Hook into the game boot phase to trigger registration
    const _Scene_Boot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.call(this);
        this.registerServiceWorker();
    };

    Scene_Boot.prototype.registerServiceWorker = function() {
        if ('serviceWorker' in navigator) {
            // Register sw.js sitting in the root folder
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('Offline Service Worker registered successfully:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        } else {
            console.warn('Service Worker is not supported by this browser.');
        }
    };
})();
