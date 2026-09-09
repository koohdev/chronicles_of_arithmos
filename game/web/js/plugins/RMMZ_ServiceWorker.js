/*:
 * @target MZ
 * @plugindesc Automatically registers an offline service worker for web and Vercel deployments.
 * @author 
 * 
 * @help RMMZ_ServiceWorker.js
 * 
 * Place your 'sw.js' file in the root folder of your project 
 * (the same folder as index.html). This plugin will register it 
 * instantly at page load.
 */

(() => {
    'use strict';

    // Register immediately on window load, bypassing the RPG Maker boot sequence
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('Offline Service Worker registered successfully:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    } else {
        console.warn('Service Worker is not supported by this browser.');
    }
})();