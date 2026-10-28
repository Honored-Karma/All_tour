import React, { Component, Suspense, type ReactNode } from "react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { GlassModal } from "../glass/GlassModal";

interface Props { locale?: Locale; dict: Dictionary; onClose: () => void; children: ReactNode }

/** Keep loading and chunk failures dismissible with the same dialog focus lifecycle. */
export class LazyModal extends Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    const { dict, locale = "ru", onClose, children } = this.props;
    const loadingLabel = locale === "kz" ? "Жүктелуде..." : "Загрузка...";
    const shell = (failed: boolean) => (
      <GlassModal open onClose={onClose} title={failed ? dict.errorBoundary.title : loadingLabel} closeLabel={dict.compare.close}>
        {failed ? <>
          <p role="alert">{dict.errorBoundary.description}</p>
          <button type="button" onClick={() => window.location.reload()}>{dict.errorBoundary.reloadBtn}</button>
        </> : <div role="status" aria-label={loadingLabel} aria-busy="true" className="min-h-24 flex items-center justify-center"><span className="h-6 w-6 rounded-full border-2 border-sage border-t-transparent animate-spin motion-reduce:animate-none" /></div>}
      </GlassModal>
    );
    return this.state.failed ? shell(true) : <Suspense fallback={shell(false)}>{children}</Suspense>;
  }
}
