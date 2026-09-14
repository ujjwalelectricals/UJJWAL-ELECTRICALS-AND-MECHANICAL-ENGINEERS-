# Google measurement setup

The site is wired for consent-gated GA4 and Search Console verification without committing account-specific values to the repository.

## GA4

Create or select the website data stream in Google Analytics and copy its Google tag / Measurement ID. Google documents the ID format as `G-...` and notes that the ID connects the website to the corresponding web data stream.

Add a GitHub repository variable named `VITE_GA4_ID` with that value. The deployment workflow injects it during the build. The site keeps analytics blocked until the visitor grants analytics consent.

## Search Console

Verify the GitHub Pages site in Google Search Console using the HTML meta-tag method. Copy the verification token value into a GitHub repository variable named `VITE_GSC_VERIFICATION`. The deployment workflow injects that value into the built page.

Then submit the sitemap shown by the live site to Search Console. Re-inspect the homepage after deployment and validate structured data after the next crawl.

## Core Web Vitals

Every Pages deployment runs a Lighthouse audit after deployment and stores the JSON report as a workflow artifact named `lighthouse-core-web-vitals`. The audit is informational and does not block deployment.

For field data, the app also records lightweight LCP and CLS measurements through the existing analytics event pipeline once GA4 consent and configuration are active.
