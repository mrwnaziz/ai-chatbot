(function () {
    // const allowedDomains = [
    //     'hub.misk.org.sa',
    //     'miskhubuat.misk.org.sa',
    //     'youthdev.misk.org.sa',
    //     '*.misk.org.sa',
    //     '*.vercel.app',
    //     '*.pages.dev',
    // ];

    // function isAllowedDomain(domain) {
    //     return allowedDomains.some(pattern => {
    //         if (pattern.startsWith('*.')) {
                
    //             const baseDomain = pattern.slice(2);
    //             return domain === baseDomain || domain.endsWith('.' + baseDomain);
    //         } else {
                
    //             return domain === pattern;
    //         }
    //     });
    // }


    
    function getScriptBaseUrl() {
        try {
            const scripts = document.getElementsByTagName('script');
            const currentScript = scripts[scripts.length - 1];
            const scriptUrl = new URL(currentScript.src);
            return scriptUrl.origin;
        } catch (error) {
            return window.location.origin;
        }
    }

    
    const baseUrl = getScriptBaseUrl();
    
    // const currentDomain = window.location.hostname;
    // const isAllowed = isAllowedDomain(currentDomain);
    
    // if (!isAllowed) {
        
    //     return; 
    // }

    
    const isEmbedded = window.location.origin !== baseUrl;
    

    if (!isEmbedded) {
        return;
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    
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
        transition: all 0.3s ease-in-out;
        transform: scale(0.95);
        opacity: 0;
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
            transform: translateY(100%);
        }
        #chat-widget-container.open {
            bottom: 0;
            right: 0;
        }
    }
`;

    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    

    
    const container = document.createElement('div');
    container.id = 'chat-widget-container';

    
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'chat-widget-iframe-container';

    
    const iframe = document.createElement('iframe');
    iframe.id = 'chat-widget-iframe';
    iframe.src = `${baseUrl}/`;
    

    
    iframeContainer.appendChild(iframe);

    
    const button = document.createElement('button');
    button.id = 'chat-widget-button';
    button.innerHTML = `
        <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_13648_57885)">
<path d="M70.9167 34.5626C70.9167 52.4762 56.3751 67.0178 38.4615 67.0178C31.4015 67.0178 24.7629 64.6996 19.4942 60.9062L4.53107 68.177L11.8019 53.3192C8.11379 48.0505 5.90093 41.6227 5.90093 34.668C6.0063 16.649 20.5479 2.10742 38.4615 2.10742C56.3751 2.10742 70.9167 16.649 70.9167 34.5626Z" fill="#00372A" stroke="white" stroke-width="4" stroke-miterlimit="10"/>
<path d="M20.0211 22.8662H56.902" stroke="white" stroke-width="4" stroke-miterlimit="10"/>
<path d="M20.0211 34.3521H56.902" stroke="white" stroke-width="4" stroke-miterlimit="10"/>
<path d="M20.0211 45.7324H56.902" stroke="white" stroke-width="4" stroke-miterlimit="10"/>
<path d="M38.2508 55.743C38.2508 71.233 50.7903 83.7725 66.2803 83.7725C72.392 83.7725 78.0822 81.7704 82.6133 78.5038L95.4689 84.7209L89.1465 71.8652C92.3077 67.3341 94.2044 61.7493 94.2044 55.8484C94.2044 40.3584 81.6649 27.8188 66.1749 27.8188C50.6849 27.8188 38.2508 40.253 38.2508 55.743Z" fill="#C2D500"/>
<path d="M100 89.1465L82.824 80.822C77.8714 84.0886 72.1812 85.7746 66.2803 85.7746C49.7366 85.7746 36.1433 72.2867 36.1433 55.6376C36.1433 39.0938 49.6312 25.606 66.2803 25.606C82.9294 25.606 96.4173 39.0938 96.4173 55.6376C96.4173 61.4331 94.7313 67.018 91.6754 71.8652L100 89.1465ZM66.2803 29.9263C52.0548 29.9263 40.3583 41.5174 40.3583 55.7429C40.3583 69.9684 51.9494 81.665 66.2803 81.665C71.7597 81.665 77.0285 79.979 81.4542 76.8178L82.5079 76.0801L90.9378 80.1897L86.8282 71.7598L87.5659 70.7061C90.6217 66.3857 92.2023 61.2224 92.2023 55.8483C92.0969 41.5174 80.5058 29.9263 66.2803 29.9263Z" fill="white"/>
<path d="M79.6628 63.2244C76.1854 66.7018 71.4436 68.8093 66.0695 68.8093C60.6955 68.8093 55.8483 66.5964 52.3709 63.0137" stroke="white" stroke-width="4" stroke-miterlimit="10"/>
<path d="M58.0611 53.6355C60.389 53.6355 62.2761 51.7484 62.2761 49.4205C62.2761 47.0927 60.389 45.2056 58.0611 45.2056C55.7332 45.2056 53.8461 47.0927 53.8461 49.4205C53.8461 51.7484 55.7332 53.6355 58.0611 53.6355Z" fill="white"/>
<path d="M74.078 53.6355C76.4059 53.6355 78.293 51.7484 78.293 49.4205C78.293 47.0927 76.4059 45.2056 74.078 45.2056C71.7501 45.2056 69.863 47.0927 69.863 49.4205C69.863 51.7484 71.7501 53.6355 74.078 53.6355Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_13648_57885">
<rect width="100" height="89.1465" fill="white"/>
</clipPath>
</defs>
</svg>
    `;

    
    container.appendChild(iframeContainer);
    container.appendChild(button);

    
    document.body.appendChild(container);
    

    
    function adjustWidgetLayout() {
        const isMobileView = isMobile();
        if (iframeContainer.style.display !== 'none') {
            if (isMobileView) {
                iframeContainer.style.width = '100%';
                iframeContainer.style.height = '100%';
                container.style.bottom = '0';
                container.style.right = '0';
                iframeContainer.style.transform = 'translateY(0)';
                container.classList.add('open');
            } else {
                iframeContainer.style.width = '400px';
                iframeContainer.style.height = '600px';
                container.style.bottom = '20px';
                container.style.right = '20px';
                iframeContainer.style.transform = 'scale(1)';
                container.classList.remove('open');
            }
        } else {
            if (isMobileView) {
                iframeContainer.style.transform = 'translateY(100%)';
            } else {
                iframeContainer.style.transform = 'scale(0.95)';
            }
            container.classList.remove('open');
        }
    }
    
    
    function toggleChat() {
        const isMobileView = isMobile();
        if (iframeContainer.style.display === 'none') {
            iframeContainer.style.display = 'block';
            setTimeout(() => {
                adjustWidgetLayout();
                iframeContainer.style.opacity = '1';
            }, 10);
            button.style.display = 'none';
        } else {
            iframeContainer.style.transform = isMobileView ? 'translateY(100%)' : 'scale(0.95)';
            iframeContainer.style.opacity = '0';
            setTimeout(() => {
                iframeContainer.style.display = 'none';
                button.style.display = 'flex';
                container.style.bottom = '20px';
                container.style.right = '20px';
            }, 300);
        }
        
    }

    button.addEventListener('click', toggleChat);


    window.addEventListener('resize', adjustWidgetLayout);
    
    window.addEventListener('message', function (event) {
        if (event.origin !== baseUrl) return;

        if (event.data === 'closeChatWidget') {
            toggleChat(); 
        }
    });

})();