class Router {
  constructor(name) {
    this.name = name;
    this.connections = new Map();
  }
}

class Graph {
  constructor() {
    this.routers = new Map();
  }

  addRouter(name) {
    const router = new router(name);
    this.routers.set(name, router);
  }

  addConnection(router1, router2, distance) {
    const n1 = this.routers.get(router1);
    const n2 = this.routers.get(router2);
    n1.connections.set(router2, distance);
    n2.connections.set(router1, distance);
  }

  getShortestPaths(startrouter) {
    const distances = new Map();
    const visited = new Set();
    const queue = [startrouter];

    // Initialize distances to Infinity for all routers except startrouter, which has distance 0
    for (const router of this.routers.values()) {
      distances.set(router.name, router === startrouter ? 0 : Infinity);
    }

    while (queue.length > 0) {
      const currentrouter = queue.shift();
      visited.add(currentrouter);

      // Update distances to neighboring routers
      for (const [routerName, distance] of currentrouter.connections) {
        const router = this.routers.get(routerName);
        if (!visited.has(router)) {
          const newDistance = distances.get(currentrouter.name) + distance;
          if (newDistance < distances.get(routerName)) {
            distances.set(routerName, newDistance);
          }
          if (!queue.includes(router)) {
            queue.push(router);
          }
        }
      }
    }

    return distances;
  }
}

// Create a new graph
const graph = new Graph();

// Add routers to the graph
graph.addRouter("A");
graph.addRouter("B");
graph.addRouter("C");
graph.addRouter("D");

// Add connections to the graph, with distances
graph.addConnection("A", "B", 3);
graph.addConnection("B", "C", 2);
graph.addConnection("C", "D", Infinity);
graph.addConnection("D", "A", Infinity);

// Calculate shortest paths from router A
const shortestPathsFromA = graph.getShortestPaths(graph.routers.get("A"));
console.log("Distances from router A:");
for (const [routerName, distance] of shortestPathsFromA) {
  console.log(`  ${routerName}: ${distance === Infinity ? "Infinity" : distance}`);
}

// Calculate shortest paths from router B
const shortestPathsFromB = graph.getShortestPaths(graph.routers.get("B"));
console.log("Distances from router B:");
for (const [routerName, distance] of shortestPathsFromB) {
  console.log(`  ${routerName}: ${distance === Infinity ? "Infinity" : distance}`);
}

// Calculate shortest paths from router C
const shortestPathsFromC = graph.getShortestPaths(graph.routers.get("C"));
console.log("Distances from router C:");
for (const [routerName, distance] of shortestPathsFromC) {
  console.log(`  ${routerName}: ${distance === Infinity ? "Infinity" : distance}`);
}

// Calculate shortest paths from router D
const shortestPathsFromD = graph.getShortestPaths(graph.routers.get("D"));
console.log("Distances from router D:");
for (const [routerName, distance] of shortestPathsFromD) {
  console.log(`  ${routerName}: ${distance === Infinity ? "Infinity" : distance}`);
}