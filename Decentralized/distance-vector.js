function bellmanFord(graph, sourceNode, destinationNode) {
  let distance = {};
  let predecessor = {};
  
  // Initialize all distances to infinity and predecessor to null
  for (let node in graph) {
    distance[node] = Infinity;
    predecessor[node] = null;
  }
  
  distance[sourceNode] = 0; // Distance to source node is 0
  
  // Relax edges repeatedly
  for (let i = 0; i < Object.keys(graph).length - 1; i++) {
    for (let node in graph) {
      for (let neighbor in graph[node]) {
        let weight = graph[node][neighbor];
        let totalDistance = distance[node] + weight;
        if (totalDistance < distance[neighbor]) {
          distance[neighbor] = totalDistance;
          predecessor[neighbor] = node;
        }
      }
    }
  }
  
  // Check for negative-weight cycles
  for (let node in graph) {
    for (let neighbor in graph[node]) {
      let weight = graph[node][neighbor];
      let totalDistance = distance[node] + weight;
      if (totalDistance < distance[neighbor]) {
        throw new Error('Negative-weight cycle detected');
      }
    }
  }
  
  // Build the shortest path
  let path = [destinationNode];
  let node = destinationNode;
  while (node !== sourceNode) {
    node = predecessor[node];
    path.unshift(node);
  }
  
  return { distance: distance[destinationNode], path: path};
}

const graph = {
    A: { B: 1, C: 4 },
    B: { A: 1, C: 4, D: 2, E: 7 },
    C: { A: 4, B: 4, D: 3, E: 5 },
    D: { B: 2, C: 3, E: 4, F: 6 },
    E: { B: 7, C: 5, D: 4, F: 7 },
    F: { D: 6, E: 7 }
  };



function submit() {

// var reloadDelay = 2000; // Delay in milliseconds
// setTimeout(function() {
//     location.reload();
// }, reloadDelay);
let path = []
let source = document.querySelector('input[name="source"]:checked');
let destination = document.querySelector('input[name="destination"]:checked');
let cost = 0;
let commaPath = "";

if (source && destination && source.value === destination.value) {
    cost = 0;
    path.push("A");
} else {
    const result = bellmanFord(graph, source.value, destination.value);
    path = result.path;
    cost = result.distance;
    commaPath = path.join(" → ")
    // alert(result.distance);
}
document.getElementById("finalcost").innerHTML = "The final cost from " + source.value + " to " + destination.value + " is " + cost;
document.getElementById("path").innerHTML = "The path from " + source.value + " to " + destination.value + " is " + commaPath;
    
    
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
