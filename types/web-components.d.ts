// types/web-components.d.ts
import React from 'react';

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'portfolio-nav': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
