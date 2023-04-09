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
    let router = new Router(name);
    this.routers.set(name, router);
  }

  addConnection(router1, router2, distance) {
    let n1 = this.routers.get(router1);
    let n2 = this.routers.get(router2);
    n1.connections.set(router2, distance);
    n2.connections.set(router1, distance);
  }

  getShortestPaths(startRouter) {

    // gsap.registerEffect({
    //   name: "swapText",
    //   effect: (targets, config) => {
    //     let tl = gsap.timeline({delay: config.delay});
    //     tl.to(targets, {opacity: 0, duration: config.duration / 2});
    //     tl.add(() => targets[0].innerHTML = config.text);
    //     tl.to(targets, {opacity: 1, duration: config.duration});
    //     return tl;
    //   },
    //   defaults: {duration: 1}, 
    //   extendTimeline: true
    // });

    // gsap.registerEffect({
    //   name: "text",
    //   effect: (targets, config) => {
    //     let tl = gsap.timeline({delay: config.delay});
    //     tl.to(targets, {opacity: 0, duration: config.duration / 2});
    //     tl.add(() => targets[0].innerHTML = config.text);
    //     tl.to(targets, {opacity: 1, duration: config.duration});
    //     return tl;
    //   },
    //   defaults: {duration: 0}, 
    //   extendTimeline: true
    // });

    // gsap.effects.swapText('#TDV'+ startRouter, {text:'0'});
    // gsap.effects.swapText('#TPV' + startRouter, {text:'0'});
    // gsap.effects.swapText("#SourceNode" , {text: startRouter });

    let distances = new Map();
    let visited = new Set();
    let queue = [startRouter];
  
    // Initialize distances to Infinity for all routers except startRouter and unconnected routers
    for (let router of this.routers.values()) {
      if (router === startRouter || router.connections.has(startRouter.name)) {
        distances.set(router.name, router === startRouter ? 0 : Infinity);
      } else {
        distances.set(router.name, Infinity);
      }
    }
  
    while (queue.length > 0) {
      let currentrouter = queue.shift();
      visited.add(currentrouter);
  
      // Update distances to neighboring routers
      for (let [routerName, distance] of currentrouter.connections) {
        let router = this.routers.get(routerName);
        if (!visited.has(router)) {
          let newDistance = distances.get(currentrouter.name) + distance;
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
let graph = new Graph();

// Add routers to the graph
graph.addRouter("A");
graph.addRouter("B");
graph.addRouter("C");
graph.addRouter("D");
graph.addRouter("E");
graph.addRouter("F");

// Add connections to the graph, with distances
graph.addConnection("A", "B", 1);
graph.addConnection("A", "C", 4);
graph.addConnection("A", "D", Infinity);
graph.addConnection("A", "E", Infinity);
graph.addConnection("A", "F", Infinity);

graph.addConnection("B", "E", 7);
graph.addConnection("B", "D", 2);
graph.addConnection("B", "C", 4);
graph.addConnection("B", "F", Infinity);

graph.addConnection("C", "E", 5);
graph.addConnection("C", "D", 3);
graph.addConnection("C", "F", Infinity);

graph.addConnection("D", "E", 4);
graph.addConnection("D", "F", 6);

graph.addConnection("E", "F", 7);

function submit() {
  console.log("ABC");
  let radioOption = document.querySelector('input[type = radio]:checked').value;
  let shortestPathsFromA = graph.getShortestPaths(graph.routers.get(radioOption));
  console.log("Distances from router A:");
  for (let [routerName, distance] of shortestPathsFromA) {
    console.log(`  ${routerName}: ${distance === Infinity ? "Infinity" : distance}`);

    // -------------------- text ------------
    let myDiv = document.getElementById("des");
    myDiv.textContent = `Router ${radioOption} Final Routing Table`;

    // -------------------- table -----------
    let distances = graph.getShortestPaths(graph.routers.get(radioOption));
    
    // Select the table div container and remove any existing tables
    let tableDiv = document.getElementById("table-div");
    while (tableDiv.firstChild) {
      tableDiv.removeChild(tableDiv.firstChild);
    }

    // Create a new table and append it to the table div container
    let table = document.createElement("table");
    tableDiv.appendChild(table);

    // Create table header row
    let headerRow = table.insertRow();
    let headerRouterName = headerRow.insertCell();
    headerRouterName.textContent = "Router Name";
    let headerDistance = headerRow.insertCell();
    headerDistance.textContent = "Distance";

    // Add data rows to the table
    for (let [routerName, distance] of distances.entries()) {
      let row = table.insertRow();
      let routerNameCell = row.insertCell();
      routerNameCell.textContent = routerName;
      let distanceCell = row.insertCell();
      distanceCell.textContent = distance === Infinity ? "Unreachable" : distance;
    }
  }

}