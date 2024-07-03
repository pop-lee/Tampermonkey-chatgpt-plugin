// ==UserScript==
// @name         ChatGPT Send with Command+Enter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send messages in ChatGPT using Command+Enter instead of Enter alone, and insert newline at current cursor position with Enter.
// @author       liyunpeng@live.com
// @match        https://*.chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const chatInputSelector = 'textarea[id="prompt-textarea"]'; // CSS selector for the ChatGPT input boxes
    let isIMEActive = false;

    function handleKeydown(e) {
        if (e.key === 'Enter') {
            if (isIMEActive) {
                console.log("Enter pressed while IME is active");
            } else {
                if (!e.metaKey && !e.ctrlKey) {
                    console.log("Enter at current position");
                    e.preventDefault(); // Prevent default behavior
                    e.stopPropagation(); // Stop event propagation

                    // Get the cursor position
                    const cursorPosition = e.target.selectionStart;
                    const textBeforeCursor = e.target.value.substring(0, cursorPosition);
                    const textAfterCursor = e.target.value.substring(cursorPosition);

                    // Insert newline at cursor position
                    e.target.value = textBeforeCursor + '\n' + textAfterCursor;

                    // Move cursor to the position after the newline
                    e.target.selectionStart = cursorPosition + 1;
                    e.target.selectionEnd = cursorPosition + 1;
                } else {
                    copyInputContentToClipboard(e);
                }
            }
        }
    }

    function handleCompositionStart(e) {
        isIMEActive = true;
    }

    function handleCompositionEnd(e) {
        isIMEActive = false;
    }

    function copyInputContentToClipboard(e) {
        // Use e.target to get the current element that triggered the event
        const chatInput = e.target;

        // Copy text to clipboard
        navigator.clipboard.writeText(chatInput.value)
            .then(function() {
                console.log('Text copied to clipboard');
            })
            .catch(function(err) {
                console.error('Could not copy text: ', err);
            });
    }

    // Set up MutationObserver to monitor DOM changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            document.querySelectorAll(chatInputSelector).forEach(chatInput => {
                chatInput.removeEventListener('keydown', handleKeydown);
                chatInput.removeEventListener('compositionstart', handleCompositionStart);
                chatInput.removeEventListener('compositionend', handleCompositionEnd);

                chatInput.addEventListener('keydown', handleKeydown);
                chatInput.addEventListener('compositionstart', handleCompositionStart);
                chatInput.addEventListener('compositionend', handleCompositionEnd);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial binding
    document.querySelectorAll(chatInputSelector).forEach(chatInput => {
        chatInput.addEventListener('keydown', handleKeydown);
        chatInput.addEventListener('compositionstart', handleCompositionStart);
        chatInput.addEventListener('compositionend', handleCompositionEnd);
    });
})();
