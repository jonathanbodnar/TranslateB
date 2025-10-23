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
  { 
    selector: 'node', 
    style: { 
      label: 'data(label)', 
      color: '#ffffff', 
      'font-size': 12, 
      'font-weight': 600,
      'text-valign': 'center', 
      'text-halign': 'center',
      'text-outline-color': 'rgba(0,0,0,0.6)',
      'text-outline-width': 2,
      width: 'mapData(closeness, 1, 10, 32, 64)', 
      height: 'mapData(closeness, 1, 10, 32, 64)', 
      'background-color': '#818cf8',
      'border-width': 3, 
      'border-color': 'rgba(255,255,255,0.5)',
      'transition-property': 'background-color, border-color, border-width',
      'transition-duration': '0.3s',
      'box-shadow': '0 4px 20px rgba(0,0,0,0.3)'
    } 
  },
  { 
    selector: 'node:active', 
    style: { 
      'overlay-color': '#9333ea',
      'overlay-opacity': 0.2,
      'overlay-padding': 8
    } 
  },
  { 
    selector: 'node[type = "Partner"], node[type = "Spouse"]', 
    style: { 
      'background-color': '#ec4899',
      'border-color': '#fce7f3'
    } 
  },
  { 
    selector: 'node[type = "Friend"]', 
    style: { 
      'background-color': '#818cf8',
      'border-color': '#e0e7ff'
    } 
  },
  { 
    selector: 'node[type = "Boss"], node[type = "Manager"], node[type = "Colleague"]', 
    style: { 
      'background-color': '#06b6d4',
      'border-color': '#cffafe'
    } 
  },
  { 
    selector: 'node[type = "Family"]', 
    style: { 
      'background-color': '#10b981',
      'border-color': '#d1fae5'
    } 
  },
  { 
    selector: 'node[type = "self"]', 
    style: { 
      'background-color': '#ffffff', 
      'background-image': 'radial-gradient(circle, #9333ea 0%, #ec4899 100%)',
      color: '#ffffff',
      'border-width': 4,
      'border-color': '#fbbf24',
      'font-size': 14,
      'font-weight': 700,
      'box-shadow': '0 8px 32px rgba(147,51,234,0.5)'
    } 
  },
  { 
    selector: 'edge', 
    style: { 
      width: 2, 
      'line-color': 'rgba(255,255,255,0.15)',
      'curve-style': 'bezier',
      'line-style': 'solid',
      'line-cap': 'round',
      'opacity': 0.7
    } 
  }
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
    cy.off('mouseover');
    cy.off('mouseout');
    
    // Click handler
    cy.on('tap', 'node', (e) => {
      const id = e.target.id();
      if (id.startsWith('rel_') && onSelect) {
        const rid = id.replace('rel_', '');
        const rel = relationships.find((r) => r.id === rid);
        if (rel) onSelect(rel);
      }
    });
    
    // Hover effects
    cy.on('mouseover', 'node', (e) => {
      const node = e.target;
      if (node.id() !== 'you') {
        node.style({
          'border-width': 5,
          'border-color': '#ffffff'
        });
      }
    });
    
    cy.on('mouseout', 'node', (e) => {
      const node = e.target;
      if (node.id() !== 'you') {
        node.style({
          'border-width': 3,
          'border-color': 'rgba(255,255,255,0.5)'
        });
      }
    });
  }, [relationships, onSelect]);

  const layout = { 
    name: 'fcose', 
    animate: true, 
    animationDuration: 500,
    animationEasing: 'ease-out',
    nodeSeparation: 90,
    nodeRepulsion: 4500,
    idealEdgeLength: 100,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    gravity: 0.25,
    numIter: 2500,
    tile: true,
    tilingPaddingVertical: 10,
    tilingPaddingHorizontal: 10,
    gravityRangeCompound: 1.5,
    gravityCompound: 1.0,
    gravityRange: 3.8
  } as const;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-white/10" style={{ height: 400 }}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />
      
      {/* Constellation visualization - contained */}
      <div className="absolute inset-0">
        <CytoscapeComponent 
          cy={(cy: any) => { 
            cyRef.current = cy;
            // Fit to container on load
            if (cy) {
              cy.fit(undefined, 50); // 50px padding
            }
          }} 
          elements={elements as any} 
          layout={layout as any} 
          stylesheet={stylesheet} 
          style={{ width: '100%', height: '100%' }} 
          wheelSensitivity={0.15}
          minZoom={0.3}
          maxZoom={2}
          autoungrabify={false}
          autounselectify={false}
          boxSelectionEnabled={false}
        />
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-card p-3 text-xs pointer-events-auto z-10">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-yellow-400 flex-shrink-0"></div>
            <span className="text-white/80 whitespace-nowrap">You</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#ec4899' }}></div>
            <span className="text-white/80 whitespace-nowrap">Partner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-white/80 whitespace-nowrap">Family</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#818cf8' }}></div>
            <span className="text-white/80 whitespace-nowrap">Friend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#06b6d4' }}></div>
            <span className="text-white/80 whitespace-nowrap">Work</span>
          </div>
        </div>
      </div>
      
      {/* Interaction hint */}
      <div className="absolute top-4 right-4 glass-card p-2 px-3 text-xs text-white/60 pointer-events-auto z-10">
        Click to view • Scroll to zoom • Drag to pan
      </div>
    </div>
  );
};

export default Constellation;

