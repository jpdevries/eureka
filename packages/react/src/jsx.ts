// Lets hosts write <eureka-browser> directly in JSX when they prefer the raw element.
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type EurekaBrowserIntrinsic = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  api?: string; assets?: string; source?: string | number; path?: string; mode?: string; 'storage-prefix'?: string; uid?: string; worker?: string; i18n?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'eureka-browser': EurekaBrowserIntrinsic;
    }
  }
}

export {};
