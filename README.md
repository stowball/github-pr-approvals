# GitHub PR Approvals

A Greasemonkey script to only allow the merging of GitHub Pull Requests when they have approval (via a comment)

The "Merge pull request" button will be disabled as appropriate on load, and on new, edited and deleted comments.

## Installation instructions

1. Install Greasemonkey for Firefox or Tampermonkey for Chrome
2. Paste github-approvals-gm.js as a new script
3. Additionally, change the required number of approvals and the approval string (default is `1` and `=Approved=`)
