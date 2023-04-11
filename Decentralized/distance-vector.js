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
  
const lines = document.querySelectorAll('.line');
lines.forEach(line => line.setAttribute('stroke', "#00527F"));

let path = []
let source = document.querySelector('input[name="source"]:checked');
let destination = document.querySelector('input[name="destination"]:checked');
let sourceP = document.querySelectorAll('input[type="radio"][name="source"]');
let destinationP = document.querySelectorAll('input[type="radio"][name="destination"]');
let cost = 0;
let commaPath = "";
let sourceSelected = false;
let destinationSelected = false;

for (let i = 0; i < sourceP.length; i++) {
  if (sourceP[i].checked) {
    sourceSelected = true;
    break;
  }
}

for (let i = 0; i < destinationP.length; i++) {
  if (destinationP[i].checked) {
    destinationSelected = true;
    break;
  }
}

if (!sourceSelected && !destinationSelected) {
    alert("Please choose a source and destination router!");
} else if (!sourceSelected) {
    alert("Please choose a source router!");
} else if (!destinationSelected) {
    alert("Please choose a destination router!");
} else {
    if (source && destination && source.value === destination.value) {
        cost = 0;
        path.push("A");
    }
    else {
        const result = bellmanFord(graph, source.value, destination.value);
        path = result.path;
        cost = result.distance;
        commaPath = path.join(" → ")
    }

    document.getElementById("finalcost").innerHTML = "The final cost from " + source.value + " to " + destination.value + " is " + cost;
    document.getElementById("path").innerHTML = "The path from " + source.value + " to " + destination.value + " is " + commaPath;
}


for (var i = 0; i<path.length-1; i++ )
{
  try {
      (function (i) {
          setTimeout(function () {
              var element = document.getElementById(path[i] + path[i + 1]);
              if (element) {
                element.setAttribute('stroke', '#b00f0c');
              } else {
                var element = document.getElementById(path[i+1] + path[i]);
                element.setAttribute('stroke', '#b00f0c');
              }      
          }, i * 250);
      })(i);
  }
  catch(err) {
    (function (i) {
        setTimeout(function () {
            var element = document.getElementById(path[i+1] + path[i]);
            element.setAttribute('stroke', '#b00f0c');
        }, i * 250);
    })(i);
  }
}

     
// -------------------- table -----------
let des = document.getElementById("des");
des.textContent = `Router ${source.value} Routing Table`;

let desT = document.getElementById("desT");
desT.textContent = `It needed to go to ${destination.value}, so it looked at the routing table for that node.`;

let desTT = document.getElementById("desTT");
desTT.textContent = `Then went accordingly given the cost at ${destination.value}.`;
    
let nodes = ["A", "B", "C", "D", "E", "F"];
let table_div = document.getElementById("table-div");
let table = document.createElement("table");
while (table_div.firstChild) {
    table_div.removeChild(table_div.firstChild);
}
table_div.appendChild(table);
let headerRow = table.insertRow(0);
let headerCell1 = headerRow.insertCell(0);
let headerCell2 = headerRow.insertCell(1);
headerCell1.innerHTML = "Node";
headerCell2.innerHTML = "Cost";

for (let i = 0; i < nodes.length; i++)
{   
    let totalCost = 0;
    if (source.value == nodes[i]) {
        totalCost = 0;
    } else {
        totalCost = bellmanFord(graph, source.value, nodes[i]).distance;
    }
    let nRow = table.insertRow(-1);
    let cellOne = nRow.insertCell(0);
    let cellTwo = nRow.insertCell(1);

    cellOne.innerHTML = nodes[i];
    cellTwo.innerHTML = totalCost;

    if (nodes[i] == destination.value) {
        cellOne.style.backgroundColor = "maroon";
        cellOne.style.color = "white";
        cellTwo.style.backgroundColor = "maroon";
        cellTwo.style.color = "white";
      }
}
    

}
