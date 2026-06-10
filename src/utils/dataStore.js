// Webhook utilities for RSVP and Wishes submissions

// Post submission payload to Google Sheets Webhook App URL
export async function postToWebhook(payload) {
  try {
    const webhookUrl = localStorage.getItem('wedding-webhook-url');
    if (!webhookUrl) return false;

    // Send via standard CORS-friendly POST
    const response = await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // standard workaround for cross-origin App Scripts
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    return true;
  } catch (err) {
    console.error('Error posting to Google Sheets Webhook', err);
    return false;
  }
}
