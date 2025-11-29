# Translation Guide for BVSS Website

## Current Setup

The website uses **react-i18next** for internationalization (i18n) with support for:
- English (en) - Primary language
- Hindi (hi) - हिंदी
- Gujarati (gu) - ગુજરાતી  
- Kannada (kn) - ಕನ್ನಡ

## How to Add Translations

### 1. Adding New Translation Keys

Edit the JSON files in `src/i18n/locales/`:
- `en.json` - English translations
- `hi.json` - Hindi translations
- `gu.json` - Gujarati translations
- `kn.json` - Kannada translations

### 2. Using Translations in Components

```jsx
import { useLanguage } from "../contexts/LanguageContext";

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t("common.welcome")}</h1>
      <p>{t("about.title")}</p>
    </div>
  );
}
```

### 3. Translation File Structure

```json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "common": {
    "welcome": "Welcome",
    "submit": "Submit"
  },
  "about": {
    "title": "About Us",
    "vision": "Our Vision"
  }
}
```

## Automatic Translation Services

For automatic translation of large amounts of content, you can use:

### Option 1: Google Cloud Translation API (Recommended)
- **Cost**: Pay-per-use, $20 per 1M characters
- **Quality**: Excellent
- **Setup**: Requires Google Cloud account

### Option 2: Microsoft Translator Text API
- **Cost**: Free tier (2M characters/month), then pay-per-use
- **Quality**: Very good
- **Setup**: Requires Azure account

### Option 3: MyMemory Translation API
- **Cost**: Free tier available
- **Quality**: Good for common languages
- **Setup**: Simple API key setup

### Option 4: Google Translate Widget (Quick Solution)
Add this script to `index.html` for instant automatic translation:
```html
<div id="google_translate_element"></div>
<script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,hi,gu,kn',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

## Adding More Languages

1. Create new JSON file: `src/i18n/locales/[lang-code].json`
2. Add translations following the same structure
3. Update `src/i18n/config.js` to include the new language
4. Add language option to Navbar component

## Best Practices

1. Always add English translation first
2. Use nested keys for organization (e.g., `nav.home`, `about.title`)
3. Keep translation keys consistent across all language files
4. Test all languages after adding new content
5. For professional translations, consider hiring human translators for final review

