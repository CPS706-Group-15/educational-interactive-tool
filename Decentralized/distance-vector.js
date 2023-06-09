// Global variables
let temp = null; //variable holds which graph we are operating on
let totalItem = 0; //amount of values in the current graph
let AC = 0, AB = 0, BC = 0, BD = 0, BE = 0, CD = 0, CE = 0, DE = 0, DF = 0, EF = 0;  //initial weights between nodes
let values = {}; //holding values of the input box
let temporary = {}; //creating a temporary graph with values of input box
let changeVariable = false; // checking if variables were changed

//function that finds the shortest path
function bellmanFord(graph, sourceNode, destinationNode) {
  let dist = {};
  let predecessor = {};
  
  // Initialize all dists to infinity and predecessor to null
  for (let node in graph) {
    dist[node] = Infinity;
    predecessor[node] = null;
  }
  
  dist[sourceNode] = 0; // dist to source node is 0
  
  // Relax edges repeatedly
  for (let i = 0; i < Object.keys(graph).length - 1; i++) {
    for (let node in graph) {
      for (let neighbour in graph[node]) {
        let weight = graph[node][neighbour];
        let totalDist = dist[node] + weight;
        if (totalDist < dist[neighbour]) {
          dist[neighbour] = totalDist;
          predecessor[neighbour] = node;
        }
      }
    }
  }
  
  // Check for negative-weight cycles
  for (let node in graph) {
    for (let neighbour in graph[node]) {
      let weight = graph[node][neighbour];
      let totalDist = dist[node] + weight;
      if (totalDist < dist[neighbour]) {
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
    
  return { dist: dist[destinationNode], path: path}; //returns the distance to the destination node and the shorted path taken to get there
}

// graphs data structure
let optionTwo = { 
  A: { B: 3}, 
  B: { A:  3}
};

let optionThree = { 
  A: { B: 4, C: 2}, 
  B: { A: 4, C: 6}, 
  C: { A: 2, B: 6} 
};

let optionFour = { 
  A: { B: 1, C: 4}, 
  B: { A: 1, C: 3, D: 8 }, 
  C: { A: 4, B: 3, D: 2 }, 
  D: { B: 8, C: 2} 
};

let optionFive = {
  A: { B: 2, C: 6 },
  B: { A: 2, C: 1, D: 4, B: 5 },
  C: { A: 6, B: 1, D: 3, E: 7},
  D: { B: 4, C: 3, E: 2 },
  E: { B: 5, C: 7, D: 2 },
};

let optionSix = {
    A: { B: 3, C: 4 },
    B: { A: 3, C: 2, D: 5, E: 5 },
    C: { A: 4, B: 2, D: 1, E: 8 },
    D: { B: 5, C: 1, E: 4, F: 3 },
    E: { B: 7, C: 5, D: 4, F: 7 },
    F: { D: 3, E: 7 }
  };

function algos(source, destination, cost, path, commaPath, graph) { //run the algorithm when the submit button is pressed and format output for user
    if (source == destination) {
        cost = 0;
        path.push("A");
    }
    let result = bellmanFord(graph, source, destination);
    path = result.path;
    cost = result.dist;
    commaPath = path.join(" → ");
    let finalcost = document.getElementById("finalcost");
    finalcost.innerHTML = "The final cost from " + source + " to " + destination + " is " + cost;
    let pathDiv = document.getElementById("path");
    pathDiv.innerHTML = "The path from " + source + " to " + destination + " is " + commaPath;
}

function validateInput(router) { //Assure the router the user has chosen is a valid router between A and F
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

function validateRange(source, destination, range, totalItem) { //Assures that the router that the user has chosen is a valid router that exists in the network
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

function validateRouters() { //Assures that the user has chosen a number of routers for the network to have so that a network can exist for the user
  let amount = document.getElementsByName("amount");
  let checked = false;
  for (let i = 0; i < amount.length; i++) {
    if (amount[i].checked) {
      checked = true;
      break;
    }
  }
  if (!checked) {
    alert("Please choose a number of routers!");
    return false;
  }
  return true;
}

function table(source, destination, graph, nodes) { //creates a display version of the routing table for the user and colours in the network to show the path
  let des = document.getElementById("des");
  let desT = document.getElementById("desT");
  let desTT = document.getElementById("desTT");
  let table_div = document.getElementById("table-div");
  let table = document.createElement("table");
  let headerRow = table.insertRow(0);
  let headerCell1 = headerRow.insertCell(0);
  let headerCell2 = headerRow.insertCell(1);

  if (source == null && destination == null && graph == null && nodes == null) {
    while (table_div.firstChild) {
      table_div.removeChild(table_div.firstChild);
    }
    des.textContent = `Router A Routing Table`;
    desT.textContent = `There is none, since it is no connected to anything.`;
    desTT.textContent = "";
    return false;
  } else {
    des.textContent = `Router ${source} Routing Table`;
    desT.textContent = `It needed to go to ${destination}, so it looked at the routing table for that node.`;
    desTT.textContent = `Then went accordingly given the cost at ${destination}.`;
        

    while (table_div.firstChild) {
        table_div.removeChild(table_div.firstChild);
    }
    table_div.appendChild(table);

    headerCell1.innerHTML = "Node";
    headerCell2.innerHTML = "Cost";
  
    for (let i = 0; i < nodes.length; i++)
    {   
        let totalCost = 0;
        if (source == nodes[i]) {
            totalCost = 0;
        } else {
          totalCost = bellmanFord(graph, source, nodes[i]).dist;
        }
        let nRow = table.insertRow(-1);
        let cell1 = nRow.insertCell(0);
        let cell2 = nRow.insertCell(1);
  
        cell1.innerHTML = nodes[i];
        cell2.innerHTML = totalCost;
  
        if (nodes[i] == destination) {
            cell1.style.backgroundColor = "maroon";
            cell1.style.color = "white";
            cell2.style.backgroundColor = "maroon";
            cell2.style.color = "white";
          }
    }
    return true;
  }
}

function animation(path, option) { // Animates the network to visually show the path to the user
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
              line.setAttribute('stroke', 'maroon');
              break;
            }
          }
          }, i * 250);
      })(i);
  }
}

