# n8n workflow

`mena-business-finder.json` runs the same Google Maps search as the app and appends one row per business to Google Sheets.

The SerpApi step uses the official community node [`n8n-nodes-serpapi`](https://github.com/serpapi/n8n-nodes-serpapi) (`n8n-nodes-serpapi.serpApi`), operation **Google Maps**, with `type=search`.

## Import

1. In n8n, open **Settings → Community nodes** and install `n8n-nodes-serpapi`.
2. Create a **SerpApi** credential with your API key from [serpapi.com/manage-api-key](https://serpapi.com/manage-api-key).
3. Create a **Google Sheets OAuth2** credential that can edit the destination spreadsheet.
4. Add a sheet tab named `Businesses`. The first run can create the header row from the mapped columns: `name`, `rating`, `reviews`, `type`, `address`, `phone`, `hours`, `link`.
5. Import `mena-business-finder.json` from the workflow menu.
6. Open **SerpApi Google Maps** and select your SerpApi credential.
7. Open **Append to Google Sheets**, select your Google credential, and replace `YOUR_SPREADSHEET_ID` with the id in the sheet URL (`https://docs.google.com/spreadsheets/d/<id>/edit`).
8. In **Search inputs**, set:
   - `q` — business type, such as `cafe` or `صيدلية`
   - `ll` — `@latitude,longitude,zoom` for the city (see the sticky note)
   - `hl` — `en` or `ar`
9. Click **Test workflow**. Each `local_results` place becomes one sheet row.

The workflow stays inactive after import. Turn it on only after the credentials and spreadsheet id are set. There is no schedule; run it manually, or replace the manual trigger with your own trigger later.
