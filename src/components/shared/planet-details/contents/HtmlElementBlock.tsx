'use client';
import { useEffect, useState, useRef } from 'react';

import type { HtmlElementContent } from '@/types/planet';

import CustomMarkdown from './CustomMarkdown';
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
      if (e.source !== iframeRef.current?.contentWindow) return;
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
          function sendHeight() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: 'resize', height }, '*');
          }
          
          window.addEventListener('load', sendHeight);
          
          setTimeout(sendHeight, 250);
          
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
      {description && <CustomMarkdown text={description} />}
      <div className="mt-4 border border-gray-300 rounded-lg overflow-auto bg-white resize">
        <iframe
          ref={iframeRef}
          className="w-full border-0 bg-white block"
          style={{ height: `${Math.min(iframeHeight, 600)}px` }}
          srcDoc={iframeContent}
          sandbox="allow-scripts allow-modals allow-top-navigation-by-user-activation"
          title="HTML Preview"
        />
      </div>
    </div>
  );
};
export default HtmlElementBlock;
