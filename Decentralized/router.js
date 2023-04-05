class Node {
    constructor(name) {
      this.name = name;
      this.connections = new Map();
    }
  }
  
  class Graph {
    constructor() {
      this.nodes = new Map();
    }
  
    addNode(name) {
      const node = new Node(name);
      this.nodes.set(name, node);
    }
  
    addConnection(node1, node2, distance) {
      const n1 = this.nodes.get(node1);
      const n2 = this.nodes.get(node2);
      n1.connections.set(node2, distance);
      n2.connections.set(node1, distance);
    }
  
    getShortestPaths(startNode) {
      const distances = new Map();
      const visited = new Set();
      const queue = [startNode];
  
      // Initialize distances to Infinity for all nodes except startNode, which has distance 0
      for (const node of this.nodes.values()) {
        distances.set(node.name, node === startNode ? 0 : Infinity);
      }
  
      while (queue.length > 0) {
        const currentNode = queue.shift();
        visited.add(currentNode);
  
        // Update distances to neighboring nodes
        for (const [nodeName, distance] of currentNode.connections) {
          const node = this.nodes.get(nodeName);
          if (!visited.has(node)) {
            const newDistance = distances.get(currentNode.name) + distance;
            if (newDistance < distances.get(nodeName)) {
              distances.set(nodeName, newDistance);
            }
            if (!queue.includes(node)) {
              queue.push(node);
            }
          }
        }
      }
  
      return distances;
    }
  }
  
  // Create a new graph
  const graph = new Graph();
  
  // Add nodes to the graph
  graph.addNode("A");
  graph.addNode("B");
  graph.addNode("C");
  graph.addNode("D");
  
  // Add connections to the graph, with distances
  graph.addConnection("A", "B", 3);
  graph.addConnection("B", "C", 2);
  graph.addConnection("C", "D", Infinity);
  graph.addConnection("D", "A", Infinity);
  
  // Calculate shortest paths from node A
  const shortestPathsFromA = graph.getShortestPaths(graph.nodes.get("A"));
  console.log("Distances from node A:");
  for (const [nodeName, distance] of shortestPathsFromA) {
    console.log(`  ${nodeName}: ${distance === Infinity ? "Infinity" : distance}`);
  }
  
  // Calculate shortest paths from node B
  const shortestPathsFromB = graph.getShortestPaths(graph.nodes.get("B"));
  console.log("Distances from node B:");
  for (const [nodeName, distance] of shortestPathsFromB) {
    console.log(`  ${nodeName}: ${distance === Infinity ? "Infinity" : distance}`);
  }
  
  // Calculate shortest paths from node C
  const shortestPathsFromC = graph.getShortestPaths(graph.nodes.get("C"));
  console.log("Distances from node C:");
  for (const [nodeName, distance] of shortestPathsFromC) {
    console.log(`  ${nodeName}: ${distance === Infinity ? "Infinity" : distance}`);
  }
  
  // Calculate shortest paths from node D
  const shortestPathsFromD = graph.getShortestPaths(graph.nodes.get("D"));
  console.log("Distances from node D:");
  for (const [nodeName, distance] of shortestPathsFromD) {
    console.log(`  ${nodeName}: ${distance === Infinity ? "Infinity" : distance}`);
  }