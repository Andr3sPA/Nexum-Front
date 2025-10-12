"use client"

import React, { useEffect, useState } from "react";

interface FloatingNoticeProps {
  storageKey?: string | null; // if null, do not persist dismissal
  title?: string;
  children: React.ReactNode;
  position?: 'bottom-right' | 'center' | 'inline';
  persist?: boolean; // whether to remember dismissal in sessionStorage
  prominent?: boolean;
}

export const FloatingNotice: React.FC<FloatingNoticeProps> = ({
  storageKey = 'opportunity_notice_dismissed',
  title = 'Aviso importante:',
  children,
  position = 'bottom-right',
  persist = true,
  prominent = false,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!persist) {
        setVisible(true);
        return;
      }
      const dismissed = typeof window !== 'undefined' && storageKey ? sessionStorage.getItem(storageKey) : null;
      if (!dismissed) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, [storageKey, persist]);

  const dismiss = () => {
    try {
      if (persist && storageKey) sessionStorage.setItem(storageKey, '1');
    } catch (e) {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  let containerClass: string;
  let boxClass: string;

  if (position === 'center') {
    containerClass = 'fixed inset-0 flex items-start pt-24 justify-center z-50 px-4';
    boxClass = 'max-w-3xl w-full rounded-lg shadow-lg border bg-white p-6';
  } else if (position === 'inline') {
    // Inline centered box that follows page flow (not fixed). Larger typography for visibility.
    containerClass = 'w-full';
    boxClass = 'max-w-4xl mx-auto rounded-lg shadow border bg-white p-8 my-6';
  } else {
    containerClass = 'fixed bottom-6 right-6 z-50 w-96 max-w-full';
    boxClass = 'rounded-lg shadow-lg border bg-white p-4';
  }

  // compute variant classes for prominent mode
  const titleClass = prominent ? 'text-2xl font-bold text-yellow-800 mb-3' : 'font-semibold text-lg text-gray-900 mb-2';
  const bodyClass = prominent ? 'text-base text-gray-800 whitespace-pre-line leading-relaxed' : 'text-base text-gray-700 whitespace-pre-line leading-relaxed';

  return (
    <div className={containerClass}>
      <div className={boxClass} role="dialog" aria-live="polite">
        <div className="flex items-start">
          <div className="flex-1">
            {prominent ? (
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l5.516 9.807c.75 1.333-.213 2.994-1.742 2.994H4.483c-1.53 0-2.493-1.66-1.743-2.994L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-6a1 1 0 00-.993.883L8.9 8.5v2a1 1 0 001.993.117L10.9 10.5v-2a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className={titleClass}>{title}</div>
                  <div className={bodyClass}>{children}</div>
                </div>
              </div>
            ) : (
              <>
                <div className={titleClass}>{title}</div>
                <div className={bodyClass}>{children}</div>
              </>
            )}
          </div>
          <div className="ml-3 shrink-0">
            <button onClick={dismiss} aria-label="Cerrar aviso" className="inline-flex items-center justify-center p-1 rounded-md hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingNotice;
