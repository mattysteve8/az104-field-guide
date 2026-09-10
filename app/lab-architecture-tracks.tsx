'use client';

import { ArrowRight, Eye, Map, Wrench } from 'lucide-react';
import { useState } from 'react';
import styles from './lab-architecture-tracks.module.css';

type ArchitectureTrack = {
  title: string;
  theme: string;
  image: string;
  imageAlt: string;
  prompt: string;
  flow: string[];
  proof: string;
  labIndex: number;
};

const tracks: ArchitectureTrack[] = [
  { title: 'Network boundary and peering', theme: 'Networking', image: '/lab04-architecture.png', imageAlt: 'Two separate VNets with non-overlapping address spaces, subnets, a network security group, and a peering connection.', prompt: 'Can the two address spaces be connected without an overlap conflict, and what must be validated after peering?', flow: ['Address plan', 'Peering', 'Route', 'NSG', 'DNS evidence'], proof: 'State why a /17 inside a /16 overlaps, then identify the route and effective security rule that prove the intended path.', labIndex: 6 },
  { title: 'Scale a VM fleet deliberately', theme: 'Compute', image: '/lab08-vmss-architecture.png', imageAlt: 'A virtual machine scale set distributed across availability zones with custom autoscale rules.', prompt: 'Is this a one-off VM, an availability design, or a homogeneous fleet that must grow and shrink?', flow: ['Workload shape', 'VMSS', 'Availability zones', 'Autoscale rules', 'Instance evidence'], proof: 'Explain why a scale set is for a uniform fleet, while zones contribute a distinct failure boundary.', labIndex: 5 },
  { title: 'Recover across regions', theme: 'Recovery', image: '/lab10-architecture.png', imageAlt: 'A VM, Azure Backup, a Recovery Services vault, monitoring, and replication to a second region.', prompt: 'Which service restores data, which replicates the workload, and what must exist before Site Recovery is configured?', flow: ['Recovery Services vault', 'Backup policy', 'Recovery point', 'ASR replication', 'Failover test'], proof: 'Choose the vault first for ASR setup, then explain the different proof for a restore and for a failover.', labIndex: 9 },
  { title: 'Turn a signal into action', theme: 'Monitoring', image: '/lab11-architecture.png', imageAlt: 'A VM producing log queries, an alert, email action, alert processing rule, and an alert trigger.', prompt: 'What signal is evaluated, who is notified, and what evidence shows that the response worked?', flow: ['Metric or log', 'Alert rule', 'Action group', 'Processing rule', 'Tested notification'], proof: 'Separate the alert rule from its action group, then show the query or metric and the received notification.', labIndex: 9 },
];

export function LabArchitectureTracks({ onOpenLab }: { onOpenLab: (labIndex: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const track = tracks[activeIndex];

  const selectTrack = (index: number) => {
    setActiveIndex(index);
    setExpanded(false);
  };

  return <div className={styles.tracks}>
    <header><div><p>Architecture lab companion</p><h3>See the moving parts before opening the portal</h3></div><span><Map size={16} /> Four visual routes</span></header>
    <div className={styles.chooser} role="tablist" aria-label="Architecture tracks">{tracks.map((item, index) => <button type="button" role="tab" aria-selected={index === activeIndex} key={item.title} className={index === activeIndex ? styles.active : styles.choice} onClick={() => selectTrack(index)}><b>{item.title}</b><small>{item.theme}</small></button>)}</div>
    <div className={styles.content}>
      <div className={expanded ? styles.figureExpanded : styles.figure}>{/* oxlint-disable-next-line next/no-img-element -- these are licensed diagram assets hosted at their upstream source. */}<img src={track.image} alt={track.imageAlt} /><button type="button" onClick={() => setExpanded(value => !value)} aria-pressed={expanded}><Eye size={15} /> {expanded ? 'Fit diagram' : 'Expand diagram'}</button></div>
      <div className={styles.guide}><p className={styles.theme}>{track.theme}</p><h4>{track.title}</h4><p className={styles.prompt}>{track.prompt}</p><ol>{track.flow.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol><div className={styles.proof}><Wrench size={17} /><p><b>Success check</b>{track.proof}</p></div><button type="button" className={styles.labButton} onClick={() => onOpenLab(track.labIndex)}>Open matching tenant lab <ArrowRight size={16} /></button></div>
    </div>
    <footer>Architecture images are used under the MIT license from the MicrosoftLearning AZ-104 lab repository; the explanations and tenant exercises here are original.</footer>
  </div>;
}
