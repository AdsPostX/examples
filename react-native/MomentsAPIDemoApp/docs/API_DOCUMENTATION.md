# AdsPostX Moments API Documentation

## Overview
This document provides comprehensive information about the AdsPostX Moments API integration, including endpoints, parameters, and response structures.

---

## Base Configuration

### API Base URL
```
https://api.adspostx.com/native/v4
```

### Environment Setup
Configure in `.env` file:
```
API_BASE_URL=https://api.adspostx.com/native/v4
```

---

## API Endpoint

### Fetch Offers

**Endpoint:** `POST /offers.json`

**Full URL:** `https://api.adspostx.com/native/v4/offers.json`

---

## Request Structure

### Headers
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "User-Agent": "<device-user-agent>"
}
```

### Query Parameters

| Parameter | Type | Required | Description | Valid Values |
|-----------|------|----------|-------------|--------------|
| `api_key` | string | **Yes** | Your API authentication key | Any valid API key |
| `loyaltyboost` | string | No | Loyalty boost level | `"0"`, `"1"`, `"2"`, or `null` |
| `creative` | string | No | Creative type flag | `"0"`, `"1"`, or `null` |
| `campaignId` | string | No | Specific campaign identifier | Any campaign ID or `null` |

**Example Query String:**
```
?api_key=b167f9d7-c479-41d8-b58f-4a5b26e561f1&loyaltyboost=0&creative=0
```

### Request Body (Payload)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dev` | string | No | Development mode flag | `"1"` for development mode |
| `adpx_fp` | string | Recommended | Unique user fingerprint/identifier | Generated unique ID |
| `pub_user_id` | string | Recommended | Publisher's user identifier | Your internal user ID (e.g., `"1234567890"`) |
| `placement` | string | Recommended | Placement location identifier | e.g., `"checkout"`, `"homepage"`, etc. |
| `ua` | string | No | User agent string | Device user agent (auto-detected if not provided) |

**Example Request Body:**
```json
{
  "dev": "1",
  "adpx_fp": "unique-device-fingerprint-123",
  "pub_user_id": "1234567890",
  "placement": "checkout",
  "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)..."
}
```

**Complete Request Example:**
```bash
POST https://api.adspostx.com/native/v4/offers.json?api_key=YOUR_API_KEY&loyaltyboost=0&creative=0

Headers:
  Content-Type: application/json
  Accept: application/json
  User-Agent: <device-user-agent>

Body:
{
  "dev": "1",
  "adpx_fp": "unique-device-fingerprint-123",
  "pub_user_id": "1234567890",
  "placement": "checkout"
}
```

---

## Response Structure

### Success Response (200 OK)

```json
{
  "data": {
    "offers": [
      {
        "id": "offer-unique-id",
        "title": "Offer Title",
        "name": "Offer Name (alternative to title)",
        "description": "Detailed offer description",
        "image": "https://example.com/offer-image.jpg",
        "creative_url": "https://example.com/creative.jpg (alternative to image)",
        "click_url": "https://example.com/offer-landing-page",
        "cta_yes": "Yes, I'm interested",
        "cta_no": "No, Thanks",
        "pixel": "https://tracking.example.com/impression-pixel",
        "adv_pixel_url": "https://advertiser.example.com/pixel",
        "beacons": {
          "close": "https://tracking.example.com/close-beacon",
          "no_thanks_click": "https://tracking.example.com/no-thanks-beacon"
        }
      }
    ],
    "styles": {
      // Optional styling configurations returned by API
      // Structure varies based on API response
    }
  }
}
```

### Normalized Offer Object (Used in App)

After processing, each offer is normalized to:

```javascript
{
  id: "offer-unique-id",              // String - Unique identifier
  title: "Offer Title",                // String - Display title
  description: "Offer description",    // String - Detailed description
  image: "https://...",                // String - Image URL
  click_url: "https://...",            // String - Destination URL
  cta_yes: "Yes",                      // String - Positive CTA text
  cta_no: "No, Thanks",                // String - Negative CTA text
  beacons: {
    close: "https://...",              // String or null - Close tracking URL
    no_thanks_click: "https://..."     // String or null - Negative CTA tracking URL
  },
  pixel: "https://..."                 // String or null - Impression tracking URL
}
```

### Error Response

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

Common error scenarios:
- **Invalid API Key:** 401 Unauthorized
- **No Offers Available:** Empty offers array `[]`
- **Invalid Parameters:** 400 Bad Request
- **Server Error:** 500 Internal Server Error

---

## Tracking Pixels & Beacons

The API provides various tracking URLs that should be fired at specific events:

### 1. Impression Pixel
**When to fire:** Immediately when an offer is displayed to the user

**URLs:**
- `offer.pixel` - Primary impression tracking
- `offer.adv_pixel_url` - Advertiser's impression tracking (if available)

**Implementation:**
```javascript
fireOfferPixel(offer.pixel);
fireOfferPixel(offer.adv_pixel_url);
```

### 2. Close Beacon
**When to fire:** When user closes the offer without interaction

**URL:** `offer.beacons.close`

**Implementation:**
```javascript
fireOfferPixel(offer.beacons.close);
```

### 3. No Thanks Beacon
**When to fire:** When user clicks the negative CTA button

**URL:** `offer.beacons.no_thanks_click`

**Implementation:**
```javascript
fireOfferPixel(offer.beacons.no_thanks_click);
```

### Pixel Firing Method
All pixels are fired using HTTP GET requests:
```javascript
axios.get(pixelUrl);
```

---

## Implementation Flow

