// ABOUTME: Checks the static portfolio page for required content, links and assets.
// ABOUTME: Run with `node --test tests/*.test.mjs` from the repository root.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('page is titled with name and headline', () => {
  assert.match(html, /<title>Sinan Rassam · Senior Software Engineer<\/title>/);
  assert.match(html, /<h1[^>]*>Sinan Rassam<\/h1>/);
  assert.match(html, /Senior Software Engineer/);
});

test('page declares language, charset, viewport and description', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta charset="utf-8">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<meta name="description" content="[^"]+">/);
});

test('page links to LinkedIn and GitHub profiles', () => {
  assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/sinanrassam\/"/);
  assert.match(html, /href="https:\/\/github\.com\/sinanrassam"/);
});

test('external links open in a new tab without exposing the opener', () => {
  const links = [...html.matchAll(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g)].map((m) => m[0]);
  assert.ok(links.length > 0, 'expected at least one external link');
  for (const link of links) {
    assert.match(link, /target="_blank"/, `link does not open in a new tab: ${link}`);
    assert.match(link, /rel="noopener noreferrer"/, `link is missing rel: ${link}`);
  }
});

test('page writes the company and product names in house style', () => {
  assert.doesNotMatch(html, /Les Mills/i, 'company name should be written LesMills');
  assert.match(html, /LESMILLS\+/);
  assert.match(html, /LESMILLS Instructor/);
  assert.match(html, /LESMILLS Content/);
  assert.match(html, /LesMills International/);
});

test('LesMills work card covers all three products', () => {
  const card = html.match(/<article class="card">(?:(?!<\/article>)[\s\S])*<h3>LesMills platforms<\/h3>[\s\S]*?<\/article>/)?.[0];
  assert.ok(card, 'missing LesMills platforms card');
  for (const product of ['LESMILLS+', 'LESMILLS Instructor', 'LESMILLS Content']) {
    assert.ok(card.includes(product), `card does not mention ${product}`);
  }
});

test('selected work links to each live project', () => {
  const cards = [...html.matchAll(/<article class="card">([\s\S]*?)<\/article>/g)].map((m) => m[1]);
  const linkFor = (title) => {
    const card = cards.find((c) => c.includes(`<h3>${title}</h3>`));
    assert.ok(card, `missing card ${title}`);
    return card.match(/<a\b[^>]*href="([^"]+)"/)?.[1];
  };
  assert.equal(linkFor('LesMills platforms'), 'https://www.lesmills.com/');
  assert.equal(linkFor('Babylon Charitable Trust'), 'https://babylon.org.nz/');
  assert.equal(linkFor('Kiwi Bright'), 'https://brighthousewash.co.nz/');
  assert.equal(linkFor('Homelab'), undefined, 'the homelab is private and has no link');
});

test('page has about, skills, work and experience sections', () => {
  for (const id of ['about', 'skills', 'work', 'experience']) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"`), `missing section #${id}`);
  }
});

test('page lists every role from the CV', () => {
  for (const role of [
    'Senior Software Engineer',
    'Software Engineer',
    'Junior Software Engineer',
    'Nexlogic',
  ]) {
    assert.ok(html.includes(role), `missing role ${role}`);
  }
});

test('page exposes no phone number or email address', () => {
  assert.doesNotMatch(html, /REDACTED/);
  assert.doesNotMatch(html, /@example\.com/);
});

test('every local asset the page references exists', () => {
  const refs = [...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map((m) => m[1]);
  assert.ok(refs.length > 0, 'expected at least one local asset');
  for (const ref of refs) {
    assert.ok(existsSync(new URL(`../${ref}`, import.meta.url)), `missing local asset ${ref}`);
  }
});

test('GitHub Pages serves the files without Jekyll processing', () => {
  assert.ok(existsSync(new URL('../.nojekyll', import.meta.url)));
});
