// src/Components/IridescenceWrapper.tsx
"use client";

import Iridescence from '@/Backgrounds/Iridescence/Iridescence';
import { memo } from "react";

function IridescenceWrapperComponent() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Iridescence mouseReact={false} />
    </div>
  );
}

export default memo(IridescenceWrapperComponent);