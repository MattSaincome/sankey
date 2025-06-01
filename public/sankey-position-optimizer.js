// Sankey Position Optimizer
// Calculates collision-free positions for all sankey elements before rendering

(function() {
    'use strict';
    
    class SankeyPositionOptimizer {
        constructor() {
            this.padding = {
                rect: 2,
                text: 3,
                textToText: 1,
                path: 2
            };
            this.maxMovement = 25;
            this.minOverlap = 2;
        }
        
        // Main optimization function - called by d3-sankey before rendering
        optimizeLayout(nodes, links, width, height) {
            console.log('[Position Optimizer] Starting layout optimization...');
            console.log(`[Position Optimizer] Nodes: ${nodes.length}, Links: ${links.length}`);
            
            // Step 1: Calculate text dimensions for all nodes
            this.calculateTextDimensions(nodes);
            
            // Step 2: Predict header positions
            const headers = this.predictHeaders(nodes, width);
            
            // Step 3: Create boundary boxes for all elements
            const elements = this.createElements(nodes, links, headers);
            
            // Step 4: Detect potential collisions
            const collisions = this.detectCollisions(elements);
            
            // Step 5: Resolve collisions by adjusting positions
            if (collisions.length > 0) {
                console.log(`[Position Optimizer] Found ${collisions.length} potential collisions`);
                this.resolveCollisions(collisions, elements, nodes, links);
            } else {
                console.log('[Position Optimizer] No collisions detected');
            }
            
            // Return optimized layout
            return { nodes, links };
        }
        
        // Calculate text dimensions for each node
        calculateTextDimensions(nodes) {
            // Create temporary SVG for text measurement
            const svg = d3.select('body').append('svg')
                .style('position', 'absolute')
                .style('visibility', 'hidden');
                
            nodes.forEach(node => {
                // Main label
                const mainText = svg.append('text')
                    .style('font-size', '14px')
                    .style('font-family', 'Arial, sans-serif')
                    .text(node.name || '');
                const mainBBox = mainText.node().getBBox();
                
                // Value label
                const valueText = svg.append('text')
                    .style('font-size', '14px')
                    .style('font-family', 'Arial, sans-serif')
                    .text(node.displayValue || `$${(node.value / 1e9).toFixed(1)}B`);
                const valueBBox = valueText.node().getBBox();
                
                // YoY label
                const yoyText = svg.append('text')
                    .style('font-size', '12px')
                    .style('font-family', 'Arial, sans-serif')
                    .text(node.yoyDisplay || '');
                const yoyBBox = yoyText.node().getBBox();
                
                // Store dimensions
                node.textDimensions = {
                    main: { width: mainBBox.width, height: mainBBox.height },
                    value: { width: valueBBox.width, height: valueBBox.height },
                    yoy: { width: yoyBBox.width, height: yoyBBox.height },
                    totalHeight: mainBBox.height + valueBBox.height + (node.yoyDisplay ? yoyBBox.height : 0)
                };
                
                mainText.remove();
                valueText.remove();
                yoyText.remove();
            });
            
            svg.remove();
        }
        
        // Predict header positions
        predictHeaders(nodes, width) {
            const headers = [];
            const columns = [...new Set(nodes.map(n => n.x0))].sort((a, b) => a - b);
            
            columns.forEach((x, i) => {
                const columnNodes = nodes.filter(n => n.x0 === x);
                const headerText = this.getHeaderText(i);
                
                headers.push({
                    type: 'header',
                    text: headerText,
                    x: x + 50, // Approximate center
                    y: 20,     // Top position
                    width: 100, // Approximate width
                    height: 20  // Approximate height
                });
            });
            
            return headers;
        }
        
        // Get header text based on column index
        getHeaderText(columnIndex) {
            const headerTexts = ['Revenue', 'Gross Profit', 'Operating Income', 'Income Before Taxes', 'Net Income'];
            return headerTexts[columnIndex] || '';
        }
        
        // Create element objects with boundary boxes
        createElements(nodes, links, headers) {
            const elements = [];
            
            // Add headers
            headers.forEach((header, i) => {
                elements.push({
                    type: 'header',
                    id: `header-${i}`,
                    bbox: {
                        x: header.x - header.width / 2 - this.padding.text,
                        y: header.y - this.padding.text,
                        width: header.width + 2 * this.padding.text,
                        height: header.height + 2 * this.padding.text
                    },
                    data: header,
                    moveable: true
                });
            });
            
            // Add nodes (rectangles)
            nodes.forEach((node, i) => {
                elements.push({
                    type: 'rect',
                    id: `rect-${i}`,
                    bbox: {
                        x: node.x0 - this.padding.rect,
                        y: node.y0 - this.padding.rect,
                        width: (node.x1 - node.x0) + 2 * this.padding.rect,
                        height: (node.y1 - node.y0) + 2 * this.padding.rect
                    },
                    data: node,
                    moveable: true
                });
                
                // Add node labels (positioned to the right)
                const labelX = node.x1 + 5;
                const labelY = node.y0 + (node.y1 - node.y0) / 2;
                
                if (node.textDimensions) {
                    elements.push({
                        type: 'text',
                        id: `text-${i}`,
                        relatedTo: `rect-${i}`,
                        bbox: {
                            x: labelX - this.padding.text,
                            y: labelY - node.textDimensions.totalHeight / 2 - this.padding.text,
                            width: Math.max(node.textDimensions.main.width, node.textDimensions.value.width) + 2 * this.padding.text,
                            height: node.textDimensions.totalHeight + 2 * this.padding.text
                        },
                        data: { node, x: labelX, y: labelY },
                        moveable: false // Labels move with their rectangles
                    });
                }
            });
            
            // Add paths
            links.forEach((link, i) => {
                // Calculate path bounding box (approximate)
                const sx = link.source.x1;
                const sy = link.y0 !== undefined ? link.source.y0 + link.y0 : link.source.y0;
                const tx = link.target.x0;
                const ty = link.y1 !== undefined ? link.target.y0 + link.y1 : link.target.y0;
                
                elements.push({
                    type: 'path',
                    id: `path-${i}`,
                    bbox: {
                        x: Math.min(sx, tx) - this.padding.path,
                        y: Math.min(sy, ty) - this.padding.path,
                        width: Math.abs(tx - sx) + 2 * this.padding.path,
                        height: Math.abs(ty - sy) + link.width + 2 * this.padding.path
                    },
                    data: link,
                    source: nodes.indexOf(link.source),
                    target: nodes.indexOf(link.target),
                    moveable: false // Paths follow their nodes
                });
            });
            
            return elements;
        }
        
        // Detect collisions between elements
        detectCollisions(elements) {
            const collisions = [];
            
            for (let i = 0; i < elements.length; i++) {
                for (let j = i + 1; j < elements.length; j++) {
                    const elem1 = elements[i];
                    const elem2 = elements[j];
                    
                    // Skip allowed collisions
                    if (this.isCollisionAllowed(elem1, elem2)) {
                        continue;
                    }
                    
                    // Apply dynamic padding for text-to-text collisions
                    let box1 = elem1.bbox;
                    let box2 = elem2.bbox;
                    
                    if (elem1.type === 'text' && elem2.type === 'text') {
                        // Use reduced padding for text-to-text
                        const reducedPadding = this.padding.text - this.padding.textToText;
                        box1 = {
                            x: box1.x + reducedPadding,
                            y: box1.y + reducedPadding,
                            width: box1.width - 2 * reducedPadding,
                            height: box1.height - 2 * reducedPadding
                        };
                        box2 = {
                            x: box2.x + reducedPadding,
                            y: box2.y + reducedPadding,
                            width: box2.width - 2 * reducedPadding,
                            height: box2.height - 2 * reducedPadding
                        };
                    }
                    
                    const overlap = this.calculateOverlap(box1, box2);
                    if (overlap >= this.minOverlap) {
                        collisions.push({
                            elem1: elem1,
                            elem2: elem2,
                            overlap: overlap
                        });
                    }
                }
            }
            
            return collisions;
        }
        
        // Check if collision between two elements is allowed
        isCollisionAllowed(elem1, elem2) {
            // Paths can touch their connected rectangles
            if (elem1.type === 'path' && elem2.type === 'rect') {
                return elem1.source === elem2.id || elem1.target === elem2.id;
            }
            if (elem2.type === 'path' && elem1.type === 'rect') {
                return elem2.source === elem1.id || elem2.target === elem1.id;
            }
            
            // Text can stay with its related rectangle
            if (elem1.type === 'text' && elem2.type === 'rect' && elem1.relatedTo === elem2.id) {
                return true;
            }
            if (elem2.type === 'text' && elem1.type === 'rect' && elem2.relatedTo === elem1.id) {
                return true;
            }
            
            return false;
        }
        
        // Calculate overlap between two boxes
        calculateOverlap(box1, box2) {
            const xOverlap = Math.max(0, Math.min(box1.x + box1.width, box2.x + box2.width) - Math.max(box1.x, box2.x));
            const yOverlap = Math.max(0, Math.min(box1.y + box1.height, box2.y + box2.height) - Math.max(box1.y, box2.y));
            return Math.min(xOverlap, yOverlap);
        }
        
        // Resolve collisions by adjusting positions
        resolveCollisions(collisions, elements, nodes, links) {
            console.log('[Position Optimizer] Resolving collisions...');
            
            // Group collisions by moveable element
            const elementCollisions = new Map();
            
            collisions.forEach(collision => {
                if (collision.elem1.moveable) {
                    if (!elementCollisions.has(collision.elem1.id)) {
                        elementCollisions.set(collision.elem1.id, []);
                    }
                    elementCollisions.get(collision.elem1.id).push(collision);
                }
                if (collision.elem2.moveable) {
                    if (!elementCollisions.has(collision.elem2.id)) {
                        elementCollisions.set(collision.elem2.id, []);
                    }
                    elementCollisions.get(collision.elem2.id).push(collision);
                }
            });
            
            // Process each element's collisions
            const processed = new Set();
            
            for (const [elementId, elementCollisions] of elementCollisions) {
                const element = elements.find(e => e.id === elementId);
                if (!element || !element.moveable) continue;
                
                let totalMovement = 0;
                
                for (const collision of elementCollisions) {
                    const other = collision.elem1.id === elementId ? collision.elem2 : collision.elem1;
                    
                    // Skip if already processed this pair
                    const pairKey = [elementId, other.id].sort().join('-');
                    if (processed.has(pairKey)) continue;
                    processed.add(pairKey);
                    
                    // Calculate movement needed
                    const movement = this.calculateMovement(element, other, collision.overlap);
                    
                    // Apply movement (vertical only)
                    if (Math.abs(movement.y) > Math.abs(totalMovement)) {
                        totalMovement = movement.y;
                    }
                }
                
                // Limit movement
                totalMovement = Math.sign(totalMovement) * Math.min(Math.abs(totalMovement), this.maxMovement);
                
                // Apply movement to data
                if (totalMovement !== 0) {
                    this.applyMovement(element, totalMovement, elements, nodes, links);
                    console.log(`[Position Optimizer] Moving ${elementId} by ${totalMovement}px`);
                }
            }
        }
        
        // Calculate movement needed to resolve collision
        calculateMovement(elem1, elem2, overlap) {
            // Move vertically to resolve collision
            const box1 = elem1.bbox;
            const box2 = elem2.bbox;
            
            // Determine direction based on current positions
            const elem1Center = box1.y + box1.height / 2;
            const elem2Center = box2.y + box2.height / 2;
            
            const moveUp = elem1Center > elem2Center;
            const movement = moveUp ? -overlap : overlap;
            
            return { x: 0, y: movement };
        }
        
        // Apply movement to element and its data
        applyMovement(element, yMovement, elements, nodes, links) {
            // Update bounding box
            element.bbox.y += yMovement;
            
            // Update actual data based on element type
            if (element.type === 'rect' && element.data) {
                // Update node position
                element.data.y0 += yMovement;
                element.data.y1 += yMovement;
                
                // Update related text elements
                elements.forEach(e => {
                    if (e.relatedTo === element.id) {
                        e.bbox.y += yMovement;
                        if (e.data) {
                            e.data.y += yMovement;
                        }
                    }
                });
                
                // Update connected paths
                links.forEach(link => {
                    if (link.source === element.data) {
                        // This is a source node, update link's sy
                        if (link.sy !== undefined) {
                            link.sy += yMovement;
                        }
                    }
                    if (link.target === element.data) {
                        // This is a target node, update link's ty
                        if (link.ty !== undefined) {
                            link.ty += yMovement;
                        }
                    }
                });
            } else if (element.type === 'header') {
                // Update header position
                element.data.y += yMovement;
            }
        }
    }
    
    // Export optimizer
    window.SankeyPositionOptimizer = SankeyPositionOptimizer;
})();
