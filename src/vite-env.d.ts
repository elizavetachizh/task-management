/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Порт JSON Server (`http://localhost:${порт}`). */
  readonly VITE_API_PORT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
