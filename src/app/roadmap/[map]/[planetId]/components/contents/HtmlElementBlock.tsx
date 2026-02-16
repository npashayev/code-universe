'use client';
import { HtmlElementContent } from '@/types/planet';
import { useEffect, useState, useRef } from 'react';
import Markdown from 'react-markdown';

interface Props {
  content: HtmlElementContent;
}

const HtmlElementBlock = ({ content }: Props) => {
  const { title, description, element } = content;
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
          setTimeout(sendHeight, 250);
          
          // watch for content changes
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
    <div>
      {title && <h3 className="heading-sub">{title}</h3>}
      {description && (
        <div className="prose max-w-none">
          <Markdown>{description}</Markdown>
        </div>
      )}

      <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden bg-white resize">
        <iframe
          ref={iframeRef}
          className="w-full border-0 bg-white block"
          style={{ height: `${iframeHeight}px` }}
          srcDoc={iframeContent}
          sandbox="allow-scripts allow-modals"
          title="HTML Preview"
        />
      </div>
    </div>
  );
};

export default HtmlElementBlock;
