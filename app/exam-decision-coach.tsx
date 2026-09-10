'use client';

import { ArrowRight, CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { useState } from 'react';
import styles from './exam-decision-coach.module.css';

type CoachScenario = {
  title: string;
  category: string;
  prompt: string;
  constraint: string;
  eliminate: string;
  choose: string;
  temptation: string;
  labIndex: number;
  labLabel: string;
};

const scenarios: CoachScenario[] = [
  {
    title: 'Peer only non-overlapping networks',
    category: 'Networking',
    prompt: 'A VNet with 10.1.0.0/16 must peer with another VNet using 10.12.0.0/16 in a different Azure region.',
    constraint: 'The address spaces must not overlap. Region difference does not disqualify global VNet peering.',
    eliminate: 'Reject a VNet using 10.1.0.0/17: it sits inside 10.1.0.0/16, so the ranges overlap.',
    choose: 'Peer the 10.1.0.0/16 and 10.12.0.0/16 VNets, then validate the route and required traffic rules.',
    temptation: 'A subnet range that looks smaller is not automatically separate. Compare its first and last address against the other range.',
    labIndex: 6,
    labLabel: 'Open VNet traffic path',
  },
  {
    title: 'Protect the persistent disk, not the temporary drive',
    category: 'Compute',
    prompt: 'A Windows VM is redeployed to a new Azure host after files are created on C:, D:, and the desktop.',
    constraint: 'The temporary disk is local to the host. On common Windows VM images it is D:, not the OS disk.',
    eliminate: 'Reject “the newly created local account is lost.” Local users, desktop data, and C: remain on the persistent OS disk.',
    choose: 'Expect data on D: to be lost; store durable application data on managed disks or a managed data service instead.',
    temptation: 'A VM deployment asks for an initial local administrator, but that does not make the account temporary after provisioning.',
    labIndex: 5,
    labLabel: 'Open VM availability and operations',
  },
  {
    title: 'Set the recovery boundary before replication',
    category: 'Monitor & recovery',
    prompt: 'A critical VM workload needs a disaster-recovery plan after migration to Azure.',
    constraint: 'Azure Site Recovery needs a Recovery Services vault as its management boundary before replication is configured.',
    eliminate: 'Reject a backup policy or MABS as the first answer: they address backup operations, not the first ASR configuration dependency.',
    choose: 'Create the Recovery Services vault first, then configure Site Recovery replication and test failover.',
    temptation: 'Backup restores recovery points. Site Recovery replicates workloads for failover. A question asking “configure first” is testing order.',
    labIndex: 9,
    labLabel: 'Open Observe, alert and recover',
  },
  {
    title: 'Grant access at the narrowest useful scope',
    category: 'Identity & governance',
    prompt: 'A developer can manage one project resource group but must not touch any other team’s resources.',
    constraint: 'Azure RBAC assignments inherit downward, never sideways. Start at the smallest scope that meets the requirement.',
    eliminate: 'Reject Owner or Contributor at subscription scope: both are broader than the stated project boundary.',
    choose: 'Assign the needed Azure RBAC role to the group at the target resource group, then verify the effective assignment.',
    temptation: 'A Microsoft Entra directory role is not the same as an Azure RBAC role for resource management.',
    labIndex: 0,
    labLabel: 'Open Entra access at the right scope',
  },
];

export function ExamDecisionCoach({ onOpenLab }: { onOpenLab: (labIndex: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const scenario = scenarios[activeIndex];

  const selectScenario = (index: number) => {
    setActiveIndex(index);
    setRevealed(false);
  };

  return <div className={styles.coach}>
    <div className={styles.rail} aria-label="Exam scenario selection">
      <p className={styles.railTitle}>Choose a pressure point</p>
      <p className={styles.railHint}>Practice the decision path, then prove it in your own tenant.</p>
      <div className={styles.scenarioList}>
        {scenarios.map((item, index) => <button type="button" key={item.title} className={activeIndex === index ? styles.scenarioActive : styles.scenarioChoice} aria-pressed={activeIndex === index} onClick={() => selectScenario(index)}><span>{String(index + 1).padStart(2, '0')}</span><span><b>{item.title}</b><small>{item.category}</small></span></button>)}
      </div>
    </div>
    <article className={styles.player} aria-live="polite">
      <header className={styles.header}>
        <p>{scenario.category}</p>
        <h3>{scenario.title}</h3>
        <p className={styles.prompt}>{scenario.prompt}</p>
      </header>
      <ol className={styles.path}>
        <li><span>1</span><div><b>Read the deciding constraint</b><p>{scenario.constraint}</p></div></li>
        <li><span>2</span><div><b>Eliminate the near miss</b><p>{scenario.eliminate}</p></div></li>
        <li><span>3</span><div><b>Choose the direct fit</b><p>{scenario.choose}</p></div></li>
      </ol>
      <div className={revealed ? styles.revealOpen : styles.reveal}>
        <div><Lightbulb size={18} /><span><b>Why the tempting answer fails</b><p>{revealed ? scenario.temptation : 'Reveal the reasoning trap after you have named your answer.'}</p></span></div>
        <button type="button" onClick={() => setRevealed(value => !value)}>{revealed ? 'Hide trap' : 'Reveal trap'}</button>
      </div>
      <footer className={styles.footer}>
        <div><CheckCircle2 size={18} /><span><b>Say it back</b><small>State the constraint, rejection, and answer without looking.</small></span></div>
        <button type="button" onClick={() => onOpenLab(scenario.labIndex)}>{scenario.labLabel} <ArrowRight size={16} /></button>
      </footer>
      <p className={styles.note}><XCircle size={14} /> This is an original practice explanation—not a copied exam item.</p>
    </article>
  </div>;
}
