// ==UserScript==
// @name         ChatGPT Content Width
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调整特定元素的样式
// @author       liyunpeng@live.com
// @match        https://*.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.xl\\:px-5 { max-width: 85% !important; }';
    document.head.appendChild(style);
})();
