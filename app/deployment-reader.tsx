'use client';

import { Braces, CheckCircle2, Eye, Network, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import styles from './deployment-reader.module.css';

const checks = [
  { label: 'Start with the input', question: 'What does the template need before it can name the VNet?', answer: 'A value for the string parameter virtualNetworks_ManufacturingVnet_name. The accompanying parameter file leaves it null, so the deployer must supply a valid name.' },
  { label: 'Find the parent resource', question: 'Which declared resource owns SensorSubnet1 and SensorSubnet2?', answer: 'The Microsoft.Network/virtualNetworks resource. The subnet declarations are child resources, identified by a combined VNet/subnet name.' },
  { label: 'Predict the outcome', question: 'What will be created when a valid VNet name is supplied?', answer: 'One virtual network plus SensorSubnet1 and SensorSubnet2. The exact address ranges and settings are properties to inspect before deploying.' },
];

export function DeploymentReader({ onOpenLab }: { onOpenLab: (labIndex: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const check = checks[activeIndex];

  const choose = (index: number) => {
    setActiveIndex(index);
    setShowAnswer(false);
  };

  return <div className={styles.reader}>
    <div className={styles.intro}><div className={styles.icon}><Braces size={22} /></div><div><h3>Read a deployment before you run it</h3><p>This safe mini-drill is built from the VNet template you added. It practices the pattern AZ-104 expects: inputs → parent resource → child resources → predictable result.</p></div></div>
    <div className={styles.workspace}>
      <div className={styles.template} aria-label="Simplified ARM template anatomy"><div className={styles.codeTop}><span>template.json</span><span>ARM JSON</span></div><pre><code><em>parameters</em> {'{'}
  <strong>virtualNetworks_ManufacturingVnet_name</strong>: string
{'}'}

<em>resources</em> {'['}
  Microsoft.Network/<strong>virtualNetworks</strong>
  Microsoft.Network/<strong>virtualNetworks/subnets</strong>
  Microsoft.Network/<strong>virtualNetworks/subnets</strong>
{']'}</code></pre><div className={styles.resourceMap}><span><Network size={15} /> VNet</span><i>owns</i><span>SensorSubnet1</span><span>SensorSubnet2</span></div></div>
      <div className={styles.challenge}><p className={styles.label}>Reading check {activeIndex + 1} of {checks.length}</p><h4>{check.label}</h4><p>{check.question}</p><button type="button" className={styles.reveal} onClick={() => setShowAnswer(value => !value)}>{showAnswer ? <><Eye size={16} /> Hide answer</> : <><CheckCircle2 size={16} /> Reveal answer</>}</button>{showAnswer && <div className={styles.answer}><b>Answer</b><p>{check.answer}</p></div>}<div className={styles.checks}>{checks.map((item, index) => <button type="button" key={item.label} aria-label={`Open ${item.label}`} aria-pressed={index === activeIndex} className={index === activeIndex ? styles.checkActive : styles.check} onClick={() => choose(index)}>{index + 1}</button>)}</div></div>
    </div>
    <footer><p><RotateCcw size={15} /> Never copy real passwords, keys, or production values into a template or parameter file.</p><button type="button" onClick={() => onOpenLab(4)}>Practice in Bicep lab</button></footer>
  </div>;
}
