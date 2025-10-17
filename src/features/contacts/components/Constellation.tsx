import React, { useEffect, useMemo, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
// @ts-ignore - no types published
import fcose from 'cytoscape-fcose';

cytoscape.use(fcose);

export type Rel = { id: string; name: string; relationshipType?: string; emotionalCloseness?: number };

type Props = {
  relationships: Rel[];
  onSelect?: (rel: Rel) => void;
};

const stylesheet: any[] = [
  { selector: 'node', style: { label: 'data(label)', color: '#fff', 'font-size': 10, 'text-valign': 'center', 'text-halign': 'center', width: 'mapData(closeness, 1, 10, 24, 56)', height: 'mapData(closeness, 1, 10, 24, 56)', 'background-color': '#88aaff', 'border-width': 2, 'border-color': 'rgba(255,255,255,0.35)' } },
  { selector: 'node[type = "Partner"], node[type = "Spouse"]', style: { 'background-color': '#f472b6' } },
  { selector: 'node[type = "Friend"]', style: { 'background-color': '#818cf8' } },
  { selector: 'node[type = "Boss"], node[type = "Manager"], node[type = "Colleague"]', style: { 'background-color': '#38bdf8' } },
  { selector: 'node[type = "Family"]', style: { 'background-color': '#34d399' } },
  { selector: 'node[type = "self"]', style: { 'background-color': '#ffffff', color: '#111827' } },
  { selector: 'edge', style: { width: 1.5, 'line-color': 'rgba(255,255,255,0.28)', 'curve-style': 'straight' } }
];

export const Constellation: React.FC<Props> = ({ relationships, onSelect }) => {
  const youId = 'you';
  const elements = useMemo(() => {
    const nodes: any[] = [{ data: { id: youId, label: 'You', type: 'self', closeness: 10 } }];
    const edges: any[] = [];
    relationships.forEach((r) => {
      nodes.push({ data: { id: `rel_${r.id}`, label: r.name, type: r.relationshipType ?? 'Friend', closeness: Math.max(1, Math.min(10, r.emotionalCloseness ?? 6)) } });
      edges.push({ data: { id: `e_${r.id}`, source: youId, target: `rel_${r.id}` } });
    });
    return [...nodes, ...edges];
  }, [relationships]);

  const cyRef = useRef<cytoscape.Core | null>(null);
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.off('tap');
    cy.on('tap', 'node', (e) => {
      const id = e.target.id();
      if (id.startsWith('rel_') && onSelect) {
        const rid = id.replace('rel_', '');
        const rel = relationships.find((r) => r.id === rid);
        if (rel) onSelect(rel);
      }
    });
  }, [relationships, onSelect]);

  const layout = { name: 'fcose', animate: false, nodeSeparation: 75 } as const;

  return (
    <div style={{ width: '100%', height: 320 }}>
      <CytoscapeComponent cy={(cy: any) => { cyRef.current = cy; }} elements={elements as any} layout={layout as any} stylesheet={stylesheet} style={{ width: '100%', height: '100%' }} wheelSensitivity={0.2} />
    </div>
  );
};

export default Constellation;

