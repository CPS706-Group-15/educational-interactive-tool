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

// graphs data structure
const optionTwo = { 
  A: { B: 3}, 
  B: { A:  3}
};

const optionThree = { 
  A: { B: 4, C: 2}, 
  B: { A: 4, C: 6}, 
  C: { A: 2, B: 6} 
};

const optionFour = { 
  A: { B: 1, C: 4}, 
  B: { A: 1, C: 3, D: 8 }, 
  C: { A: 4, B: 3, D: 2 }, 
  D: { B: 8, C: 2} 
};

const optionFive = {
  A: { B: 1, C: 4 },
  B: { A: 1, C: 4, D: 2 },
  C: { A: 4, B: 4, D: 3 },
  D: { B: 2, C: 3, E: 4 },
  E: { B: 7, C: 5, D: 4 },
};

const optionSix = {
    A: { B: 1, C: 4 },
    B: { A: 1, C: 4, D: 2, E: 7 },
    C: { A: 4, B: 4, D: 3, E: 5 },
    D: { B: 2, C: 3, E: 4, F: 6 },
    E: { B: 7, C: 5, D: 4, F: 7 },
    F: { D: 6, E: 7 }
  };

function algos(source, destination, cost, path, commaPath, graph) {
  if (source == destination) {
      cost = 0;
      path.push("A");
  }
  const result = bellmanFord(graph, source, destination);
  path = result.path;
  cost = result.distance;
  commaPath = path.join(" → ");
  let finalcost = document.getElementById("finalcost");
  finalcost.innerHTML = "The final cost from " + source + " to " + destination + " is " + cost;
  let pathDiv = document.getElementById("path");
  pathDiv.innerHTML = "The path from " + source + " to " + destination + " is " + commaPath;
}

function validateInput(router) {
  let pattern = /^[A-Fa-f]{1}$/;
  if (!pattern.test(router)) {
    alert("Invalid input! Please enter only A to F.");
    if (document.getElementById(router).value == null) {
      document.getElementById(router).value = "";
    }
    return false;
  }
  return true;
}

function validateRange(source, destination, range, totalItem) {
  let sourceInvalid = true;
  let destinationInvalid = true; 
  let lastCharacter = "";
  for (let i = 0; i < range.length; i++) {
    sourceInvalid = (source == range[i]) && (i >= totalItem);
    destinationInvalid = (destination == range[i]) && (i >= totalItem);
    if (destinationInvalid || sourceInvalid) {
      lastCharacter = range[i-1];
      break;
    }
  }
  if (!sourceInvalid && !destinationInvalid) {
    return true;
  } else {
    alert("Input out of range! Please enter only A to " + lastCharacter);
    document.getElementById("source").value = "";
    document.getElementById("destination").value = "";
    return false;
  }
}

function table(source, destination, graph, nodes) {
  let des = document.getElementById("des");
  let desT = document.getElementById("desT");
  let desTT = document.getElementById("desTT");
  if (source == null && destination == null && graph == null) {
    des.textContent = `Router A Routing Table`;
    desT.textContent = `There is none, since it is no connected to anything.`;
    return false;
  }
  des.textContent = `Router ${source} Routing Table`;
  desT.textContent = `It needed to go to ${destination}, so it looked at the routing table for that node.`;
  desTT.textContent = `Then went accordingly given the cost at ${destination}.`;
      
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
      if (source == nodes[i]) {
          totalCost = 0;
      } else {
        totalCost = bellmanFord(graph, source, nodes[i]).distance;
      }
      let nRow = table.insertRow(-1);
      let cellOne = nRow.insertCell(0);
      let cellTwo = nRow.insertCell(1);

      cellOne.innerHTML = nodes[i];
      cellTwo.innerHTML = totalCost;

      if (nodes[i] == destination) {
          cellOne.style.backgroundColor = "maroon";
          cellOne.style.color = "white";
          cellTwo.style.backgroundColor = "maroon";
          cellTwo.style.color = "white";
        }
  }
}

function animation(path, option, optionTemp) {

  let lines = document.querySelectorAll('.line');
  lines.forEach(line => line.setAttribute('stroke', "#00527F"));
  let svg = option.querySelector("svg");
  for (var i = 0; i < path.length-1; i++ )
  {
      (function (i) {
        setTimeout(function () {
          let lines = svg.querySelectorAll('line');
          for (let j = 0; j < lines.length; j++) {
            let line = lines[j];
            let lineId = line.getAttribute('id');
            if (lineId === `${path[i]}${path[i + 1]}` || lineId === `${path[i + 1]}${path[i]}`) {
              line.setAttribute('stroke', '#b00f0c');
              break;
            }
          }
          }, i * 250);
      })(i);
  }
}

// The function submit is triggered when the user submits the form after pressing all the radio options.
// All the main code such as the animations and setting up the graph is at.
function submit() {
  //checks for amount of routers user desires
  let amount = document.querySelectorAll('input[type="radio"][name="amount"]');
  let option = document.getElementsByClassName('option');
  let temp = null;
  let totalItem = 0;
  for (var i = 0; i < option.length; i++) {
    if (option[i].id === amount[i].value && amount[i].checked) {
      option[i].style.display = 'block';
      temp = option[i].id;
      //asigning correct graph
      let itemNumber = option[i].id;
      switch (itemNumber) {
        case "option2":
          totalItem = 2;
          break;
        case "option3":
          totalItem = 3;
          break;
        case "option4":
          totalItem = 4;
          break;
        case "option5":
          totalItem = 5;
          break;
        case "option6":
          totalItem = 6;
          break;
      };
    } else {
      option[i].style.display = 'none';
    }
  }

  //assigning all variables
  let path = []
  let cost = 0;
  let commaPath = "";
  let source = document.getElementById("source").value;
  let destination = document.getElementById("destination").value;
  source = source.toUpperCase();
  destination = destination.toUpperCase();
  let nodes = []; 
  let optionAnimation = document.getElementById(temp);
  let optionTemp = 0;
  let range = ['A', 'B', 'C', 'D', 'E', 'F'];
  let graph = {};

  //asigning correct last variable
  switch (temp) {
    case "option2":
      graph = optionTwo;
      nodes = ["A", "B"];
      optionTemp = 2;
      break;
    case "option3":
      graph = optionThree;
      nodes = ["A", "B", "C"];
      optionTemp = 3;
      break;
    case "option4":
      graph = optionFour;
      nodes = ["A", "B", "C", "D"];
      optionTemp = 4;
      break;
    case "option5":
      graph = optionFive;
      nodes = ["A", "B", "C", "D", "E"];
      optionTemp = 5;
      break;
    case "option6":
      graph = optionSix;
      nodes = ["A", "B", "C", "D", "E", "F"];
      optionTemp = 6;
      break;
  };

  //check for whice graph is executing
  if (temp === "option1") {
    document.getElementById("source").value = "";
    document.getElementById("destination").value = "";
    document.getElementById("finalcost").innerHTML = "The final cost from A to A is 0";
    document.getElementById("path").innerHTML = "The path from A to A is A";
    table(null, null, null, null);
  } else {
    if (validateInput(source) && validateInput(destination) && validateRange(source, destination, range, totalItem)) {
      algos(source, destination, cost, path, commaPath, graph);
      path = bellmanFord(graph, source, destination).path;
      table(source, destination, graph, nodes);
      animation(path, optionAnimation, optionTemp);
    }
  }
}