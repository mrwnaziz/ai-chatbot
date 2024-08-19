(function() {
    console.log("Chat widget script started");

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Check if we should show the widget
    var showWidget = getUrlParameter('showChatWidget') === 'true' || window.SHOW_CHAT_WIDGET === true;
    console.log("Show widget parameter:", getUrlParameter('showChatWidget'));
    console.log("Show widget:", showWidget);

    if (!showWidget) {
        console.log("Widget not shown due to missing or false showChatWidget parameter");
        return; // Don't show the widget if the parameter is not set
    }

    // Function to get the base URL of the script
    function getScriptBaseUrl() {
        try {
            const scripts = document.getElementsByTagName('script');
            const currentScript = scripts[scripts.length - 1];
            const scriptUrl = new URL(currentScript.src, window.location.origin);
            console.log("Script URL:", scriptUrl.href);
            return scriptUrl.origin;
        } catch (error) {
            console.warn('Failed to determine script base URL:', error);
            return window.location.origin;
        }
    }

    // Get the base URL
    const baseUrl = getScriptBaseUrl();
    console.log("Base URL:", baseUrl);

    
    // Function to check if the device is mobile
     function isMobile() {
            return window.innerWidth <= 768;
        }
    
    // Styles for the widget
    const styles = `
        #chat-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999999;
            font-family: 'Geist', sans-serif;
        }
        #chat-widget-iframe-container {
            display: none;
            width: 400px;
            height: 600px;
            box-shadow: 0 5px 40px rgba(0,0,0,0.16);
            border-radius: 8px;
            overflow: hidden;
        }
        #chat-widget-iframe {
            border: none;
            width: 100%;
            height: 100%;
        }
        #chat-widget-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #00372a;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        #chat-widget-button svg {
            width: 30px;
            height: 30px;
        }
        @media (max-width: 768px) {
            #chat-widget-iframe-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                border-radius: 0;
            }
        }
    `;

    // Create style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    console.log("Styles appended to head");

    // Create widget container
    const container = document.createElement('div');
    container.id = 'chat-widget-container';

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'chat-widget-iframe-container';

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'chat-widget-iframe';
    iframe.src = `${baseUrl}/new`;
    console.log("Iframe src:", iframe.src);

    // Append iframe to iframe container
    iframeContainer.appendChild(iframe);

    // Create toggle button with new chat icon
    const button = document.createElement('button');
    button.id = 'chat-widget-button';
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256"><path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z"></path></svg>
    `;

    // Append elements to container
    container.appendChild(iframeContainer);
    container.appendChild(button);

    // Append container to body
    document.body.appendChild(container);
    console.log("Widget container appended to body");

    // Toggle iframe visibility
    function toggleChat() {
        if (iframeContainer.style.display === 'none') {
            iframeContainer.style.display = 'block';
            button.style.display = 'none';
            if (window.innerWidth <= 768) {
                iframeContainer.style.width = '100vw';
                iframeContainer.style.height = '100vh';
                container.style.bottom = '0';
                container.style.right = '0';
            }
        } else {
            iframeContainer.style.display = 'none';
            button.style.display = 'flex';
        }
        console.log("Chat toggled");
    }

    button.addEventListener('click', toggleChat);

    // Listen for messages from the iframe
    window.addEventListener('message', function(event) {
        if (event.origin !== baseUrl) return; // Ensure the message is from your app
        
        if (event.data === 'closeChatWidget') {
            toggleChat(); // Close the widget
        }
    });

    console.log("Chat widget script completed");
})();