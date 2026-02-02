'use client';
import { HtmlElementContent } from '@/lib/types/planet';
import { useEffect, useState, useRef } from 'react';

interface Props {
  content: HtmlElementContent;
}

const HtmlElementBlock = ({ content }: Props) => {
  const { title, element } = content;
  const { html, css, js } = element;
  const [iframeHeight, setIframeHeight] = useState(300);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'resize') {
        setIframeHeight(e.data.height);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 16px;
          }
          ${css || ''}
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Send initial height
          function sendHeight() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: 'resize', height }, '*');
          }
          
          // Send height after content loads
          window.addEventListener('load', sendHeight);
          
          // Send height after a short delay (for dynamic content)
          setTimeout(sendHeight, 100);
          
          // Optional: watch for content changes
          if (window.ResizeObserver) {
            const observer = new ResizeObserver(sendHeight);
            observer.observe(document.body);
          }
          
          ${js || ''}
        </script>
      </body>
    </html>
  `;

  return (
    <div className="my-8">
      {title && <p className="mb-3">{title}</p>}

      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm resize">
        <iframe
          ref={iframeRef}
          className="w-full border-0 bg-white block"
          style={{ height: `${iframeHeight}px` }}
          srcDoc={iframeContent}
          sandbox="allow-scripts"
          title="HTML Preview"
        />
      </div>
    </div>
  );
};

export default HtmlElementBlock;
