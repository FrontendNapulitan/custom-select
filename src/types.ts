import * as React from 'react';
import type { JSX as SolidJSX } from 'solid-js';
import type { JSX as PreactJSX } from 'preact';
// Interfaccia per le props specifiche del componente
export interface MyOwnSelectProps extends React.HTMLAttributes<HTMLElement> {
  value?:string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'my-own-select': React.DetailedHTMLProps<MyOwnSelectProps, HTMLElement>;
    }
  }
}
declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      'my-own-select': SolidJSX.HTMLAttributes<any> & { children: Element[]; "on:selection": (event: CustomEvent<any>) => void; };
    }
  }
}
declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      'my-own-select': PreactJSX.DetailedHTMLProps<any> ;
    }
  }
}