// Force fix for SG&A text position
console.log('[FIX-SGA] Direct script loaded');

// Function to force the text below the rect
function fixSGAText() {
  // Find the exact SG&A rect at x=536
  const sgaRect = document.querySelector('rect[x="536"]');
  if (!sgaRect) {
    console.log('[FIX-SGA] SG&A rect not found yet');
    return false;
  }
  
  // Find the exact SG&A text with class "nodelabel"
  const sgaLabelText = document.querySelector('text[class="nodelabel"]:not([transform])');
  if (!sgaLabelText) {
    console.log('[FIX-SGA] SG&A label text not found');
    return false;
  }
  
  console.log('[FIX-SGA] Found SG&A elements:', sgaRect, sgaLabelText);
  
  // Get the rect's bottom position
  const rectY = parseFloat(sgaRect.getAttribute('y'));
  const rectHeight = parseFloat(sgaRect.getAttribute('height'));
  const rectBottom = rectY + rectHeight;
  
  // Directly manipulate style properties
  sgaLabelText.style.position = 'absolute';
  sgaLabelText.setAttribute('y', rectBottom + 25);
  sgaLabelText.style.top = (rectBottom + 25) + 'px';
  
  // Force remove transform
  sgaLabelText.removeAttribute('transform');
  sgaLabelText.style.transform = 'none';
  
  // Apply an !important style rule
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    text.nodelabel:contains('SG&A') {
      y: ${rectBottom + 25}px !important;
      transform: none !important;
      position: absolute !important;
    }
  `;
  document.head.appendChild(styleTag);
  
  console.log('[FIX-SGA] Applied direct style changes to SG&A label');
  return true;
}

// Try immediately and retry several times
let attempts = 0;
const maxAttempts = 10;

function attemptFix() {
  if (attempts >= maxAttempts) {
    console.log('[FIX-SGA] Max attempts reached');
    return;
  }
  
  attempts++;
  console.log(`[FIX-SGA] Attempt ${attempts}/${maxAttempts}`);
  
  if (!fixSGAText()) {
    // Wait longer between each attempt
    setTimeout(attemptFix, 200 * attempts);
  }
}

// Start the fix process
window.addEventListener('load', function() {
  console.log('[FIX-SGA] Window loaded, starting fix process');
  setTimeout(attemptFix, 500);
  
  // Also try with a MutationObserver
  const observer = new MutationObserver(function(mutations) {
    console.log('[FIX-SGA] DOM changed, retrying fix');
    setTimeout(attemptFix, 100);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
});

// Try immediately as well
setTimeout(attemptFix, 100);

// Add a direct event listener
document.addEventListener('DOMContentLoaded', function() {
  console.log('[FIX-SGA] DOM content loaded, applying fix');
  setTimeout(attemptFix, 300);
});
