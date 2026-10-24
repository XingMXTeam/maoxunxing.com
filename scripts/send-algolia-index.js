// Send a hugo-algolia-generated JSON file to an Algolia index via a temp
// index + moveIndex (full replace, same semantics as hugo-algolia's own
// sender, but without its getSettings/searchSynonyms preamble, which fails
// on a not-yet-existing index). saveObjects auto-creates the target index.
//
// Usage: ALGOLIA_ADMIN_KEY=... node scripts/send-algolia-index.js <index> <json-file>
const algoliasearch = require('algoliasearch');
const fs = require('fs');

const [indexName, file] = process.argv.slice(2);
if (!indexName || !file) {
  console.error('Usage: node scripts/send-algolia-index.js <index> <json-file>');
  process.exit(2);
}
const key = process.env.ALGOLIA_ADMIN_KEY;
if (!key) {
  console.error('Set ALGOLIA_ADMIN_KEY to your Algolia Admin API key');
  process.exit(2);
}

const objects = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(objects)) {
  console.error('Expected the JSON file to contain an array of records');
  process.exit(2);
}

(async () => {
  const client = algoliasearch('D7NQ3RODEC', key);
  const tmp = client.initIndex(`${indexName}-temp`);
  const saved = await tmp.saveObjects(objects);
  console.log(`Saved ${objects.length} objects to ${tmp.indexName} (taskID ${saved.taskID})`);
  const moved = await client.moveIndex(tmp.indexName, indexName);
  console.log(`Moved ${tmp.indexName} -> ${indexName} (taskID ${moved.taskID})`);
})().catch((err) => {
  console.error(`send-algolia-index failed for ${indexName}:`, err && err.message ? err.message : err);
  process.exit(1);
});
