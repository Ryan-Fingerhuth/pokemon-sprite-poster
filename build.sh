# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "master" ]; then
  # Run the "cloudflare-build-prod" script in `package.json` on the "master" branch
  npm run cloudflare-build-prod

elif [ "$CF_PAGES_BRANCH" == "develop" ]; then
  # Run the "cloudflare-build-preview" script in `package.json` on the "develop" branch
  npm run cloudflare-build-preview

else
  # Else run the cloudflare build preview script
  npm run cloudflare-build-preview
fi