### 1. Initialize API Call
```javascript
import { getOffers } from './services/OffersService';

const response = await getOffers({
  apiKey: 'YOUR_API_KEY',
  loyaltyBoost: '0',           // Optional: '0', '1', '2', or null
  creative: '0',               // Optional: '0', '1', or null
  isDevelopment: true,         // Optional: boolean
  payload: {
    adpx_fp: 'unique-id',      // Recommended
    pub_user_id: '1234567890', // Recommended
    placement: 'checkout',     // Recommended
    ua: 'user-agent-string'    // Optional
  },
  campaignId: null             // Optional
});
```

### 2. Handle Response
```javascript
const { offers, styles } = response;

// offers: Array of normalized offer objects
// styles: API-provided styling configurations
```

### 3. Display Offers
```javascript
// Show offers in a carousel or list
offers.forEach((offer, index) => {
  // Display offer.image, offer.title, offer.description
  // Show offer.cta_yes and offer.cta_no buttons
});
```

### 4. Handle User Interactions

**Positive CTA (Yes button):**
```javascript
// 1. Open the offer URL
openURL(offer.click_url);

// 2. Navigate to next offer or close
goToNextOffer();
```

**Negative CTA (No Thanks button):**
```javascript
// 1. Fire the no thanks beacon
fireOfferPixel(offer.beacons.no_thanks_click);

// 2. Navigate to next offer or close
goToNextOffer();
```

**Close Button:**
```javascript
// 1. Fire the close beacon
fireOfferPixel(offer.beacons.close);

// 2. Close the offer container
closeOffers();
```

**Image Click:**
```javascript
// Open the offer URL
openURL(offer.click_url);
```

---

## Best Practices

### 1. User Identification
- Always provide `adpx_fp` (unique device fingerprint) for better tracking
- Use `pub_user_id` to link offers to your internal user system
- Generate consistent IDs across sessions

### 2. Placement Tracking
- Use descriptive `placement` values (e.g., "checkout", "homepage", "cart")
- This helps optimize offer delivery

### 3. Development Mode
- Set `isDevelopment: true` or `dev: "1"` during testing
- This may return test offers and enable additional logging

### 4. Error Handling
```javascript
try {
  const response = await getOffers({ apiKey, ... });
} catch (error) {
  if (error.response) {
    // API returned error response
    console.error('API Error:', error.response.data);
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error:', error.request);
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

### 5. Pixel Firing
- Fire impression pixels immediately when offer is shown
- Fire tracking beacons for all user interactions
- Handle pixel failures gracefully (don't block UI)

### 6. Parameter Validation
- Validate `loyaltyBoost` is one of: `"0"`, `"1"`, `"2"`, or `null`
- Validate `creative` is one of: `"0"`, `"1"`, or `null`
- Ensure `api_key` is always provided

---

## Code Examples

### Complete Integration Example

```javascript
import { getOffers, fireOfferPixel } from './services/OffersService';
import { generateUniqueID, getUserAgent, openURL } from './utils/Util';

// Fetch offers
async function loadOffers(apiKey, isDevelopment = false) {
  try {
    // Generate unique identifier
    const adpx_fp = await generateUniqueID();
    const ua = await getUserAgent();
    
    // Fetch offers
    const response = await getOffers({
      apiKey: apiKey,
      loyaltyBoost: '0',
      creative: '0',
      isDevelopment: isDevelopment,
      payload: {
        adpx_fp: adpx_fp,
        pub_user_id: 'your-user-id',
        placement: 'checkout',
        ua: ua
      }
    });
    
    const { offers, styles } = response;
    
    // Fire impression pixels for first offer
    if (offers.length > 0) {
      fireOfferPixel(offers[0].pixel);
      fireOfferPixel(offers[0].adv_pixel_url);
    }
    
    return { offers, styles };
  } catch (error) {
    console.error('Failed to load offers:', error);
    throw error;
  }
}

// Handle positive CTA
function handleYesClick(offer) {
  if (offer.click_url) {
    openURL(offer.click_url);
  }
  // Navigate to next offer or close
}

// Handle negative CTA
function handleNoClick(offer) {
  fireOfferPixel(offer.beacons.no_thanks_click);
  // Navigate to next offer or close
}

// Handle close
function handleClose(offer) {
  fireOfferPixel(offer.beacons.close);
  // Close offer container
}
```

---

## Testing

### Test API Key
Default test key provided in app:
```
b167f9d7-c479-41d8-b58f-4a5b26e561f1
```

### Development Mode
Enable development mode to:
- Get test offers
- Enable detailed logging
- Test without affecting production metrics

Set in request:
```javascript
{
  isDevelopment: true,
  payload: {
    dev: "1"
  }
}
```

---

## Additional Resources

- **Official Documentation:** https://docs.momentscience.com/react-native-moments-api-integration-guide
- **API Base URL:** https://api.adspostx.com/native/v4

---

## Summary

### Required Parameters
- ✅ `api_key` (query parameter)

### Recommended Parameters
- 📌 `adpx_fp` (payload) - Unique user identifier
- 📌 `pub_user_id` (payload) - Your internal user ID
- 📌 `placement` (payload) - Placement location

### Optional Parameters
- `loyaltyboost` (query) - `"0"`, `"1"`, `"2"`
- `creative` (query) - `"0"`, `"1"`
- `campaignId` (query) - Specific campaign ID
- `dev` (payload) - `"1"` for development mode
- `ua` (payload) - User agent (auto-detected if not provided)

### Response Contains
- `offers[]` - Array of offer objects
- `styles{}` - Styling configurations

### Tracking Events
1. **Impression** → Fire `pixel` and `adv_pixel_url`
2. **Close** → Fire `beacons.close`
3. **No Thanks** → Fire `beacons.no_thanks_click`
4. **Yes/Click** → Open `click_url`

---

*Last Updated: November 2024*
