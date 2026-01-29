/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    OPENWEATHERMAP_API_KEY?: string;
    OPENWEATHERMAP_BASE?: string;
  }
}
