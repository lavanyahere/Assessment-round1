function buildTree(node, graph) {

    const result = {};

    const children = graph[node] || [];

    for (const child of children) {
        result[child] = buildTree(child, graph);
    }

    return result;
}

function calculateDepth(node, graph) {

    const children = graph[node] || [];

    if (children.length === 0) {
        return 1;
    }

    let maxDepth = 0;

    for (const child of children) {
        maxDepth = Math.max(
            maxDepth,
            calculateDepth(child, graph)
        );
    }

    return maxDepth + 1;
}

function hasCycle(node, graph, visited, recursionStack) {

    visited.add(node);
    recursionStack.add(node);

    const children = graph[node] || [];

    for (const child of children) {

        if (!visited.has(child)) {

            if (hasCycle(child, graph, visited, recursionStack)) {
                return true;
            }

        } else if (recursionStack.has(child)) {
            return true;
        }
    }

    recursionStack.delete(node);

    return false;
}

function processHierarchy(data) {

    const invalidEntries = [];
    const validEdges = [];

    const seenEdges = new Set();
    const duplicateEdges = new Set();
    const childParentMap = new Map();

    for (let entry of data) {

        entry = entry.trim();

        const regex = /^[A-Z]->[A-Z]$/;

        if (!regex.test(entry)) {
            invalidEntries.push(entry);
            continue;
        }

        const [parent, child] = entry.split("->");

        if (parent === child) {
            invalidEntries.push(entry);
            continue;
        }

        if (seenEdges.has(entry)) {
            duplicateEdges.add(entry);
            continue;
        }

        if (childParentMap.has(child)) {
            continue;
        }

        childParentMap.set(child, parent);

        seenEdges.add(entry);
        validEdges.push(entry);
    }

    const graph = {};
    const allNodes = new Set();
    const childNodes = new Set();

    for (const edge of validEdges) {

        const [parent, child] = edge.split("->");

        if (!graph[parent]) {
            graph[parent] = [];
        }

        graph[parent].push(child);

        allNodes.add(parent);
        allNodes.add(child);

        childNodes.add(child);
    }

    const roots = [];

    for (const node of allNodes) {
        if (!childNodes.has(node)) {
            roots.push(node);
        }
    }

    const visited = new Set();
    const recursionStack = new Set();

    let cycleExists = false;

    for (const node of allNodes) {

        if (!visited.has(node)) {

            if (
                hasCycle(
                    node,
                    graph,
                    visited,
                    recursionStack
                )
            ) {
                cycleExists = true;
            }
        }
    }

    const hierarchies = [];

    if (cycleExists) {

        let cycleRoot;

        if (roots.length > 0) {
            cycleRoot = roots.sort()[0];
        } else {
            cycleRoot = [...allNodes].sort()[0];
        }

        hierarchies.push({
            root: cycleRoot,
            tree: {},
            has_cycle: true
        });

    } else {

        for (const root of roots) {

            const tree = {};

            tree[root] = buildTree(root, graph);

            const depth = calculateDepth(root, graph);

            hierarchies.push({
                root,
                tree,
                depth
            });
        }
    }

    let largestTreeRoot = "";
    let maxDepth = -1;

    for (const hierarchy of hierarchies) {

        if (hierarchy.has_cycle) {
            continue;
        }

        if (
            hierarchy.depth > maxDepth ||
            (
                hierarchy.depth === maxDepth &&
                hierarchy.root < largestTreeRoot
            )
        ) {
            maxDepth = hierarchy.depth;
            largestTreeRoot = hierarchy.root;
        }
    }

    return {
        user_id: "lavanayagoyal_01102004",

        email_id:
            "lavanaya0642.be23@chitkara.edu.in",

        college_roll_number:
            "2310990642",

        hierarchies,

        invalid_entries: invalidEntries,

        duplicate_edges: [...duplicateEdges],

        summary: {
            total_trees:
                hierarchies.filter(
                    h => !h.has_cycle
                ).length,

            total_cycles:
                hierarchies.filter(
                    h => h.has_cycle
                ).length,

            largest_tree_root:
                largestTreeRoot
        }
    };
}

module.exports = processHierarchy;