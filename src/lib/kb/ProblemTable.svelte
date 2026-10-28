<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket } from '#lib/kb/split';

  // tickets: problem → number of the ticket filed for it in `repo`.
  let { ticket, repo, tickets = {} }: { ticket: number; repo: string; tickets?: Record<string, number> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const exported = (reports as Report[]).filter((r) => r.mergedInto === ticket).length;
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports in #{ticket} ({exported - merged.length} exported twice, counted once) ·
  <strong>{groups.length}</strong> problems
</p>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if tickets[g.cause]}<a href="https://github.com/{repo}/issues/{tickets[g.cause]}">{repo}#{tickets[g.cause]}</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<details>
  <summary>report ids per problem</summary>
  {#each groups as g (g.cause)}
    <p><code>{g.cause}</code>: {g.reports.map((r) => r.id).sort().join(', ')}</p>
  {/each}
</details>

<style>
  .sum { font-size: 1.1rem; }
  details p { font: 0.8rem var(--mono); color: var(--muted); }
</style>
