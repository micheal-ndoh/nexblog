"use client"

import React from 'react'
import { useAppStore } from './store'

export function TolgeeWrapper({ children }: { children: React.ReactNode }) {
    // TODO: Implement Tolgee integration
    return React.createElement(React.Fragment, null, children)
}

export const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ka-GE', name: 'ქართული', flag: '🇬🇪' },
] 