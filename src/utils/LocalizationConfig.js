import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import * as RNLocalize from 'react-native-localize';

import { I18nManager } from 'react-native';

export const translationGetters = {
    // lazy requires (metro bundler does not support symlinks)
    en: () => require('../assets/locales/en.json'),
    vi: () => require('../assets/locales/vi.json'),
};

const Strings = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = () => {
    let locales = RNLocalize.getLocales();

    // fallback if no available language fits
    const fallback = { languageTag: 'vi', isRTL: false };

    const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

    // const {languageTag, isRTL} = fallback;

    // clear translation cache
    Strings.cache.clear();
    // versionupdate layout direction
    I18nManager.forceRTL(isRTL);

    // set i18n-js config
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};
export default Strings;
