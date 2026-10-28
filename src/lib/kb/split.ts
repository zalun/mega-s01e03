// #4471 split by what actually broke. causes.ts places a report by its tenant and channel; the desk
// read a few reports as a one-day move (desk-notes.json), which no tenant rule explains. Those get
// their own group here instead of a footnote under `parser`.
import { groupByCause, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day';

export type ProblemGroup = Omit<CauseGroup, 'cause'> & { cause: Problem };

export function splitTicket(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  const rest = merged.filter((r) => !oneDayMove.includes(r.id));
  const groups: ProblemGroup[] = groupByCause(rest, tenantOf);
  if (moved.length) groups.push({ ...groupByCause(moved, tenantOf)[0], cause: 'one-day' });
  return groups.sort((a, b) => b.reports.length - a.reports.length);
}