function createInputBoxesAndLabels() { // creates the input boxes for the edge weights according to the number of routers and for the input of the source and destination router
  let option = document.getElementById(temp);
  let svg = option.querySelector("svg");
  let lines = svg.getElementsByTagName("line");
  let div = document.getElementById("customization");
  let custom = document.getElementById("customization");
  custom.innerHTML = ""; 
  // Loop through each line
  for (let i = 0; i < lines.length; i++) {
    let container = document.createElement("div");
    div.appendChild(container);
    let line = lines[i];
    let label = document.createElement("label");
    label.textContent = line.id;
    label.id = line.id;
    label.style.textAlign = "center";
    label.style.fontFamily = "'Inter', sans-serif";
    label.style.fontSize = "1.5em";
    label.style.fontWeight = "bold";
    label.style.paddingBottom = "0.5em";
    label.style.color = "#658163";
    label.style.display = "inline-block";
    label.style.marginBottom = "10px";
    label.style.paddingRight = "2em";
    container.appendChild(label);
    let input = document.createElement("input");
    input.id = line.id;
    input.type = "number";
    input.style.fontWeight = "bold";
    input.style.border = "3px solid #658163";
    input.style.background = "#FFFEF0";
    input.style.color = "#658163";
    input.style.fontSize = "18px";
    input.style.padding = "15px 15px";
    input.style.textTransform = "uppercase";
    input.style.textAlign = "center";
    label.style.display = "block";
    input.style.marginBottom = "20px";
    input.style.marginTop = "5px";
    input.style.flexGrow = "1";
    container.appendChild(input);
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    input.value = 0;
    input.addEventListener("input", function(event) {
      let value = event.target.value;
      if (value < 0) {
        event.target.value = 0;
        value = 0;
      }
      values[line.id] = value;
      updateWeights();
    });
  }
}

