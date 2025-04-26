// src/Components/IridescenceWrapper.tsx
"use client";

import Iridescence from '@/Backgrounds/Iridescence/Iridescence';
import { memo } from "react";

function IridescenceWrapperComponent() {
  return (
    <div className="fixed inset-0 w-[100vw] h-[100vh] overflow-hidden" style={{ zIndex: -10 }}>
      <Iridescence mouseReact={false} />
    </div>
  );
}

export default memo(IridescenceWrapperComponent);