/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import i18next from 'i18next';
import translations from './translations';
import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import tr from './locales/tr.json';
import id from './locales/id.json';
import ca from './locales/ca.json';
import it from './locales/it.json';
import LanguageDetector from 'i18next-browser-languagedetector';

import type { i18n, Resource } from 'i18next';

export class I18nService {
	// expose i18next
	i18n: i18n;

	constructor() {
		this.i18n = i18next;
		this.initialize();
		// this.changeLanguage("de")
		//this.changeLanguage(INITIAL_LANGUAGE);
	}

	// Our translation function
	t(key: string, replacements?: Record<string, unknown>): string {
		return this.i18n.t(key, replacements);
	}

	// Initializing i18n
	initialize(): void {
		this.i18n.use(LanguageDetector).init({
			// lng: INITIAL_LANGUAGE,
			compatibilityJSON: 'v3',
			fallbackLng: 'en',
			debug: false,
			defaultNS: 'translation',
			resources: translations as Resource,
			interpolation: {
				escapeValue: false
			},
			returnEmptyString: false,
			simplifyPluralSuffix: true,
			// detection: {
			// 	order: ['browser', 'querystring', 'navigator', 'localStorage', 'htmlTag'],
			// 	lookupQuerystring: 'lng'
			// }
			detection: {
				order: ['querystring', 'cookie', 'localStorage', 'navigator'],
				lookupQuerystring: 'lng',
				lookupLocalStorage: 'language'
			}
		});
		this.i18n.addResourceBundle('en', 'translation', en);
		this.i18n.addResourceBundle('de', 'translation', de);
		this.i18n.addResourceBundle('fr', 'translation', fr);
		this.i18n.addResourceBundle('tr', 'translation', tr);
		this.i18n.addResourceBundle('id', 'translation', id);
		this.i18n.addResourceBundle('it', 'translation', it);
		this.i18n.addResourceBundle('ca', 'translation', ca);
	}

	changeLanguage(language: string): void {
		this.i18n.changeLanguage(language);
	}
}