function updateWeights() { //storing the updated weights
  for (let key in values){
    switch (key) {
      case "AB":
        if(Number(values[key]) != 0) {
          AB = Number(values[key]);
        }
        break;
      case "AC":
        if(Number(values[key]) != 0) {
          AC = Number(values[key]);
        }
        break;
      case "BC":
        if(Number(values[key]) != 0) {
          BC = Number(values[key]);
        }
        break;
      case "BD":
        if(Number(values[key]) != 0) {
          BD = Number(values[key]);
        }
        break;
      case "BE":
        if(Number(values[key]) != 0) {
          BE = Number(values[key]);
        }
        break;
      case "CD":
        if(Number(values[key]) != 0) {
          CD = Number(values[key]);
        }
        break;
      case "CE":
        if(Number(values[key]) != 0) {
          CE = Number(values[key]);
        }
        break;
      case "DE":
        if(Number(values[key]) != 0) {
          DE = Number(values[key]);
        }
        break;
      case "DF":
        if(Number(values[key]) != 0) {
          DF = Number(values[key]);
        }
        break;
      case "EF":
        if(Number(values[key]) != 0) {
          EF = Number(values[key]);
        }
        break;
    }
  }
}

// switches between the graphs
function submitR() {
  //checks for amount of routers user desires
  if (validateRouters()) {
    let amount = document.querySelectorAll('input[type="radio"][name="amount"]');
    let option = document.getElementsByClassName('option');
    let tempo = 0;
    for (var i = 0; i < option.length; i++) {
      if (option[i].id === amount[i].value && amount[i].checked) {
        option[i].style.display = 'block';
        temp = option[i].id;
        //asigning correct graph
        let itemNumber = option[i].id;
        switch (itemNumber) {
          case "option1":
            tempo = 1;
            break;
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
    if (tempo == 1) {
      customizeMes = document.getElementById("customizeMes");
      customizeMes.innerHTML = "";
    } else {
      customizeMes = document.getElementById("customizeMes");
      customizeMes.innerHTML = "For further customization on the edge weight can be done below.";
    }
    createInputBoxesAndLabels();
  }
}

function submitC() { //submitting the new edge values
  let option = document.querySelector(`#${temp}`);
  let svg = option.querySelector("svg");
  let texts = svg.querySelectorAll("text");
  let arr = [];

  for (let i = 0; i < Object.keys(values).length; i++) {
    let id = Object.keys(values)[i];
    texts.forEach(text => {
      if (text.id === id) {
        text.innerHTML = "";
        arr[i] = (" " + text.id + " : " + values[id] + " ");
      }
    });
  }
  customizeMes = document.getElementById("customizeMes");
  customizeMes.innerHTML = "The old values of those edges are now deleted!";
  customizeMes2 = document.getElementById("customizeMes2");
  customizeMes2.innerHTML = arr;
  temporary = {
    A: { B: AB, C: AC },
    B: { A: AB, C: BC, D: BD, E: BE },
    C: { A: AC, B: BC, D: CD, E: CE },
    D: { B: BD, C: CD, E: DE, F: DF },
    E: { B: BE, C: CE, D: DE, F: EF },
    F: { D: DF, E: EF }
  };
  changeVariable = true;
}

// The function submit is triggered when the user submits the form after inputting all the options.
// All the main code such as the animations and setting up the graph is at.
function submit() {
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
  let range = ['A', 'B', 'C', 'D', 'E', 'F'];
  let graph = {};

  //asigning correct last variable
  switch (temp) {
    case "option2":
      graph = optionTwo;
      nodes = ["A", "B"];
      break;
    case "option3":
      graph = optionThree;
      nodes = ["A", "B", "C"];
      break;
    case "option4":
      graph = optionFour;
      nodes = ["A", "B", "C", "D"];
      break;
    case "option5":
      graph = optionFive;
      nodes = ["A", "B", "C", "D", "E"];
      break;
    case "option6":
      graph = optionSix;
      nodes = ["A", "B", "C", "D", "E", "F"];
      break;
  };

  if (changeVariable) {
    for (let router in graph) {
      for (let path in graph[router]) {
        if (temporary[router][path] !== 0) {
          graph[router][path] = temporary[router][path];
        }
      }
    }
    changeVariable = false;
  }
  console.log(graph);

  if (!validateRouters()) {
    return;
  }
  else if (temp === "option1") {
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
      animation(path, optionAnimation);
    }
  }
}